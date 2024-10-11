// routes/health.js

const express = require('express');
const mongoose = require('mongoose'); // Ensure mongoose is imported
const HealthMonitoring = require('../models/HealthMonitoring');
const router = express.Router();

// @route   POST /api/v1/health
// @desc    Create a new health monitoring record
// @access  Public (Consider securing this endpoint)
router.post('/', async (req, res) => {
  try {
    console.log('Received POST data:', req.body);

    const {
      motherName,
      babyHeight,
      babyWeight,
      ageDays,
      meanWeight,
      healthStatus
    } = req.body;

    // Initialize an array to collect missing fields
    const missingFields = [];

    if (!motherName) missingFields.push('motherName');
    if (babyHeight === undefined) missingFields.push('babyHeight');
    if (babyWeight === undefined) missingFields.push('babyWeight');
    if (ageDays === undefined) missingFields.push('ageDays');
    if (meanWeight === undefined) missingFields.push('meanWeight');
    if (!healthStatus) missingFields.push('healthStatus');

    if (missingFields.length > 0) {
      console.log(`Missing fields: ${missingFields.join(', ')}`);
      return res.status(400).json({ 
        message: `Missing required fields: ${missingFields.join(', ')}` 
      });
    }

    // Additional validation
    if (typeof motherName !== 'string' || motherName.trim() === '') {
      return res.status(400).json({ message: 'Invalid mother name.' });
    }

    if (typeof babyHeight !== 'number' || babyHeight <= 0) {
      return res.status(400).json({ message: 'Invalid baby height.' });
    }

    if (typeof babyWeight !== 'number' || babyWeight <= 0) {
      return res.status(400).json({ message: 'Invalid baby weight.' });
    }

    if (typeof ageDays !== 'number' || ageDays < 0) {
      return res.status(400).json({ message: 'Invalid age in days.' });
    }

    if (typeof meanWeight !== 'number' || meanWeight <= 0) {
      return res.status(400).json({ message: 'Invalid mean weight.' });
    }

    if (!['Good', 'Needs Attention'].includes(healthStatus)) {
      return res.status(400).json({ message: 'Invalid health status.' });
    }

    // Create a new health monitoring record
    const healthRecord = new HealthMonitoring({
      motherName: motherName.trim(),
      babyHeight,
      babyWeight,
      ageDays,
      meanWeight,
      healthStatus,
      // calculatedAt is automatically set by the model
    });

    // Save to database
    const savedRecord = await healthRecord.save();
    console.log('Health record saved successfully:', savedRecord);
    return res.status(201).json(savedRecord);
  } catch (error) {
    console.error('Error creating health monitoring record:', error);
    return res.status(500).json({ message: 'Server Error. Please try again later.' });
  }
});

// @route   GET /api/v1/health
// @desc    Get all health monitoring records for a specific mother
// @access  Public (Consider securing this endpoint)
router.get('/', async (req, res) => {
  try {
    const { motherName } = req.query;

    if (!motherName) {
      return res.status(400).json({ message: 'Mother name is required.' });
    }

    console.log(`Fetching records for mother: ${motherName}`);

    // Find records by motherName, case-insensitive
    const healthRecords = await HealthMonitoring.find({ 
      motherName: { $regex: new RegExp(`^${motherName}$`, 'i') } 
    }).sort({ calculatedAt: -1 });

    console.log(`Found ${healthRecords.length} records for mother: ${motherName}`);

    return res.status(200).json(healthRecords);
  } catch (error) {
    console.error('Error fetching health monitoring records:', error);
    return res.status(500).json({ message: 'Server Error. Please try again later.' });
  }
});

// @route   DELETE /api/v1/health/:id
// @desc    Delete a specific health monitoring record
// @access  Public (Consider securing this endpoint)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    console.log(`Attempting to delete record with ID: ${id}`);

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log('Invalid ID format.');
      return res.status(400).json({ message: 'Invalid record ID.' });
    }

    // Attempt to find and delete the record
    const deletedRecord = await HealthMonitoring.findByIdAndDelete(id);

    if (!deletedRecord) {
      console.log('Record not found.');
      return res.status(404).json({ message: 'Record not found.' });
    }

    console.log('Record deleted successfully.');
    return res.status(200).json({ message: 'Record deleted successfully.' });
  } catch (error) {
    console.error('Error deleting health monitoring record:', error);
    return res.status(500).json({ message: 'Server Error. Please try again later.' });
  }
});

module.exports = router;









// // routes/health.js

// const express = require('express');
// const HealthMonitoring = require('../models/HealthMonitoring');
// const router = express.Router();

// // Create a new health monitoring record
// router.post('/', async (req, res) => {
//   try {
//     const { motherName, babyHeight, babyWeight, daysUntilBorn, healthStatus, calculatedAt } = req.body;

//     if (!motherName || !babyHeight || !babyWeight || !daysUntilBorn || !healthStatus) {
//       return res.status(400).json({ message: 'All fields are required.' });
//     }

//     const healthRecord = new HealthMonitoring({
//       motherName,
//       babyHeight,
//       babyWeight,
//       daysUntilBorn,
//       healthStatus,
//       calculatedAt,
//     });

//     await healthRecord.save();
//     res.status(201).json(healthRecord);
//   } catch (error) {
//     console.error('Error creating health monitoring record:', error);
//     res.status(400).json({ message: error.message });
//   }
// });

// // Get all health monitoring records for a specific mother
// router.get('/', async (req, res) => {
//   try {
//     const { motherName } = req.query;

//     if (!motherName) {
//       return res.status(400).json({ message: 'Mother name is required.' });
//     }

//     const healthRecords = await HealthMonitoring.find({ motherName }).sort({ calculatedAt: -1 });

//     res.status(200).json(healthRecords);
//   } catch (error) {
//     console.error('Error fetching health monitoring records:', error);
//     res.status(500).json({ message: error.message });
//   }
// });

// module.exports = router;
