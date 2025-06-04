import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/styles.css';

const FriendFeedPage = ({
  friends = [],
  friendActivity = [],
  onAddFriend,
  onRemoveFriend
}) => {
  const [showAddFriendModal, setShowAddFriendModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

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

  return (
    <div className="friend-feed-container">
      <div className="friends-section">
        <div className="section-header">
          <h2>Лента друзей</h2>
          <button
            className="add-friend-button"
            onClick={() => setShowAddFriendModal(true)}
          >
            + Добавить друга
          </button>
        </div>

        <div className="friend-activity-feed">
          {friendActivity.map(activity => (
            <div key={activity.id} className="activity-item">
              <div className="friend-info">
                <img
                  src={activity.friend.avatar || '/default-avatar.png'}
                  alt={activity.friend.name}
                  className="friend-avatar"
                />
                <div className="friend-details">
                  <h4>{activity.friend.name}</h4>
                  <time>
                    {new Date(activity.date).toLocaleDateString('ru-RU', {
                      day: 'numeric',
                      month: 'long',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </time>
                </div>
              </div>

              <div className="activity-content">
                <h3>Пройдена викторина: {activity.quizTitle}</h3>
                <div className="quiz-stats">
                  <span>Результат: {activity.score}/{activity.total}</span>
                  <span>Процент: {Math.round((activity.score/activity.total)*100)}%</span>
                  {activity.time && <span>Время: {activity.time} сек</span>}
                </div>
                <Link to={`/quiz/${activity.quizId}`} className="quiz-link">
                  Посмотреть викторину
                </Link>
              </div>
            </div>
          ))}
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
    </div>
  );
};

export default FriendFeedPage;
