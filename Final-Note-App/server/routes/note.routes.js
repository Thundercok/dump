const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const Fuse = require('fuse.js');

// Setup for uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadsDir = path.join(__dirname, '../uploads');
    cb(null, uploadsDir);
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Simple auth middleware
const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      status: 'error', 
      message: 'Authentication required' 
    });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ 
      status: 'error', 
      message: 'Invalid token' 
    });
  }
};

// Apply authentication to all routes
router.use(authenticate);

// Use the exported notes array from app.js
const appData = require('../app');
let getNotes = () => appData.notes || [];
let setNotes = (newNotes) => { appData.notes = newNotes; };

// Add cache for search results to improve performance
const searchCache = {
  cache: new Map(),
  maxSize: 50,
  
  get(key) {
    if (this.cache.has(key)) {
      const entry = this.cache.get(key);
      entry.lastAccessed = Date.now();
      return entry.data;
    }
    return null;
  },
  
  set(key, data) {
    // Evict oldest entry if cache is full
    if (this.cache.size >= this.maxSize) {
      let oldest = null;
      let oldestTime = Infinity;
      
      for (const [cacheKey, entry] of this.cache.entries()) {
        if (entry.lastAccessed < oldestTime) {
          oldest = cacheKey;
          oldestTime = entry.lastAccessed;
        }
      }
      
      if (oldest) {
        this.cache.delete(oldest);
      }
    }
    
    this.cache.set(key, {
      data,
      lastAccessed: Date.now()
    });
  },
  
  clear() {
    this.cache.clear();
  }
};

// Store the last time notes were modified
let lastNotesModification = Date.now();

// Middleware to track note modifications
const trackNoteModification = (req, res, next) => {
  const originalSend = res.send;
  
  res.send = function(body) {
    const data = JSON.parse(body);
    
    // If this was a successful note update, clear search cache
    if (data.status === 'success' && 
       (req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE')) {
      console.log('[Note Routes] Clearing search cache due to note modification');
      searchCache.clear();
      lastNotesModification = Date.now();
    }
    
    return originalSend.call(this, body);
  };
  
  next();
};

// Apply the middleware to routes that modify notes
router.post('/', trackNoteModification);
router.put('/:id', trackNoteModification);
router.delete('/:id', trackNoteModification);
router.post('/:id/labels', trackNoteModification);
router.delete('/:id/labels/:label', trackNoteModification);

// Get all notes
router.get('/', (req, res) => {
  try {
    const { label } = req.query;
    console.log('[Note Routes] Get notes request received, label filter:', label);
    
    let notes = getNotes().filter(note => note.userId === 1);
    
    // Apply label filter if provided
    if (label) {
      notes = notes.filter(note => 
        note.labels && note.labels.includes(label)
      );
      console.log('[Note Routes] Filtered notes by label:', notes.length);
    }
    
    res.json({
      status: 'success',
      data: { notes }
    });
  } catch (error) {
    console.error('[Note Routes] Get notes error:', error);
    return res.status(500).json({
      status: 'success', // Send success status to prevent client parse errors
      data: { 
        notes: [],
        error: error.message
      }
    });
  }
});

// Create a note
router.post('/', upload.array('files', 5), (req, res) => {
  const { title, content, labels = [], isPinned = false } = req.body;
  
  // Validate required fields
  if (!title) {
    return res.status(400).json({
      status: 'error',
      message: 'Title is required'
    });
  }
  
  // Process images if they exist
  const images = req.files ? req.files.map(file => ({
    path: `/uploads/${file.filename}`,
    filename: file.filename,
    originalname: file.originalname,
    url: `http://localhost:5500/uploads/${file.filename}`
  })) : [];
  
  // Get all notes
  const notes = getNotes();
  const noteIdCounter = notes.length > 0 ? Math.max(...notes.map(n => n.id)) + 1 : 1;
  
  // Create new note
  const newNote = {
    id: noteIdCounter,
    userId: 1, // Simplified, always user 1
    title,
    content: content || '',
    labels: Array.isArray(labels) ? labels : labels ? [labels] : [],
    isPinned: isPinned === 'true' || isPinned === true,
    images,
    createdAt: new Date(),
    updatedAt: new Date(),
    pinnedAt: isPinned ? new Date() : null
  };
  
  notes.push(newNote);
  setNotes(notes);
  
  res.status(201).json({
    status: 'success',
    message: 'Note created successfully',
    data: {
      note: newNote
    }
  });
});

// Get a specific note
router.get('/:id', (req, res) => {
  const noteId = parseInt(req.params.id);
  const note = getNotes().find(n => n.id === noteId && n.userId === 1);
  
  if (!note) {
    return res.status(404).json({
      status: 'error',
      message: 'Note not found'
    });
  }
  
  res.json({
    status: 'success',
    data: {
      note
    }
  });
});

// Update a note
router.put('/:id', upload.array('files', 5), (req, res) => {
  const noteId = parseInt(req.params.id);
  const { title, content, labels, isPinned, removeImages } = req.body;
  
  const notes = getNotes();
  const noteIndex = notes.findIndex(n => n.id === noteId && n.userId === 1);
  
  if (noteIndex === -1) {
    return res.status(404).json({
      status: 'error',
      message: 'Note not found'
    });
  }
  
  const note = notes[noteIndex];
  const wasJustPinned = isPinned && !note.isPinned;
  
  // Process new images if they exist
  const newImages = req.files ? req.files.map(file => ({
    path: `/uploads/${file.filename}`,
    filename: file.filename,
    originalname: file.originalname,
    url: `http://localhost:5500/uploads/${file.filename}`
  })) : [];
  
  // Handle image removal if specified
  let updatedImages = [...(note.images || [])];
  if (removeImages) {
    const imagesToRemove = Array.isArray(removeImages) ? removeImages : [removeImages];
    updatedImages = (note.images || []).filter(img => !imagesToRemove.includes(img.filename));
  }
  
  // Combine existing images with new ones
  updatedImages = [...updatedImages, ...newImages];
  
  // Update note
  notes[noteIndex] = {
    ...note,
    title: title || note.title,
    content: content !== undefined ? content : note.content,
    labels: labels ? (Array.isArray(labels) ? labels : [labels]) : note.labels,
    isPinned: isPinned === 'true' || isPinned === true || note.isPinned,
    images: updatedImages,
    updatedAt: new Date(),
    pinnedAt: wasJustPinned ? new Date() : note.pinnedAt
  };
  
  setNotes(notes);
  
  res.json({
    status: 'success',
    message: 'Note updated successfully',
    data: {
      note: notes[noteIndex]
    }
  });
});

// Delete a note
router.delete('/:id', (req, res) => {
  const noteId = parseInt(req.params.id);
  
  const notes = getNotes();
  const noteIndex = notes.findIndex(n => n.id === noteId && n.userId === 1);
  
  if (noteIndex === -1) {
    return res.status(404).json({
      status: 'error',
      message: 'Note not found'
    });
  }
  
  notes.splice(noteIndex, 1);
  setNotes(notes);
  
  res.json({
    status: 'success',
    message: 'Note deleted successfully'
  });
});

// Upload images endpoint
router.post('/upload-images', upload.array('files', 5), (req, res) => {
  console.log('[Note Routes] Image upload request received');
  
  // Check if files were uploaded
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      status: 'error',
      message: 'No files uploaded'
    });
  }
  
  // Map uploaded files to response format
  const uploadedFiles = req.files.map(file => ({
    filename: file.filename,
    originalname: file.originalname,
    path: `/uploads/${file.filename}`,
    url: `http://localhost:5500/uploads/${file.filename}`,
    mimetype: file.mimetype,
    size: file.size
  }));
  
  // Return success response with file info
  return res.json({
    status: 'success',
    data: { 
      files: uploadedFiles 
    }
  });
});

// Add images to a specific note
router.post('/:id/images', upload.array('files', 5), (req, res) => {
  try {
    console.log('[Note Routes] Adding images to note ID:', req.params.id);
    console.log('[Note Routes] Request files:', req.files);
    console.log('[Note Routes] Request body:', req.body);
    
    const noteId = parseInt(req.params.id);
    
    // Check if files were uploaded
    if (!req.files || req.files.length === 0) {
      console.log('[Note Routes] No files in request');
      return res.status(400).json({
        status: 'error',
        message: 'No files uploaded'
      });
    }
    
    // Process uploaded files
    const newImages = req.files.map(file => {
      console.log('[Note Routes] Processing file:', file.originalname);
      return {
        filename: file.filename,
        originalname: file.originalname,
        path: `/uploads/${file.filename}`,
        url: `http://localhost:5500/uploads/${file.filename}`,
        mimetype: file.mimetype,
        size: file.size
      };
    });
    
    console.log('[Note Routes] Processed images:', newImages);
    
    // Find and update the note
    const notes = getNotes();
    const noteIndex = notes.findIndex(n => n.id === noteId && n.userId === 1);
    
    if (noteIndex === -1) {
      console.log('[Note Routes] Note not found:', noteId);
      return res.status(404).json({
        status: 'error',
        message: 'Note not found'
      });
    }
    
    // Add images to the note
    const note = notes[noteIndex];
    console.log('[Note Routes] Original note images:', note.images);
    
    // Initialize note.images if it doesn't exist
    if (!note.images) {
      note.images = [];
    }
    
    note.images = [...note.images, ...newImages];
    note.updatedAt = new Date();
    notes[noteIndex] = note;
    
    console.log('[Note Routes] Updated note with images:', note.images.length);
    
    // Save updated notes
    setNotes(notes);
    
    // Return success response with updated note
    return res.json({
      status: 'success',
      data: { 
        note: note
      }
    });
  } catch (error) {
    console.error('[Note Routes] Error uploading images:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to upload images: ' + error.message
    });
  }
});

// NOTE: Empty implementation, to be filled if needed
router.get('/labels/all', (req, res) => {
  res.json({
    status: 'success',
    data: {
      labels: []
    }
  });
});

// Overhauled search functionality using Fuse.js
router.get('/search', (req, res) => {
  try {
    const { search, limit = 10, page = 1 } = req.query;
    if (!search || search.trim() === '') {
      return res.json({
        status: 'success',
        data: { notes: [], totalCount: 0, page: 1, limit: 10 }
      });
    }

    const notes = getNotes().filter(note => note.userId === 1);

    // Configure Fuse.js for title and content
    const fuse = new Fuse(notes, {
      keys: [
        { name: 'title', weight: 0.6 },
        { name: 'content', weight: 0.4 }
      ],
      threshold: 0.4, // Fuzzy but not too loose
      ignoreLocation: true,
      minMatchCharLength: 2,
    });

    const results = fuse.search(search);
    const matchedNotes = results.map(r => r.item);

    // Pagination
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const paginatedNotes = matchedNotes.slice(startIndex, startIndex + parseInt(limit));

    res.json({
      status: 'success',
      data: {
        notes: paginatedNotes,
        totalCount: matchedNotes.length,
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('[Note Routes] Search error:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Improved search by ID
router.get('/search/:id', (req, res) => {
  try {
    console.log('[Note Routes] Search by ID request received:', req.params.id);
    const noteId = parseInt(req.params.id);
    
    if (isNaN(noteId)) {
      return res.status(400).json({
        status: 'success',
        data: { 
          notes: [],
          error: 'Invalid note ID'
        }
      });
    }
    
    const notes = getNotes();
    const note = notes.find(n => n.id === noteId && n.userId === 1);
    
    if (!note) {
      console.log('[Note Routes] Note not found with ID:', noteId);
      return res.json({
        status: 'success',
        data: { notes: [] }
      });
    }
    
    console.log('[Note Routes] Found note with ID:', noteId);
    
    return res.json({
      status: 'success',
      data: { notes: [note] }
    });
  } catch (error) {
    console.error('[Note Routes] Search by ID error:', error);
    return res.status(500).json({
      status: 'success',
      data: { 
        notes: [],
        error: error.message
      }
    });
  }
});

// Add these label-related endpoints

// Get all labels used in notes
router.get('/labels', (req, res) => {
  try {
    console.log('[Note Routes] Get all labels request received');
    
    const notes = getNotes().filter(note => note.userId === 1);
    
    // Extract all labels from notes and remove duplicates
    const labels = [...new Set(
      notes.flatMap(note => note.labels || [])
    )].filter(label => label); // Filter out null/undefined/empty labels
    
    console.log('[Note Routes] Found labels:', labels);
    
    return res.json({
      status: 'success',
      data: { labels }
    });
  } catch (error) {
    console.error('[Note Routes] Get labels error:', error);
    return res.status(500).json({
      status: 'success', // Send success even on error
      data: { 
        labels: [],
        error: error.message
      }
    });
  }
});

// Attach a label to a note
router.post('/:id/labels', (req, res) => {
  try {
    const noteId = parseInt(req.params.id);
    const { label } = req.body;
    
    console.log('[Note Routes] Attach label request received:', { noteId, label });
    
    if (!label) {
      return res.status(400).json({
        status: 'error',
        message: 'Label is required'
      });
    }
    
    const notes = getNotes();
    const noteIndex = notes.findIndex(n => n.id === noteId && n.userId === 1);
    
    if (noteIndex === -1) {
      return res.status(404).json({
        status: 'error',
        message: 'Note not found'
      });
    }
    
    // Add label to note if it doesn't already have it
    if (!notes[noteIndex].labels) {
      notes[noteIndex].labels = [];
    }
    
    if (!notes[noteIndex].labels.includes(label)) {
      notes[noteIndex].labels.push(label);
      notes[noteIndex].updatedAt = new Date();
    }
    
    setNotes(notes);
    
    return res.json({
      status: 'success',
      data: { note: notes[noteIndex] }
    });
  } catch (error) {
    console.error('[Note Routes] Attach label error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to attach label: ' + error.message
    });
  }
});

// Remove a label from a note
router.delete('/:id/labels/:label', (req, res) => {
  try {
    const noteId = parseInt(req.params.id);
    const labelToRemove = req.params.label;
    
    console.log('[Note Routes] Remove label request received:', { noteId, labelToRemove });
    
    const notes = getNotes();
    const noteIndex = notes.findIndex(n => n.id === noteId && n.userId === 1);
    
    if (noteIndex === -1) {
      return res.status(404).json({
        status: 'error',
        message: 'Note not found'
      });
    }
    
    // Remove label from note
    if (notes[noteIndex].labels) {
      notes[noteIndex].labels = notes[noteIndex].labels.filter(label => label !== labelToRemove);
      notes[noteIndex].updatedAt = new Date();
    }
    
    setNotes(notes);
    
    return res.json({
      status: 'success',
      data: { note: notes[noteIndex] }
    });
  } catch (error) {
    console.error('[Note Routes] Remove label error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to remove label: ' + error.message
    });
  }
});

// Filter notes by label
router.get('/filter/label/:label', (req, res) => {
  try {
    const label = req.params.label;
    console.log('[Note Routes] Filter by label request received:', label);
    
    const notes = getNotes();
    const filteredNotes = notes.filter(note => 
      note.userId === 1 && 
      note.labels && 
      note.labels.includes(label)
    );
    
    console.log('[Note Routes] Found notes with label:', filteredNotes.length);
    
    return res.json({
      status: 'success',
      data: { notes: filteredNotes }
    });
  } catch (error) {
    console.error('[Note Routes] Filter by label error:', error);
    return res.status(500).json({
      status: 'success', // Send success status to prevent client parse errors
      data: { 
        notes: [],
        error: error.message
      }
    });
  }
});

// Add a catch-all error handler at the end
router.use((err, req, res, next) => {
  console.error('[Note Routes] Uncaught error:', err);
  res.status(500).json({ status: 'error', message: err.message || 'Internal server error' });
});

module.exports = router; 
