import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/profile.css';
import '../../styles/styles.css'

const ProfileFeed = () => {
    const [feedItems, setFeedItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFeedItems();
    }, []);

    const fetchFeedItems = async () => {
        try {
            const response = await axios.get('/api/profile/feed');
            setFeedItems(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching feed items:', error);
            setLoading(false);
        }
    };

    const renderQuizResult = (result) => {
        if (result.quizType === 'PERSONALITY') {
            return (
                <div className="feed-item personality-result">
                    <div className="feed-item-header">
                        <h3>{result.quizTitle}</h3>
                        <span className="feed-item-date">{new Date(result.completedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="personality-content">
                        <h4>Результат: {result.character}</h4>
                        {result.image && (
                            <div className="character-image-container">
                                <img src={result.image} alt={result.character} className="character-image" />
                            </div>
                        )}
                        <p>{result.description}</p>
                        <div className="traits-summary">
                            {Object.entries(result.traits).map(([trait, value]) => (
                                <div key={trait} className="trait-mini">
                                    <span>{trait}: {value}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="feed-item quiz-result">
                <div className="feed-item-header">
                    <h3>{result.quizTitle}</h3>
                    <span className="feed-item-date">{new Date(result.completedAt).toLocaleDateString()}</span>
                </div>
                <div className="quiz-result-content">
                    <div className="result-stats">
                        <div className="stat-item">
                            <span className="stat-label">Результат:</span>
                            <span className="stat-value">
                                {Math.round((result.score / result.totalQuestions) * 100)}%
                            </span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Правильных ответов:</span>
                            <span className="stat-value">{result.score} из {result.totalQuestions}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Время:</span>
                            <span className="stat-value">
                                {Math.floor(result.timeSpent / 60)} мин {result.timeSpent % 60} сек
                            </span>
                        </div>
                        {result.position && (
                            <div className="stat-item">
                                <span className="stat-label">Место в рейтинге:</span>
                                <span className="stat-value">{result.position}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return <div className="loading">Загрузка...</div>;
    }

    return (
        <div className="profile-feed">
            <h2>Моя лента</h2>
            <div className="feed-items">
                {feedItems.length === 0 ? (
                    <div className="no-results">
                        Пока нет опубликованных результатов
                    </div>
                ) : (
                    feedItems.map((item) => (
                        <div key={item.id} className="feed-item-wrapper">
                            {renderQuizResult(item)}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ProfileFeed; 