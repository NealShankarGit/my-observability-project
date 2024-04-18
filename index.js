const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();

// Import the tracing setup
const tracer = require('./tracing')('todo-service');

app.use(express.json()); // Middleware to parse JSON bodies

const port = 3000;
let db;

// Start Server function that connects to MongoDB and inserts sample data
const startServer = async () => {
    const client = await MongoClient.connect('mongodb://localhost:27017/', { 
        useNewUrlParser: true, 
        useUnifiedTopology: true 
    });
    db = client.db('todo');
    await db.collection('todos').insertMany([
        { id: '1', title: 'Buy groceries' },
        { id: '2', title: 'Install Aspecto' },
        { id: '3', title: 'Buy my own name domain' }
    ]);
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    });
};

// API endpoint to get all todos
app.get('/todo', async (req, res) => {
    const todos = await db.collection('todos').find({}).toArray();
    res.send(todos);
});

// API endpoint to get a single todo by id
app.get('/todo/:id', async (req, res) => {
    const todo = await db.collection('todos').findOne({ id: req.params.id });
    res.send(todo);
});

// Call startServer to initialize everything
startServer();

