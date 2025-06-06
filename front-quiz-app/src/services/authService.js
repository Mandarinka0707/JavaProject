import { API_URL, API_ENDPOINTS } from '../config';

export const validateToken = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('Не авторизован');
    }

    try {
        const response = await fetch(`${API_URL}${API_ENDPOINTS.AUTH.VALIDATE}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token.trim()}`,
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            if (response.status === 401) {
                // Пробуем обновить токен
                try {
                    const refreshResponse = await fetch(`${API_URL}${API_ENDPOINTS.AUTH.REFRESH}`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token.trim()}`,
                            'Accept': 'application/json'
                        }
                    });

                    if (refreshResponse.ok) {
                        const data = await refreshResponse.json();
                        localStorage.setItem('token', data.token);
                        return true;
                    }
                } catch (refreshError) {
                    console.error('Error refreshing token:', refreshError);
                }
                
                localStorage.removeItem('token');
                throw new Error('Сессия истекла');
            }
            throw new Error('Ошибка валидации токена');
        }

        return true;
    } catch (error) {
        console.error('Token validation error:', error);
        throw error;
    }
};

export const handleAuthError = (error, navigate, from = '/') => {
    console.error('Auth error:', error);
    
    if (error.message === 'Не авторизован' || error.message === 'Сессия истекла') {
        localStorage.removeItem('token');
        if (navigate) {
            navigate('/login', {
                state: {
                    from,
                    message: error.message === 'Сессия истекла' 
                        ? 'Ваша сессия истекла. Пожалуйста, войдите снова.'
                        : 'Пожалуйста, войдите в систему для продолжения'
                }
            });
        } else {
            window.location.href = '/login';
        }
    }
    
    throw error;
};

export const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('Не авторизован');
    }

    return {
        'Authorization': `Bearer ${token.trim()}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };
}; 