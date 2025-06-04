import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import QuizListPage from './QuizListPage';
import { getMyQuizzes } from '../../services/quizService';
import '../../styles/styles.css';

const MyQuizzes = () => {
  const [userQuizzes, setUserQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserQuizzes = async () => {
      try {
        setLoading(true);
        const quizzes = await getMyQuizzes();
        setUserQuizzes(quizzes);
        setError(null);
      } catch (err) {
        setError('Не удалось загрузить ваши викторины. Пожалуйста, попробуйте позже.');
        console.error('Error fetching user quizzes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserQuizzes();
  }, []);

  if (loading) {
    return (
      <div className="my-quizzes-container">
        <div className="loading-message">
          Загрузка ваших викторин...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-quizzes-container">
        <div className="error-message">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="my-quizzes-container">
      <div className="my-quizzes-header">
        <h2>Мои викторины</h2>
        <Link to="/create-quiz" className="create-quiz-button">
          Создать новую викторину
        </Link>
      </div>
      
      {userQuizzes.length === 0 ? (
        <div className="no-quizzes-message">
          <p>У вас пока нет созданных викторин.</p>
          <p>Создайте свою первую викторину!</p>
        </div>
      ) : (
        <QuizListPage quizzes={userQuizzes} />
      )}
    </div>
  );
};

export default MyQuizzes; 