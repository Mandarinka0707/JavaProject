// // components/RegisterPage.js
// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import '/Users/darinautalieva/Desktop/Projects/JavaProject/front-quiz-app/src/styles.css';
// const RegisterPage = () => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [email, setEmail] = useState('');
//   const navigate = useNavigate();

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Здесь должна быть логика регистрации
//     navigate('/login');
//   };

//   return (
//     <div className="auth-container">
//       <h2>Регистрация</h2>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           placeholder="Имя пользователя"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//           required
//         />
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />
//         <input
//           type="password"
//           placeholder="Пароль"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />
//         <button type="submit" className="auth-button">Зарегистрироваться</button>
//       </form>
//     </div>
//   );
// };

// export default RegisterPage;


import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL, API_ENDPOINTS } from '../../config';
import '../../styles/styles.css';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Очищаем предыдущие ошибки
    
    try {
      const response = await fetch(`${API_URL}${API_ENDPOINTS.AUTH.REGISTER}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, email }),
      });
      
      if (response.ok) {
        // Успешная регистрация
        navigate('/login');
      } else {
        // Пытаемся получить сообщение об ошибке
        try {
          const data = await response.json();
          setError(data.message || 'Ошибка при регистрации');
          console.error('Registration failed:', data.message);
        } catch (jsonError) {
          setError('Ошибка при регистрации');
          console.error('Error parsing error response:', jsonError);
        }
      }
    } catch (error) {
      setError('Ошибка сервера. Пожалуйста, попробуйте позже.');
      console.error('Error during registration:', error);
    }
  };

  return (
    <div className="auth-container">
      <h2>Регистрация</h2>
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
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="auth-button">Зарегистрироваться</button>
      </form>
    </div>
  );
};

export default RegisterPage;
