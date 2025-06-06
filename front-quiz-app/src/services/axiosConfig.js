import axios from 'axios';

// Создаем перехватчик для добавления токена к запросам
axios.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// Создаем перехватчик для обработки ответов
axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response) {
            // Если сервер вернул ошибку 401 (не авторизован)
            if (error.response.status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
            // Логируем ошибки
            console.error('Response error:', {
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers
            });
        } else if (error.request) {
            // Если запрос был сделан, но ответ не получен
            console.error('Request error:', error.request);
        } else {
            // Что-то пошло не так при настройке запроса
            console.error('Error:', error.message);
        }
        return Promise.reject(error);
    }
);

export default axios; 