const mongoose = require('mongoose');

const pregnancySchema = new mongoose.Schema({
  motherName: {
    type: String,
    required: true,
  },
  pregnancyStartDate: {
    type: Date,
    required: true,
  },
  estimatedDeliveryDate: {
    type: Date,
    // required: true,
  },
  deliveryDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['ongoing', 'delivered'],
    default: 'ongoing',
  },
}, { timestamps: true });

// Create a model from the schema
const Pregnancy = mongoose.model('Pregnancy', pregnancySchema);

module.exports = Pregnancy;