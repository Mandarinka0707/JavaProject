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
      const response = await fetch('http://localhost:8080/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, email }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Успешная регистрация
        navigate('/login');
      } else {
        // Показываем ошибку от сервера
        setError(data.message || 'Ошибка при регистрации');
        console.error('Registration failed:', data.message);
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
