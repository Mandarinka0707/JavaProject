// components/StartPage.js
import { useNavigate } from 'react-router-dom';
import '/Users/darinautalieva/Desktop/JavaProject/front-quiz-app/src/styles.css';

const StartPage = () => {
  const navigate = useNavigate();

  return (
    <div className="start-container">
      <h1>Добро пожаловать в Викторину!</h1>
      <span>У нас размещены тысячи разнообразных викторин, с помощью которых можно приятно провести время, узнать о себе что-то новое и сравнить предпочтения с мнением широкой аудитории.</span>
      
    </div>
  );
};

export default StartPage;