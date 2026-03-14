import { NoteModel, NoteWithCollaborators } from '../../models/note.model';
import { LabelModel } from '../../models/label.model';
import { GraphQLError } from 'graphql';
import { Context } from '../context';
import { Note } from '../../types';

interface CreateNoteInput {
  title: string;
  content?: string;
  isPinned?: boolean;
  password?: string;
}

interface UpdateNoteInput {
  title?: string;
  content?: string;
  isPinned?: boolean;
  password?: string;
}

export const noteResolvers = {
  Query: {
    // Get a single note by ID
    note: async (_: any, { id }: { id: string }, { req }: Context) => {
      try {
        const userId = req.user?.id;
        if (!userId) {
          throw new GraphQLError('Authentication required', {
            extensions: { code: 'UNAUTHENTICATED' },
          });
        }
        
        const note = await NoteModel.findWithCollaborators(parseInt(id), userId);
        if (!note) {
          throw new GraphQLError('Note not found', {
            extensions: { code: 'NOT_FOUND' },
          });
        }
        
        return note;
      } catch (error) {
        console.error('Error fetching note:', error);
        throw error;
      }
    },
    
    // Get all notes, optionally filtered by labelId
    notes: async (_: any, { labelId }: { labelId?: string }, { req }: Context) => {
      try {
        const userId = req.user?.id;
        if (!userId) {
          throw new GraphQLError('Authentication required', {
            extensions: { code: 'UNAUTHENTICATED' },
          });
        }
        
        let notes = await NoteModel.findByUser(userId);
        
        // Filter by label if labelId is provided
        if (labelId) {
          // Get notes with this label
          const filterPromises = notes.map(async (note) => {
            const labels = await LabelModel.getLabelsForNote(note.id);
            return labels.some(label => label.id === parseInt(labelId));
          });
          
          const filterResults = await Promise.all(filterPromises);
          notes = notes.filter((_, index) => filterResults[index]);
        }
        
        return notes;
      } catch (error) {
        console.error('Error fetching notes:', error);
        throw error;
      }
    },
    
    // Search notes
    searchNotes: async (_: any, { query }: { query: string }, { req }: Context) => {
      try {
        const userId = req.user?.id;
        if (!userId) {
          throw new GraphQLError('Authentication required', {
            extensions: { code: 'UNAUTHENTICATED' },
          });
        }
        
        // Get all notes for user
        const notes = await NoteModel.findByUser(userId);
        
        // Simple client-side search implementation
        if (!query || query.trim() === '') {
          return notes;
        }
        
        const searchQuery = query.toLowerCase();
        return notes.filter(note => 
          note.title.toLowerCase().includes(searchQuery) || 
          (note.content && note.content.toLowerCase().includes(searchQuery))
        );
      } catch (error) {
        console.error('Error searching notes:', error);
        throw error;
      }
    }
  },
  
  Mutation: {
    // Create a new note
    createNote: async (_: any, { input }: { input: CreateNoteInput }, { req }: Context) => {
      try {
        const userId = req.user?.id;
        if (!userId) {
          throw new GraphQLError('Authentication required', {
            extensions: { code: 'UNAUTHENTICATED' },
          });
        }
        
        const noteData = {
          userId,
          title: input.title,
          content: input.content || '',
          isPinned: input.isPinned || false,
          password: input.password
        };
        
        const note = await NoteModel.create(noteData);
        return note;
      } catch (error) {
        console.error('Error creating note:', error);
        throw error;
      }
    },
    
    // Update an existing note
    updateNote: async (_: any, { id, input }: { id: string, input: UpdateNoteInput }, { req }: Context) => {
      try {
        const userId = req.user?.id;
        if (!userId) {
          throw new GraphQLError('Authentication required', {
            extensions: { code: 'UNAUTHENTICATED' },
          });
        }
        
        const updates = { ...input };
        const note = await NoteModel.update(parseInt(id), userId, updates);
        return note;
      } catch (error) {
        console.error('Error updating note:', error);
        throw error;
      }
    },
    
    // Delete a note
    deleteNote: async (_: any, { id }: { id: string }, { req }: Context) => {
      try {
        const userId = req.user?.id;
        if (!userId) {
          throw new GraphQLError('Authentication required', {
            extensions: { code: 'UNAUTHENTICATED' },
          });
        }
        
        await NoteModel.delete(parseInt(id), userId);
        return true;
      } catch (error) {
        console.error('Error deleting note:', error);
        throw error;
      }
    },
    
    // Pin or unpin a note
    pinNote: async (_: any, { id, pin }: { id: string, pin: boolean }, { req }: Context) => {
      try {
        const userId = req.user?.id;
        if (!userId) {
          throw new GraphQLError('Authentication required', {
            extensions: { code: 'UNAUTHENTICATED' },
          });
        }
        
        const note = await NoteModel.pin(parseInt(id), userId, pin);
        return note;
      } catch (error) {
        console.error('Error pinning note:', error);
        throw error;
      }
    },
    
    // Set password protection on a note
    setNotePassword: async (_: any, { id, password }: { id: string, password: string | null }, { req }: Context) => {
      try {
        const userId = req.user?.id;
        if (!userId) {
          throw new GraphQLError('Authentication required', {
            extensions: { code: 'UNAUTHENTICATED' },
          });
        }
        
        const note = await NoteModel.setPassword(parseInt(id), userId, password);
        return note;
      } catch (error) {
        console.error('Error setting note password:', error);
        throw error;
      }
    },
    
    // Verify password for a protected note
    verifyNotePassword: async (_: any, { id, password }: { id: string, password: string }) => {
      try {
        const isValid = await NoteModel.verifyPassword(parseInt(id), password);
        return isValid;
      } catch (error) {
        console.error('Error verifying note password:', error);
        throw error;
      }
    },
    
    // Add a collaborator to a note
    addCollaborator: async (_: any, { noteId, email, role }: { noteId: string, email: string, role: 'viewer' | 'editor' }, { req }: Context) => {
      try {
        const userId = req.user?.id;
        if (!userId) {
          throw new GraphQLError('Authentication required', {
            extensions: { code: 'UNAUTHENTICATED' },
          });
        }
        
        await NoteModel.addCollaborator(parseInt(noteId), userId, email, role);
        return NoteModel.findWithCollaborators(parseInt(noteId), userId);
      } catch (error) {
        console.error('Error adding collaborator:', error);
        throw error;
      }
    },
    
    // Remove a collaborator from a note
    removeCollaborator: async (
      _: any, 
      { noteId, userId: collaboratorId }: { noteId: string, userId: string }, 
      { req }: Context
    ) => {
      try {
        const userId = req.user?.id;
        if (!userId) {
          throw new GraphQLError('Authentication required', {
            extensions: { code: 'UNAUTHENTICATED' },
          });
        }
        
        await NoteModel.removeCollaborator(parseInt(noteId), userId, parseInt(collaboratorId));
        return NoteModel.findWithCollaborators(parseInt(noteId), userId);
      } catch (error) {
        console.error('Error removing collaborator:', error);
        throw error;
      }
    },
    
    // Add a label to a note
    addLabelToNote: async (_: any, { noteId, labelId }: { noteId: string, labelId: string }, { req }: Context) => {
      try {
        const userId = req.user?.id;
        if (!userId) {
          throw new GraphQLError('Authentication required', {
            extensions: { code: 'UNAUTHENTICATED' },
          });
        }
        
        await LabelModel.attachToNote(parseInt(labelId), parseInt(noteId), userId);
        return NoteModel.findById(parseInt(noteId));
      } catch (error) {
        console.error('Error adding label to note:', error);
        throw error;
      }
    },
    
    // Remove a label from a note
    removeLabelFromNote: async (_: any, { noteId, labelId }: { noteId: string, labelId: string }, { req }: Context) => {
      try {
        const userId = req.user?.id;
        if (!userId) {
          throw new GraphQLError('Authentication required', {
            extensions: { code: 'UNAUTHENTICATED' },
          });
        }
        
        await LabelModel.detachFromNote(parseInt(labelId), parseInt(noteId), userId);
        return NoteModel.findById(parseInt(noteId));
      } catch (error) {
        console.error('Error removing label from note:', error);
        throw error;
      }
    },
    
    // Upload images to a note
    uploadNoteImages: async (_: any, { noteId, files }: { noteId: string, files: any[] }, { req }: Context) => {
      try {
        const userId = req.user?.id;
        if (!userId) {
          throw new GraphQLError('Authentication required', {
            extensions: { code: 'UNAUTHENTICATED' },
          });
        }
        
        // Process each uploaded file
        for (const file of files) {
          const { createReadStream, filename, mimetype } = await file;
          
          // Create a unique filename
          const uniqueFilename = `${Date.now()}-${filename}`;
          const path = `uploads/${uniqueFilename}`;
          
          // Create a write stream
          const fs = require('fs');
          const writeStream = fs.createWriteStream(path);
          
          // Pipe the file data into the write stream
          await new Promise((resolve, reject) => {
            const readStream = createReadStream();
            readStream
              .pipe(writeStream)
              .on('finish', resolve)
              .on('error', reject);
          });
          
          // Here you would typically update your database with the file information
          // For example, associate the image with the note in the database
          // This is application-specific and depends on your database schema
        }
        
        // Return the updated note
        return NoteModel.findById(parseInt(noteId));
      } catch (error) {
        console.error('Error uploading images:', error);
        throw error;
      }
    }
  },
  
  // Resolvers for the Note type fields
  Note: {
    // Resolver for labels field
    labels: async (note: Note) => {
      try {
        return await LabelModel.getLabelsForNote(note.id);
      } catch (error) {
        console.error('Error fetching labels for note:', error);
        return [];
      }
    }
  }
}; 
