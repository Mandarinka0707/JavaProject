// components/RatingPage.js

import { useState, useEffect } from 'react';
import { getUserRating } from '../../services/userService';
import { API_URL, API_ENDPOINTS } from '../../config';
import '../../styles/styles.css';

const RatingPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [myRating, setMyRating] = useState(null);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const [topResponse, rating] = await Promise.all([
          fetch(`${API_URL}${API_ENDPOINTS.RATINGS.TOP}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Accept': 'application/json'
            }
          }),
          getUserRating()
        ]);

        if (!topResponse.ok) {
          throw new Error('Ошибка при загрузке рейтинга');
        }

        const topUsers = await topResponse.json();

        setUsers(topUsers);
        setMyRating(rating);
      } catch (error) {
        console.error('Ошибка при загрузке рейтинга:', error);
        setError('Не удалось загрузить рейтинг. Пожалуйста, попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, []);

  if (loading) {
    return (
      <div className="rating-container">
        <div className="loading-message">
          <div className="loading-spinner"></div>
          Загрузка рейтинга...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rating-container">
        <div className="error-message">
          {error}
          <button onClick={() => window.location.reload()} className="retry-button">
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rating-container">
      <h1>Рейтинг пользователей</h1>
      
      {myRating && (
        <div className="my-rating">
          <h2>Ваша статистика</h2>
          <div className="my-rating-stats">
            <div className="stat">
              <span className="stat-label">Средний результат:</span>
              <span className="stat-value">{myRating.averageScore.toFixed(2)}%</span>
            </div>
            <div className="stat">
              <span className="stat-label">Место в рейтинге:</span>
              <span className="stat-value">#{myRating.rank}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Пройдено викторин:</span>
              <span className="stat-value">{myRating.completedQuizzes}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Всего попыток:</span>
              <span className="stat-value">{myRating.totalAttempts}</span>
            </div>
          </div>
        </div>
      )}

      <div className="rating-list">
        <h2>Топ игроков</h2>
        {users.map((user, index) => (
          <div key={index} className="rating-item">
            <div className="rating-position">#{index + 1}</div>
            <div className="rating-info">
              <span className="username">{user.username}</span>
              <div className="user-stats">
                <span className="average-score">{user.averageScore.toFixed(2)}%</span>
                <span className="completed-quizzes">
                  Пройдено викторин: {user.completedQuizzes}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RatingPage;