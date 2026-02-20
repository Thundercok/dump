import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { db } from '../config/database';
import { Label } from '../types';
import { AppError } from '../middleware/errorHandler';

interface LabelRow extends Label, RowDataPacket {}

export interface CreateLabelDTO {
  name: string;
  userId: string;
}

export class LabelModel {
  private static mapRowToLabel(row: LabelRow): Label {
    return {
      id: row.id,
      name: row.name,
      ownerId: row.owner_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  static async create(name: string, ownerId: number): Promise<Label> {
    try {
      // Check if label with same name already exists for this user
      const existingLabel = await this.findByNameAndOwnerId(name, ownerId);
      if (existingLabel) {
        throw new AppError(`Label '${name}' already exists`, 400);
      }

      const [result] = await db.execute<ResultSetHeader>(
        'INSERT INTO labels (name, owner_id) VALUES (?, ?)',
        [name, ownerId]
      );

      const newLabel = await this.findById(result.insertId);
      if (!newLabel) {
        throw new AppError('Failed to create label', 500);
      }

      return newLabel;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Error creating label', 500);
    }
  }

  static async findById(id: number): Promise<Label | null> {
    try {
      const [rows] = await db.execute<LabelRow[]>(
        'SELECT * FROM labels WHERE id = ?',
        [id]
      );

      return rows.length ? this.mapRowToLabel(rows[0]) : null;
    } catch (error) {
      throw new AppError('Error finding label', 500);
    }
  }

  static async findByOwnerId(ownerId: number): Promise<Label[]> {
    try {
      const [rows] = await db.execute<LabelRow[]>(
        'SELECT * FROM labels WHERE owner_id = ? ORDER BY name',
        [ownerId]
      );

      return rows.map(row => this.mapRowToLabel(row));
    } catch (error) {
      throw new AppError('Error finding labels', 500);
    }
  }

  static async findByNameAndOwnerId(name: string, ownerId: number): Promise<Label | null> {
    try {
      const [rows] = await db.execute<LabelRow[]>(
        'SELECT * FROM labels WHERE name = ? AND owner_id = ?',
        [name, ownerId]
      );

      return rows.length ? this.mapRowToLabel(rows[0]) : null;
    } catch (error) {
      throw new AppError('Error finding label', 500);
    }
  }

  static async update(id: number, name: string): Promise<Label> {
    try {
      const [result] = await db.execute<ResultSetHeader>(
        'UPDATE labels SET name = ? WHERE id = ?',
        [name, id]
      );

      if (result.affectedRows === 0) {
        throw new AppError('Label not found', 404);
      }

      const updatedLabel = await this.findById(id);
      if (!updatedLabel) {
        throw new AppError('Failed to update label', 500);
      }

      return updatedLabel;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Error updating label', 500);
    }
  }

  static async delete(id: number): Promise<boolean> {
    try {
      const [result] = await db.execute<ResultSetHeader>(
        'DELETE FROM labels WHERE id = ?',
        [id]
      );

      return result.affectedRows > 0;
    } catch (error) {
      throw new AppError('Error deleting label', 500);
    }
  }

  static async getLabelsForNote(noteId: number): Promise<Label[]> {
    try {
      const [rows] = await db.execute<LabelRow[]>(
        `SELECT l.* FROM labels l
         INNER JOIN note_labels nl ON l.id = nl.label_id
         WHERE nl.note_id = ?
         ORDER BY l.name`,
        [noteId]
      );

      return rows.map(row => this.mapRowToLabel(row));
    } catch (error) {
      throw new AppError('Error getting labels for note', 500);
    }
  }

  static async attachToNote(labelId: number, noteId: number, userId: number): Promise<void> {
    // Ensure the label belongs to the user
    const [labelRows] = await db.execute<RowDataPacket[]>(
      'SELECT * FROM labels WHERE id = ? AND owner_id = ?',
      [labelId, userId]
    );
    if (!labelRows.length) throw new AppError('Label not found or not owned by user', 404);
    // Ensure the note belongs to the user
    const [noteRows] = await db.execute<RowDataPacket[]>(
      'SELECT * FROM notes WHERE id = ? AND user_id = ?',
      [noteId, userId]
    );
    if (!noteRows.length) throw new AppError('Note not found or not owned by user', 404);
    // Attach label to note (ignore if already attached)
    await db.execute(
      'INSERT IGNORE INTO note_labels (note_id, label_id) VALUES (?, ?)',
      [noteId, labelId]
    );
  }

  static async detachFromNote(labelId: number, noteId: number, userId: number): Promise<void> {
    // Ensure the label belongs to the user
    const [labelRows] = await db.execute<RowDataPacket[]>(
      'SELECT * FROM labels WHERE id = ? AND owner_id = ?',
      [labelId, userId]
    );
    if (!labelRows.length) throw new AppError('Label not found or not owned by user', 404);
    // Ensure the note belongs to the user
    const [noteRows] = await db.execute<RowDataPacket[]>(
      'SELECT * FROM notes WHERE id = ? AND user_id = ?',
      [noteId, userId]
    );
    if (!noteRows.length) throw new AppError('Note not found or not owned by user', 404);
    // Detach label from note
    await db.execute(
      'DELETE FROM note_labels WHERE note_id = ? AND label_id = ?',
      [noteId, labelId]
    );
  }
} 
