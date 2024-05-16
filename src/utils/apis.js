import axios from 'axios';

const API_BASE_URL = 'https://www.swu-db.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    // Add any other future necessary headers
  },
});

export const getCards = async () => {
  try {
    const response = await api.get('/cards');
    return response.data;
  } catch (error) {
    console.error('Error fetching cards:', error);
    throw error;
  }
};

export const getCardById = async (id) => {
  try {
    const response = await api.get(`/cards/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching card with id ${id}:`, error);
    throw error;
  }
};

// Add future api methods (TCGplayer)
