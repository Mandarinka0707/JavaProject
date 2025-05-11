import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '/Users/darinautalieva/Desktop/JavaProject/front-quiz-app/src/styles.css';

const QuizCard = ({ quiz }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

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

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      setComments([...comments, newComment]);
      setNewComment('');
    }
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

      <div className="card-footer">
        {renderRatingStars()}
        <Link to={`/quiz/${quiz.id}`} className="start-button">
          Начать
        </Link>
      </div>

      <div className="comments-section">
        <h3>Comments</h3>
        <form onSubmit={handleCommentSubmit}>
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="comment-input"
          />
          <button type="submit" className="comment-submit">Submit</button>
        </form>
        <div className="comments-list">
          {comments.map((comment, index) => (
            <p key={index}>{comment}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizCard;
