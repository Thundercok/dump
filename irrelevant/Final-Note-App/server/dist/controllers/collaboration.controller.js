"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollaborationController = void 0;
const note_model_1 = require("../models/note.model");
const errorHandler_1 = require("../middleware/errorHandler");
class CollaborationController {
    // Get collaborators for a note
    static async getCollaborators(req, res, next) {
        try {
            const noteId = parseInt(req.params.id, 10);
            const userId = req.user.id;
            const note = await note_model_1.NoteModel.findWithCollaborators(noteId, userId);
            if (!note) {
                throw new errorHandler_1.AppError('Note not found or you don\'t have access', 404);
            }
            res.json({
                status: 'success',
                data: {
                    collaborators: note.collaborators || []
                }
            });
        }
        catch (err) {
            next(err);
        }
    }
    // Add a collaborator to a note
    static async addCollaborator(req, res, next) {
        try {
            const noteId = parseInt(req.params.id, 10);
            const userId = req.user.id;
            const { email, role } = req.body;
            if (!email) {
                throw new errorHandler_1.AppError('Collaborator email is required', 400);
            }
            if (!['viewer', 'editor'].includes(role)) {
                throw new errorHandler_1.AppError('Invalid role. Must be "viewer" or "editor"', 400);
            }
            const success = await note_model_1.NoteModel.addCollaborator(noteId, userId, email, role);
            if (success) {
                res.json({
                    status: 'success',
                    message: 'Collaborator added successfully'
                });
            }
            else {
                throw new errorHandler_1.AppError('Failed to add collaborator', 500);
            }
        }
        catch (err) {
            next(err);
        }
    }
    // Remove a collaborator from a note
    static async removeCollaborator(req, res, next) {
        try {
            const noteId = parseInt(req.params.id, 10);
            const userId = req.user.id;
            const collaboratorId = parseInt(req.params.collaboratorId, 10);
            const success = await note_model_1.NoteModel.removeCollaborator(noteId, userId, collaboratorId);
            if (success) {
                res.json({
                    status: 'success',
                    message: 'Collaborator removed successfully'
                });
            }
            else {
                throw new errorHandler_1.AppError('Failed to remove collaborator', 500);
            }
        }
        catch (err) {
            next(err);
        }
    }
    // Set password protection on a note
    static async setPassword(req, res, next) {
        try {
            const noteId = parseInt(req.params.id, 10);
            const userId = req.user.id;
            const { password } = req.body;
            // For removing password protection
            if (password === null) {
                const note = await note_model_1.NoteModel.setPassword(noteId, userId, null);
                return res.json({
                    status: 'success',
                    data: { note },
                    message: 'Password protection removed'
                });
            }
            // For adding password protection
            if (typeof password !== 'string' || password.length < 4) {
                throw new errorHandler_1.AppError('Password must be at least 4 characters', 400);
            }
            const note = await note_model_1.NoteModel.setPassword(noteId, userId, password);
            res.json({
                status: 'success',
                data: { note },
                message: 'Password protection enabled'
            });
        }
        catch (err) {
            next(err);
        }
    }
    // Verify password for a password-protected note
    static async verifyPassword(req, res, next) {
        try {
            const noteId = parseInt(req.params.id, 10);
            const { password } = req.body;
            if (!password) {
                throw new errorHandler_1.AppError('Password is required', 400);
            }
            const isValid = await note_model_1.NoteModel.verifyPassword(noteId, password);
            if (isValid) {
                // If password is valid, get the note
                const note = await note_model_1.NoteModel.findById(noteId);
                res.json({
                    status: 'success',
                    data: { note },
                    message: 'Password verified'
                });
            }
            else {
                throw new errorHandler_1.AppError('Invalid password', 401);
            }
        }
        catch (err) {
            next(err);
        }
    }
}
exports.CollaborationController = CollaborationController;
