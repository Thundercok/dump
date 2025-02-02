"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const database_1 = require("../config/database");
// Create a dedicated router for search functionality
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
// Search endpoint
router.get('/', async (req, res, next) => {
    try {
        const userId = req.user.id;
        const searchTerm = req.query.search || '';
        console.log(`[Search] Searching notes for user ${userId} with term: "${searchTerm}"`);
        // Handle special characters in search
        const escapedSearch = typeof searchTerm === 'string'
            ? searchTerm.replace(/[%_\\]/g, '\\$&')
            : '';
        // Execute search query
        const [rows] = await database_1.db.execute(`SELECT * FROM notes 
         WHERE user_id = ? AND (title LIKE ? OR content LIKE ?) 
         ORDER BY is_pinned DESC, updated_at DESC`, [userId, `%${escapedSearch}%`, `%${escapedSearch}%`]);
        console.log(`[Search] Found ${rows.length} results for search term "${searchTerm}"`);
        // Format the results
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
        res.json({
            status: 'success',
            data: {
                notes,
                totalCount: notes.length,
                query: searchTerm
            }
        });
    }
    catch (error) {
        console.error('[Search] Error searching notes:', error);
        res.status(500).json({
            status: 'error',
            message: 'Search failed',
            error: String(error)
        });
    }
});
exports.default = router; 
