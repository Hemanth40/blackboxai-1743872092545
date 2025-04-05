const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const User = require('../models/User');

// Create a new project
router.post('/', async (req, res) => {
    try {
        // In a real app, you would verify the user is authenticated
        const { createdBy, title, description, category, location, targetAmount, endDate } = req.body;
        
        // Check if user exists
        const user = await User.findById(createdBy);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Create new project
        const project = new Project({
            createdBy,
            title,
            description,
            category,
            location,
            targetAmount,
            endDate
        });

        await project.save();
        res.status(201).json(project);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get all projects
router.get('/', async (req, res) => {
    try {
        const projects = await Project.find()
            .populate('createdBy', 'firstName lastName')
            .populate('donors.user', 'firstName lastName')
            .populate('volunteers', 'firstName lastName');
        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a specific project
router.get('/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate('createdBy', 'firstName lastName')
            .populate('donors.user', 'firstName lastName')
            .populate('volunteers', 'firstName lastName');
        
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.json(project);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update a project
router.put('/:id', async (req, res) => {
    try {
        const project = await Project.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ).populate('createdBy', 'firstName lastName');
        
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.json(project);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Record a donation
router.post('/:id/donations', async (req, res) => {
    try {
        const { userId, amount, anonymous, message } = req.body;
        
        const project = await Project.findByIdAndUpdate(
            req.params.id,
            {
                $push: {
                    donors: {
                        user: userId,
                        amount,
                        anonymous,
                        message
                    }
                },
                $inc: { amountRaised: amount }
            },
            { new: true }
        );
        
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.json(project);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Add a volunteer to a project
router.post('/:id/volunteers', async (req, res) => {
    try {
        const { volunteerId } = req.body;
        
        const project = await Project.findByIdAndUpdate(
            req.params.id,
            {
                $addToSet: {
                    volunteers: volunteerId
                }
            },
            { new: true }
        );
        
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.json(project);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;