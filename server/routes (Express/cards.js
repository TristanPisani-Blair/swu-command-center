const express = require('express');
const router = express.Router();
const axios = require('axios');

const API_BASE_URL = 'https://www.swu-db.com/api';

router.get('/cards', async (req, res) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/cards`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching cards:', error);
    res.status(500).send('Server Error');
  }
});

router.get('/cards/:id', async (req, res) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/cards/${req.params.id}`);
    res.json(response.data);
  } catch (error) {
    console.error(`Error fetching card with id ${req.params.id}:`, error);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
