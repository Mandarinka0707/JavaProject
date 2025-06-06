import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatWindow from './Chat/ChatWindow';
import { getFriends, getPendingRequests, sendFriendRequest, acceptFriendRequest, rejectFriendRequest, removeFriend, searchFriends } from '../services/friendService';
import { API_BASE_URL } from '../config';
import '../styles/friends.css';

const FriendsPage = () => {
  const navigate = useNavigate();
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddFriendModal, setShowAddFriendModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const loadFriendsData = async () => {
      try {
        setLoading(true);
        const data = await getFriends();
        setFriends(data);
        setError(null);
      } catch (err) {
        if (err.message === 'Не авторизован' || err.message.includes('Сессия истекла')) {
          navigate('/login', { 
            state: { 
              from: '/friends',
              message: err.message 
            } 
          });
        } else {
          setError('Ошибка при загрузке списка друзей');
          console.error('Error loading friends:', err);
        }
      } finally {
        setLoading(false);
      }
    };

    const loadPendingRequestsData = async () => {
      try {
        const data = await getPendingRequests();
        setPendingRequests(data);
      } catch (err) {
        if (err.message === 'Не авторизован' || err.message.includes('Сессия истекла')) {
          navigate('/login', { 
            state: { 
              from: '/friends',
              message: err.message 
            } 
          });
        } else {
          console.error('Error loading pending requests:', err);
        }
      }
    };

    loadFriendsData();
    loadPendingRequestsData();
  }, [navigate]);

  const handleSearchFriends = async (e) => {
    e.preventDefault();
    try {
      const results = await searchFriends(searchQuery);
      setSearchResults(results);
    } catch (err) {
      setError('Ошибка при поиске пользователей');
      console.error('Error searching users:', err);
    }
  };

  const handleAddFriend = async (userId) => {
    try {
      await sendFriendRequest(userId);
      setSearchResults(searchResults.map(user => 
        user.id === userId ? { ...user, requestSent: true } : user
      ));
    } catch (err) {
      const errorMessage = err.message === 'Friend request already exists' 
        ? 'Запрос в друзья уже отправлен'
        : err.message === 'Already friends'
        ? 'Вы уже являетесь друзьями'
        : 'Ошибка при отправке запроса дружбы';
      
      setError(errorMessage);
      console.error('Error sending friend request:', err);
    }
  };

  const handleAcceptRequest = async (friendId) => {
    try {
      await acceptFriendRequest(friendId);
      setLoading(true);
      const [friendsData, pendingData] = await Promise.all([
        getFriends(),
        getPendingRequests()
      ]);
      setFriends(friendsData);
      setPendingRequests(pendingData);
      setLoading(false);
    } catch (err) {
      setError('Ошибка при принятии запроса дружбы');
      console.error('Error accepting friend request:', err);
    }
  };

  const handleRejectRequest = async (friendId) => {
    try {
      await rejectFriendRequest(friendId);
      const pendingData = await getPendingRequests();
      setPendingRequests(pendingData);
    } catch (err) {
      setError('Ошибка при отклонении запроса дружбы');
      console.error('Error rejecting friend request:', err);
    }
  };

  const handleRemoveFriend = async (friendId) => {
    try {
      await removeFriend(friendId);
      const friendsData = await getFriends();
      setFriends(friendsData);
    } catch (err) {
      setError('Ошибка при удалении друга');
      console.error('Error removing friend:', err);
    }
  };

  const handleStartChat = (friend) => {
    setActiveChat({
      id: friend.id,
      name: friend.username
    });
    setIsExpanded(true);
  };

  const handleCloseChat = () => {
    setActiveChat(null);
    setIsExpanded(false);
  };

  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className={`friends-page-container ${isExpanded ? 'chat-expanded' : ''}`}>
      <div className="friends-section-container">
        <div className="friends-header">
          <h1>Мои друзья</h1>
          <button
            className="add-friend-button"
            onClick={() => setShowAddFriendModal(true)}
          >
            + Добавить друга
          </button>
        </div>

        {pendingRequests.length > 0 && (
          <div className="pending-requests-section">
            <h2>Входящие заявки в друзья</h2>
            <div className="pending-requests-grid">
              {pendingRequests.map(request => (
                <div key={request.id} className="friend-request-card">
                  <div className="friend-main">
                    <div className="friend-avatar-container">
                      <img
                        src={request.avatar || '/default-avatar.png'}
                        alt={request.username}
                        className="friend-avatar"
                      />
                    </div>
                    <div className="friend-details">
                      <h4 className="friend-name">{request.username}</h4>
                    </div>
                  </div>
                  <div className="friend-request-actions">
                    <button
                      onClick={() => handleAcceptRequest(request.id)}
                      className="accept-button"
                    >
                      Принять
                    </button>
                    <button
                      onClick={() => handleRejectRequest(request.id)}
                      className="reject-button"
                    >
                      Отклонить
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {friends.length === 0 ? (
          <div className="no-friends">
            <p>У вас пока нет друзей</p>
            <button 
              onClick={() => setShowAddFriendModal(true)} 
              className="add-friend-button"
            >
              Найти друзей
            </button>
          </div>
        ) : (
          <div className="friends-section">
            <h2>Друзья</h2>
            <div className="friends-list">
              {friends.map(friend => (
                <div key={friend.id} className={`friend-card ${activeChat?.id === friend.id ? 'active' : ''}`}>
                  <div className="friend-main">
                    <div className="friend-avatar-container">
                      <img
                        src={friend.avatar || '/default-avatar.png'}
                        alt={friend.username}
                        className="friend-avatar"
                      />
                    </div>
                    <div className="friend-details">
                      <h4 className="friend-name">{friend.username}</h4>
                    </div>
                  </div>
                  <div className="friend-actions">
                    <button
                      onClick={() => handleStartChat(friend)}
                      className="chat-button"
                    >
                      Написать
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
          </div>
        )}
      </div>

      {activeChat && (
        <div className="chat-section">
          <ChatWindow
            friendId={activeChat.id}
            friendName={activeChat.name}
            onClose={handleCloseChat}
            isExpanded={isExpanded}
          />
        </div>
      )}

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

export default FriendsPage;
