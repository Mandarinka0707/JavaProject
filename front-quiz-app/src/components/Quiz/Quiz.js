import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import QuizRating from './QuizRating';
import '/Users/darinautalieva/Desktop/JavaProject/front-quiz-app/src/styles.css';

const Quiz = ({ quizzes }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [timerActive, setTimerActive] = useState(true);
  const [completedQuizId, setCompletedQuizId] = useState(null);
  
  const quiz = quizzes.find(q => q.id === Number(id));

  useEffect(() => {
    if (!quiz) navigate('/quizzes');
  }, [quiz, navigate]);

  useEffect(() => {
    if (!quiz) return;
    
    const timer = setInterval(() => {
      if (timerActive && timeLeft > 0) {
        setTimeLeft(t => t - 1);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timerActive, timeLeft, quiz]);

  const handleAnswer = (selectedIndex) => {
    setTimerActive(false);
    
    if (selectedIndex === quiz.questions[currentQuestion].correctIndex) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentQuestion < quiz.questions.length - 1) {
        setCurrentQuestion(c => c + 1);
        setTimeLeft(30);
        setTimerActive(true);
      } else {
        setCompletedQuizId(quiz.id);
        navigate('/results', { 
          state: { 
            score, 
            total: quiz.questions.length,
            quizId: quiz.id,
            completed: true
          } 
        });
      }
    }, 1500);
  };

  if (!quiz) return <div className="loading">Загрузка викторины...</div>;

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
      </div>

      <div className="question-container">
        <div className="timer">
          <span>⏳ {timeLeft} сек</span>
        </div>

        <div className="question-content">
          <h3>{quiz.questions[currentQuestion].question}</h3>
          
          <div className="options-grid">
            {quiz.questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                className="option-button"
                disabled={!timerActive}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Убираем дублирующий rating-section и передаем класс как пропс */}
        <QuizRating 
          quizId={quiz.id}
          initialRating={quiz.rating}
          initialRatingCount={quiz.ratingCount}
          isCompleted={location.state?.completed || completedQuizId === quiz.id}
          className="rating-section"
        />
      </div>
    </div>
  );
};

export default Quiz;