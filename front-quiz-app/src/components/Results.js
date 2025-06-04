// import { useLocation } from 'react-router-dom';
// import QuizRating from './Quiz/QuizRating';
// import '/Users/darinautalieva/Desktop/Projects/JavaProject/front-quiz-app/src/css/styles.css';

// const Results = () => {
//   const location = useLocation();
//   const { quizId, score, total, completed } = location.state || {};

//   return (
//     <div className="results-container">
//       <h2>Ваш результат: {score} из {total}</h2>
//       {quizId && completed && (
//         <div className="rating-section">
//           <h3>Оцените эту викторину:</h3>
//           <QuizRating 
//             quizId={quizId} 
//             isCompleted={true}
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// export default Results;

import { useLocation, useNavigate } from 'react-router-dom';
import QuizRating from './Quiz/QuizRating';
import '../styles/styles.css';

const Results = ({ onPublishResult }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { 
    quizId, 
    score, 
    total, 
    completed, 
    quizTitle,
    timeSpent,
    position,
    answers,
    personalityResult, // Результат для personality quiz
    quizType // Тип викторины
  } = location.state || {};

  const handlePublish = () => {
    if (onPublishResult) {
      onPublishResult({
        quizId,
        score,
        total,
        title: quizTitle,
        timeSpent,
        position,
        date: new Date().toISOString(),
        personalityResult
      });
    }
    navigate('/profile');
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}м ${remainingSeconds}с`;
  };

  const formatPosition = (pos) => {
    if (!pos) return 'Нет данных';
    if (pos === 1) return '1-е';
    if (pos === 2) return '2-е';
    if (pos === 3) return '3-е';
    return `${pos}-е`;
  };

  const getScoreMessage = (score, total) => {
    const percentage = (score / total) * 100;
    if (percentage === 100) return 'Отлично! Идеальный результат! 🎉';
    if (percentage >= 80) return 'Очень хороший результат! 👏';
    if (percentage >= 60) return 'Неплохой результат! 👍';
    if (percentage >= 40) return 'Есть куда расти! 💪';
    return 'Попробуйте еще раз! 🔄';
  };

  if (!location.state) {
    return (
      <div className="results-container">
        <div className="error-message">
          Результаты не найдены
          <button 
            className="retry-button"
            onClick={() => navigate('/quizzes')}
          >
            К списку викторин
          </button>
        </div>
      </div>
    );
  }

  // Отображение результатов для личностного теста
  if (quizType === 'PERSONALITY' && personalityResult) {
    return (
      <div className="results-container personality-results">
        <div className="results-header">
          <h2>{quizTitle}</h2>
        </div>

        <div className="personality-result">
          <h3>Вы - {personalityResult.title}!</h3>
          {personalityResult.image && (
            <div className="character-image">
              <img src={personalityResult.image} alt={personalityResult.title} />
            </div>
          )}
          <p className="character-description">{personalityResult.description}</p>
        </div>

        <div className="results-details">
          <p>
            <strong>Затраченное время:</strong> {formatTime(timeSpent)}
          </p>
        </div>

        <div className="results-actions">
          <button 
            onClick={handlePublish} 
            className="results-button primary"
          >
            Опубликовать результат
          </button>
          <button 
            onClick={() => navigate('/quizzes')} 
            className="results-button secondary"
          >
            К списку викторин
          </button>
        </div>

        {quizId && completed && (
          <div className="rating-section">
            <h3>Оцените эту викторину:</h3>
            <QuizRating 
              quizId={quizId} 
              isCompleted={true}
            />
          </div>
        )}
      </div>
    );
  }

  // Отображение результатов для стандартной викторины
  return (
    <div className="results-container">
      <div className="results-header">
        <h2>{quizTitle}</h2>
        <p className="score-message">{getScoreMessage(score, total)}</p>
      </div>
      
      <div className="results-score">
        {score} / {total}
        <span className="score-percentage">
          ({Math.round((score / total) * 100)}%)
        </span>
      </div>

      <div className="results-details">
        <p>
          <strong>Затраченное время:</strong> {formatTime(timeSpent)}
        </p>
        <p>
          <strong>Место в рейтинге:</strong> {formatPosition(position)}
        </p>
      </div>

      {answers && (
        <div className="answer-review">
          <h3>Обзор ответов</h3>
          {Object.entries(answers).map(([questionIndex, isCorrect]) => (
            <div 
              key={questionIndex} 
              className={`answer-item ${isCorrect ? 'correct' : 'incorrect'}`}
            >
              <div className="answer-details">
                <span>Вопрос {Number(questionIndex) + 1}</span>
                <span className={`answer-status ${isCorrect ? 'correct' : 'incorrect'}`}>
                  {isCorrect ? '✓ Верно' : '✗ Неверно'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="results-actions">
        <button 
          onClick={handlePublish} 
          className="results-button primary"
        >
          Опубликовать результат
        </button>
        <button 
          onClick={() => navigate('/quizzes')} 
          className="results-button secondary"
        >
          К списку викторин
        </button>
      </div>

      {quizId && completed && (
        <div className="rating-section">
          <h3>Оцените эту викторину:</h3>
          <QuizRating 
            quizId={quizId} 
            isCompleted={true}
          />
        </div>
      )}
    </div>
  );
};

export default Results;