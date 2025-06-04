// import { useState } from 'react';
// import { Link } from 'react-router-dom';
// import '/Users/darinautalieva/Desktop/Projects/JavaProject/front-quiz-app/src/css/styles.css';

// const FriendsPage = ({ friends, onRemoveFriend }) => {
//   return (
//     <div className="friends-page-container">
//       <h1>Мои друзья</h1>
//       <div className="friends-grid">
//         {friends.map(friend => (
//           <div key={friend.id} className="friend-card">
//             <div className="friend-main">
//               <div className="friend-avatar-container">
//                 <img
//                   src={friend.avatar || '/default-avatar.png'}
//                   alt={friend.name}
//                   className="friend-avatar"
//                 />
//                 {friend.isOnline && <span className="online-badge"></span>}
//               </div>
//               <div className="friend-details">
//                 <h4 className="friend-name">{friend.name}</h4>
//                 <p className="friend-status">
//                   {friend.isOnline ? 'Онлайн' : `Был(а) ${friend.lastSeen}`}
//                 </p>
//               </div>
//             </div>
//             <div className="friend-actions">
//               <button
//                 onClick={() => onRemoveFriend(friend.id)}
//                 className="remove-button"
//               >
//                 Удалить
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default FriendsPage;

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/styles.css';

const FriendsPage = ({ friends, onRemoveFriend }) => {
  const navigate = useNavigate();

  const handleChatClick = (friendId) => {
    navigate(`/chat/${friendId}`);
  };

  return (
    <div className="friends-page-container">
      <h1>Мои друзья</h1>
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
                onClick={() => handleChatClick(friend.id)}
                className="message-button"
              >
                Чат
              </button>
              <button
                onClick={() => onRemoveFriend(friend.id)}
                className="remove-button"
              >
                Удалить
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FriendsPage;
