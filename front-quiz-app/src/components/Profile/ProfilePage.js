import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import '/Users/darinautalieva/Desktop/JavaProject/front-quiz-app/src/styles.css';

const ProfilePage = ({
    userQuizzes = [],
    completedQuizzes = [],
    userStats = {},
    friends = [],
    friendActivity = [],
    chats = [],
    onAddFriend = (userId) => {
      console.log(`Добавление пользователя с ID ${userId} в друзья`);
    },
    onRemoveFriend = (friendId) => {
      console.log(`Удаление пользователя с ID ${friendId} из друзей`);
    }
  }) => {
    const navigate = useNavigate();
    const [showAddFriendModal, setShowAddFriendModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [activeTab, setActiveTab] = useState('friends');

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
      onAddFriend(userId);
      setSearchResults(searchResults.filter(user => user.id !== userId));
    };

    const handleRemoveFriend = (friendId) => {
      onRemoveFriend(friendId);
    };

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
          <div className="stat-value">{userQuizzes.length}</div>
        </div>
        <div className="stat-card">
          <h3>Друзей</h3>
          <div className="stat-value">{friends.length}</div>
        </div>
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

      <div className="profile-tabs">
        <button
          className={`tab-button ${activeTab === 'friends' ? 'active' : ''}`}
          onClick={() => setActiveTab('friends')}
        >
          Друзья
        </button>
        <button
          className={`tab-button ${activeTab === 'chats' ? 'active' : ''}`}
          onClick={() => setActiveTab('chats')}
        >
          Чаты
        </button>
      </div>

      {activeTab === 'friends' && (
        <div className="friends-section">
          <div className="section-header">
            <h2>Мои друзья</h2>
            <button
              className="add-friend-button"
              onClick={() => setShowAddFriendModal(true)}
            >
              + Добавить друга
            </button>
          </div>

          {friends.length === 0 ? (
            <div className="empty-state">
              <p>У вас пока нет друзей</p>
              <button
                className="primary-button"
                onClick={() => setShowAddFriendModal(true)}
              >
                Найти друзей
              </button>
            </div>
          ) : (
            <div className="friends-grid">
              {friends.map(friend => (
                <div key={friend.id} className="friend-card">
                  <div className="friend-main">
                    <div className="friend-avatar-container">
                      <img
                        src={friend.avatar || '/default-avatar.png'}
                        alt={friend.name}
                        className="friend-avatar"
                      />
                      {friend.isOnline && <span className="online-badge"></span>}
                    </div>
                    <div className="friend-details">
                      <h4 className="friend-name">{friend.name}</h4>
                      <p className="friend-status">
                        {friend.isOnline ? 'Онлайн' : `Был(а) ${friend.lastSeen}`}
                      </p>
                    </div>
                  </div>
                  <div className="friend-actions">
                    <button
                      onClick={() => navigate(`/chat/${friend.id}`)}
                      className="message-button"
                    >
                      Чат
                    </button>
                    <button
                      onClick={() => handleRemoveFriend(friend.id)}
                      className="remove-button"
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'chats' && (
        <div className="chats-section">
          <div className="section-header">
            <h2>Мои чаты</h2>
            <button
              className="new-chat-button"
              onClick={() => navigate('/new-chat')}
            >
              + Новый чат
            </button>
          </div>

          {chats.length === 0 ? (
            <div className="empty-state">
              <p>У вас нет активных чатов</p>
              <button
                className="primary-button"
                onClick={() => navigate('/friends')}
              >
                Начать общение
              </button>
            </div>
          ) : (
            <div className="chats-list">
              {chats.map(chat => (
                <div
                  key={chat.id}
                  className="chat-item"
                  onClick={() => navigate(`/chat/${chat.id}`)}
                >
                  <div className="chat-avatar-container">
                    <img
                      src={chat.participant.avatar || '/default-avatar.png'}
                      alt={chat.participant.name}
                      className="chat-avatar"
                    />
                    {chat.participant.isOnline && <span className="online-badge"></span>}
                  </div>
                  <div className="chat-info">
                    <div className="chat-header">
                      <h4>{chat.participant.name}</h4>
                      <span className="chat-time">
                        {new Date(chat.lastMessageTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                    <p className="last-message">
                      {chat.lastMessage || "Нет сообщений"}
                    </p>
                  </div>
                  {chat.unreadCount > 0 && (
                    <span className="unread-count">{chat.unreadCount}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

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
            {completedQuizzes.slice(0, 4).map(quiz => (
              <div key={quiz.id} className="quiz-card completed">
                <h3>{quiz.title}</h3>
                <div className="quiz-stats">
                  <span>★ Ваш результат: {quiz.userRating}/5</span>
                  <span>🏆 Место в рейтинге: {quiz.position}</span>
                </div>
                <div className="quiz-meta">
                  <span>🕒 Лучшее время: {quiz.bestTime} сек</span>
                  <span>📅 {new Date(quiz.date).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="my-quizzes">
        <div className="section-header">
          <h2>Мои викторины</h2>
          <Link to="/create-quiz" className="create-quiz-button">
            Создать новую
          </Link>
        </div>
        {userQuizzes.length === 0 ? (
          <div className="empty-state">
            <p>Вы еще не создали ни одной викторины</p>
            <Link to="/create-quiz" className="primary-button">
              Создать первую
            </Link>
          </div>
        ) : (
          <div className="quizzes-grid">
            {userQuizzes.slice(0, 4).map(quiz => (
              <div key={quiz.id} className="quiz-card">
                <h3>{quiz.title}</h3>
                <p className="quiz-description">{quiz.description}</p>
                <div className="quiz-meta">
                    <span className={`difficulty-badge ${quiz.difficulty}`}>
                        {quiz.difficulty}
                    </span>
                </div>
                <div className="quiz-stats">
                <div>★ Средний рейтинг: {quiz.rating?.toFixed(1) || 0}</div>
                <div>Вопросов: {quiz.questions.length}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
