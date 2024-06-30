// Import required modules
const express = require('express');
const { PrismaClient } = require('@prisma/client');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Set EJS as the view engine
app.set('view engine', 'ejs');
// Set static folder
app.use(express.static('public'));
// Body parser middleware for handling form data
app.use(express.urlencoded({ extended: true }));

// Create Prisma Client instance
const prisma = new PrismaClient();

// Routes
app.get('/', async (req, res) => {
    try {
        const todos = await prisma.todo.findMany();
        res.render('index', { todos });
    } catch (error) {
        console.error('Error fetching todos:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/todos', async (req, res) => {
    try {
        const todos = await prisma.todo.findMany();
        res.json(todos);
    } catch (error) {
        console.error('Error fetching todos:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/todos', async (req, res) => {
    try {
        const { task } = req.body; // Extract task from request body
        const newTodo = await prisma.todo.create({
            data: {
                task: task, // Pass task data to create function
                completed: false
            }
        });
        console.log('New todo created:', newTodo);
        res.redirect('/');
    } catch (error) {
        console.error('Error creating todo:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.put('/todos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const todo = await prisma.todo.update({
            where: { id: parseInt(id) },
            data: { completed: req.body.completed }
        });
        res.json(todo);
    } catch (error) {
        console.error('Error updating todo:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.delete('/todos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.todo.delete({ where: { id: parseInt(id) } });
        res.sendStatus(204);
    } catch (error) {
        console.error('Error deleting todo:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
