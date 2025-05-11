// components/Chat.js
import { useState, useEffect, useRef } from 'react';
import '/Users/darinautalieva/Desktop/JavaProject/front-quiz-app/src/styles.css';
const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef(null);

  // Заглушка для имитации подключения
  useEffect(() => {
    const timer = setTimeout(() => setIsConnected(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      setMessages([...messages, {
        text: newMessage,
        user: 'Вы',
        time: new Date().toLocaleTimeString()
      }]);
      setNewMessage('');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  return (
    <div className="chat-wrapper">
      <div className="chat-container">
        <div className="chat-header">
          <h3>Чат викторины</h3>
          <div className={`connection-status ${isConnected ? 'connected' : 'connecting'}`}>
            {isConnected ? 'Online' : 'Connecting...'}
          </div>
        </div>

        <div className="messages-window">
          {messages.length === 0 ? (
            <div className="no-messages">Начните общение первым!</div>
          ) : (
            messages.map((msg, index) => (
              <div key={index} className="message own-message">
                <div className="message-header">
                  <span className="message-username">{msg.user}</span>
                  <span className="message-time">{msg.time}</span>
                </div>
                <div className="message-content">{msg.text}</div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <form className="message-input-area" onSubmit={handleSendMessage}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Введите сообщение..."
            disabled={!isConnected}
          />
          <button type="submit" disabled={!isConnected || !newMessage.trim()}>
            Отправить
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;