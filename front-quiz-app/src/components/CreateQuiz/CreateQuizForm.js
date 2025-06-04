import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createQuiz } from '../../services/quizService';
import '../../styles/styles.css';

const CreateQuizForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [quizData, setQuizData] = useState({
    title: '',
    description: '',
    category: 'GENERAL',
    difficulty: 'EASY',
    quizType: 'STANDARD',
    timeDuration: 30,
    isPublic: true,
    questions: [{
      question: '',
      image: '',
      options: [
        { content: '', traits: { resultIndex: null } },
        { content: '', traits: { resultIndex: null } }
      ]
    }],
    results: []
  });

  const [currentResult, setCurrentResult] = useState({
    title: '', // Имя персонажа
    description: '', // Описание персонажа
    image: '' // URL изображения персонажа
  });

  const handleQuizTypeChange = (e) => {
    const type = e.target.value;
    setQuizData({
      ...quizData,
      quizType: type,
      category: type === 'PERSONALITY' ? 'PERSONALITY' : quizData.category,
      difficulty: 'EASY',
      questions: [{
        question: '',
        image: '',
        options: [
          { content: '', traits: { resultIndex: null } },
          { content: '', traits: { resultIndex: null } }
        ]
      }],
      results: []
    });
  };

  const handleQuestionChange = (field, value) => {
    const updatedQuestions = [...quizData.questions];
    const currentQuestion = updatedQuestions[updatedQuestions.length - 1];
    
    if (field === 'question') {
      currentQuestion.question = value;
    } else if (field === 'image') {
      currentQuestion.image = value;
    }
    
    setQuizData({
      ...quizData,
      questions: updatedQuestions
    });
  };

  const handleOptionChange = (index, field, value) => {
    const updatedQuestions = [...quizData.questions];
    const currentQuestion = updatedQuestions[updatedQuestions.length - 1];
    const updatedOptions = [...currentQuestion.options];
    
    if (field === 'resultIndex') {
      updatedOptions[index] = {
        ...updatedOptions[index],
        content: updatedOptions[index].content,
        traits: {
          resultIndex: value === '' ? null : parseInt(value)
        }
      };
    } else {
      updatedOptions[index] = {
        ...updatedOptions[index],
        [field]: value
      };
    }
    
    currentQuestion.options = updatedOptions;
    
    setQuizData({
      ...quizData,
      questions: updatedQuestions
    });
  };

  const addResult = () => {
    if (!currentResult.title.trim()) {
      setError('Введите имя персонажа');
      return;
    }

    if (!currentResult.description.trim()) {
      setError('Добавьте описание персонажа');
      return;
    }

    setQuizData({
      ...quizData,
      results: [...quizData.results, { ...currentResult }]
    });

    setCurrentResult({
      title: '',
      description: '',
      image: ''
    });
  };

  const addNewQuestion = () => {
    const lastQuestion = quizData.questions[quizData.questions.length - 1];
    
    if (!lastQuestion.question.trim()) {
      setError('Вопрос не может быть пустым');
      return;
    }

    if (quizData.quizType === 'PERSONALITY') {
      const hasUnassignedOptions = lastQuestion.options.some(
        option => option.content.trim() === '' || !option.traits || option.traits.resultIndex === null
      );

      if (hasUnassignedOptions) {
        setError('Каждый вариант ответа должен быть привязан к персонажу');
        return;
      }
    }

    setQuizData({
      ...quizData,
      questions: [
        ...quizData.questions,
        {
          question: '',
          image: '',
          options: [
            { content: '', traits: { resultIndex: null } },
            { content: '', traits: { resultIndex: null } }
          ]
        }
      ]
    });
  };

  const addOptionToCurrentQuestion = () => {
    const updatedQuestions = [...quizData.questions];
    const currentQuestion = updatedQuestions[updatedQuestions.length - 1];
    
    currentQuestion.options.push({ content: '', traits: { resultIndex: null } });
    
    setQuizData({
      ...quizData,
      questions: updatedQuestions
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const lastQuestion = quizData.questions[quizData.questions.length - 1];
      
      // Проверяем основные поля
      if (!quizData.title.trim()) {
        throw new Error('Введите название викторины');
      }

      if (!quizData.description.trim()) {
        throw new Error('Добавьте описание викторины');
      }

      // Проверяем последний вопрос
      if (!lastQuestion.question.trim()) {
        throw new Error('Заполните текущий вопрос');
      }

      if (quizData.quizType === 'PERSONALITY') {
        const hasUnassignedOptions = lastQuestion.options.some(
          option => option.content.trim() === '' || !option.traits || option.traits.resultIndex === null
        );

        if (hasUnassignedOptions) {
          throw new Error('Заполните все варианты ответов и привяжите их к персонажам');
        }

        if (quizData.results.length === 0) {
          throw new Error('Добавьте хотя бы один результат (персонаж)');
        }
      }

      // Подготавливаем данные для отправки
      const dataToSend = {
        ...quizData,
        timeDuration: parseInt(quizData.timeDuration) || 30,
        difficulty: quizData.difficulty || 'EASY'
      };

      const response = await createQuiz(dataToSend);
      navigate(`/quiz/${response.id}`);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-quiz-container">
      <h1>Создание новой викторины</h1>
      
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Название викторины</label>
          <input
            type="text"
            value={quizData.title}
            onChange={(e) => setQuizData({ ...quizData, title: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Описание</label>
          <textarea
            value={quizData.description}
            onChange={(e) => setQuizData({ ...quizData, description: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Тип викторины</label>
          <select
            value={quizData.quizType}
            onChange={handleQuizTypeChange}
            required
          >
            <option value="STANDARD">Стандартная викторина</option>
            <option value="PERSONALITY">Тест "Кто ты?"</option>
          </select>
        </div>

        <div className="form-group">
          <label>Категория</label>
          <select
            value={quizData.category}
            onChange={(e) => setQuizData({ ...quizData, category: e.target.value })}
            disabled={quizData.quizType === 'PERSONALITY'}
            required
          >
            <option value="GENERAL">Общие знания</option>
            <option value="ANIME">Аниме</option>
            <option value="GAMES">Игры</option>
            <option value="MOVIES">Фильмы</option>
            <option value="BOOKS">Книги</option>
            <option value="SPORTS">Спорт</option>
            <option value="SCIENCE">Наука</option>
            <option value="HISTORY">История</option>
            <option value="PERSONALITY">Тесты личности</option>
          </select>
          {quizData.quizType === 'PERSONALITY' && (
            <small className="helper-text">Для тестов "Кто ты?" категория устанавливается автоматически</small>
          )}
        </div>

        <div className="form-group">
          <label>Сложность</label>
          <select
            value={quizData.difficulty}
            onChange={(e) => setQuizData({ ...quizData, difficulty: e.target.value })}
            required
          >
            <option value="EASY">Легкий</option>
            <option value="MEDIUM">Средний</option>
            <option value="HARD">Сложный</option>
          </select>
        </div>

        <div className="form-group">
          <label>Время на прохождение (минуты)</label>
          <input
            type="number"
            min="1"
            value={quizData.timeDuration}
            onChange={(e) => setQuizData({ ...quizData, timeDuration: parseInt(e.target.value) })}
            required
          />
        </div>

        {/* Секция результатов (персонажей) для теста "Кто ты?" */}
        {quizData.quizType === 'PERSONALITY' && (
          <div className="results-section">
            <h2>Добавить персонажа</h2>
            
            <div className="form-group">
              <label>Имя персонажа</label>
              <input
                type="text"
                value={currentResult.title}
                onChange={(e) => setCurrentResult({ ...currentResult, title: e.target.value })}
                placeholder="Например: Наруто Узумаки"
              />
            </div>

            <div className="form-group">
              <label>Описание персонажа</label>
              <textarea
                value={currentResult.description}
                onChange={(e) => setCurrentResult({ ...currentResult, description: e.target.value })}
                placeholder="Опишите персонажа и почему пользователь может быть похож на него"
              />
            </div>

            <div className="form-group">
              <label>Изображение персонажа (URL)</label>
              <input
                type="url"
                value={currentResult.image}
                onChange={(e) => setCurrentResult({ ...currentResult, image: e.target.value })}
                placeholder="URL изображения персонажа"
              />
            </div>

            <button type="button" onClick={addResult} className="add-button">
              Добавить персонажа
            </button>

            {/* Список добавленных персонажей */}
            {quizData.results.length > 0 && (
              <div className="results-list">
                <h3>Добавленные персонажи:</h3>
                {quizData.results.map((result, index) => (
                  <div key={index} className="result-item">
                    <h4>{result.title}</h4>
                    <p>{result.description}</p>
                    {result.image && (
                      <img 
                        src={result.image} 
                        alt={result.title} 
                        className="character-preview"
                        style={{ maxWidth: '200px', height: 'auto' }}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Секция добавления вопроса */}
        {(quizData.quizType !== 'PERSONALITY' || quizData.results.length > 0) && (
          <div className="question-section">
            <h2>Добавить вопрос</h2>
            
            <div className="form-group">
              <label>Текст вопроса</label>
              <input
                type="text"
                value={quizData.questions[quizData.questions.length - 1].question}
                onChange={(e) => handleQuestionChange('question', e.target.value)}
                placeholder="Введите вопрос"
              />
            </div>

            <div className="form-group">
              <label>Изображение к вопросу (URL)</label>
              <input
                type="url"
                value={quizData.questions[quizData.questions.length - 1].image}
                onChange={(e) => handleQuestionChange('image', e.target.value)}
                placeholder="URL изображения (необязательно)"
              />
            </div>

            <div className="options-section">
              <h3>Варианты ответов</h3>
              {quizData.questions[quizData.questions.length - 1].options.map((option, index) => (
                <div key={index} className="option-group">
                  <input
                    type="text"
                    value={option.content}
                    onChange={(e) => handleOptionChange(index, 'content', e.target.value)}
                    placeholder={`Вариант ${index + 1}`}
                  />
                  
                  {quizData.quizType === 'PERSONALITY' && (
                    <select
                      value={option.traits?.resultIndex ?? ''}
                      onChange={(e) => handleOptionChange(index, 'resultIndex', e.target.value)}
                      required
                    >
                      <option value="">Выберите персонажа</option>
                      {quizData.results.map((result, idx) => (
                        <option key={idx} value={idx}>{result.title}</option>
                      ))}
                    </select>
                  )}
                </div>
              ))}
              
              <button
                type="button"
                onClick={addOptionToCurrentQuestion}
                className="add-button"
              >
                Добавить вариант
              </button>
            </div>

            <button type="button" onClick={addNewQuestion} className="add-button">
              Добавить следующий вопрос
            </button>
          </div>
        )}

        {/* Список добавленных вопросов */}
        <div className="questions-list">
          <h3>Добавленные вопросы:</h3>
          {quizData.questions.map((q, index) => (
            <div key={index} className="question-item">
              <p><strong>Вопрос {index + 1}:</strong> {q.question}</p>
              <div className="options-list">
                {q.options.map((opt, optIndex) => (
                  <div key={optIndex} className="option-item">
                    <span>{optIndex + 1}. {opt.content}</span>
                    {quizData.quizType === 'PERSONALITY' && (
                      <span className="result-link">
                        → {quizData.results[opt.resultIndex]?.title}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? 'Создание...' : 'Создать викторину'}
        </button>
      </form>
    </div>
  );
};

export default CreateQuizForm; 