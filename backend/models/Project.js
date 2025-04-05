const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a project title'],
        maxlength: 100
    },
    description: {
        type: String,
        required: [true, 'Please provide a project description'],
        maxlength: 2000
    },
    category: {
        type: String,
        required: true,
        enum: [
            'infrastructure', 
            'education', 
            'environment',
            'healthcare',
            'community',
            'other'
        ]
    },
    location: {
        type: String,
        required: [true, 'Please provide a location']
    },
    targetAmount: {
        type: Number,
        required: [true, 'Please provide a target amount'],
        min: [100, 'Target amount must be at least $100']
    },
    amountRaised: {
        type: Number,
        default: 0
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date,
        required: [true, 'Please provide an end date'],
        validate: {
            validator: function(value) {
                return value > this.startDate;
            },
            message: 'End date must be after start date'
        }
    },
    images: [{
        type: String,
        validate: {
            validator: function(v) {
                return /^https?:\/\/.+\..+/.test(v);
            },
            message: props => `${props.value} is not a valid image URL!`
        }
    }],
    status: {
        type: String,
        enum: ['planning', 'active', 'completed', 'cancelled'],
        default: 'planning'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    updates: [{
        title: String,
        description: String,
        date: {
            type: Date,
            default: Date.now
        },
        images: [String]
    }],
    donors: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        amount: Number,
        anonymous: Boolean,
        date: {
            type: Date,
            default: Date.now
        },
        message: String
    }],
    volunteers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Volunteer'
    }]
}, {
    timestamps: true
});

// Calculate percentage funded as a virtual property
ProjectSchema.virtual('percentFunded').get(function() {
    return Math.round((this.amountRaised / this.targetAmount) * 100);
});

// Update status based on dates and funding
ProjectSchema.pre('save', function(next) {
    const now = new Date();
    
    if (this.status !== 'cancelled') {
        if (now > this.endDate) {
            this.status = 'completed';
        } else if (this.amountRaised >= this.targetAmount) {
            this.status = 'active';
        } else if (this.status === 'planning' && now >= this.startDate) {
            this.status = 'active';
        }
    }
    
    next();
});

module.exports = mongoose.model('Project', ProjectSchema);