const express = require('express');
const app = express();
require("dotenv").config();
const mongoose = require('mongoose');
const cors = require('cors');
// const PregnancyRoutes = require('./routes/pregnancy');
// const healthRoutes = require('./routes/health'); 

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

const Visit = mongoose.model('Visit', visitSchema);
const Note = mongoose.model('Note', healthTipSchema);

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
