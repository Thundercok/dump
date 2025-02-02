"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoteController = void 0;
const note_model_1 = require("../models/note.model");
const user_model_1 = require("../models/user.model");
const errorHandler_1 = require("../middleware/errorHandler");
class NoteController {
    static async list(req, res, next) {
        var _a;
        console.log('[NoteController.list] userId:', (_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
        try {
            const notes = await note_model_1.NoteModel.findByUser(req.user.id);
            console.log('[NoteController.list] Found notes:', notes.length);
            console.log('[NoteController.list] Response payload:', JSON.stringify({ status: 'success', data: { notes } }));
            res.json({ status: 'success', data: { notes } });
        }
        catch (err) {
            console.error('[NoteController.list] Error:', err);
            next(err);
        }
    }
    static async create(req, res, next) {
        try {
            if (!req.user) {
                throw new errorHandler_1.AppError('Authentication required', 401);
            }
            console.log('[NoteController.create] req.user:', req.user);
            const { title, content, isPinned } = req.body;
            if (!title) {
                throw new errorHandler_1.AppError('Title is required', 400);
            }
            console.log('[NoteController.create] Creating note with userId:', req.user.id, 'title:', title, 'content length:', content === null || content === void 0 ? void 0 : content.length);
            // Ensure the user exists before creating a note
            try {
                const user = await user_model_1.UserModel.findById(Number(req.user.id));
                if (!user) {
                    // User doesn't exist, create one to avoid broken foreign keys
                    console.log('[NoteController.create] User not found, creating auto-user with id:', req.user.id);
                    const bcrypt = require('bcryptjs');
                    const hash = await bcrypt.hash('temppass123', 10);
                    await user_model_1.UserModel.create({
                        email: req.user.email || `user${req.user.id}@example.com`,
                        password: hash,
                        displayName: req.user.displayName || `User ${req.user.id}`,
                        role: 'user',
                        isVerified: true,
                        isActivated: true
                    });
                    // Force update the ID if needed
                    try {
                        await require('../config/database').db.execute("UPDATE users SET id = ? WHERE email = ?", [req.user.id, req.user.email || `user${req.user.id}@example.com`]);
                    }
                    catch (updateErr) {
                        console.error(`Error setting user ID to ${req.user.id}:`, updateErr);
                    }
                }
            }
            catch (error) {
                console.error('[NoteController.create] Error checking or creating user:', error);
            }
            try {
                const note = await note_model_1.NoteModel.create({
                    userId: Number(req.user.id),
                    title,
                    content: content || '',
                    isPinned: isPinned === true
                });
                console.log('[NoteController.create] Note created successfully with ID:', note.id);
                res.status(201).json({
                    status: 'success',
                    data: { note }
                });
            }
            catch (dbError) {
                console.log('[NoteController.create] Database error:', dbError);
                throw new errorHandler_1.AppError('Failed to create note', 500);
            }
        }
        catch (error) {
            console.log('[NoteController.create] Unexpected error:', error);
            next(error);
        }
    }
    static async get(req, res, next) {
        var _a;
        console.log('[NoteController.get] userId:', (_a = req.user) === null || _a === void 0 ? void 0 : _a.id, 'noteId:', req.params.id);
        try {
            const note = await note_model_1.NoteModel.findById(Number(req.params.id));
            if (note.userId !== req.user.id)
                return res.status(403).json({ status: 'error', message: 'Forbidden' });
            res.json({ status: 'success', data: { note } });
        }
        catch (err) {
            next(err);
        }
    }
    static async update(req, res, next) {
        var _a;
        console.log('[NoteController.update] userId:', (_a = req.user) === null || _a === void 0 ? void 0 : _a.id, 'noteId:', req.params.id, 'body:', req.body);
        try {
            const note = await note_model_1.NoteModel.update(Number(req.params.id), req.user.id, req.body);
            res.json({ status: 'success', data: { note } });
        }
        catch (err) {
            next(err);
        }
    }
    static async delete(req, res, next) {
        var _a;
        console.log('[NoteController.delete] userId:', (_a = req.user) === null || _a === void 0 ? void 0 : _a.id, 'noteId:', req.params.id);
        try {
            await note_model_1.NoteModel.delete(Number(req.params.id), req.user.id);
            res.json({ status: 'success' });
        }
        catch (err) {
            next(err);
        }
    }
    static async pin(req, res, next) {
        var _a;
        console.log('[NoteController.pin] userId:', (_a = req.user) === null || _a === void 0 ? void 0 : _a.id, 'noteId:', req.params.id);
        try {
            const note = await note_model_1.NoteModel.pin(Number(req.params.id), req.user.id, true);
            res.json({ status: 'success', data: { note } });
        }
        catch (err) {
            next(err);
        }
    }
    static async unpin(req, res, next) {
        var _a;
        console.log('[NoteController.unpin] userId:', (_a = req.user) === null || _a === void 0 ? void 0 : _a.id, 'noteId:', req.params.id);
        try {
            const note = await note_model_1.NoteModel.pin(Number(req.params.id), req.user.id, false);
            res.json({ status: 'success', data: { note } });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.NoteController = NoteController;
