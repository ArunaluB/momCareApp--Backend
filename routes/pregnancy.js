const express = require('express');
const Pregnancy = require('../models/Pregnancy');
const router = express.Router();

// Create a new pregnancy record
router.post('/', async (req, res) => {
  try {
    const { motherName, pregnancyStartDate } = req.body;
    const pregnancy = new Pregnancy({ motherName, pregnancyStartDate });
    await pregnancy.save();
    res.status(201).json(pregnancy);
  } catch (error) {
    console.error('Error creating pregnancy record:', error);
    res.status(400).json({ message: error.message });
  }
});

// Get a pregnancy record by motherName
router.get('/', async (req, res) => {
  try {
    const { motherName } = req.query;
    if (!motherName) {
      return res.status(400).json({ message: 'Mother name is required.' });
    }

    const pregnancy = await Pregnancy.findOne({ motherName });
    if (!pregnancy) {
      return res.status(404).json({ message: 'Pregnancy record not found.' });
    }

    res.status(200).json(pregnancy);
  } catch (error) {
    console.error('Error fetching pregnancy record:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;



















// const express = require('express');
// const Pregnancy = require('../models/Pregnancy');
// const router = express.Router();

// // Create a new pregnancy record
// router.post('/', async (req, res) => {
//   try {
//     const { motherName, pregnancyStartDate, estimatedDeliveryDate } = req.body;
//     const pregnancy = new Pregnancy({ motherName, pregnancyStartDate, estimatedDeliveryDate });
//     await pregnancy.save();
//     res.status(201).json(pregnancy);
//   } catch (error) {
//     console.error('Error creating pregnancy record:', error);
//     res.status(400).json({ message: error.message });
//   }
// });

// // Get all pregnancy records
// router.get('/', async (req, res) => {
//   try {
//     const pregnancies = await Pregnancy.find();
//     res.status(200).json(pregnancies);
//   } catch (error) {
//     console.error('Error fetching pregnancy records:', error);
//     res.status(500).json({ message: error.message });
//   }
// });

// // Export the router
// module.exports = router;