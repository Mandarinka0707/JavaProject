// components/Header.js
import { Link, useNavigate } from 'react-router-dom';
import '/Users/darinautalieva/Desktop/JavaProject/front-quiz-app/src/styles.css';

const Header = ({ isAuthenticated, setIsAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsAuthenticated(false);
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-left">
        <Link to="/" className="logo">Викторина</Link>
      </div>
      
      <nav className="header-right">
        <Link to="/quizzes" className="nav-link">Все викторины</Link>
        <Link to="/rating" className="nav-link">Рейтинг</Link>
        
        {isAuthenticated ? (
          <>
            <Link to="/profile" className="nav-link">Профиль</Link>
            <button onClick={handleLogout} className="auth-button">Выйти</button>
          </>
        ) : (
          <>
            <Link to="/login" className="auth-button">Войти</Link>
            <Link to="/register" className="auth-button">Регистрация</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;