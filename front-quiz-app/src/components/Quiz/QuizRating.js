import { useState, useEffect } from 'react';
import '../../styles/styles.css';
const QuizRating = ({ quizId, initialRating = 0, initialRatingCount = 0, isCompleted = false }) => {
  const [rating, setRating] = useState(initialRating || 0);
  const [ratingCount, setRatingCount] = useState(initialRatingCount || 0);
  const [userRating, setUserRating] = useState(0);
  const [hasRated, setHasRated] = useState(false);

  useEffect(() => {
    const savedRating = localStorage.getItem(`quiz_${quizId}_rated`);
    if (savedRating) setHasRated(true);
  }, [quizId]);

  const handleRate = async (value) => {
    if (!isCompleted || hasRated) return;

    try {
      const newCount = (ratingCount || 0) + 1;
      const currentTotal = (rating || 0) * (ratingCount || 0);
      const newRating = (currentTotal + value) / newCount;

      localStorage.setItem(`quiz_${quizId}_rated`, 'true');
      
      setRating(newRating);
      setRatingCount(newCount);
      setUserRating(value);
      setHasRated(true);

      // Здесь должна быть реальная интеграция с API
      await fetch(`/api/quizzes/${quizId}/rate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ rating: value })
      });
    } catch (error) {
      console.error('Ошибка оценки:', error);
    }
  };

  return (
    <div className="rating-section">
      {!isCompleted ? (
        <p className="rating-notice">Пройдите викторину, чтобы оценить её!</p>
      ) : hasRated ? (
        <div className="rating-thanks">
          Спасибо за вашу оценку!
          <div className="stars-disabled">
            {[1, 2, 3, 4, 5].map(star => (
              <span key={star} className="star active">★</span>
            ))}
          </div>
        </div>
      ) : (
        <div className="rating-wrapper">
          {[1, 2, 3, 4, 5].map((star) => (
            <button 
              key={star}
              className={`star ${userRating >= star ? 'active' : ''}`}
              onClick={() => handleRate(star)}
              disabled={!isCompleted || hasRated}
            >
              ★
            </button>
          ))}
          <span className="rating-info">
            ({(rating || 0).toFixed(1)}, оценок: {ratingCount || 0})
          </span>
        </div>
      )}
    </div>
  );
};

export default QuizRating;