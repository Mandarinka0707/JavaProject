import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/styles.css';

const QuizCard = ({ quiz }) => {
  const renderRatingStars = () => {
    const rating = quiz.rating || 0;
    return (
      <div className="rating-stars">
        {[...Array(5)].map((_, index) => (
          <span
            key={index}
            className={`star ${index < Math.round(rating) ? 'filled' : ''}`}
          >
            ★
          </span>
        ))}
        <span className="rating-value">({rating.toFixed(1)})</span>
      </div>
    );
  };

  return (
    <div className="quiz-card">
      <div className="card-header">
        <span className={`difficulty-badge ${quiz.difficulty}`}>
          {quiz.difficulty}
        </span>
        <div className="metadata">
          <span className="time">🕒 {quiz.timeDuration || 15} мин</span>
          <span className="questions">❓ {quiz.questions?.length || 0} вопросов</span>
        </div>
      </div>

      <h3 className="quiz-title">{quiz.title}</h3>
      <p className="quiz-description">{quiz.description}</p>

      <div className="tags-list">
        {quiz.tags && quiz.tags.map((tag, index) => (
          <span key={index} className="tag">#{tag}</span>
        ))}
      </div>

      <div className="card-footer">
        {renderRatingStars()}
        <Link to={`/quiz/${quiz.id}`} className="start-button">
          Начать
        </Link>
      </div>
    </div>
  );
};

export default QuizCard;
