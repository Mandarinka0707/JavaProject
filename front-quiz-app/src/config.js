export const API_BASE_URL = 'http://localhost:8080';
export const API_URL = API_BASE_URL;

export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/api/auth/login',
        REGISTER: '/api/auth/register',
        VALIDATE: '/api/auth/validate',
        REFRESH: '/api/auth/refresh'
    },
    QUIZ: {
        CREATE: '/api/quizzes',
        CREATE_PERSONALITY: '/api/quizzes/personality',
        LIST: '/api/quizzes',
        MY: '/api/quizzes/my',
        ATTEMPT: {
            START: '/api/quiz-attempts/start',
            SUBMIT: '/api/quiz-attempts/submit',
            MY: '/api/quiz-attempts/my',
            ACTIVE: '/api/quiz-attempts/my/active'
        },
        RATING: {
            RATE: (quizId) => `/api/quizzes/${quizId}/rate`,
            USER_RATING: (quizId) => `/api/quizzes/${quizId}/user-rating`
        }
    },
    FRIENDS: {
        LIST: '/api/friends',
        COUNT: '/api/friends/count',
        PENDING: '/api/friends/pending',
        REQUEST: '/api/friends/request',
        ACCEPT: '/api/friends/accept',
        REJECT: '/api/friends/reject',
        SEARCH: '/api/friends/search',
        STATUS: '/api/friends/status'
    },
    RATINGS: {
        MY: '/api/ratings/my',
        REFRESH: '/api/ratings/refresh',
        TOP: '/api/ratings/top'
    }
}; 