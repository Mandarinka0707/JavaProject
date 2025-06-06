import { useState, useEffect } from 'react';
import { API_URL, API_ENDPOINTS } from '../../config';
import '../../styles/styles.css';

const QuizRating = ({ quizId, initialRating = 0, initialRatingCount = 0, isCompleted = false }) => {
  const [rating, setRating] = useState(initialRating || 0);
  const [ratingCount, setRatingCount] = useState(initialRatingCount || 0);
  const [userRating, setUserRating] = useState(0);
  const [hasRated, setHasRated] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Проверяем, оценивал ли пользователь эту викторину ранее
    const checkUserRating = async () => {
      try {
        const response = await fetch(`${API_URL}${API_ENDPOINTS.QUIZ.RATING.USER_RATING(quizId)}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.rating) {
            setHasRated(true);
            setUserRating(data.rating);
          }
        }
      } catch (error) {
        console.error('Ошибка при проверке оценки:', error);
      }
    };

    if (quizId) {
      checkUserRating();
    }
  }, [quizId]);

  const handleRate = async (value) => {
    if (!isCompleted || hasRated) return;

    try {
      const response = await fetch(`${API_URL}${API_ENDPOINTS.QUIZ.RATING.RATE(quizId)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ rating: value })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Ошибка при сохранении оценки');
      }

      const data = await response.json();
      
      // Обновляем состояние с новыми данными от сервера
      setRating(data.averageRating);
      setRatingCount(data.totalRatings);
      setUserRating(value);
      setHasRated(true);
      setError(null);

      // Обновляем локальное хранилище
      localStorage.setItem(`quiz_${quizId}_rated`, value.toString());

      // Вызываем событие обновления для обновления отображения в других компонентах
      const event = new CustomEvent('quizRatingUpdated', {
        detail: { quizId, newRating: data.averageRating, newCount: data.totalRatings }
      });
      window.dispatchEvent(event);

    } catch (error) {
      console.error('Ошибка при сохранении оценки:', error);
      setError('Не удалось сохранить оценку. Пожалуйста, попробуйте позже.');
    }
  };

  const renderStars = () => {
    return Array(5).fill(0).map((_, index) => (
      <button
        key={index}
        className={`star ${index < userRating ? 'filled' : ''} ${index < rating ? 'active' : ''}`}
        onClick={() => handleRate(index + 1)}
        disabled={!isCompleted || hasRated}
      >
        ★
      </button>
    ));
  };

  return (
    <div className="rating-container">
      <div className="stars-interactive">
        {renderStars()}
      </div>
      {error && <div className="error-message">{error}</div>}
      <div className="rating-info">
        {ratingCount > 0 && (
          <span>
            Средняя оценка: {rating.toFixed(1)} ({ratingCount} {ratingCount === 1 ? 'оценка' : 'оценок'})
          </span>
        )}
      </div>
    </div>
  );
};

export default QuizRating;