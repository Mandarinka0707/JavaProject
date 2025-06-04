import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/styles.css';

const LoginPage = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Проверяем наличие токена в localStorage при загрузке компонента
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      navigate('/');
    }
  }, [setIsAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Очищаем предыдущие ошибки
    
    try {
      const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Сохраняем токен в localStorage
        localStorage.setItem('token', data.token);
        // Устанавливаем состояние аутентификации
        setIsAuthenticated(true);
        // Добавляем небольшую задержку перед редиректом
        setTimeout(() => {
          navigate('/');
        }, 100);
      } else {
        setError(data.message || 'Неверное имя пользователя или пароль');
        console.error('Login failed:', data.message);
      }
    } catch (error) {
      setError('Ошибка сервера. Пожалуйста, попробуйте позже.');
      console.error('Error during login:', error);
    }
  };

  return (
    <div className="auth-container">
      <h2>Вход в систему</h2>
      {error && <div className="error-message">{error}</div>}
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
