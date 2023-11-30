const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/registrationForm', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define a schema for the user data
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String
});

// Create a model based on the schema
const User = mongoose.model('User', userSchema);

// Middleware for parsing JSON data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve the HTML form
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Handle form submissions
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  // Create a new user instance
  const newUser = new User({
    username,
    email,
    password
  });

  try {
    // Save the user to the database
    await newUser.save();
    res.sendFile(__dirname + '/success.html');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// New route to fetch and display registered users
app.get('/users', async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
  

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
