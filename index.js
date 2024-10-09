const express = require('express');
const app = express();
require("dotenv").config();
const mongoose = require('mongoose');
const cors = require('cors');

const PORT = process.env.PORT || 8001;

// Enable CORS with default options (you can customize as needed)
app.use(cors({ origin: '*' })); 

// Middleware to parse JSON
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

const Visit = mongoose.model('Visit', visitSchema);
const Note = mongoose.model('Note', healthTipSchema);

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
        console.log("awa");
        res.status(200).send({ message: 'Visit added successfully' });
    } catch (error) {
        res.status(400).send({ error: 'Error saving visit data' });
    }
});

// GET API to fetch all visit data
app.get('/visits', async (req, res) => {
    
    try {
        const visits = await Visit.find();
        console.log(visits);
        res.status(200).send(visits);
    } catch (error) {
        res.status(500).send({ error: 'Error fetching visit data' });
    }
});


// GET API to fetch all visit data
app.get('/notes', async (req, res) => {
    try {
        const visits = await Note.find();
        res.status(200).send(visits);
    } catch (error) {
        res.status(500).send({ error: 'Error fetching visit data' });
    }
});

// GET API to fetch visit data for the current month
app.get('/visits/current-month', async (req, res) => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // `getMonth` is zero-indexed, so add 1

    try {
        // Find visits where selectedDate matches the current year and month
        const visits = await Visit.find({
            selectedDate: {
                $regex: `^${year}-${month}`, // Matches the format "YYYY-MM"
            }
        });
        res.status(200).send(visits);
    } catch (error) {
        res.status(500).send({ error: 'Error fetching current month visit data' });
    }
});
// GET API to fetch visit data for the current date
app.get('/visits/current-date', async (req, res) => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // `getMonth` is zero-indexed, so add 1
    const day = String(currentDate.getDate()).padStart(2, '0');

    try {
        // Find visits where selectedDate matches the current year, month, and day
        const visits = await Visit.find({
            selectedDate: {
                $regex: `^${year}-${month}-${day}`, // Matches the format "YYYY-MM-DD"
            }
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

// Connect to MongoDB
const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO);
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("Failed to connect to MongoDB", err);
    }
};

// Start the server only after connecting to the database
connect().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
