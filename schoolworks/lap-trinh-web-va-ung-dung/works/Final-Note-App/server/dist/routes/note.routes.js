"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const note_controller_1 = require("../controllers/note.controller");
const label_controller_1 = require("../controllers/label.controller");
const collaboration_controller_1 = require("../controllers/collaboration.controller");
const database_1 = require("../config/database");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
router.get('/', note_controller_1.NoteController.list);
router.post('/', note_controller_1.NoteController.create);
router.get('/:id', note_controller_1.NoteController.get);
router.patch('/:id', note_controller_1.NoteController.update);
router.delete('/:id', note_controller_1.NoteController.delete);
router.post('/:id/pin', note_controller_1.NoteController.pin);
router.post('/:id/unpin', note_controller_1.NoteController.unpin);
// Direct test endpoint for debugging note fetching issues
router.get('/test/direct-notes', async (req, res) => {
    var _a;
    try {
        console.log('[DirectNotes] User ID:', (_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
        if (!req.user || !req.user.id) {
            return res.status(401).json({ status: 'error', message: 'Authentication required' });
        }
        // Query notes directly from database
        const [rows] = await database_1.db.execute('SELECT * FROM notes WHERE user_id = ? ORDER BY is_pinned DESC, updated_at DESC', [req.user.id]);
        console.log(`[DirectNotes] Found ${rows.length} notes for user ${req.user.id}`);
        // Map rows to appropriate format
        const notes = rows.map(row => ({
            id: row.id,
            userId: row.user_id,
            title: row.title,
            content: row.content,
            isPinned: !!row.is_pinned,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
        }));
        return res.json({
            status: 'success',
            data: { notes },
            debug: { rawRows: rows }
        });
    }
    catch (error) {
        console.error('[DirectNotes] Error:', error);
        return res.status(500).json({ status: 'error', message: 'Server error', error: String(error) });
    }
});
// NEW fixed endpoint that handles different user ID formats
router.get('/direct-db-notes', async (req, res) => {
    var _a, _b;
    try {
        console.log('[DirectDBNotes] User ID from token:', (_a = req.user) === null || _a === void 0 ? void 0 : _a.id, 'Type:', typeof ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id));
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
        const [rows] = await database_1.db.execute(`SELECT n.* 
       FROM notes n
       LEFT JOIN note_shares nc ON n.id = nc.note_id
       WHERE n.user_id = ? OR nc.user_id = ?
       GROUP BY n.id
       ORDER BY n.is_pinned DESC, n.updated_at DESC`, [userId, userId]);
        console.log(`[DirectDBNotes] Found ${rows.length} notes for user ${userId}`);
        // If no notes found, create a sample note
        if (rows.length === 0) {
            console.log('[DirectDBNotes] No notes found, creating sample note');
            const [result] = await database_1.db.execute('INSERT INTO notes (user_id, title, content, is_pinned, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())', [
                userId,
                'Welcome to Note App',
                'This is your first note! Created to help with the display issue.',
                1 // Pinned
            ]);
            const [newRows] = await database_1.db.execute('SELECT * FROM notes WHERE user_id = ? ORDER BY is_pinned DESC, updated_at DESC', [userId]);
            const notes = newRows.map(row => ({
                id: row.id,
                userId: row.user_id,
                title: row.title,
                content: row.content || '',
                isPinned: !!row.is_pinned,
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
            createdAt: row.created_at,
            updatedAt: row.updated_at,
        }));
        return res.json({
            status: 'success',
            data: { notes }
        });
    }
    catch (error) {
        console.error('[DirectDBNotes] Error:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Server error fetching notes',
            error: String(error)
        });
    }
});
// Debug endpoint to inspect all notes
router.get('/debug/all-notes', async (req, res) => {
    try {
        // Query notes directly from database
        const [rows] = await database_1.db.execute('SELECT id, user_id, title, is_pinned, created_at, updated_at FROM notes ORDER BY id');
        console.log(`[DEBUG] Found ${rows.length} total notes in database`);
        // Also get user count
        const [userRows] = await database_1.db.execute('SELECT id, email FROM users');
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
    }
    catch (error) {
        console.error('[DEBUG] Error getting all notes:', error);
        return res.status(500).json({ status: 'error', message: 'Server error', error: String(error) });
    }
});
// Collaboration routes
router.get('/:id/collaborators', collaboration_controller_1.CollaborationController.getCollaborators);
router.post('/:id/collaborators', collaboration_controller_1.CollaborationController.addCollaborator);
router.delete('/:id/collaborators/:collaboratorId', collaboration_controller_1.CollaborationController.removeCollaborator);
// Password protection routes
router.post('/:id/password', collaboration_controller_1.CollaborationController.setPassword);
router.post('/:id/verify-password', collaboration_controller_1.CollaborationController.verifyPassword);
// Label CRUD and attach/detach endpoints
router.get('/labels/all', label_controller_1.LabelController.list);
router.post('/labels', label_controller_1.LabelController.create);
router.put('/labels/:label', label_controller_1.LabelController.rename);
router.delete('/labels/:label', label_controller_1.LabelController.delete);
router.post('/:noteId/labels', label_controller_1.LabelController.attach);
router.delete('/:noteId/labels/:label', label_controller_1.LabelController.detach);
exports.default = router;
