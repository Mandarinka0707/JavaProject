import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ChatWindow.css';

const API_BASE_URL = 'http://localhost:8080';
const POLLING_INTERVAL = 3000;

const ChatWindow = ({ friendId, friendName, onClose, isExpanded }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [error, setError] = useState(null);
    const [isFriend, setIsFriend] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [hasAuthError, setHasAuthError] = useState(false);
    const intervalRef = useRef(null);
    const abortControllerRef = useRef(null);
    const lastMessageTimestamp = useRef(null);
    const navigate = useNavigate();
    const messagesEndRef = useRef(null);
    const isComponentMounted = useRef(true);

    const clearPollingInterval = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
    }, []);

    const handleLogout = useCallback(() => {
        clearPollingInterval();
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        if (isComponentMounted.current) {
            setMessages([]);
            setHasAuthError(true);
            setError('Сессия завершена. Перенаправление на страницу входа...');
            setTimeout(() => {
                if (isComponentMounted.current) {
                    navigate('/login');
                }
            }, 1500);
        }
    }, [clearPollingInterval, navigate]);

    const loadMessages = useCallback(async (isInitialLoad = false) => {
        if (!isComponentMounted.current || !friendId || hasAuthError) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                handleLogout();
                return;
            }

            // Создаем новый AbortController только если это не первичная загрузка
            if (!isInitialLoad && abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            abortControllerRef.current = new AbortController();

            const response = await axios.get(`${API_BASE_URL}/api/messages/chat/${friendId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                signal: !isInitialLoad ? abortControllerRef.current.signal : undefined
            });

            if (response.status === 200 && Array.isArray(response.data)) {
                const sortedMessages = response.data.sort((a, b) => 
                    new Date(a.sentAt) - new Date(b.sentAt)
                );

                const lastMessage = sortedMessages[sortedMessages.length - 1];
                const hasNewMessages = !lastMessageTimestamp.current || 
                    (lastMessage && new Date(lastMessage.sentAt) > new Date(lastMessageTimestamp.current));

                if (isComponentMounted.current && (isInitialLoad || hasNewMessages)) {
                    setMessages(sortedMessages);
                    if (lastMessage) {
                        lastMessageTimestamp.current = lastMessage.sentAt;
                    }
                    setError(null);
                }
            }
        } catch (error) {
            // Игнорируем ошибки отмены запроса
            if (axios.isCancel(error)) {
                return;
            }
            
            if (isComponentMounted.current) {
                console.error('Ошибка при загрузке сообщений:', error);
                if (error.response?.status === 401 || error.response?.status === 403) {
                    handleLogout();
                } else {
                    setError('Ошибка при загрузке сообщений');
                }
            }
        }
    }, [friendId, hasAuthError, handleLogout]);

    const checkFriendshipStatus = useCallback(async () => {
        if (!isComponentMounted.current || hasAuthError) return false;

        try {
            const token = localStorage.getItem('token');
            const currentUserId = localStorage.getItem('userId');
            
            if (!token || !currentUserId) {
                handleLogout();
                return false;
            }

            const response = await axios.get(`${API_BASE_URL}/api/friends/status/${friendId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (isComponentMounted.current) {
                const isAcceptedFriend = response.data.status === 'ACCEPTED';
                setIsFriend(isAcceptedFriend);
                
                if (!isAcceptedFriend) {
                    setError('Вы не можете отправлять сообщения этому пользователю, так как вы не являетесь друзьями');
                    clearPollingInterval();
                } else {
                    setError(null);
                    // Первичная загрузка сообщений
                    await loadMessages(true);
                    
                    // Устанавливаем интервал только если компонент все еще смонтирован
                    if (isComponentMounted.current && !intervalRef.current) {
                        const loadMessagesPolling = () => {
                            if (isComponentMounted.current) {
                                loadMessages(false);
                            }
                        };
                        intervalRef.current = setInterval(loadMessagesPolling, POLLING_INTERVAL);
                    }
                }
                
                return isAcceptedFriend;
            }
            return false;
        } catch (error) {
            if (isComponentMounted.current) {
                console.error('Ошибка при проверке статуса дружбы:', error);
                if (error.response?.status === 401 || error.response?.status === 403) {
                    handleLogout();
                } else {
                    setError('Ошибка при проверке статуса дружбы');
                }
            }
            return false;
        } finally {
            if (isComponentMounted.current) {
                setIsLoading(false);
            }
        }
    }, [friendId, hasAuthError, handleLogout, clearPollingInterval, loadMessages]);

    useEffect(() => {
        isComponentMounted.current = true;
        lastMessageTimestamp.current = null;
        
        const initializeChat = async () => {
            if (!friendId || !friendName) return;
            
            if (isComponentMounted.current) {
                setIsLoading(true);
                clearPollingInterval();
                setMessages([]);
                setError(null);
                
                try {
                    await checkFriendshipStatus();
                } catch (error) {
                    if (isComponentMounted.current) {
                        console.error('Ошибка при инициализации чата:', error);
                        setError('Ошибка при инициализации чата');
                        setIsLoading(false);
                    }
                }
            }
        };

        initializeChat();

        return () => {
            isComponentMounted.current = false;
            clearPollingInterval();
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [friendId, friendName, clearPollingInterval, checkFriendshipStatus]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !friendId || !isFriend) return;

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                handleLogout();
                return;
            }

            const response = await axios.post(`${API_BASE_URL}/api/messages/send/${friendId}`, 
                { content: newMessage },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.status === 200 && response.data) {
                setMessages(prev => [...prev, response.data]);
                setNewMessage('');
                setError(null);
            }
        } catch (error) {
            console.error('Ошибка при отправке сообщения:', error);
            if (error.response?.status === 401 || error.response?.status === 403) {
                handleLogout();
            } else {
                setError('Ошибка при отправке сообщения');
            }
        }
    };

    if (hasAuthError) {
        return (
            <div className="chat-window">
                <div className="error-message">{error}</div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="chat-window">
                <div className="loading-message">Загрузка...</div>
            </div>
        );
    }

    return (
        <div className={`chat-window ${isExpanded ? 'expanded' : ''}`}>
            <div className="chat-header">
                <div className="chat-header-info">
                    <h3>{friendName}</h3>
                    {isFriend && <span className="status-badge">В друзьях</span>}
                </div>
                <div className="chat-header-actions">
                    <button 
                        className="close-chat-button" 
                        onClick={() => {
                            clearPollingInterval();
                            onClose();
                        }}
                    >
                        Закрыть
                    </button>
                </div>
            </div>

            <div className="messages-container">
                {error && (
                    <div className="error-message">{error}</div>
                )}
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`message ${message.senderId === parseInt(localStorage.getItem('userId')) ? 'sent' : 'received'}`}
                    >
                        <div className="message-content">
                            <p>{message.content}</p>
                            <span className="message-time">
                                {new Date(message.sentAt).toLocaleTimeString([], { 
                                    hour: '2-digit', 
                                    minute: '2-digit' 
                                })}
                            </span>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="message-input-form">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Введите сообщение..."
                    className="message-input"
                    disabled={!isFriend}
                />
                <button 
                    type="submit" 
                    className="send-button" 
                    disabled={!newMessage.trim() || !isFriend}
                >
                    Отправить
                </button>
            </form>
        </div>
    );
};

export default ChatWindow; 