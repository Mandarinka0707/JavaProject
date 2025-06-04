import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getMyQuizzes, getCompletedQuizzes } from '../../services/quizService';
import '../../styles/styles.css';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [showAddFriendModal, setShowAddFriendModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [feedPosts, setFeedPosts] = useState([]);
  const [newPostText, setNewPostText] = useState('');
  const [userQuizCount, setUserQuizCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completedQuizzes, setCompletedQuizzes] = useState([]);
  const [userStats, setUserStats] = useState({ overallRating: 0 });
  const [friends, setFriends] = useState([]);
  const [publishedResults, setPublishedResults] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const [quizzes, completed] = await Promise.all([
          getMyQuizzes(),
          getCompletedQuizzes()
        ]);
        setUserQuizCount(quizzes.length);
        setCompletedQuizzes(completed);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Ошибка при загрузке данных пользователя');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const savedPosts = localStorage.getItem('feedPosts');
    if (savedPosts) {
      setFeedPosts(JSON.parse(savedPosts));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('feedPosts', JSON.stringify(feedPosts));
  }, [feedPosts]);

  const addToFeed = (quizResult) => {
    const newPost = {
      id: Date.now(),
      ...quizResult,
      date: new Date().toISOString(),
      likes: 0,
      comments: [],
      shares: 0
    };
    setFeedPosts([newPost, ...feedPosts]);
    setNewPostText('');
  };

  const handleSearchFriends = (e) => {
    e.preventDefault();
    const mockResults = [
      { id: 101, name: 'Алексей Петров', avatar: '', commonFriends: 3 },
      { id: 102, name: 'Мария Иванова', avatar: '', commonFriends: 5 },
      { id: 103, name: 'Дмитрий Смирнов', avatar: '', commonFriends: 2 }
    ];
    setSearchResults(mockResults.filter(user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    ));
  };

  const handleAddFriend = (userId) => {
    // Implement the logic to add a friend
    console.log(`Adding friend ${userId}`);
    setSearchResults(searchResults.filter(user => user.id !== userId));
  };

  const handleRemoveFriend = (friendId) => {
    // Implement the logic to remove a friend
    console.log(`Removing friend ${friendId}`);
  };

  const handleLikePost = (postId) => {
    setFeedPosts(feedPosts.map(post =>
      post.id === postId ? {...post, likes: post.likes + 1} : post
    ));
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}м ${remainingSeconds}с`;
  };

  const formatPosition = (position) => {
    if (!position) return '-';
    if (position === 1) return '1-е';
    if (position === 2) return '2-е';
    if (position === 3) return '3-е';
    return `${position}-е`;
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading-message">Загрузка профиля...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-container">
        <div className="error-message">
          {error}
          <button onClick={() => window.location.reload()} className="retry-button">
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <h1>Мой профиль</h1>

      <div className="profile-stats">
        <div className="stat-card">
          <h3>Общий рейтинг</h3>
          <div className="stat-value">★ {userStats.overallRating || 0}</div>
        </div>
        <div className="stat-card">
          <h3>Пройдено викторин</h3>
          <div className="stat-value">{completedQuizzes.length}</div>
        </div>
        <div className="stat-card">
          <h3>Создано викторин</h3>
          <div className="stat-value">{userQuizCount}</div>
          <Link to="/my-quizzes" className="view-all-link">Посмотреть все</Link>
        </div>
        <div className="stat-card">
          <h3>Средний результат</h3>
          <div className="stat-value">
            {completedQuizzes.length > 0
              ? Math.round(
                  completedQuizzes.reduce((acc, quiz) => 
                    acc + (quiz.score / quiz.totalQuestions) * 100, 0
                  ) / completedQuizzes.length
                )
              : 0}%
          </div>
        </div>
        <div className="stat-card">
          <h3>Друзей</h3>
          <div className="stat-value">{friends.length}</div>
        </div>
      </div>

      <div className="activity-feed">
        <h2>Моя лента</h2>

        <div className="new-post-card">
          <textarea
            placeholder="Поделитесь своими достижениями..."
            value={newPostText}
            onChange={(e) => setNewPostText(e.target.value)}
            className="post-input"
          />
          <button
            className="share-button"
            onClick={() => addToFeed({
              text: newPostText,
              score: 0,
              total: 0,
              type: 'manual'
            })}
          >
            Опубликовать
          </button>
        </div>

        {publishedResults.map((result) => (
          <div key={result.id} className="feed-post published-result">
            <div className="post-header">
              <img
                src="/default-avatar.png"
                alt="Аватар"
                className="user-avatar"
              />
              <div className="post-info">
                <h4>{userStats.username || 'Пользователь'}</h4>
                <time>
                  {new Date(result.date).toLocaleDateString('ru-RU', {
                    day: 'numeric',
                    month: 'long',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </time>
              </div>
            </div>
            <div className="post-content">
              <h3>Результат викторины: {result.title}</h3>
              <div className="quiz-stats">
                <span>Правильных ответов: {result.score}/{result.total}</span>
                <span>Процент: {Math.round((result.score/result.total)*100)}%</span>
                {result.time && <span>Время: {result.time} сек</span>}
              </div>
            </div>
          </div>
        ))}

        {feedPosts.map(post => (
          <div key={post.id} className="feed-post">
            <div className="post-header">
              <img
                src="/default-avatar.png"
                alt="Аватар"
                className="user-avatar"
              />
              <div className="post-info">
                <h4>{userStats.username || 'Пользователь'}</h4>
                <time>
                  {new Date(post.date).toLocaleDateString('ru-RU', {
                    day: 'numeric',
                    month: 'long',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </time>
              </div>
              <button
                className="delete-post"
                onClick={() => setFeedPosts(feedPosts.filter(p => p.id !== post.id))}
              >
                ×
              </button>
            </div>

            <div className="post-content">
              {post.quizId && (
                <Link to={`/quiz/${post.quizId}`} className="quiz-link">
                  <h3>{post.title}</h3>
                  <div className="quiz-stats">
                    <span>Результат: {post.score}/{post.total}</span>
                    <span>Процент: {Math.round((post.score/post.total)*100)}%</span>
                  </div>
                </Link>
              )}
              {post.text && <p className="post-text">{post.text}</p>}
            </div>

            <div className="post-actions">
              <button
                className="like-button"
                onClick={() => handleLikePost(post.id)}
              >
                ♡ {post.likes}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="completed-quizzes">
        <h2>Пройденные викторины</h2>
        {completedQuizzes.length === 0 ? (
          <div className="empty-state">
            <p>Вы еще не прошли ни одной викторины</p>
            <Link to="/quizzes" className="primary-button">
              Найти викторину
            </Link>
          </div>
        ) : (
          <div className="quizzes-grid">
            {completedQuizzes.map(quiz => (
              <div key={quiz.attemptId} className="quiz-card completed">
                <h3>{quiz.quizTitle}</h3>
                <div className="quiz-stats">
                  <span>Лучший результат: {quiz.score}/{quiz.totalQuestions}</span>
                  <span>Процент: {Math.round((quiz.score/quiz.totalQuestions)*100)}%</span>
                </div>
                <div className="quiz-meta">
                  <span>Время: {formatTime(quiz.timeSpent)}</span>
                  {quiz.position && (
                    <span className="position">Место: {formatPosition(quiz.position)}</span>
                  )}
                </div>
                <div className="quiz-actions">
                  <Link to={`/quiz/${quiz.quizId}`} className="retry-link">
                    Пройти снова
                  </Link>
                  <span className="attempt-date">
                    {new Date(quiz.endTime).toLocaleDateString('ru-RU', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAddFriendModal && (
        <div className="modal-overlay" onClick={() => setShowAddFriendModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Добавить друзей</h3>
              <button className="close-modal" onClick={() => setShowAddFriendModal(false)}>
                &times;
              </button>
            </div>
            <div className="modal-content">
              <form onSubmit={handleSearchFriends} className="search-friends-form">
                <input
                  type="text"
                  placeholder="Поиск по имени"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="search-button">
                  Найти
                </button>
              </form>

              <div className="search-results">
                {searchResults.length > 0 ? (
                  searchResults.map(user => (
                    <div key={user.id} className="search-result-item">
                      <div className="user-info">
                        <img
                          src={user.avatar || '/default-avatar.png'}
                          alt={user.name}
                          className="user-avatar"
                        />
                        <div>
                          <h4>{user.name}</h4>
                          <p>{user.commonFriends} общих друга</p>
                        </div>
                      </div>
                      <button
                        className="add-button"
                        onClick={() => handleAddFriend(user.id)}
                      >
                        Добавить
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="info-text">
                    {searchQuery
                      ? 'Никого не найдено'
                      : 'Введите имя пользователя для поиска'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
