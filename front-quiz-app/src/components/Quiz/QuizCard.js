import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/styles.css';

const QuizCard = ({ quiz }) => {
  const [currentRating, setCurrentRating] = useState(quiz.rating || 0);
  const [ratingCount, setRatingCount] = useState(quiz.ratingCount || 0);

  useEffect(() => {
    // Обработчик события обновления рейтинга
    const handleRatingUpdate = (event) => {
      if (event.detail.quizId === quiz.id) {
        setCurrentRating(event.detail.newRating);
        setRatingCount(event.detail.newCount);
      }
    };

    // Подписываемся на событие обновления рейтинга
    window.addEventListener('quizRatingUpdated', handleRatingUpdate);

    // Отписываемся при размонтировании компонента
    return () => {
      window.removeEventListener('quizRatingUpdated', handleRatingUpdate);
    };
  }, [quiz.id]);

  const starStyle = {
    fontSize: '16px',
    cursor: 'default',
    margin: '0 1px'
  };

  const filledStarStyle = {
    ...starStyle,
    color: '#FFD700',
    textShadow: '0 0 3px rgba(255, 215, 0, 0.5)'
  };

  const emptyStarStyle = {
    ...starStyle,
    color: '#e0e0e0'
  };

  const renderRatingStars = () => {
    const rating = Math.round(currentRating);
    const stars = [];
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          style={i <= rating ? filledStarStyle : emptyStarStyle}
          title={`${i} из 5 звезд`}
        >
          ★
        </span>
      );
    }

    return (
      <div className="rating-stars" style={{ 
        display: 'flex', 
        alignItems: 'center', 
        padding: '6px 10px',
        background: '#f8f4ff',
        borderRadius: '16px',
        fontSize: '0.9rem'
      }}>
        {stars}
        <span style={{
          marginLeft: '6px',
          fontSize: '0.85rem',
          color: '#aa1fbf',
          fontWeight: '600',
          background: 'white',
          padding: '3px 8px',
          borderRadius: '10px'
        }}>
          {currentRating > 0 ? currentRating.toFixed(1) : '0.0'} ({ratingCount})
        </span>
      </div>
    );
  };

  return (
    <div className="quiz-card">
      <div className="card-header">
        <div className="badges">
          <span className={`difficulty-badge ${quiz.difficulty}`}>
            {quiz.difficulty}
          </span>
          <span className="category-badge">
            {quiz.category}
          </span>
        </div>
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
        <Link to={`/quiz/${quiz.id}`} className="start-button" style={{
          padding: '8px 20px',
          fontSize: '1rem',
          borderRadius: '14px',
          fontWeight: '600',
          background: 'linear-gradient(135deg, #cd5cde 0%, #aa1fbf 100%)',
          color: 'white',
          textDecoration: 'none',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 12px rgba(170, 31, 191, 0.15)'
        }}>
          Начать
        </Link>
      </div>

      <style jsx>{`
        .quiz-card {
          background: white;
          border: 1px solid #f3e5ff;
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          min-height: 200px;
          display: flex;
          flex-direction: column;
        }

        .quiz-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
          border-color: #f3e5ff;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.2rem;
        }

        .badges {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .difficulty-badge,
        .category-badge {
          padding: 0.3rem 0.8rem;
          border-radius: 15px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          line-height: 1;
        }

        .difficulty-badge {
          background: linear-gradient(135deg, #f8f4ff, #f3e5ff);
          color: #cd5cde;
        }

        .category-badge {
          background: linear-gradient(135deg, #f3e5ff, #cd5cde);
          color: white;
        }

        .metadata {
          display: flex;
          gap: 0.8rem;
          font-size: 0.9rem;
          color: #666;
        }

        .quiz-title {
          font-size: 1.4rem;
          margin-bottom: 0.8rem;
          color: #2d3436;
        }

        .quiz-description {
          color: #636e72;
          font-size: 0.95rem;
          line-height: 1.5;
          margin-bottom: 1.5rem;
          min-height: 60px;
        }

        .tags-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .tag {
          padding: 0.3rem 0.8rem;
          background: #f8f4ff;
          border-radius: 12px;
          font-size: 0.8rem;
          color: #aa1fbf;
        }

        .card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: auto;
          padding-top: 1rem;
          gap: 1rem;
        }

        .start-button {
          padding: 8px 20px;
          font-size: 1rem;
          border-radius: 14px;
          font-weight: 600;
          background: linear-gradient(135deg, #cd5cde 0%, #aa1fbf 100%);
          color: white;
          text-decoration: none;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(170, 31, 191, 0.15);
        }

        .start-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(170, 31, 191, 0.25);
        }

        @media (max-width: 768px) {
          .quiz-card {
            padding: 1rem;
          }

          .card-header {
            flex-direction: column;
            gap: 0.8rem;
          }

          .metadata {
            width: 100%;
            justify-content: flex-start;
          }

          .quiz-title {
            font-size: 1.2rem;
          }

          .quiz-description {
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
};

export default QuizCard;
