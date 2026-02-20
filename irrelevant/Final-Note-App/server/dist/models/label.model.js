"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LabelModel = void 0;
const database_1 = require("../config/database");
const errorHandler_1 = require("../middleware/errorHandler");
class LabelModel {
    static mapRowToLabel(row) {
        return {
            id: row.id,
            name: row.name,
            ownerId: row.owner_id,
            createdAt: row.created_at,
            updatedAt: row.updated_at
        };
    }
    static async create(name, ownerId) {
        try {
            // Check if label with same name already exists for this user
            const existingLabel = await this.findByNameAndOwnerId(name, ownerId);
            if (existingLabel) {
                throw new errorHandler_1.AppError(`Label '${name}' already exists`, 400);
            }
            const [result] = await database_1.db.execute('INSERT INTO labels (name, owner_id) VALUES (?, ?)', [name, ownerId]);
            const newLabel = await this.findById(result.insertId);
            if (!newLabel) {
                throw new errorHandler_1.AppError('Failed to create label', 500);
            }
            return newLabel;
        }
        catch (error) {
            if (error instanceof errorHandler_1.AppError) {
                throw error;
            }
            throw new errorHandler_1.AppError('Error creating label', 500);
        }
    }
    static async findById(id) {
        try {
            const [rows] = await database_1.db.execute('SELECT * FROM labels WHERE id = ?', [id]);
            return rows.length ? this.mapRowToLabel(rows[0]) : null;
        }
        catch (error) {
            throw new errorHandler_1.AppError('Error finding label', 500);
        }
    }
    static async findByOwnerId(ownerId) {
        try {
            const [rows] = await database_1.db.execute('SELECT * FROM labels WHERE owner_id = ? ORDER BY name', [ownerId]);
            return rows.map(row => this.mapRowToLabel(row));
        }
        catch (error) {
            throw new errorHandler_1.AppError('Error finding labels', 500);
        }
    }
    static async findByNameAndOwnerId(name, ownerId) {
        try {
            const [rows] = await database_1.db.execute('SELECT * FROM labels WHERE name = ? AND owner_id = ?', [name, ownerId]);
            return rows.length ? this.mapRowToLabel(rows[0]) : null;
        }
        catch (error) {
            throw new errorHandler_1.AppError('Error finding label', 500);
        }
    }
    static async update(id, name) {
        try {
            const [result] = await database_1.db.execute('UPDATE labels SET name = ? WHERE id = ?', [name, id]);
            if (result.affectedRows === 0) {
                throw new errorHandler_1.AppError('Label not found', 404);
            }
            const updatedLabel = await this.findById(id);
            if (!updatedLabel) {
                throw new errorHandler_1.AppError('Failed to update label', 500);
            }
            return updatedLabel;
        }
        catch (error) {
            if (error instanceof errorHandler_1.AppError) {
                throw error;
            }
            throw new errorHandler_1.AppError('Error updating label', 500);
        }
    }
    static async delete(id) {
        try {
            const [result] = await database_1.db.execute('DELETE FROM labels WHERE id = ?', [id]);
            return result.affectedRows > 0;
        }
        catch (error) {
            throw new errorHandler_1.AppError('Error deleting label', 500);
        }
    }
    static async getLabelsForNote(noteId) {
        try {
            const [rows] = await database_1.db.execute(`SELECT l.* FROM labels l
         INNER JOIN note_labels nl ON l.id = nl.label_id
         WHERE nl.note_id = ?
         ORDER BY l.name`, [noteId]);
            return rows.map(row => this.mapRowToLabel(row));
        }
        catch (error) {
            throw new errorHandler_1.AppError('Error getting labels for note', 500);
        }
    }
    static async attachToNote(labelId, noteId, userId) {
        // Ensure the label belongs to the user
        const [labelRows] = await database_1.db.execute('SELECT * FROM labels WHERE id = ? AND owner_id = ?', [labelId, userId]);
        if (!labelRows.length)
            throw new errorHandler_1.AppError('Label not found or not owned by user', 404);
        // Ensure the note belongs to the user
        const [noteRows] = await database_1.db.execute('SELECT * FROM notes WHERE id = ? AND user_id = ?', [noteId, userId]);
        if (!noteRows.length)
            throw new errorHandler_1.AppError('Note not found or not owned by user', 404);
        // Attach label to note (ignore if already attached)
        await database_1.db.execute('INSERT IGNORE INTO note_labels (note_id, label_id) VALUES (?, ?)', [noteId, labelId]);
    }
    static async detachFromNote(labelId, noteId, userId) {
        // Ensure the label belongs to the user
        const [labelRows] = await database_1.db.execute('SELECT * FROM labels WHERE id = ? AND owner_id = ?', [labelId, userId]);
        if (!labelRows.length)
            throw new errorHandler_1.AppError('Label not found or not owned by user', 404);
        // Ensure the note belongs to the user
        const [noteRows] = await database_1.db.execute('SELECT * FROM notes WHERE id = ? AND user_id = ?', [noteId, userId]);
        if (!noteRows.length)
            throw new errorHandler_1.AppError('Note not found or not owned by user', 404);
        // Detach label from note
        await database_1.db.execute('DELETE FROM note_labels WHERE note_id = ? AND label_id = ?', [noteId, labelId]);
    }
}
exports.LabelModel = LabelModel;
