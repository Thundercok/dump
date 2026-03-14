import { db } from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { Note } from '../types';
import { AppError } from '../middleware/errorHandler';
import * as bcrypt from 'bcryptjs';

// Update the Note interface to explicitly include isPasswordProtected
declare module '../types' {
  interface Note {
    isPasswordProtected?: boolean;
  }
}

export interface NoteCollaborator {
  userId: number;
  email: string;
  displayName: string;
  role: 'viewer' | 'editor';
}

export interface NoteWithCollaborators extends Note {
  collaborators?: NoteCollaborator[];
  isPasswordProtected?: boolean;
}

export class NoteModel {
  static mapRow(row: any): Note {
    return {
      id: row.id,
      userId: row.user_id,
      title: row.title,
      content: row.content,
      isPinned: !!row.is_pinned,
      isPasswordProtected: !!row.is_password_protected,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  static async create(note: { 
    userId: number; 
    title: string; 
    content?: string; 
    isPinned?: boolean;
    password?: string;
  }): Promise<Note> {
    console.log('[NoteModel.create] Creating note with userId:', note.userId, 'type:', typeof note.userId);
    try {
      // Extra validation for userId to ensure it's a valid number
      const userId = Number(note.userId);
      if (isNaN(userId) || userId <= 0) {
        throw new Error(`Invalid user ID: ${note.userId} (${typeof note.userId})`);
      }
      
      // Check if user exists first to avoid foreign key errors
      const [userRows] = await db.execute<RowDataPacket[]>(
        'SELECT id FROM users WHERE id = ?', 
        [userId]
      );
      
      if (!userRows || !userRows.length) {
        throw new Error(`User with ID ${userId} not found. Cannot create notes for non-existent user.`);
      }
      
      // Hash password if provided
      let hashedPassword = null;
      const isPasswordProtected = !!note.password;
      
      if (isPasswordProtected && note.password) {
        // Ensure password is not undefined before hashing
        hashedPassword = await bcrypt.hash(note.password, 10);
      }
      
      const [result] = await db.execute<ResultSetHeader>(
        'INSERT INTO notes (user_id, title, content, is_pinned, is_password_protected, password_hash, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())',
        [
          userId,
          note.title,
          note.content || '',
          note.isPinned ? 1 : 0,
          isPasswordProtected ? 1 : 0,
          hashedPassword
        ]
      );
      console.log('[NoteModel.create] Note created successfully with ID:', result.insertId);
      return this.findById(result.insertId);
    } catch (error) {
      console.error('[NoteModel.create] Error creating note:', error);
      throw error;
    }
  }

  static async findById(id: number): Promise<Note> {
    const [rows] = await db.execute<RowDataPacket[]>('SELECT * FROM notes WHERE id = ?', [id]);
    if (!rows.length) throw new Error('Note not found');
    return this.mapRow(rows[0]);
  }

  static async findByUser(userId: number): Promise<Note[]> {
    console.log('[NoteModel.findByUser] Finding notes for userId:', userId, 'type:', typeof userId);
    
    try {
      // Extra validation for userId
      if (isNaN(Number(userId)) || Number(userId) <= 0) {
        console.error('[NoteModel.findByUser] Invalid userId:', userId);
        return [];
      }
      
      // First check if user exists
      const [userRows] = await db.execute<RowDataPacket[]>(
        'SELECT id FROM users WHERE id = ?',
        [userId]
      );
      
      if (!userRows || !userRows.length) {
        console.error('[NoteModel.findByUser] User with ID', userId, 'not found');
        return [];
      }
      
      // Find all notes where user is owner OR collaborator - use note_shares instead of note_collaborators
      const [rows] = await db.execute<RowDataPacket[]>(
        `SELECT n.* 
         FROM notes n
         LEFT JOIN note_shares ns ON n.id = ns.note_id
         WHERE n.user_id = ? OR ns.user_id = ?
         GROUP BY n.id
         ORDER BY n.is_pinned DESC, n.updated_at DESC`,
        [userId, userId]
      );
      
      console.log(`[NoteModel.findByUser] Found ${rows.length} notes for user ${userId}`);
      
      if (rows.length === 0) {
        console.log('[NoteModel.findByUser] No notes found for user. Creating sample note...');
        
        // Create a sample welcome note for users with no notes
        try {
          const [result] = await db.execute<ResultSetHeader>(
            'INSERT INTO notes (user_id, title, content, is_pinned, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())',
            [
              userId,
              'Welcome to Note App',
              'This is your first note! You can edit or delete it as needed.',
              1 // Pinned
            ]
          );
          
          console.log('[NoteModel.findByUser] Created sample note with ID:', result.insertId);
          
          // Get the notes again including the newly created one
          const [newRows] = await db.execute<RowDataPacket[]>(
            'SELECT * FROM notes WHERE user_id = ? ORDER BY is_pinned DESC, updated_at DESC',
            [userId]
          );
          
          return (newRows as any[]).map(this.mapRow);
        } catch (error) {
          console.error('[NoteModel.findByUser] Error creating sample note:', error);
          // Fall back to returning empty array
          return [];
        }
      }
      
      return (rows as any[]).map(this.mapRow);
    } catch (error) {
      console.error('[NoteModel.findByUser] Error finding notes:', error);
      return [];
    }
  }
  
  static async findWithCollaborators(noteId: number, userId: number): Promise<NoteWithCollaborators | null> {
    try {
      // Check if the user has access to this note (owner or collaborator)
      const [accessRows] = await db.execute<RowDataPacket[]>(
        `SELECT 1 FROM (
          SELECT user_id FROM notes WHERE id = ?
          UNION
          SELECT user_id FROM note_shares WHERE note_id = ?
         ) as access
         WHERE access.user_id = ?`,
        [noteId, noteId, userId]
      );
      
      if (!accessRows || !accessRows.length) {
        return null; // User doesn't have access
      }
      
      // Get note data
      const [noteRows] = await db.execute<RowDataPacket[]>(
        'SELECT * FROM notes WHERE id = ?',
        [noteId]
      );
      
      if (!noteRows || !noteRows.length) {
        return null; // Note doesn't exist
      }
      
      const note = this.mapRow(noteRows[0]) as NoteWithCollaborators;
      
      // Get collaborators
      const [collaboratorRows] = await db.execute<RowDataPacket[]>(
        `SELECT ns.permission as role, u.id as userId, u.email, u.display_name as displayName
         FROM note_shares ns
         JOIN users u ON ns.user_id = u.id
         WHERE ns.note_id = ?`,
        [noteId]
      );
      
      note.collaborators = collaboratorRows.map(row => ({
        userId: row.userId,
        email: row.email,
        displayName: row.displayName,
        role: row.role
      }));
      
      return note;
    } catch (error) {
      console.error('[NoteModel.findWithCollaborators] Error:', error);
      return null;
    }
  }

  static async update(id: number, userId: number, updates: Partial<Omit<Note, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>): Promise<Note> {
    const fields = [];
    const values = [];
    if (updates.title !== undefined) { fields.push('title = ?'); values.push(updates.title); }
    if (updates.content !== undefined) { fields.push('content = ?'); values.push(updates.content); }
    if (updates.isPinned !== undefined) { fields.push('is_pinned = ?'); values.push(updates.isPinned ? 1 : 0); }
    if (!fields.length) throw new Error('No fields to update');
    values.push(id, userId);
    await db.execute(`UPDATE notes SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ? AND user_id = ?`, values);
    return this.findById(id);
  }

  static async delete(id: number, userId: number): Promise<void> {
    await db.execute('DELETE FROM notes WHERE id = ? AND user_id = ?', [id, userId]);
  }

  static async pin(id: number, userId: number, pin: boolean): Promise<Note> {
    await db.execute('UPDATE notes SET is_pinned = ? WHERE id = ? AND user_id = ?', [pin ? 1 : 0, id, userId]);
    return this.findById(id);
  }
  
  static async setPassword(id: number, userId: number, password: string | null): Promise<Note> {
    try {
      // Get note to confirm ownership
      const [rows] = await db.execute<RowDataPacket[]>(
        'SELECT * FROM notes WHERE id = ? AND user_id = ?',
        [id, userId]
      );
      
      if (!rows || !rows.length) {
        throw new AppError('Note not found or you do not have permission', 404);
      }
      
      // If removing password protection
      if (password === null) {
        await db.execute(
          'UPDATE notes SET is_password_protected = 0, password_hash = NULL, updated_at = NOW() WHERE id = ?',
          [id]
        );
        return this.findById(id);
      }
      
      // Hash the password
      const passwordHash = await bcrypt.hash(password, 10);
      
      // Update the note with password protection
      await db.execute(
        'UPDATE notes SET is_password_protected = 1, password_hash = ?, updated_at = NOW() WHERE id = ?',
        [passwordHash, id]
      );
      
      return this.findById(id);
    } catch (error) {
      console.error('[NoteModel.setPassword] Error:', error);
      throw error;
    }
  }
  
  static async verifyPassword(id: number, password: string): Promise<boolean> {
    try {
      const [rows] = await db.execute<RowDataPacket[]>(
        'SELECT password_hash FROM notes WHERE id = ? AND is_password_protected = 1',
        [id]
      );
      
      if (!rows || !rows.length || !rows[0].password_hash) {
        return false;
      }
      
      return bcrypt.compare(password, rows[0].password_hash);
    } catch (error) {
      console.error('[NoteModel.verifyPassword] Error:', error);
      return false;
    }
  }
  
  static async addCollaborator(noteId: number, ownerId: number, collaboratorEmail: string, role: 'viewer' | 'editor'): Promise<boolean> {
    try {
      // Check note ownership
      const [ownerRows] = await db.execute<RowDataPacket[]>(
        'SELECT * FROM notes WHERE id = ? AND user_id = ?',
        [noteId, ownerId]
      );
      
      if (!ownerRows || !ownerRows.length) {
        throw new AppError('Note not found or you are not the owner', 403);
      }
      
      // Find the user by email
      const [userRows] = await db.execute<RowDataPacket[]>(
        'SELECT id FROM users WHERE email = ?',
        [collaboratorEmail]
      );
      
      if (!userRows || !userRows.length) {
        throw new AppError('User not found', 404);
      }
      
      const collaboratorId = userRows[0].id;
      
      // Don't add the owner as a collaborator
      if (collaboratorId === ownerId) {
        throw new AppError('You cannot add yourself as a collaborator', 400);
      }
      
      // Check if already a collaborator
      const [existingRows] = await db.execute<RowDataPacket[]>(
        'SELECT * FROM note_shares WHERE note_id = ? AND user_id = ?',
        [noteId, collaboratorId]
      );
      
      // Map role to permission (note_shares uses 'permission' column, not 'role')
      const permission = role === 'editor' ? 'write' : 'read';
      
      if (existingRows && existingRows.length > 0) {
        // Update permission if different
        if (existingRows[0].permission !== permission) {
          await db.execute(
            'UPDATE note_shares SET permission = ? WHERE note_id = ? AND user_id = ?',
            [permission, noteId, collaboratorId]
          );
        }
      } else {
        // Add new collaborator
        await db.execute(
          'INSERT INTO note_shares (note_id, user_id, permission) VALUES (?, ?, ?)',
          [noteId, collaboratorId, permission]
        );
      }
      
      return true;
    } catch (error) {
      console.error('[NoteModel.addCollaborator] Error:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to add collaborator', 500);
    }
  }
  
  static async removeCollaborator(noteId: number, ownerId: number, collaboratorId: number): Promise<boolean> {
    try {
      // Check note ownership
      const [ownerRows] = await db.execute<RowDataPacket[]>(
        'SELECT * FROM notes WHERE id = ? AND user_id = ?',
        [noteId, ownerId]
      );
      
      if (!ownerRows || !ownerRows.length) {
        throw new AppError('Note not found or you are not the owner', 403);
      }
      
      // Remove collaborator
      await db.execute(
        'DELETE FROM note_shares WHERE note_id = ? AND user_id = ?',
        [noteId, collaboratorId]
      );
      
      return true;
    } catch (error) {
      console.error('[NoteModel.removeCollaborator] Error:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to remove collaborator', 500);
    }
  }
} 
 