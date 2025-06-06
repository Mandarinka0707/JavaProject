import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL, API_ENDPOINTS } from '../../config';
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
      const response = await fetch(`${API_URL}${API_ENDPOINTS.AUTH.LOGIN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Login response:', data);
        // Сохраняем токен и ID пользователя в localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);
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
      console.error('Login failed:', error);
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
