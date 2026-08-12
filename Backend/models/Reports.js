const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
    {
        reportType: {
            type: String,
            required: true,
            enum: ["inventory", "sales", "profit"]
        },
        // Add other report-specific fields as needed
        createdAt: {
            type: Date,
            default: Date.now
        }
    }
);