const express = require('express');
const app = express();
require("dotenv").config();
const mongoose = require('mongoose');
const cors = require('cors');


const PORT = process.env.PORT || 8001;

app.use(cors({ origin: '*' }));
app.use(express.json());

const visitSchema = new mongoose.Schema({
    doctorName: String,
    clinicName: String,
    time: String,
    selectedDate: String,
    Notification: String,
});

const healthTipSchema = new mongoose.Schema({
    doctorName: String,
    healthTips: String,
});

const doctorSchema = new mongoose.Schema({
    name: String,
    experience: String,
    qualifications: String,
    rating: Number,
    comments: String,
});

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
    ageDays: {
        type: Number,
        required: true,
        min: 0,
    },
    meanWeight: { 
        type: Number,
        required: true,
        min: 0,
    },
    healthStatus: {
        type: String,
        required: true,
        enum: ['Good', 'Needs Attention'],
    },
    calculatedAt: {
        type: Date,
        default: Date.now,
    },
});
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

const Visit = mongoose.model('Visit', visitSchema);
const Note = mongoose.model('Note', healthTipSchema);
const Doctor = mongoose.model('Doctor', doctorSchema);
const Health = mongoose.model('Health', HealthMonitoringSchema); 
const Pregnancy = mongoose.model('Pregnancy', pregnancySchema); 

// // Pregnancy Routes
// app.use('/pregnancy', PregnancyRoutes);
// app.use('/health', healthRoutes);

app.post('/add-visit', async (req, res) => {
    try {
        const visitData = new Visit(req.body);
        console.log('Visit Data:', visitData);
        await visitData.save();
        res.status(201).send({ message: 'Visit added successfully' });
    } catch (error) {
        res.status(400).send({ error: 'Error saving visit data' });
    }
});

app.post('/add-note', async (req, res) => {
    try {
        const noteData = new Note(req.body);
        console.log('Visit Data:', noteData);
        await noteData.save();
        res.status(201).send({ message: 'Note added successfully' });
    } catch (error) {
        res.status(400).send({ error: 'Error saving Note data' });
    }
});

app.get('/', async (req, res) => {
    try {
        res.status(200).send({ message: 'Visit added successfully' });
    } catch (error) {
        res.status(400).send({ error: 'Error saving visit data' });
    }
});

app.get('/visits', async (req, res) => {
    try {
        const visits = await Visit.find();
        res.status(200).send(visits);
    } catch (error) {
        res.status(500).send({ error: 'Error fetching visit data' });
    }
});

app.get('/notes', async (req, res) => {
    try {
        const visits = await Note.find();
        res.status(200).send(visits);
    } catch (error) {
        res.status(500).send({ error: 'Error fetching visit data' });
    }
});

app.get('/visits/current-month', async (req, res) => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');

    try {
        const visits = await Visit.find({
            selectedDate: { $regex: `^${year}-${month}` }
        });
        res.status(200).send(visits);
    } catch (error) {
        res.status(500).send({ error: 'Error fetching current month visit data' });
    }
});

app.get('/visits/current-date', async (req, res) => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');

    try {
        const visits = await Visit.find({
            selectedDate: { $regex: `^${year}-${month}-${day}` }
        });
        res.status(200).send(visits);
    } catch (error) {
        res.status(500).send({ error: 'Error fetching current date visit data' });
    }
});

app.patch('/update-notification/:id', async (req, res) => {
    const { id } = req.params;
    const { Notification } = req.body;

    try {
        const visit = await Visit.findByIdAndUpdate(id, { Notification }, { new: true });
        if (!visit) {
            return res.status(404).send({ error: 'Visit not found' });
        }
        res.status(200).send({ message: 'Notification updated successfully', visit });
    } catch (error) {
        res.status(500).send({ error: 'Error updating Notification' });
    }
});

app.delete('/delete-visit/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const visit = await Visit.findByIdAndDelete(id);
        if (!visit) {
            return res.status(404).send({ error: 'Visit not found' });
        }
        res.status(200).send({ message: 'Visit deleted successfully' });
    } catch (error) {
        res.status(500).send({ error: 'Error deleting visit' });
    }
});


// Doctor Routes
app.post('/add-doctor', async (req, res) => {
    try {
        const doctorData = new Doctor(req.body);
        await doctorData.save();
        res.status(201).send({ message: 'Doctor data added successfully' });
    } catch (error) {
        res.status(400).send({ error: 'Error saving doctor data' });
    }
});

app.get('/doctors', async (req, res) => {
    try {
        const doctors = await Doctor.find();
        res.status(200).send(doctors);
    } catch (error) {
        res.status(500).send({ error: 'Error fetching doctor data' });
    }
});

app.patch('/update-rating/:id', async (req, res) => {
    const { id } = req.params;
    const { rating } = req.body;

    try {
        const doctor = await Doctor.findByIdAndUpdate(id, { rating }, { new: true });
        if (!doctor) {
            return res.status(404).send({ error: 'Doctor not found' });
        }
        res.status(200).send({ message: 'Rating updated successfully', doctor });
    } catch (error) {
        res.status(500).send({ error: 'Error updating rating' });
    }
});

app.post('/add-record', async (req, res) => {
    try {
        const {
            motherName,
            babyHeight,
            babyWeight,
            ageDays,
            meanWeight,
            healthStatus
          } = req.body;
       // Create a new health monitoring record
    const healthRecord = new Health({
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
        return res.status(400).json({ message: error.message });
    }
    
});

app.get('/modify-mother', async (req, res) => {
    try {
        const { motherName } = req.query;
        if (!motherName) {
            return res.status(400).json({ message: 'Mother name is required.' });
        }
        console.log(`Fetching records for mother: ${motherName}`);
        // Find records by motherName, case-insensitive
        const healthRecords = await Health.find({
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
app.delete('/delete-record/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`Attempting to delete record with ID: ${id}`);
        // Validate ID format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.log('Invalid ID format.');
            return res.status(400).json({ message: 'Invalid record ID.' });
        }
        // Attempt to find and delete the record
        const deletedRecord = await Health.findByIdAndDelete(id);
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

// Create a new pregnancy record
app.post('/paregnancy-add', async (req, res) => {
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
app.get('/pregnancy-get', async (req, res) => {
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








const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO);
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("Failed to connect to MongoDB", err);
    }
};

connect().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
