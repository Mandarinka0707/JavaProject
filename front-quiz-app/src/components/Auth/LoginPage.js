// components/LoginPage.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '/Users/darinautalieva/Desktop/JavaProject/front-quiz-app/src/styles.css';
const LoginPage = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Здесь должна быть логика авторизации
    setIsAuthenticated(true);
    navigate('/');
  };

  return (
    <div className="auth-container">
      <h2>Вход в систему</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Имя пользователя"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="auth-button">Войти</button>
      </form>
    </div>
  );
};

export default LoginPage;