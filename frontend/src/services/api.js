import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const explainMove = async (fen, userMove, pgn) => {
  try {
    const response = await apiClient.post('/explain-move', {
      fen,
      user_move: userMove,
      pgn,
    });
    return response.data;
  } catch (error) {
    console.error('Error explaining move:', error);
    throw error;
  }
};

export default apiClient;