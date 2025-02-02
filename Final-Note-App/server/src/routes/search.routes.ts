import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { db } from '../config/database';
import { RowDataPacket } from 'mysql2';

// Create a dedicated router for search functionality
const router = Router();

router.use(authenticate);

// Search endpoint
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const searchTerm = req.query.search || '';
    
    console.log(`[Search] Searching notes for user ${userId} with term: "${searchTerm}"`);
    
    // Handle special characters in search
    const escapedSearch = typeof searchTerm === 'string' 
      ? searchTerm.replace(/[%_\\]/g, '\\$&')
      : '';
    
    // Execute search query
    const [rows] = await db.execute<RowDataPacket[]>(
      `SELECT * FROM notes 
       WHERE user_id = ? AND (title LIKE ? OR content LIKE ?) 
       ORDER BY is_pinned DESC, updated_at DESC`,
      [userId, `%${escapedSearch}%`, `%${escapedSearch}%`]
    );
    
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
  } catch (error) {
    console.error('[Search] Error searching notes:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Search failed',
      error: String(error)
    });
  }
});

export default router; 
