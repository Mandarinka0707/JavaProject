import { API_URL, API_ENDPOINTS } from '../config';

const handleAuthError = () => {
  localStorage.removeItem('token');
  window.location.href = '/login';
};

export const getFriendCount = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    handleAuthError();
    throw new Error('Не авторизован');
  }

  try {
    const response = await fetch(`${API_URL}${API_ENDPOINTS.FRIENDS.COUNT}`, {
      headers: {
        'Authorization': `Bearer ${token.trim()}`,
        'Accept': 'application/json'
      }
    });

    if (response.status === 401) {
      handleAuthError();
      throw new Error('Сессия истекла. Пожалуйста, войдите снова.');
    }

    if (!response.ok) {
      throw new Error('Failed to fetch friend count');
    }

    const data = await response.json();
    return data.count;
  } catch (error) {
    console.error('Error fetching friend count:', error);
    return 0;
  }
};

export const getFriends = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    handleAuthError();
    throw new Error('Не авторизован');
  }

  try {
    const response = await fetch(`${API_URL}${API_ENDPOINTS.FRIENDS.LIST}`, {
      headers: {
        'Authorization': `Bearer ${token.trim()}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 401) {
      handleAuthError();
      throw new Error('Сессия истекла. Пожалуйста, войдите снова.');
    }

    if (!response.ok) {
      throw new Error('Ошибка при загрузке списка друзей');
    }

    return await response.json();
  } catch (error) {
    console.error('Error loading friends:', error);
    throw error;
  }
};

export const getPendingRequests = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    handleAuthError();
    throw new Error('Не авторизован');
  }

  try {
    const response = await fetch(`${API_URL}${API_ENDPOINTS.FRIENDS.PENDING}`, {
      headers: {
        'Authorization': `Bearer ${token.trim()}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 401) {
      handleAuthError();
      throw new Error('Сессия истекла. Пожалуйста, войдите снова.');
    }

    if (!response.ok) {
      throw new Error('Ошибка при загрузке заявок в друзья');
    }

    return await response.json();
  } catch (error) {
    console.error('Error loading pending requests:', error);
    throw error;
  }
};

export const sendFriendRequest = async (userId) => {
  const token = localStorage.getItem('token');
  if (!token) {
    handleAuthError();
    throw new Error('Не авторизован');
  }

  try {
    const response = await fetch(`${API_URL}${API_ENDPOINTS.FRIENDS.REQUEST}/${userId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token.trim()}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 401) {
      handleAuthError();
      throw new Error('Сессия истекла. Пожалуйста, войдите снова.');
    }

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Ошибка при отправке запроса дружбы');
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending friend request:', error);
    throw error;
  }
};

export const acceptFriendRequest = async (userId) => {
  const token = localStorage.getItem('token');
  if (!token) {
    handleAuthError();
    throw new Error('Не авторизован');
  }

  try {
    const response = await fetch(`${API_URL}${API_ENDPOINTS.FRIENDS.ACCEPT}/${userId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token.trim()}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 401) {
      handleAuthError();
      throw new Error('Сессия истекла. Пожалуйста, войдите снова.');
    }

    if (!response.ok) {
      throw new Error('Ошибка при принятии запроса дружбы');
    }

    return await response.json();
  } catch (error) {
    console.error('Error accepting friend request:', error);
    throw error;
  }
};

export const rejectFriendRequest = async (userId) => {
  const token = localStorage.getItem('token');
  if (!token) {
    handleAuthError();
    throw new Error('Не авторизован');
  }

  try {
    const response = await fetch(`${API_URL}${API_ENDPOINTS.FRIENDS.REJECT}/${userId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token.trim()}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 401) {
      handleAuthError();
      throw new Error('Сессия истекла. Пожалуйста, войдите снова.');
    }

    if (!response.ok) {
      throw new Error('Ошибка при отклонении запроса дружбы');
    }

    return await response.json();
  } catch (error) {
    console.error('Error rejecting friend request:', error);
    throw error;
  }
};

export const removeFriend = async (userId) => {
  const token = localStorage.getItem('token');
  if (!token) {
    handleAuthError();
    throw new Error('Не авторизован');
  }

  try {
    const response = await fetch(`${API_URL}${API_ENDPOINTS.FRIENDS.LIST}/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token.trim()}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 401) {
      handleAuthError();
      throw new Error('Сессия истекла. Пожалуйста, войдите снова.');
    }

    if (!response.ok) {
      throw new Error('Ошибка при удалении друга');
    }

    return true;
  } catch (error) {
    console.error('Error removing friend:', error);
    throw error;
  }
};

export const searchFriends = async (query) => {
  const token = localStorage.getItem('token');
  if (!token) {
    handleAuthError();
    throw new Error('Не авторизован');
  }

  try {
    const response = await fetch(`${API_URL}${API_ENDPOINTS.FRIENDS.SEARCH}?query=${encodeURIComponent(query)}`, {
      headers: {
        'Authorization': `Bearer ${token.trim()}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 401) {
      handleAuthError();
      throw new Error('Сессия истекла. Пожалуйста, войдите снова.');
    }

    if (!response.ok) {
      throw new Error('Ошибка при поиске пользователей');
    }

    return await response.json();
  } catch (error) {
    console.error('Error searching friends:', error);
    throw error;
  }
}; 