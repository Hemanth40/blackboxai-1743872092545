const mongoose = require('mongoose');

const IssueSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['road', 'waste', 'safety', 'water', 'electricity', 'other']
    },
    description: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 1000
    },
    severity: {
        type: String,
        required: true,
        enum: ['low', 'medium', 'high']
    },
    location: {
        type: String,
        required: true,
        maxlength: 200
    },
    images: [{
        type: String, // URLs to stored images
        validate: {
            validator: function(v) {
                return /^https?:\/\/.+\..+/.test(v);
            },
            message: props => `${props.value} is not a valid image URL!`
        }
    }],
    status: {
        type: String,
        default: 'open',
        enum: ['open', 'in-progress', 'resolved']
    },
    reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        text: {
            type: String,
            required: true,
            maxlength: 500
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    supporters: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
});

// Update the updatedAt field before saving
IssueSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Issue', IssueSchema);