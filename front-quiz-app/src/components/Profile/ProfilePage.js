import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getMyQuizzes, getCompletedQuizzes } from '../../services/quizService';
import { getUserRating } from '../../services/userService';
import { getFriendCount } from '../../services/friendService';
import '../../styles/styles.css';
import '../../styles/profile.css';

const ProfilePage = () => {
  const [showAddFriendModal, setShowAddFriendModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [feedPosts, setFeedPosts] = useState([]);
  const [newPostText, setNewPostText] = useState('');
  const [userQuizCount, setUserQuizCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completedQuizzes, setCompletedQuizzes] = useState([]);
  const [userRating, setUserRating] = useState(null);
  const [friendCount, setFriendCount] = useState(0);
  const [publishedResults] = useState([]);
  const [activeTab, setActiveTab] = useState('feed');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const [quizzes, completed, rating, friends] = await Promise.all([
          getMyQuizzes(),
          getCompletedQuizzes(),
          getUserRating(),
          getFriendCount()
        ]);
        
        setUserQuizCount(quizzes.length);
        setCompletedQuizzes(completed);
        setUserRating(rating);
        setFriendCount(friends);
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
    console.log(`Adding friend ${userId}`);
    setSearchResults(searchResults.filter(user => user.id !== userId));
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
          <div className="stat-value">
            {userRating ? `${userRating.averageScore.toFixed(2)}%` : '0%'}
          </div>
        </div>
        <div className="stat-card">
          <h3>Пройдено викторин</h3>
          <div className="stat-value">
            {userRating ? userRating.completedQuizzes : 0}
          </div>
        </div>
        <div className="stat-card">
          <h3>Создано викторин</h3>
          <div className="stat-value">{userQuizCount}</div>
          <Link to="/my-quizzes" className="view-all-link">Посмотреть все</Link>
        </div>
        <div className="stat-card">
          <h3>Друзей</h3>
          <div className="stat-value">{friendCount}</div>
          {friendCount > 0 && (
            <Link to="/friends" className="view-all-link">Посмотреть всех</Link>
          )}
        </div>
      </div>

      <div className="profile-tabs">
        <button 
          className={`tab-button ${activeTab === 'feed' ? 'active' : ''}`}
          onClick={() => setActiveTab('feed')}
        >
          Моя лента
        </button>
        <button 
          className={`tab-button ${activeTab === 'quizzes' ? 'active' : ''}`}
          onClick={() => setActiveTab('quizzes')}
        >
          Пройденные викторины
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'feed' ? (
          <div className="activity-feed">
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
                    <h4>{userRating.username || 'Пользователь'}</h4>
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
                    <h4>{userRating.username || 'Пользователь'}</h4>
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
        ) : (
          <div className="quiz-history">
            {completedQuizzes.length === 0 ? (
              <div className="empty-state">
                <p>Вы еще не прошли ни одной викторины</p>
                <Link to="/quizzes" className="primary-button">
                  Найти викторину
                </Link>
              </div>
            ) : (
              <div className="quizzes-grid">
                {(() => {
                  // Создаем объект для группировки попыток
                  const attemptsByQuiz = {};
                  
                  // Группируем все попытки по ID викторины
                  completedQuizzes.forEach(quiz => {
                    if (!attemptsByQuiz[quiz.quizId]) {
                      attemptsByQuiz[quiz.quizId] = [];
                    }
                    attemptsByQuiz[quiz.quizId].push(quiz);
                  });

                  // Выводим только последнюю попытку для каждой викторины
                  return Object.entries(attemptsByQuiz).map(([quizId, attempts]) => {
                    // Берем только последнюю попытку (первый элемент в массиве, так как они уже отсортированы)
                    const latestAttempt = attempts[0];
                    const isPersonalityQuiz = latestAttempt.personalityResult;
                    
                    // Для обычных викторин считаем процент
                    const percentage = !isPersonalityQuiz ? 
                      Math.round((latestAttempt.score / latestAttempt.totalQuestions) * 100) : null;
                    const isSuccess = !isPersonalityQuiz ? percentage >= 100 : true;
                    
                    // Получаем текстовый результат для викторины типа PERSONALITY
                    const personalityResultText = isPersonalityQuiz ? 
                      (typeof latestAttempt.personalityResult === 'object' ? 
                        latestAttempt.personalityResult.title || 'Результат не определен' : 
                        String(latestAttempt.personalityResult)) : '';

                    console.log('Personality Result:', latestAttempt.personalityResult);
                    
                    return (
                      <div key={quizId} className="quiz-attempts-group">
                        <h3>{latestAttempt.quizTitle}</h3>
                        <div className={`quiz-card ${!isPersonalityQuiz ? (isSuccess ? 'success' : 'failure') : 'personality'}`}>
                          <div className="attempt-header">
                            <div className="attempt-number">
                              Последняя попытка
                              {!isPersonalityQuiz && (
                                <span className={`attempt-status ${isSuccess ? 'success' : 'failure'}`}>
                                  {isSuccess ? ' ✓' : ' ✗'}
                                </span>
                              )}
                            </div>
                            <div className="attempt-date">
                              {latestAttempt.endTime ? new Date(latestAttempt.endTime).toLocaleDateString('ru-RU', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              }) : 'Дата не указана'}
                            </div>
                          </div>
                          <div className="quiz-stats">
                            {isPersonalityQuiz ? (
                              <div className="personality-result">
                                <span>Ваш результат:</span>
                                <span className="personality-type">{personalityResultText}</span>
                                {typeof latestAttempt.personalityResult === 'object' && latestAttempt.personalityResult.description && (
                                  <span className="personality-description">
                                    {latestAttempt.personalityResult.description}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <>
                                <span className={isSuccess ? 'success' : 'failure'}>
                                  Результат: {latestAttempt.score}/{latestAttempt.totalQuestions}
                                </span>
                                <span className={isSuccess ? 'success' : 'failure'}>
                                  Процент: {percentage}%
                                </span>
                              </>
                            )}
                          </div>
                          <div className="quiz-meta">
                            <span>Время: {formatTime(latestAttempt.timeSpent)}</span>
                          </div>
                          <div className="quiz-actions">
                            <Link to={`/quiz/${latestAttempt.quizId}`} className="retry-link">
                              Пройти снова
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            )}
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
