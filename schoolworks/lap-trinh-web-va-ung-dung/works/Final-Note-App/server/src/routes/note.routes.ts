import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { NoteController } from '../controllers/note.controller';
import { LabelController } from '../controllers/label.controller';
import { CollaborationController } from '../controllers/collaboration.controller';
import { db } from '../config/database';
import { RowDataPacket } from 'mysql2';
import { Request, Response, NextFunction } from 'express';
import { UserModel } from '../models/user.model';
import { NoteModel } from '../models/note.model';

// Define AuthRequest interface directly
interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    displayName?: string;
  };
}

const router = Router();

router.use(authenticate);

// Order is important! Put specific routes before parameter routes
router.get('/search', async (req: any, res) => {
  try {
    const userId = req.user.id;
    const search = req.query.search || '';
    console.log('[SearchNotes] Searching for:', search, 'userId:', userId);

    // Handle special characters in search
    const escapedSearch = search.replace(/[%_\\]/g, '\\$&');
    
    // Simple SQL LIKE search with proper escaping
    const [rows] = await db.execute<RowDataPacket[]>(
      `SELECT * FROM notes WHERE user_id = ? AND (title LIKE ? OR content LIKE ?) ORDER BY is_pinned DESC, updated_at DESC`,
      [userId, `%${escapedSearch}%`, `%${escapedSearch}%`]
    );
    
    console.log(`[SearchNotes] Found ${rows.length} notes for search term "${search}"`);
    
    const notes = (rows as any[]).map((row: any) => ({
      id: row.id,
      userId: row.user_id,
      title: row.title,
      content: row.content,
      isPinned: !!row.is_pinned,
      isPasswordProtected: !!row.is_password_protected,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
    
    res.json({ status: 'success', data: { notes } });
  } catch (error) {
    console.error('[SearchNotes] Error:', error);
    res.status(500).json({ status: 'error', message: 'Search failed', error: String(error) });
  }
});

router.get('/direct-db-notes', async (req: any, res) => {
  try {
    console.log('[DirectDBNotes] User ID from token:', req.user?.id, 'Type:', typeof req.user?.id);
    
    if (!req.user) {
      return res.status(401).json({ status: 'error', message: 'Authentication required' });
    }
    
    // Handle different ID formats
    let userId = req.user.id;
    if (typeof userId === 'string') {
      userId = parseInt(userId, 10);
      if (isNaN(userId)) {
        return res.status(400).json({ status: 'error', message: 'Invalid user ID format' });
      }
    }
    
    console.log('[DirectDBNotes] Normalized user ID:', userId);
    
    // Query notes directly, including both owned notes and shared notes
    const [rows] = await db.execute<RowDataPacket[]>(
      `SELECT n.* 
       FROM notes n
       LEFT JOIN note_shares ns ON n.id = ns.note_id
       WHERE n.user_id = ? OR ns.user_id = ?
       GROUP BY n.id
       ORDER BY n.is_pinned DESC, n.updated_at DESC`,
      [userId, userId]
    );
    
    console.log(`[DirectDBNotes] Found ${rows.length} notes for user ${userId}`);
    
    // If no notes found, create a sample note
    if (rows.length === 0) {
      console.log('[DirectDBNotes] No notes found, creating sample note');
      
      const [result] = await db.execute(
        'INSERT INTO notes (user_id, title, content, is_pinned, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())',
        [
          userId,
          'Welcome to Note App',
          'This is your first note! Created to help with the display issue.',
          1 // Pinned
        ]
      );
      
      const [newRows] = await db.execute<RowDataPacket[]>(
        'SELECT * FROM notes WHERE user_id = ? ORDER BY is_pinned DESC, updated_at DESC',
        [userId]
      );
      
      const notes = newRows.map(row => ({
        id: row.id,
        userId: row.user_id,
        title: row.title,
        content: row.content || '',
        isPinned: !!row.is_pinned,
        isPasswordProtected: !!row.is_password_protected,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));
      
      return res.json({
        status: 'success',
        data: { notes },
        debug: { 
          sampleNoteCreated: true,
          userId: userId
        }
      });
    }
    
    // Map rows to appropriate format
    const notes = rows.map(row => ({
      id: row.id,
      userId: row.user_id,
      title: row.title,
      content: row.content || '',
      isPinned: !!row.is_pinned,
      isPasswordProtected: !!row.is_password_protected,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
    
    return res.json({
      status: 'success',
      data: { notes }
    });
  } catch (error) {
    console.error('[DirectDBNotes] Error:', error);
    return res.status(500).json({ 
      status: 'error', 
      message: 'Server error fetching notes', 
      error: String(error)
    });
  }
});

// Label CRUD and attach/detach endpoints
router.get('/labels/all', LabelController.list);
router.post('/labels', LabelController.create);
router.put('/labels/:label', LabelController.rename);
router.delete('/labels/:label', LabelController.delete);

// Other specific routes
router.get('/shared-with-me', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as AuthRequest).user!.id;
    
    // Get all notes shared with the user
    const [rows] = await db.execute<RowDataPacket[]>(
      `SELECT n.*, ns.permission, u.email as ownerEmail, u.display_name as ownerName, ns.created_at as sharedAt
       FROM notes n
       JOIN note_shares ns ON n.id = ns.note_id
       JOIN users u ON n.user_id = u.id
       WHERE ns.user_id = ?`,
      [userId]
    );
    
    // Map the rows to proper note objects
    const notes = (rows as any[]).map(row => ({
      id: row.id,
      userId: row.user_id,
      title: row.title,
      content: row.content,
      isPinned: !!row.is_pinned,
      isPasswordProtected: !!row.is_password_protected,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      permission: row.permission,
      ownerEmail: row.ownerEmail,
      ownerName: row.ownerName,
      sharedAt: row.sharedAt
    }));
    
    res.json({ status: 'success', data: { notes } });
  } catch (err) {
    next(err);
  }
});

router.get('/test/direct-notes', async (req: any, res) => {
  try {
    console.log('[DirectNotes] User ID:', req.user?.id);
    
    if (!req.user || !req.user.id) {
      return res.status(401).json({ status: 'error', message: 'Authentication required' });
    }
    
    // Query notes directly from database
    const [rows] = await db.execute<RowDataPacket[]>(
      'SELECT * FROM notes WHERE user_id = ? ORDER BY is_pinned DESC, updated_at DESC',
      [req.user.id]
    );
    
    console.log(`[DirectNotes] Found ${rows.length} notes for user ${req.user.id}`);
    
    // Map rows to appropriate format
    const notes = rows.map(row => ({
      id: row.id,
      userId: row.user_id,
      title: row.title,
      content: row.content,
      isPinned: !!row.is_pinned,
      isPasswordProtected: !!row.is_password_protected,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
    
    return res.json({
      status: 'success',
      data: { notes },
      debug: { rawRows: rows }
    });
  } catch (error) {
    console.error('[DirectNotes] Error:', error);
    return res.status(500).json({ status: 'error', message: 'Server error', error: String(error) });
  }
});

router.get('/debug/all-notes', async (req: any, res) => {
  try {
    // Query notes directly from database
    const [rows] = await db.execute<RowDataPacket[]>(
      'SELECT id, user_id, title, is_pinned, created_at, updated_at FROM notes ORDER BY id'
    );
    
    console.log(`[DEBUG] Found ${rows.length} total notes in database`);
    
    // Also get user count
    const [userRows] = await db.execute<RowDataPacket[]>('SELECT id, email FROM users');
    
    return res.json({
      status: 'success',
      data: { 
        notes: rows,
        users: userRows,
        counts: {
          notes: rows.length,
          users: userRows.length
        }
      }
    });
  } catch (error) {
    console.error('[DEBUG] Error getting all notes:', error);
    return res.status(500).json({ status: 'error', message: 'Server error', error: String(error) });
  }
});

// Standard CRUD routes
router.get('/', NoteController.list);
router.post('/', NoteController.create);
router.get('/:id', NoteController.get);
router.patch('/:id', NoteController.update);
router.delete('/:id', NoteController.delete);
router.post('/:id/pin', NoteController.pin);
router.post('/:id/unpin', NoteController.unpin);

// Collaboration routes
router.get('/:id/collaborators', CollaborationController.getCollaborators);
router.post('/:id/collaborators', CollaborationController.addCollaborator);
router.delete('/:id/collaborators/:collaboratorId', CollaborationController.removeCollaborator);

// Attach/detach labels for specific notes
router.post('/:noteId/labels', LabelController.attach);
router.delete('/:noteId/labels/:label', LabelController.detach);

// Password protection routes
router.post('/:id/password', CollaborationController.setPassword);
router.post('/:id/verify-password', CollaborationController.verifyPassword);

// Add these routes to handle password protection
router.post('/:id/set-password', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({ status: 'error', message: 'Password is required' });
    }
    
    const note = await NoteModel.setPassword(parseInt(id), (req as AuthRequest).user!.id, password);
    
    res.json({ status: 'success', data: { note } });
  } catch (err) {
    next(err);
  }
});

router.post('/:id/change-password', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ status: 'error', message: 'Current password and new password are required' });
    }
    
    // First verify the current password
    const isValid = await NoteModel.verifyPassword(parseInt(id), currentPassword);
    
    if (!isValid) {
      return res.status(401).json({ status: 'error', message: 'Invalid current password' });
    }
    
    // Then update the password
    const note = await NoteModel.setPassword(parseInt(id), (req as AuthRequest).user!.id, newPassword);
    
    res.json({ status: 'success', data: { note } });
  } catch (err) {
    next(err);
  }
});

router.post('/:id/remove-password', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { password } = req.body;
    
    // Verify the password first
    const isValid = await NoteModel.verifyPassword(parseInt(id), password);
    
    if (!isValid) {
      return res.status(401).json({ status: 'error', message: 'Invalid password' });
    }
    
    // Then remove the password
    const note = await NoteModel.setPassword(parseInt(id), (req as AuthRequest).user!.id, null);
    
    res.json({ status: 'success', data: { note } });
  } catch (err) {
    next(err);
  }
});

router.post('/:id/verify-password', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({ status: 'error', message: 'Password is required' });
    }
    
    const isValid = await NoteModel.verifyPassword(parseInt(id), password);
    
    res.json({ status: 'success', data: { valid: isValid } });
  } catch (err) {
    next(err);
  }
});

// Add these routes to handle sharing functionality
router.post('/:id/share', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { email, permission } = req.body;
    
    if (!email) {
      return res.status(400).json({ status: 'error', message: 'Email is required' });
    }
    
    if (!['viewer', 'editor'].includes(permission)) {
      return res.status(400).json({ status: 'error', message: 'Permission must be either "viewer" or "editor"' });
    }
    
    // Check if the user is the owner of the note
    const note = await NoteModel.findById(parseInt(id));
    
    if (note.userId !== (req as AuthRequest).user!.id) {
      return res.status(403).json({ status: 'error', message: 'Only the owner can share this note' });
    }
    
    const result = await NoteModel.addCollaborator(
      parseInt(id),
      (req as AuthRequest).user!.id,
      email,
      permission as 'viewer' | 'editor'
    );
    
    if (result) {
      res.json({ status: 'success', message: 'Note shared successfully' });
    } else {
      res.status(400).json({ status: 'error', message: 'Failed to share note' });
    }
  } catch (err) {
    next(err);
  }
});

router.post('/:id/revoke-share', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ status: 'error', message: 'User ID is required' });
    }
    
    const result = await NoteModel.removeCollaborator(
      parseInt(id),
      (req as AuthRequest).user!.id,
      parseInt(userId)
    );
    
    if (result) {
      res.json({ status: 'success', message: 'Share access revoked' });
    } else {
      res.status(400).json({ status: 'error', message: 'Failed to revoke access' });
    }
  } catch (err) {
    next(err);
  }
});

router.post('/:id/update-share-permission', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { userId, permission } = req.body;
    
    if (!userId || !permission) {
      return res.status(400).json({ status: 'error', message: 'User ID and permission are required' });
    }
    
    if (!['viewer', 'editor'].includes(permission)) {
      return res.status(400).json({ status: 'error', message: 'Permission must be either "viewer" or "editor"' });
    }
    
    // Remove existing collaborator
    await NoteModel.removeCollaborator(parseInt(id), (req as AuthRequest).user!.id, parseInt(userId));
    
    // Add collaborator with new permission
    // We need to get their email first
    const user = await UserModel.findById(parseInt(userId));
    
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }
    
    const result = await NoteModel.addCollaborator(
      parseInt(id),
      (req as AuthRequest).user!.id,
      user.email,
      permission as 'viewer' | 'editor'
    );
    
    if (result) {
      res.json({ status: 'success', message: 'Permission updated successfully' });
    } else {
      res.status(400).json({ status: 'error', message: 'Failed to update permission' });
    }
  } catch (err) {
    next(err);
  }
});

export default router; 
 