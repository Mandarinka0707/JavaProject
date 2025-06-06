import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import QuizListPage from './QuizListPage';
import { getMyQuizzes } from '../../services/quizService';
import { validateToken, handleAuthError } from '../../services/authService';
import '../../styles/styles.css';

const MyQuizzes = () => {
  const [userQuizzes, setUserQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadQuizzes = async () => {
      try {
        setLoading(true);
        // Проверяем валидность токена
        await validateToken();
        
        // Если токен валиден, загружаем викторины
        const quizzes = await getMyQuizzes();
        setUserQuizzes(quizzes);
        setError(null);
      } catch (err) {
        console.error('Error in MyQuizzes:', err);
        try {
          handleAuthError(err, navigate, '/my-quizzes');
        } catch (authError) {
          setError('Не удалось загрузить ваши викторины. Пожалуйста, попробуйте позже.');
        }
      } finally {
        setLoading(false);
      }
    };

    loadQuizzes();
  }, [navigate]);

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
          <button 
            className="retry-button"
            onClick={() => window.location.reload()}
          >
            Попробовать снова
          </button>
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