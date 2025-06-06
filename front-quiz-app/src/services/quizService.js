import { API_URL, API_ENDPOINTS } from '../config';
import { getAuthHeaders } from './authService';

export const createQuiz = async (quizData) => {
    try {
        const endpoint = quizData.quizType === 'PERSONALITY' ? 
            `${API_URL}${API_ENDPOINTS.QUIZ.CREATE_PERSONALITY}` : 
            `${API_URL}${API_ENDPOINTS.QUIZ.CREATE}`;

        console.log('Sending quiz data:', JSON.stringify(quizData, null, 2));

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(quizData)
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Сессия истекла');
            }

            const responseText = await response.text();
            console.error('Server error response:', {
                status: response.status,
                statusText: response.statusText,
                body: responseText
            });

            let errorMessage = 'Ошибка при создании викторины';
            try {
                const errorData = JSON.parse(responseText);
                if (errorData?.message) {
                    errorMessage = errorData.message;
                }
            } catch (e) {
                console.error('Error parsing error response:', e);
                if (response.status === 403) {
                    errorMessage = 'У вас нет прав для создания викторины';
                }
            }
            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating quiz:', error);
        throw error;
    }
};

export const getQuizzes = async () => {
    try {
        const response = await fetch(`${API_URL}${API_ENDPOINTS.QUIZ.LIST}`, {
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            if (!errorText) {
                throw new Error('Ошибка при получении викторин');
            }
            
            try {
                const errorData = JSON.parse(errorText);
                throw new Error(errorData?.message || 'Ошибка при получении викторин');
            } catch (parseError) {
                throw new Error('Ошибка при получении викторин');
            }
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching quizzes:', error);
        throw error;
    }
};

export const getMyQuizzes = async () => {
    try {
        const response = await fetch(`${API_URL}${API_ENDPOINTS.QUIZ.MY}`, {
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Сессия истекла');
            }
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.message || 'Ошибка при получении ваших викторин');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching user quizzes:', error);
        throw error;
    }
};

export const startQuizAttempt = async (quizId) => {
    try {
        const response = await fetch(`${API_URL}${API_ENDPOINTS.QUIZ.ATTEMPT.START}/${quizId}`, {
            method: 'POST',
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            const errorText = await response.text();
            if (!errorText) {
                throw new Error('Не удалось начать викторину');
            }
            
            try {
                const errorData = JSON.parse(errorText);
                throw new Error(errorData?.message || 'Не удалось начать викторину');
            } catch (parseError) {
                throw new Error('Не удалось начать викторину');
            }
        }

        return await response.json();
    } catch (error) {
        console.error('Error starting quiz:', error);
        throw error;
    }
};

export const getActiveAttempt = async (quizId) => {
    try {
        const response = await fetch(`${API_URL}${API_ENDPOINTS.QUIZ.ATTEMPT.ACTIVE}/${quizId}`, {
            headers: getAuthHeaders()
        });

        if (response.status === 404) {
            return null;
        }

        if (!response.ok) {
            const errorText = await response.text();
            if (!errorText) {
                throw new Error('Ошибка при получении активной попытки');
            }
            
            try {
                const errorData = JSON.parse(errorText);
                throw new Error(errorData?.message || 'Ошибка при получении активной попытки');
            } catch (parseError) {
                throw new Error('Ошибка при получении активной попытки');
            }
        }

        const data = await response.json();
        if (!data || !data.attemptId) {
            return null;
        }

        return {
            id: data.attemptId,
            startTime: data.startTime,
            timeSpent: data.timeSpent || 0,
            answers: data.answers || {},
            currentQuestion: data.currentQuestion || 0,
            score: data.score || 0,
            isCompleted: data.isCompleted || false
        };
    } catch (error) {
        console.error('Error checking active attempt:', error);
        throw error;
    }
};

export const submitQuizAttempt = async ({ quizId, attemptId, answers, timeSpent }) => {
    try {
        if (!timeSpent || isNaN(timeSpent) || timeSpent < 0) {
            timeSpent = 1;
        }

        const response = await fetch(`${API_URL}${API_ENDPOINTS.QUIZ.ATTEMPT.SUBMIT}`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({
                quizId,
                attemptId,
                answers,
                timeSpent: Math.floor(timeSpent)
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            if (!errorText) {
                throw new Error('Ошибка при отправке ответов');
            }
            
            try {
                const errorData = JSON.parse(errorText);
                throw new Error(errorData?.message || 'Ошибка при отправке ответов');
            } catch (parseError) {
                throw new Error('Ошибка при отправке ответов');
            }
        }

        const result = await response.json();
        return result.result || result;
    } catch (error) {
        console.error('Error submitting quiz attempt:', error);
        throw error;
    }
};

export const getQuizAttempts = async () => {
    try {
        const response = await fetch(`${API_URL}${API_ENDPOINTS.QUIZ.ATTEMPT.MY}`, {
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Сессия истекла');
            }
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.message || 'Ошибка при получении истории попыток');
        }

        return await response.json();
    } catch (error) {
        console.error('Ошибка при получении истории попыток:', error);
        throw error;
    }
};

export const getCompletedQuizzes = async () => {
    try {
        const response = await fetch(`${API_URL}${API_ENDPOINTS.QUIZ.ATTEMPT.MY}`, {
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Сессия истекла');
            }
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.message || 'Ошибка при получении пройденных викторин');
        }

        const attempts = await response.json();
        return attempts
            .filter(attempt => attempt.isCompleted)
            .sort((a, b) => new Date(b.endTime) - new Date(a.endTime));
    } catch (error) {
        console.error('Ошибка при получении пройденных викторин:', error);
        throw error;
    }
}; 