import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import StartPage from './components/StartPage';
import Quiz from './components/Quiz/Quiz';
import Results from './components/Results';
import LoginPage from './components/Auth/LoginPage';
import RegisterPage from './components/Auth/RegisterPage';
import RatingPage from './components/Rating/RatingPage';
import QuizListPage from './components/Quiz/QuizListPage';
import ProfilePage from './components/Profile/ProfilePage';
import CreateQuizForm from './components/Quiz/CreateQuizForm';
import ProtectedRoute from './components/ProtectedRoute';
import Chat from './components/Chat';

const categories = [
  { id: 1, title: "Кино", tags: ["фильмы", "актеры", "награды"] },
  { id: 2, title: "История", tags: ["даты", "личности", "события"] },
  { id: 3, title: "Наука", tags: ["физика", "химия", "биология"] },
];

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userQuizzes, setUserQuizzes] = useState([]);
  const [allQuizzes, setAllQuizzes] = useState([
    {
      id: 1,
      title: "Столицы мира",
      description: "Проверьте свои знания географии",
      difficulty: "средний",
      categoryId: 1,
      category: "Кино",
      tags: ["география", "столицы"],
      rating: 4.5,
      ratingCount: 15,
      time: 5,
      timeLimit: 30,
      progress: 0,
      questions: [
        {
          question: "Столица Франции?",
          options: ["Лондон", "Берлин", "Париж", "Мадрид"],
          correctIndex: 2
        },
        {
          question: "Столица Германии?",
          options: ["Мюнхен", "Берлин", "Гамбург", "Франкфурт"],
          correctIndex: 1
        }
      ],
      author: "system"
    }
  ]);

  const filterByCategory = (quizzes, categoryId) => {
    return quizzes.filter(q => q.categoryId === Number(categoryId));
  };

  const addNewQuiz = (quiz) => {
    const newQuiz = {
      ...quiz,
      id: Date.now(),
      author: "user",
      rating: 0,
      ratingCount: 0,
      timeLimit: 30
    };
    setAllQuizzes(prev => [...prev, newQuiz]);
    setUserQuizzes(prev => [...prev, newQuiz]);
  };

  return (
    <Router>
      <div className="app">
        <Header 
          isAuthenticated={isAuthenticated}
          setIsAuthenticated={setIsAuthenticated}
        />
        
        <Routes>
          <Route path="/" element={<StartPage />} />
          <Route path="/quizzes" element={<QuizListPage quizzes={allQuizzes} categories={categories} />} />
          <Route 
            path="/quizzes/:categoryId" 
            element={<QuizListPage quizzes={allQuizzes} filterByCategory={filterByCategory} categories={categories} />}
          />
          <Route path="/quiz/:id" element={<Quiz quizzes={allQuizzes} />} />
          <Route path="/results" element={<Results />} />
          <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/rating" element={<RatingPage quizzes={allQuizzes} />} />
          <Route 
            path="/profile" 
            element={<ProtectedRoute isAuthenticated={isAuthenticated}><ProfilePage userQuizzes={userQuizzes} /></ProtectedRoute>} 
          />
          <Route 
            path="/create-quiz" 
            element={<ProtectedRoute isAuthenticated={isAuthenticated}><CreateQuizForm addQuiz={addNewQuiz} categories={categories} /></ProtectedRoute>} 
          />
        </Routes>

        <Chat />
      </div>
    </Router>
  );
}

export default App;