import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import StartPage from './components/StartPage';
import Quiz from './components/Quiz/Quiz';
import Results from './components/Results';
import LoginPage from './components/Auth/LoginPage';
import RegisterPage from './components/Auth/RegisterPage';
import RatingPage from './components/Rating/RatingPage';
import QuizListPage from './components/Quiz/QuizListPage';
import ProfilePage from './components/Profile/ProfilePage';
import CreateQuizForm from './components/CreateQuiz/CreateQuizForm';
import ProtectedRoute from './components/ProtectedRoute';
import FriendFeedPage from './components/FriendFeedPage';
import MyQuizzes from './components/Quiz/MyQuizzes';
import { createQuiz, getQuizzes } from './services/quizService';

const categories = [
  { id: 1, title: "Кино", tags: ["фильмы", "актеры", "награды"] },
  { id: 2, title: "История", tags: ["даты", "личности", "события"] },
  { id: 3, title: "Наука", tags: ["физика", "химия", "биология"] },
];

const filterByCategory = (quizzes, categoryId) => {
  if (!categoryId) return quizzes;
  return quizzes.filter(quiz => quiz.categoryId === parseInt(categoryId));
};

const initialQuizzes = [
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
];

const initialFriends = [
  { id: 101, name: 'Алексей Петров', avatar: '', isOnline: true, lastSeen: '2 часа назад' },
  { id: 102, name: 'Мария Иванова', avatar: '', isOnline: false, lastSeen: '5 часов назад' }
];

const initialFriendActivity = [
  {
    id: 1,
    friend: initialFriends[0],
    quizTitle: 'Столицы мира',
    score: 8,
    total: 10,
    date: new Date().toISOString(),
    quizId: 1
  },
  {
    id: 2,
    friend: initialFriends[1],
    quizTitle: 'Столицы мира',
    score: 12,
    total: 15,
    date: new Date().toISOString(),
    quizId: 2
  }
];

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [allQuizzes, setAllQuizzes] = useState([]);
  const [publishedResults, setPublishedResults] = useState([]);
  const [friends, setFriends] = useState([]);
  const [friendActivity, setFriendActivity] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      loadQuizzes();
    }
  }, []);

  const loadQuizzes = async () => {
    try {
      const quizzes = await getQuizzes();
      console.log('Получены все викторины:', quizzes);
      setAllQuizzes(quizzes);
    } catch (error) {
      console.error('Ошибка при загрузке викторин:', error);
    }
  };

  const addNewQuiz = async (quizData) => {
    try {
      const newQuiz = await createQuiz(quizData);
      setAllQuizzes(prev => [...prev, newQuiz]);
      return newQuiz;
    } catch (error) {
      console.error('Ошибка при создании викторины:', error);
      throw error;
    }
  };

  const handlePublishResult = (result) => {
    const newResult = {
      ...result,
      id: Date.now(),
      date: new Date().toISOString()
    };
    setPublishedResults(prev => [newResult, ...prev]);
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
          <Route 
            path="/quizzes" 
            element={<QuizListPage quizzes={allQuizzes} categories={categories} />} 
          />
          <Route 
            path="/quizzes/:categoryId"
            element={<QuizListPage quizzes={allQuizzes} categories={categories} filterByCategory={filterByCategory} />}
          />
          <Route 
            path="/quiz/:id" 
            element={<Quiz quizzes={allQuizzes} />} 
          />
          <Route 
            path="/results" 
            element={<Results onPublishResult={handlePublishResult} />} 
          />
          <Route 
            path="/login" 
            element={!isAuthenticated ? 
              <LoginPage setIsAuthenticated={setIsAuthenticated} /> : 
              <Navigate to="/" />} 
          />
          <Route 
            path="/register" 
            element={!isAuthenticated ? 
              <RegisterPage /> : 
              <Navigate to="/" />} 
          />
          <Route
            path="/rating"
            element={<RatingPage quizzes={allQuizzes} />}
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <ProfilePage 
                  publishedResults={publishedResults}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-quiz"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <CreateQuizForm addQuiz={addNewQuiz} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-quizzes"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <MyQuizzes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/friend-feed"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <FriendFeedPage
                  friends={friends}
                  friendActivity={friendActivity}
                />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
