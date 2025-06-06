import { API_URL, API_ENDPOINTS } from '../config';

export const getUserRating = async () => {
  try {
    const response = await fetch(`${API_URL}${API_ENDPOINTS.RATINGS.MY}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('token');
        throw new Error('Сессия истекла');
      }
      throw new Error('Ошибка при получении рейтинга');
    }

    const data = await response.json();
    return {
      averageScore: data.averageScore || 0,
      completedQuizzes: data.completedQuizzes || 0,
      totalAttempts: data.totalAttempts || 0,
      rank: data.rank || 0,
      username: data.username
    };
  } catch (error) {
    console.error('Error fetching user rating:', error);
    throw error;
  }
};

export const refreshUserRating = async () => {
  try {
    const response = await fetch(`${API_URL}${API_ENDPOINTS.RATINGS.REFRESH}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('token');
        throw new Error('Сессия истекла');
      }
      throw new Error('Ошибка при обновлении рейтинга');
    }

    return await getUserRating();
  } catch (error) {
    console.error('Error refreshing user rating:', error);
    throw error;
  }
}; 