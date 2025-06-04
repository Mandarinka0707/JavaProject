import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/styles.css';

const QuizResults = ({ results, quizType }) => {
  if (!results) return null;

  if (quizType === 'PERSONALITY') {
    const { character, traits, description, image } = results;

    return (
      <div className="results-container personality-results">
        <div className="results-header">
          <h2>Ваш результат</h2>
          <div className="character-result">
            <h3>Вы - {character}!</h3>
            {image && (
              <div className="character-image-container">
                <img src={image} alt={character} className="character-image" />
              </div>
            )}
            <p className="character-description">{description}</p>
          </div>
        </div>

        <div className="character-traits">
          <h3>Ваши характеристики:</h3>
          <div className="traits-grid">
            {Object.entries(traits).map(([trait, value]) => (
              <div key={trait} className="trait-item">
                <div className="trait-name">{trait}</div>
                <div className="trait-bar">
                  <div 
                    className="trait-value" 
                    style={{ width: `${value}%` }}
                  />
                </div>
                <div className="trait-percentage">{value}%</div>
              </div>
            ))}
          </div>
        </div>

        <div className="results-actions">
          <Link to="/quizzes" className="results-button secondary">
            Другие тесты
          </Link>
          <button 
            onClick={() => window.location.reload()} 
            className="results-button primary"
          >
            Пройти заново
          </button>
        </div>
      </div>
    );
  }

  // Стандартная викторина
  const { score, totalQuestions, timeSpent, position } = results;
  const percentage = Math.round((score / totalQuestions) * 100);

  return (
    <div className="results-container">
      <div className="results-header">
        <h2>Результаты викторины</h2>
        <div className="results-score">{percentage}%</div>
      </div>

      <div className="results-details">
        <p>Правильных ответов: {score} из {totalQuestions}</p>
        <p>Затраченное время: {Math.round(timeSpent / 60)} мин {timeSpent % 60} сек</p>
        {position && (
          <div className="results-position">
            {position} место в рейтинге
          </div>
        )}
      </div>

      <div className="results-actions">
        <Link to="/quizzes" className="results-button secondary">
          К списку викторин
        </Link>
        <button 
          onClick={() => window.location.reload()} 
          className="results-button primary"
        >
          Попробовать снова
        </button>
      </div>
    </div>
  );
};

export default QuizResults; 