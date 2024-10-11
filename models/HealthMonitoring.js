// models/HealthMonitoring.js

const mongoose = require('mongoose');

const HealthMonitoringSchema = new mongoose.Schema({
  motherName: {
    type: String,
    required: true,
    trim: true,
  },
  babyHeight: {
    type: Number,
    required: true,
    min: 0,
  },
  babyWeight: {
    type: Number,
    required: true,
    min: 0,
  },
  ageDays: { // Updated field name
    type: Number,
    required: true,
    min: 0,
  },
  meanWeight: { // New field
    type: Number,
    required: true,
    min: 0,
  },
  healthStatus: {
    type: String,
    required: true,
    enum: ['Good', 'Needs Attention'], // Define allowed values
  },
  calculatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('HealthMonitoring', HealthMonitoringSchema);
