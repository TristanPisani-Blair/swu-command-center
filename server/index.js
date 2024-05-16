const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MONGODB_URI;

// Creates a MongoClient with a MongoClientOptions object to set the API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

async function run() {
  try {
    await client.connect();
    // Sends a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
}

run().catch(console.dir);

// Define routes here
app.get('/', (req, res) => {
  res.send('Hello World!');
});


const userRoutes = require('./routes/users');
app.use('/users', userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});