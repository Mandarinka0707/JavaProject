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
import FriendsPage from './components/FriendsPage';
import MyQuizzes from './components/Quiz/MyQuizzes';
import { createQuiz, getQuizzes } from './services/quizService';
import { API_URL, API_ENDPOINTS } from './config';
import { getFriends } from './services/friendService';

const categories = [
  { id: 1, title: "Кино", tags: ["фильмы", "актеры", "награды"] },
  { id: 2, title: "История", tags: ["даты", "личности", "события"] },
  { id: 3, title: "Наука", tags: ["физика", "химия", "биология"] },
];

const filterByCategory = (quizzes, categoryId) => {
  if (!categoryId) return quizzes;
  return quizzes.filter(quiz => quiz.categoryId === parseInt(categoryId));
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [allQuizzes, setAllQuizzes] = useState([]);
  const [publishedResults, setPublishedResults] = useState([]);
  const [friends, setFriends] = useState([]);
  const [friendActivity, setFriendActivity] = useState([]);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      if (token) {
        // Проверяем валидность токена
        fetch(`${API_URL}${API_ENDPOINTS.AUTH.VALIDATE}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token.trim()}`,
            'Accept': 'application/json'
          }
        })
        .then(response => {
          if (response.ok) {
            setIsAuthenticated(true);
            // Загружаем данные друзей после успешной авторизации
            loadFriendsData();
          } else {
            localStorage.removeItem('token');
            setIsAuthenticated(false);
          }
        })
        .catch(() => {
          localStorage.removeItem('token');
          setIsAuthenticated(false);
        });
      } else {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
    loadQuizzes();
  }, []);

  const loadFriendsData = async () => {
    try {
      const friendsData = await getFriends();
      setFriends(friendsData);
      
      // Загружаем активность друзей (последние результаты викторин)
      const friendsActivity = friendsData.map(friend => ({
        id: Date.now(),
        friend: friend,
        quizTitle: 'Последняя активность',
        date: new Date().toISOString()
      }));
      setFriendActivity(friendsActivity);
    } catch (error) {
      console.error('Error loading friends data:', error);
    }
  };

  const loadQuizzes = async () => {
    try {
      console.log('App - Starting to load quizzes');
      setAllQuizzes([]); // Clear existing quizzes while loading
      const quizzes = await getQuizzes();
      console.log('App - Quizzes loaded:', quizzes);
      if (Array.isArray(quizzes)) {
        setAllQuizzes(quizzes);
      } else {
        console.error('App - Received non-array quizzes:', quizzes);
        setAllQuizzes([]);
      }
    } catch (error) {
      console.error('App - Error loading quizzes:', error);
      setAllQuizzes([]);
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

  // Add a function to reload quizzes
  const reloadQuizzes = () => {
    console.log('App - Reloading quizzes');
    loadQuizzes();
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
            element={<QuizListPage quizzes={allQuizzes} categories={categories} onReload={reloadQuizzes} />} 
          />
          <Route 
            path="/quizzes/:categoryId"
            element={<QuizListPage quizzes={allQuizzes} categories={categories} filterByCategory={filterByCategory} onReload={reloadQuizzes} />}
          />
          <Route 
            path="/quiz/:id" 
            element={<Quiz quizzes={allQuizzes} onReload={reloadQuizzes} />} 
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
            path="/friends"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <FriendsPage friends={friends} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/friend-feed"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <FriendFeedPage activities={friendActivity} />
              </ProtectedRoute>
            }
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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
