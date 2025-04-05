const express = require('express');
const router = express.Router();
const Volunteer = require('../models/Volunteer');
const User = require('../models/User');

// Create a new volunteer profile
router.post('/', async (req, res) => {
    try {
        // In a real app, you would verify the user is authenticated
        const { userId, skills, availability, interests } = req.body;
        
        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Create volunteer profile
        const volunteer = new Volunteer({
            user: userId,
            skills,
            availability,
            interests
        });

        await volunteer.save();
        res.status(201).json(volunteer);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get all volunteers
router.get('/', async (req, res) => {
    try {
        const volunteers = await Volunteer.find()
            .populate('user', 'firstName lastName email')
            .populate('eventsAttended.event', 'title date');
        res.json(volunteers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a specific volunteer
router.get('/:id', async (req, res) => {
    try {
        const volunteer = await Volunteer.findById(req.params.id)
            .populate('user', 'firstName lastName email')
            .populate('eventsAttended.event', 'title date');
        
        if (!volunteer) {
            return res.status(404).json({ error: 'Volunteer not found' });
        }
        res.json(volunteer);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update volunteer profile
router.put('/:id', async (req, res) => {
    try {
        const volunteer = await Volunteer.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ).populate('user', 'firstName lastName email');
        
        if (!volunteer) {
            return res.status(404).json({ error: 'Volunteer not found' });
        }
        res.json(volunteer);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Record volunteer participation in an event
router.post('/:id/events', async (req, res) => {
    try {
        const { eventId, hours } = req.body;
        
        const volunteer = await Volunteer.findByIdAndUpdate(
            req.params.id,
            {
                $push: {
                    eventsAttended: {
                        event: eventId,
                        hours: hours,
                        date: new Date()
                    }
                }
            },
            { new: true }
        );
        
        if (!volunteer) {
            return res.status(404).json({ error: 'Volunteer not found' });
        }
        res.json(volunteer);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;