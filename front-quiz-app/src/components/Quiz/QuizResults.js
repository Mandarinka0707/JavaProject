import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../services/axiosConfig';
import '../../styles/styles.css';

const QuizResults = ({ results, quizType, quizTitle }) => {
  const [isPublished, setIsPublished] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState(null);

  if (!results) {
    console.error('No results provided to QuizResults component');
    return null;
  }

  console.log('QuizResults component received:', { results, quizType, quizTitle });

  const handlePublish = async () => {
    try {
      setPublishing(true);
      setError(null);
      
      // Логируем входные данные
      console.log('Publishing results:', {
        results,
        quizType,
        quizTitle
      });

      const feedItem = {
        quizId: results.quizId,
        quizTitle: quizTitle || results.quizTitle,
        quizType: quizType || 'STANDARD',
        completedAt: new Date().toISOString(),
        score: results.score || 0,
        totalQuestions: results.totalQuestions || 0,
        timeSpent: results.timeSpent || 0,
        position: results.position || null,
        character: results.character || null,
        description: results.description || null,
        image: results.image || null,
        traits: results.traits || {}
      };

      console.log('Sending feed item to backend:', feedItem);

      const response = await axios.post('/api/profile/feed/publish', feedItem, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      console.log('Server response:', response);
      
      if (response.status === 200) {
        setIsPublished(true);
        console.log('Publication successful, redirecting to feed...');
        setTimeout(() => {
          window.location.href = '/profile/feed';
        }, 1000);
      }
    } catch (error) {
      console.error('Error publishing results:', error);
      console.error('Error response:', error.response);
      console.error('Error details:', error.response?.data);
      
      const errorMessage = error.response?.data?.error || 
                          'Не удалось опубликовать результат. Пожалуйста, попробуйте снова.';
      setError(errorMessage);
    } finally {
      setPublishing(false);
    }
  };

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
            {Object.entries(traits || {}).map(([trait, value]) => (
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

        {error && (
          <div className="error-message" style={{ color: 'red', marginTop: '1rem' }}>
            {error}
          </div>
        )}

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
          <button
            onClick={handlePublish}
            disabled={isPublished || publishing}
            className={`results-button ${isPublished ? 'published' : 'publish'}`}
          >
            {publishing ? 'Публикация...' : isPublished ? 'Опубликовано' : 'Опубликовать результат'}
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

      {error && (
        <div className="error-message" style={{ color: 'red', marginTop: '1rem' }}>
          {error}
        </div>
      )}

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
        <button
          onClick={handlePublish}
          disabled={isPublished || publishing}
          className={`results-button ${isPublished ? 'published' : 'publish'}`}
        >
          {publishing ? 'Публикация...' : isPublished ? 'Опубликовано' : 'Опубликовать результат'}
        </button>
      </div>
    </div>
  );
};

export default QuizResults; 