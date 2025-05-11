import { useLocation } from 'react-router-dom';
import QuizRating from './Quiz/QuizRating';
import '/Users/darinautalieva/Desktop/JavaProject/front-quiz-app/src/styles.css';

const Results = () => {
  const location = useLocation();
  const { quizId, score, total, completed } = location.state || {};

  return (
    <div className="results-container">
      <h2>Ваш результат: {score} из {total}</h2>
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