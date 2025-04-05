const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// Create a new issue
router.post('/', (req, res) => {
    try {
        const issue = {
            id: uuidv4(),
            ...req.body,
            createdAt: new Date()
        };
        req.app.get('tempData').issues.push(issue);
        res.status(201).json(issue);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get all issues
router.get('/', (req, res) => {
    try {
        const issues = req.app.get('tempData').issues.sort((a, b) => b.createdAt - a.createdAt);
        res.json(issues);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a single issue
router.get('/:id', async (req, res) => {
    try {
        const issue = await Issue.findById(req.params.id);
        if (!issue) return res.status(404).json({ error: 'Issue not found' });
        res.json(issue);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update an issue
router.put('/:id', (req, res) => {
    try {
        const issues = req.app.get('tempData').issues;
        const index = issues.findIndex(i => i.id === req.params.id);
        if (index === -1) return res.status(404).json({ error: 'Issue not found' });
        
        issues[index] = {
            ...issues[index],
            ...req.body,
            updatedAt: new Date()
        };
        res.json(issues[index]);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete an issue
router.delete('/:id', async (req, res) => {
    try {
        const issue = await Issue.findByIdAndDelete(req.params.id);
        if (!issue) return res.status(404).json({ error: 'Issue not found' });
        res.json({ message: 'Issue deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;