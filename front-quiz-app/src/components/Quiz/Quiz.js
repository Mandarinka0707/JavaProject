import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import QuizRating from './QuizRating';
import { startQuizAttempt, submitQuizAttempt } from '../../services/quizService';
import '../../styles/styles.css';

const Quiz = ({ quizzes }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);
  const [timerActive, setTimerActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [attemptId, setAttemptId] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [timerStatus, setTimerStatus] = useState('normal'); // 'normal', 'warning', 'danger'
  
  const quiz = quizzes.find(q => q.id === Number(id));

  useEffect(() => {
    if (!quiz) {
      setError('Викторина не найдена');
      return;
    }
    startQuiz();
  }, [quiz]);

  useEffect(() => {
    if (!quiz || !startTime || !timerActive) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 0) {
          clearInterval(timer);
          handleTimeUp();
          return 0;
        }

        // Обновляем статус таймера
        if (prevTime <= 5) {
          setTimerStatus('danger');
        } else if (prevTime <= 10) {
          setTimerStatus('warning');
        }

        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timerActive, startTime, quiz]);

  const startQuiz = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await startQuizAttempt(quiz.id);
      setAttemptId(response.attemptId);
      setStartTime(new Date());
      setTimeLeft(quiz.timeDuration || 30);
      setTimerActive(true);
      setTimerStatus('normal');
    } catch (error) {
      setError('Не удалось начать викторину. Пожалуйста, попробуйте снова.');
      console.error('Ошибка при начале викторины:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTimeUp = () => {
    setTimerActive(false);
    if (!answers[currentQuestion]) {
      const newAnswers = { ...answers, [currentQuestion]: null };
      setAnswers(newAnswers);
      
      setTimeout(() => {
        if (currentQuestion < quiz.questions.length - 1) {
          setCurrentQuestion(c => c + 1);
          setTimeLeft(quiz.timeDuration || 30);
          setTimerActive(true);
          setTimerStatus('normal');
        } else {
          submitResults(newAnswers);
        }
      }, 1000);
    }
  };

  const handleAnswer = async (selectedIndex) => {
    if (submitting || !timerActive) return;
    
    setTimerActive(false);
    const newAnswers = { ...answers, [currentQuestion]: selectedIndex };
    setAnswers(newAnswers);
    
    if (selectedIndex === quiz.questions[currentQuestion].correctIndex) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentQuestion < quiz.questions.length - 1) {
        setCurrentQuestion(c => c + 1);
        setTimeLeft(quiz.timeDuration || 30);
        setTimerActive(true);
        setTimerStatus('normal');
      } else {
        submitResults(newAnswers);
      }
    }, 1500);
  };

  const submitResults = async (finalAnswers) => {
    if (submitting) return;
    
    setSubmitting(true);
    const timeSpent = Math.floor((new Date() - startTime) / 1000);
    
    try {
      const result = await submitQuizAttempt({
        quizId: quiz.id,
        attemptId: attemptId,
        answers: finalAnswers,
        timeSpent: timeSpent
      });

      navigate('/results', { 
        state: { 
          score: result.score,
          total: result.totalQuestions,
          quizId: quiz.id,
          completed: true,
          quizTitle: quiz.title,
          timeSpent: result.timeSpent,
          position: result.position,
          answers: result.answers,
          personalityResult: result.personalityResult,
          quizType: quiz.quizType
        } 
      });
    } catch (error) {
      setError('Не удалось сохранить результаты. Пожалуйста, попробуйте снова.');
      console.error('Ошибка при отправке результатов:', error);
    } finally {
      setSubmitting(false);
    }
  };

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
              if (quiz) startQuiz();
              else navigate('/quizzes');
            }}
          >
            {quiz ? 'Попробовать снова' : 'Вернуться к списку викторин'}
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
        <div className="quiz-meta">
          <h2>{quiz.title}</h2>
          <div className="difficulty-badge">{quiz.difficulty}</div>
        </div>
        
        <div className="quiz-progress">
          <div className="progress-bar">
            <div style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }} />
          </div>
          <div className="progress-text">
            Вопрос {currentQuestion + 1} из {quiz.questions.length}
          </div>
        </div>

        {timerActive && timeLeft > 0 && (
          <div className={`timer ${timerStatus}`}>
            <span>{timeLeft}</span>
          </div>
        )}
      </div>

      <div className="question-container">
        <div className="question-content">
          <h3>{currentQuestionData.question}</h3>
          
          {currentQuestionData.image && (
            <img 
              src={currentQuestionData.image} 
              alt="Изображение вопроса" 
              className="question-image"
            />
          )}
          
          <div className="options-grid">
            {currentQuestionData.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                className={`option-button ${
                  answers[currentQuestion] === index ? 'selected' : ''
                }`}
                disabled={!timerActive || answers[currentQuestion] !== undefined || submitting}
              >
                {option.type === 'image' ? (
                  <img 
                    src={option.content} 
                    alt={`Вариант ${index + 1}`} 
                    className="option-image"
                  />
                ) : (
                  <span className="option-text">{option.content || option}</span>
                )}
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