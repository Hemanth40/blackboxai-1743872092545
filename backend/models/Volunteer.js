const mongoose = require('mongoose');

const VolunteerSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    skills: [{
        type: String,
        enum: [
            'construction', 'teaching', 'medical', 
            'cooking', 'driving', 'tech', 
            'organization', 'language', 'other'
        ]
    }],
    availability: {
        weekdays: Boolean,
        weekends: Boolean,
        mornings: Boolean,
        afternoons: Boolean,
        evenings: Boolean
    },
    interests: [{
        type: String,
        enum: [
            'cleanup', 'tutoring', 'food-distribution',
            'elder-care', 'event-planning', 'construction',
            'administration', 'fundraising', 'other'
        ]
    }],
    eventsAttended: [{
        event: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Event'
        },
        hours: Number,
        date: Date
    }],
    totalHours: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'pending'],
        default: 'pending'
    },
    notes: String
}, {
    timestamps: true
});

// Update total hours when new events are added
VolunteerSchema.pre('save', function(next) {
    if (this.isModified('eventsAttended')) {
        this.totalHours = this.eventsAttended.reduce(
            (sum, event) => sum + (event.hours || 0), 0
        );
    }
    next();
});

module.exports = mongoose.model('Volunteer', VolunteerSchema);