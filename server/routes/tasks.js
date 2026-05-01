const router = require('express').Router();
const db = require('../config/db');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Dashboard stats — must be before /:id routes
router.get('/stats', verifyToken, async (req, res) => {
    try {
        let totalQuery, byStatusQuery, overdueQuery;
        const params = [];

        if (req.user.role === 'admin') {
            totalQuery = 'SELECT COUNT(*) as count FROM tasks';
            byStatusQuery = 'SELECT status, COUNT(*) as count FROM tasks GROUP BY status';
            overdueQuery = "SELECT COUNT(*) as count FROM tasks WHERE due_date < CURDATE() AND status != 'done'";
        } else {
            totalQuery = 'SELECT COUNT(*) as count FROM tasks WHERE assigned_to = ?';
            byStatusQuery = 'SELECT status, COUNT(*) as count FROM tasks WHERE assigned_to = ? GROUP BY status';
            overdueQuery = "SELECT COUNT(*) as count FROM tasks WHERE assigned_to = ? AND due_date < CURDATE() AND status != 'done'";
            params.push(req.user.id);
        }

        const [[{ count: total }]] = await db.query(totalQuery, params);
        const [byStatus] = await db.query(byStatusQuery, params);
        const [[{ count: overdue }]] = await db.query(overdueQuery, params);

        res.json({ total, byStatus, overdue });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get tasks (with optional projectId filter)
router.get('/', verifyToken, async (req, res) => {
    const { projectId } = req.query;
    try {
        const params = [];
        let where = [];

        if (req.user.role !== 'admin') {
            where.push('t.assigned_to = ?');
            params.push(req.user.id);
        }
        if (projectId) {
            where.push('t.project_id = ?');
            params.push(projectId);
        }

        const whereClause = where.length ? 'WHERE ' + where.join(' AND ') : '';

        const [rows] = await db.query(`
            SELECT t.*, u.name as assigned_name, p.name as project_name
            FROM tasks t
            LEFT JOIN users u ON t.assigned_to = u.id
            LEFT JOIN projects p ON t.project_id = p.id
            ${whereClause}
            ORDER BY t.id DESC
        `, params);

        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create task (admin only)
router.post('/', verifyToken, isAdmin, async (req, res) => {
    const { title, description, project_id, assigned_to, due_date, priority, status } = req.body;
    if (!title) return res.status(400).json({ message: 'Task title required' });
    try {
        const [result] = await db.query(
            'INSERT INTO tasks (title, description, project_id, assigned_to, created_by, due_date, priority, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [title, description || '', project_id, assigned_to || null, req.user.id, due_date || null, priority || 'medium', status || 'todo']
        );
        const [rows] = await db.query(`
            SELECT t.*, u.name as assigned_name, p.name as project_name
            FROM tasks t
            LEFT JOIN users u ON t.assigned_to = u.id
            LEFT JOIN projects p ON t.project_id = p.id
            WHERE t.id = ?
        `, [result.insertId]);
        res.status(201).json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update full task
router.put('/:id', verifyToken, async (req, res) => {
    const { title, description, priority, status, assigned_to, due_date } = req.body;
    try {
        if (req.user.role !== 'admin') {
            const [tasks] = await db.query('SELECT * FROM tasks WHERE id = ? AND assigned_to = ?', [req.params.id, req.user.id]);
            if (!tasks.length) return res.status(403).json({ message: 'Not authorized' });
            await db.query('UPDATE tasks SET status = ? WHERE id = ?', [status, req.params.id]);
        } else {
            await db.query(
                'UPDATE tasks SET title=?, description=?, priority=?, status=?, assigned_to=?, due_date=? WHERE id=?',
                [title, description, priority, status, assigned_to || null, due_date || null, req.params.id]
            );
        }
        const [rows] = await db.query(`
            SELECT t.*, u.name as assigned_name, p.name as project_name
            FROM tasks t
            LEFT JOIN users u ON t.assigned_to = u.id
            LEFT JOIN projects p ON t.project_id = p.id
            WHERE t.id = ?
        `, [req.params.id]);
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update task status only (drag & drop)
router.patch('/:id/status', verifyToken, async (req, res) => {
    const { status } = req.body;
    try {
        await db.query('UPDATE tasks SET status = ? WHERE id = ?', [status, req.params.id]);
        res.json({ message: 'Status updated' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete task (admin only)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        await db.query('DELETE FROM tasks WHERE id = ?', [req.params.id]);
        res.json({ message: 'Task deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
