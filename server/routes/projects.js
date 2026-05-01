const router = require('express').Router();
const db = require('../config/db');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Get all projects (admin sees all, members see joined)
router.get('/', verifyToken, async (req, res) => {
    try {
        let rows;
        if (req.user.role === 'admin') {
            [rows] = await db.query(`
                SELECT p.*,
                    (SELECT COUNT(*) FROM project_members WHERE project_id = p.id) as member_count,
                    (SELECT COUNT(*) FROM tasks WHERE project_id = p.id) as task_count,
                    (SELECT COUNT(*) FROM tasks WHERE project_id = p.id AND status = 'done') as done_count
                FROM projects p
                ORDER BY p.id DESC
            `);
        } else {
            [rows] = await db.query(`
                SELECT p.*,
                    (SELECT COUNT(*) FROM project_members WHERE project_id = p.id) as member_count,
                    (SELECT COUNT(*) FROM tasks WHERE project_id = p.id) as task_count,
                    (SELECT COUNT(*) FROM tasks WHERE project_id = p.id AND status = 'done') as done_count
                FROM projects p
                JOIN project_members pm ON p.id = pm.project_id
                WHERE pm.user_id = ?
                ORDER BY p.id DESC
            `, [req.user.id]);
        }
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get single project with members
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const [projects] = await db.query(`
            SELECT p.*,
                (SELECT COUNT(*) FROM tasks WHERE project_id = p.id) as task_count,
                (SELECT COUNT(*) FROM tasks WHERE project_id = p.id AND status = 'done') as done_count,
                (SELECT COUNT(*) FROM tasks WHERE project_id = p.id AND due_date < CURDATE() AND status != 'done') as overdue_count
            FROM projects p WHERE p.id = ?
        `, [req.params.id]);

        if (!projects.length) return res.status(404).json({ message: 'Project not found' });

        const [members] = await db.query(`
            SELECT u.id, u.name, u.email, u.role
            FROM users u
            JOIN project_members pm ON u.id = pm.user_id
            WHERE pm.project_id = ?
        `, [req.params.id]);

        res.json({ ...projects[0], members });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create project (admin only)
router.post('/', verifyToken, isAdmin, async (req, res) => {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: 'Project name required' });
    try {
        const [result] = await db.query(
            'INSERT INTO projects (name, description, created_by) VALUES (?, ?, ?)',
            [name, description || '', req.user.id]
        );
        res.status(201).json({ message: 'Project created', id: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add member (admin only)
router.post('/:id/members', verifyToken, isAdmin, async (req, res) => {
    const { user_id } = req.body;
    try {
        await db.query(
            'INSERT IGNORE INTO project_members (project_id, user_id) VALUES (?, ?)',
            [req.params.id, user_id]
        );
        res.json({ message: 'Member added' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Remove member (admin only)
router.delete('/:id/members/:userId', verifyToken, isAdmin, async (req, res) => {
    try {
        await db.query(
            'DELETE FROM project_members WHERE project_id = ? AND user_id = ?',
            [req.params.id, req.params.userId]
        );
        res.json({ message: 'Member removed' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete project (admin only)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        await db.query('DELETE FROM tasks WHERE project_id = ?', [req.params.id]);
        await db.query('DELETE FROM project_members WHERE project_id = ?', [req.params.id]);
        await db.query('DELETE FROM projects WHERE id = ?', [req.params.id]);
        res.json({ message: 'Project deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
