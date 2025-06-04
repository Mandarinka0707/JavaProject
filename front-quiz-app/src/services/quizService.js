const API_URL = 'http://localhost:8080/api';

export const createQuiz = async (quizData) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('Не авторизован');
    }

    try {
        const endpoint = quizData.quizType === 'PERSONALITY' ? 
            `${API_URL}/quizzes/personality` : 
            `${API_URL}/quizzes`;

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(quizData)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            console.error('Server error:', errorData);
            throw new Error(errorData?.message || 'Ошибка при создании викторины');
        }

        return await response.json();
    } catch (error) {
        console.error('Ошибка:', error);
        throw error;
    }
};

export const getQuizzes = async () => {
    try {
        const headers = {
            'Accept': 'application/json'
        };

        // Добавляем токен в заголовки, если он есть
        const token = localStorage.getItem('token');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_URL}/quizzes`, {
            headers: headers
        });

        console.log('Quiz request response:', {
            status: response.status,
            statusText: response.statusText,
            headers: Object.fromEntries(response.headers.entries())
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response text:', errorText);
            
            try {
                const errorData = JSON.parse(errorText);
                throw new Error(errorData?.message || 'Ошибка при получении викторин');
            } catch (parseError) {
                console.error('Error parsing error response:', parseError);
                throw new Error(`Ошибка при получении викторин: ${errorText}`);
            }
        }

        const data = await response.json();
        console.log('Quiz data received:', data);
        return data;
    } catch (error) {
        console.error('Detailed error:', {
            name: error.name,
            message: error.message,
            stack: error.stack
        });
        throw error;
    }
};

export const getMyQuizzes = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('Не авторизован');
    }

    try {
        const response = await fetch(`${API_URL}/quizzes/my`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            console.error('Server error:', errorData);
            throw new Error(errorData?.message || 'Ошибка при получении ваших викторин');
        }

        const data = await response.json();
        console.log('Ответ от сервера (мои викторины):', {
            status: response.status,
            headers: Object.fromEntries(response.headers.entries()),
            data: data
        });
        return data;
    } catch (error) {
        console.error('Ошибка:', error);
        throw error;
    }
};

// Начать попытку прохождения викторины
export const startQuizAttempt = async (quizId) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('Не авторизован');
    }

    try {
        const response = await fetch(`${API_URL}/quiz-attempts/start/${quizId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.message || 'Ошибка при начале викторины');
        }

        return await response.json();
    } catch (error) {
        console.error('Ошибка при начале викторины:', error);
        throw error;
    }
};

// Отправить ответы на викторину
export const submitQuizAttempt = async (attemptData) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('Не авторизован');
    }

    try {
        const response = await fetch(`${API_URL}/quiz-attempts/submit`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(attemptData)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.message || 'Ошибка при отправке ответов');
        }

        return await response.json();
    } catch (error) {
        console.error('Ошибка при отправке ответов:', error);
        throw error;
    }
};

// Получить историю попыток прохождения викторин
export const getQuizAttempts = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('Не авторизован');
    }

    try {
        const response = await fetch(`${API_URL}/quiz-attempts/my`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.message || 'Ошибка при получении истории попыток');
        }

        return await response.json();
    } catch (error) {
        console.error('Ошибка при получении истории попыток:', error);
        throw error;
    }
};

// Получить пройденные викторины (только лучшие попытки)
export const getCompletedQuizzes = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('Не авторизован');
    }

    try {
        const response = await fetch(`${API_URL}/quiz-attempts/my`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.message || 'Ошибка при получении пройденных викторин');
        }

        const attempts = await response.json();
        
        // Фильтруем только завершенные попытки
        const completedAttempts = attempts.filter(attempt => attempt.isCompleted);
        
        // Группируем попытки по quizId и находим лучшую для каждой викторины
        const bestAttempts = completedAttempts.reduce((acc, attempt) => {
            const existingAttempt = acc[attempt.quizId];
            
            // Если это первая попытка для этой викторины или результат лучше предыдущего
            if (!existingAttempt || 
                (attempt.score / attempt.totalQuestions) > (existingAttempt.score / existingAttempt.totalQuestions) ||
                ((attempt.score / attempt.totalQuestions) === (existingAttempt.score / existingAttempt.totalQuestions) && 
                 attempt.timeSpent < existingAttempt.timeSpent)) {
                acc[attempt.quizId] = attempt;
            }
            
            return acc;
        }, {});

        // Преобразуем объект обратно в массив
        return Object.values(bestAttempts);
    } catch (error) {
        console.error('Ошибка при получении пройденных викторин:', error);
        throw error;
    }
}; 