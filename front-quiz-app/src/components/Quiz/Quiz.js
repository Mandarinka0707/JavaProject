import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import QuizRating from './QuizRating';
import { startQuizAttempt, submitQuizAttempt, getActiveAttempt } from '../../services/quizService';
import { refreshUserRating } from '../../services/userService';
import '../../styles/styles.css';

const Quiz = ({ quizzes, onReload }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);
  const [timerActive, setTimerActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [attemptId, setAttemptId] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [timerStatus, setTimerStatus] = useState('normal'); // 'normal', 'warning', 'danger'
  const mountedRef = useRef(false);
  const initializationDone = useRef(false);
  const initializationAttempts = useRef(0);
  
  console.log('Quiz component - Current ID:', id);
  console.log('Quiz component - Available quizzes:', quizzes);
  
  const quiz = useMemo(() => {
    return quizzes?.find(q => String(q.id) === String(id));
  }, [quizzes, id]);

  console.log('Quiz component - Found quiz:', quiz);

  // Добавляем маппинг для перевода сложности
  const difficultyMap = {
    'EASY': 'Легкий',
    'MEDIUM': 'Средний',
    'HARD': 'Сложный'
  };

  // Функция для перевода сложности
  const translateDifficulty = (difficulty) => {
    return difficultyMap[difficulty] || difficulty;
  };

  // Добавляем функцию форматирования времени
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Объявляем submitResults первым, так как он используется в других функциях
  const submitResults = useCallback(async (finalAnswers) => {
    if (submitting) return;
    
    setSubmitting(true);
    
    try {
      // Calculate timeSpent in seconds, ensuring it's a valid number
      const currentTime = new Date();
      let calculatedTimeSpent = 1; // Default value
      
      // Safely handle startTime
      if (startTime && startTime instanceof Date && !isNaN(startTime)) {
        calculatedTimeSpent = Math.max(1, Math.floor((currentTime - startTime) / 1000));
      }
      
      const debugInfo = {
        quizId: quiz?.id,
        attemptId,
        answers: finalAnswers,
        timeSpent: calculatedTimeSpent,
        startTime: startTime instanceof Date ? startTime.toISOString() : null,
        currentTime: currentTime.toISOString()
      };
      
      console.log('Submitting quiz attempt:', debugInfo);

      const result = await submitQuizAttempt({
        quizId: quiz?.id,
        attemptId: attemptId,
        answers: finalAnswers,
        timeSpent: calculatedTimeSpent
      });

      console.log('Quiz submission result:', result);

      if (!result) {
        throw new Error('Не получен результат от сервера');
      }

      // Обновляем рейтинг пользователя после завершения викторины
      await refreshUserRating();

      navigate('/results', { 
        state: { 
          score: result.score || 0,
          total: result.totalQuestions || 0,
          quizId: quiz?.id,
          completed: true,
          quizTitle: quiz?.title || 'Викторина',
          timeSpent: result.timeSpent || calculatedTimeSpent,
          position: result.position,
          answers: result.answers || finalAnswers,
          personalityResult: result.personalityResult,
          quizType: quiz?.quizType || 'STANDARD',
          quiz: quiz
        } 
      });
    } catch (error) {
      console.error('Ошибка при отправке результатов:', error);
      setError('Не удалось сохранить результаты. Пожалуйста, попробуйте снова.');
    } finally {
      setSubmitting(false);
    }
  }, [quiz, attemptId, startTime, submitting, navigate]);

  const handleTimeUp = useCallback(() => {
    if (!mountedRef.current) return;

    setTimerActive(false);
    if (!answers[currentQuestion]) {
      const newAnswers = { ...answers, [currentQuestion]: null };
      setAnswers(newAnswers);
      
      setTimeout(() => {
        if (currentQuestion < quiz?.questions?.length - 1) {
          setCurrentQuestion(c => c + 1);
          setTimeLeft((quiz?.timeDuration || 30) * 60);
          setTimerActive(true);
          setTimerStatus('normal');
        } else {
          submitResults(newAnswers);
        }
      }, 1000);
    }
  }, [answers, currentQuestion, quiz?.questions?.length, quiz?.timeDuration, submitResults]);

  const handleAnswer = (selectedIndex) => {
    if (!timerActive || answers[currentQuestion] !== undefined || submitting) {
      return;
    }

    const newAnswers = { ...answers, [currentQuestion]: selectedIndex };
    setAnswers(newAnswers);

    // Если это последний вопрос, отправляем результаты
    if (currentQuestion === quiz.questions.length - 1) {
      submitResults(newAnswers);
    } else {
      // Переходим к следующему вопросу
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
        setTimeLeft((quiz?.timeDuration || 30) * 60);
      }, 500);
    }
  };

  // Эффект для таймера
  useEffect(() => {
    if (!quiz || !startTime || !timerActive) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 0) {
          clearInterval(timer);
          handleTimeUp();
          return 0;
        }

        if (prevTime <= 30) {
          setTimerStatus('danger');
        } else if (prevTime <= 60) {
          setTimerStatus('warning');
        }

        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quiz, startTime, timerActive, handleTimeUp]);

  // Функция для проверки активной попытки
  const checkActiveAttempt = useCallback(async () => {
    if (!quiz?.id || !mountedRef.current) return null;
    
    try {
      const activeAttempt = await getActiveAttempt(quiz.id);
      return activeAttempt;
    } catch (error) {
      console.error('Error checking active attempt:', error);
      return null;
    }
  }, [quiz?.id]);

  // Функция для инициализации викторины
  const initializeQuiz = useCallback(async () => {
    if (!mountedRef.current || initializationDone.current || !quiz || initializationAttempts.current > 2) {
      return;
    }

    try {
      initializationAttempts.current += 1;
      console.log('Initializing quiz...', { attempt: initializationAttempts.current });
      setLoading(true);
      setError(null);

      const initQuiz = async () => {
        try {
          // Сначала проверяем наличие активной попытки
          const activeAttempt = await checkActiveAttempt();
          
          if (!mountedRef.current) return;

          if (activeAttempt) {
            console.log('Found active attempt:', activeAttempt);
            setAttemptId(activeAttempt.id);
            // Ensure startTime is a valid Date object
            const attemptStartTime = activeAttempt.startTime ? new Date(activeAttempt.startTime) : new Date();
            if (!isNaN(attemptStartTime)) {
              setStartTime(attemptStartTime);
            } else {
              setStartTime(new Date());
            }
            setTimeLeft(Math.max(0, (quiz.timeDuration || 30) * 60 - (activeAttempt.timeSpent || 0)));
            setAnswers(activeAttempt.answers || {});
            setCurrentQuestion(activeAttempt.currentQuestion || 0);
            setTimerActive(true);
            setTimerStatus('normal');
            initializationDone.current = true;
            return;
          }

          // Если нет активной попытки, начинаем новую
          const response = await startQuizAttempt(quiz.id);
          
          if (!mountedRef.current) return;

          console.log('Quiz started successfully:', response);
          setAttemptId(response.attemptId);
          setStartTime(new Date());
          setTimeLeft((quiz.timeDuration || 30) * 60);
          setTimerActive(true);
          setTimerStatus('normal');
          initializationDone.current = true;
        } catch (error) {
          if (!mountedRef.current) return;
          throw error;
        }
      };

      initQuiz().catch(error => {
        if (!mountedRef.current) return;
        console.error('Error initializing quiz:', error);
        setError(error.message);
      }).finally(() => {
        if (mountedRef.current) {
          setLoading(false);
        }
      });
    } catch (error) {
      if (!mountedRef.current) return;
      console.error('Error in initialization effect:', error);
      setError(error.message);
      setLoading(false);
    }
  }, [quiz, checkActiveAttempt]);

  // Эффект для инициализации
  useEffect(() => {
    mountedRef.current = true;
    console.log('Component mounted');

    return () => {
      console.log('Component unmounting');
      mountedRef.current = false;
      initializationDone.current = false;
      initializationAttempts.current = 0;
    };
  }, []);

  // Эффект для загрузки викторины
  useEffect(() => {
    if (!mountedRef.current || initializationDone.current) {
      return;
    }

    if (!quizzes || quizzes.length === 0) {
      console.log('No quizzes available, reloading...');
      onReload();
      return;
    }

    if (!quiz) {
      console.log('Quiz not found');
      setError('Викторина не найдена');
      setLoading(false);
      initializationDone.current = true;
      return;
    }

    const timer = setTimeout(() => {
      console.log('Starting quiz initialization');
      initializeQuiz();
    }, 100);

    return () => clearTimeout(timer);
  }, [quiz, quizzes, onReload, initializeQuiz]);

  // Validate quiz ID
  useEffect(() => {
    if (id) {
      const numericId = parseInt(id, 10);
      if (isNaN(numericId) || numericId <= 0) {
        setError('Некорректный ID викторины');
        return;
      }
    }
  }, [id]);

  // Validate time duration
  useEffect(() => {
    if (quiz?.timeDuration) {
      const duration = parseInt(quiz.timeDuration, 10);
      if (isNaN(duration) || duration <= 0) {
        setError('Некорректное время прохождения викторины');
        return;
      }
      setTimeLeft(duration * 60); // Convert to seconds
    }
  }, [quiz]);

  if (loading) {
    return (
      <div className="quiz-container">
        <div className="loading-message">
          <div className="loading-spinner"></div>
          Загрузка викторины...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="quiz-container">
        <div className="error-message">
          {error}
          <button 
            className="retry-button"
            onClick={() => {
              if (quiz) {
                initializeQuiz();
              } else {
                console.log('Quiz component - Attempting to reload quizzes');
                setLoading(true);
                setError(null);
                onReload();
              }
            }}
          >
            {quiz ? 'Попробовать снова' : 'Перезагрузить'}
          </button>
          <button 
            className="back-button"
            onClick={() => navigate('/quizzes')}
          >
            Вернуться к списку викторин
          </button>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="quiz-container">
        <div className="error-message">
          Викторина не найдена
          <button 
            className="retry-button"
            onClick={() => navigate('/quizzes')}
          >
            Вернуться к списку викторин
          </button>
        </div>
      </div>
    );
  }

  const currentQuestionData = quiz.questions[currentQuestion];

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h2>{quiz?.title || 'Загрузка...'}</h2>
        {timerActive && (
          <div className={`timer ${timerStatus}`}>
            {formatTime(timeLeft)}
          </div>
        )}
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="quiz-meta">
        {quiz?.difficulty && (
          <div className={`difficulty-badge ${translateDifficulty(quiz.difficulty)}`}>
            {translateDifficulty(quiz.difficulty)}
          </div>
        )}
      </div>

      <div className="progress-bar">
        <div 
          className="progress-fill"
          style={{ width: `${((currentQuestion + 1) / quiz?.questions?.length) * 100}%` }}
        />
      </div>

      <div className="question-container">
        <div className="question-content">
          <h3>{currentQuestionData?.question}</h3>
          
          {currentQuestionData?.image && (
            <img 
              src={currentQuestionData.image} 
              alt="Изображение вопроса" 
              className="question-image"
            />
          )}
          
          <div className="options-grid">
            {currentQuestionData?.options?.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                className={`option-button ${
                  answers[currentQuestion] === index ? 'selected' : ''
                }`}
                disabled={!timerActive || answers[currentQuestion] !== undefined || submitting}
              >
                <div className="option-content">
                  {option.image && (
                    <img 
                      src={option.image} 
                      alt={`Вариант ${index + 1}`} 
                      className="option-image"
                    />
                  )}
                  <span className="option-text">{option.content}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {location.state?.completed && (
          <QuizRating 
            quizId={quiz.id}
            initialRating={quiz.rating}
            initialRatingCount={quiz.ratingCount}
            isCompleted={true}
            className="rating-section"
          />
        )}
      </div>
    </div>
  );
};

export default Quiz;