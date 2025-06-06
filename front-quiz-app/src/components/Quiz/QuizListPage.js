import { useState, useEffect } from 'react';
import QuizCard from './QuizCard';
import '../../styles/styles.css';

const QuizListPage = ({ quizzes = [], filterByCategory }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [availableTags, setAvailableTags] = useState([]);

  // Маппинг для отображения сложности
  const difficultyMap = {
    'EASY': 'легкий',
    'MEDIUM': 'средний',
    'HARD': 'сложный'
  };

  // Маппинг для категорий
  const categoryMap = {
    'GENERAL': 'Общие знания',
    'ANIME': 'Аниме',
    'GAMES': 'Игры',
    'MOVIES': 'Фильмы',
    'BOOKS': 'Книги',
    'SPORTS': 'Спорт',
    'SCIENCE': 'Наука',
    'HISTORY': 'История',
    'PERSONALITY': 'Тесты личности'
  };

  const reverseDifficultyMap = {
    'легкий': 'EASY',
    'средний': 'MEDIUM',
    'сложный': 'HARD',
    // Добавляем маппинг для значений в верхнем регистре
    'ЛЕГКИЙ': 'EASY',
    'СРЕДНИЙ': 'MEDIUM',
    'СЛОЖНЫЙ': 'HARD'
  };

  // Функция нормализации значения сложности
  const normalizeDifficulty = (difficulty) => {
    if (!difficulty) return null;
    
    // Если значение уже в формате EASY/MEDIUM/HARD
    if (['EASY', 'MEDIUM', 'HARD'].includes(difficulty)) {
      return difficulty;
    }
    
    // Преобразуем русское значение в английское
    const normalizedDifficulty = reverseDifficultyMap[difficulty.toUpperCase()];
    return normalizedDifficulty || difficulty;
  };

  useEffect(() => {
    // Собираем все уникальные теги из викторин
    console.log('=== ОТЛАДКА ТЕГОВ ===');
    console.log('Все викторины:', quizzes);
    console.log('Теги из викторин:', quizzes.map(q => q.tags));
    const tags = [...new Set(quizzes.flatMap(q => q.tags || []))];
    console.log('Уникальные теги:', tags);
    setAvailableTags(tags);
    
    // Отладочная информация
    console.log('=== ОТЛАДКА ВИКТОРИН ===');
    console.log(`Получено викторин: ${quizzes.length}`);
    quizzes.forEach((quiz, index) => {
      console.log(`\nВикторина ${index + 1}:`, {
        id: quiz.id,
        title: quiz.title,
        description: quiz.description,
        difficulty: quiz.difficulty,
        tags: quiz.tags,
        allProperties: quiz
      });
    });
  }, [quizzes]);

  const filteredQuizzes = quizzes.filter(quiz => {
    if (!quiz) {
      console.log('Обнаружена пустая викторина!');
      return false;
    }

    // Проверяем наличие обязательных полей
    if (!quiz.title) {
      console.log(`Викторина ID ${quiz.id}: отсутствует название`);
      return false;
    }

    const matchesSearch = !searchTerm || 
                         (quiz.title && quiz.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (quiz.description && quiz.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Подробное логирование с реальными значениями
    console.log('==========================================');
    console.log(`Викторина: "${quiz.title}"`);
    console.log(`Сложность викторины: "${quiz.difficulty}"`);
    console.log(`Нормализованная сложность: "${normalizeDifficulty(quiz.difficulty)}"`);
    console.log(`Выбранный фильтр сложности: "${selectedDifficulty}"`);
    
    const normalizedQuizDifficulty = normalizeDifficulty(quiz.difficulty);
    
    const matchesDifficulty = selectedDifficulty === 'all' || 
                             normalizedQuizDifficulty === selectedDifficulty;
    
    const matchesTags = selectedTags.length === 0 || 
                       (quiz.tags && selectedTags.every(tag => quiz.tags.includes(tag)));

    const matchesCategory = selectedCategory === 'all' || 
                          quiz.category === selectedCategory;

    const matches = matchesSearch && matchesDifficulty && matchesTags && matchesCategory;
    
    // Выводим результат фильтрации с конкретными значениями
    console.log('Результаты проверок:', {
      'Поиск пройден': matchesSearch,
      'Сложность совпадает': matchesDifficulty,
      'Теги совпадают': matchesTags,
      'Категория совпадает': matchesCategory,
      'Общий результат': matches
    });
    console.log('==========================================');

    return matches;
  });

  const handleTagToggle = tag => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="quiz-list-container">
      <div className="filters-section" style={{
        margin: '0 auto 2rem auto',
        maxWidth: '100%',
        padding: '1.5rem',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(170, 31, 191, 0.08)'
      }}>
        <input
          type="text"
          placeholder="Поиск викторин..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
          style={{
            width: '100%',
            padding: '0.8rem',
            border: '2px solid #f3e5ff',
            borderRadius: '8px',
            fontSize: '1rem',
            boxSizing: 'border-box'
          }}
        />

        <div className="filters-row">
          <div className="filter-group">
            <label>Категория:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="category-filter"
              style={{
                width: '100%',
                padding: '0.8rem',
                border: '2px solid #f3e5ff',
                borderRadius: '8px',
                fontSize: '1rem',
                marginTop: '0.5rem',
                boxSizing: 'border-box'
              }}
            >
              <option value="all">Все категории</option>
              {Object.entries(categoryMap).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Сложность:</label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="difficulty-filter"
              style={{
                width: '100%',
                padding: '0.8rem',
                border: '2px solid #f3e5ff',
                borderRadius: '8px',
                fontSize: '1rem',
                marginTop: '0.5rem',
                boxSizing: 'border-box'
              }}
            >
              <option value="all">Все</option>
              <option value="EASY">Легкий</option>
              <option value="MEDIUM">Средний</option>
              <option value="HARD">Сложный</option>
            </select>
          </div>
        </div>

        <div className="tags-filter" style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.8rem',
          marginTop: '1rem'
        }}>
          {availableTags.map(tag => (
            <button
              key={tag}
              onClick={() => handleTagToggle(tag)}
              className={`tag ${selectedTags.includes(tag) ? 'active' : ''}`}
              style={{
                padding: '0.6rem 1.2rem',
                background: selectedTags.includes(tag) ? 
                  'linear-gradient(135deg, #cd5cde 0%, #aa1fbf 100%)' : 
                  '#f8f4ff',
                border: 'none',
                borderRadius: '20px',
                color: selectedTags.includes(tag) ? 'white' : '#aa1fbf',
                fontSize: '0.95rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      <div className="quizzes-grid">
        {filteredQuizzes.map(quiz => (
          <QuizCard 
            key={quiz.id} 
            quiz={{
              ...quiz,
              difficulty: difficultyMap[quiz.difficulty] || quiz.difficulty,
              category: categoryMap[quiz.category] || quiz.category
            }}
          />
        ))}
      </div>

      {filteredQuizzes.length === 0 && (
        <div className="no-results">
          <h3>Ничего не найдено</h3>
          <p>Попробуйте изменить параметры поиска</p>
        </div>
      )}

      <style jsx>{`
        .quiz-list-container {
          max-width: 1200px;
          margin: 2rem auto;
          padding: 0 20px;
        }

        .filters-section {
          margin-bottom: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(170, 31, 191, 0.08);
        }

        .search-input {
          width: 100%;
          padding: 0.8rem;
          border: 2px solid #f3e5ff;
          border-radius: 8px;
          font-size: 1rem;
        }

        .search-input:focus {
          outline: none;
          border-color: #cd5cde;
          box-shadow: 0 0 0 3px rgba(170, 31, 191, 0.2);
        }

        .filters-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-top: 1rem;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .filter-group label {
          color: #2c3e50;
          font-weight: 500;
        }

        .category-filter,
        .difficulty-filter {
          width: 100%;
          padding: 0.8rem;
          border: 2px solid #f3e5ff;
          border-radius: 8px;
          font-size: 1rem;
          background: white;
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23cd5cde'%3e%3cpath d='M7 10l5 5 5-5z'/%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 0.8rem center;
          background-size: 1em;
        }

        .category-filter:focus,
        .difficulty-filter:focus {
          outline: none;
          border-color: #cd5cde;
          box-shadow: 0 0 0 3px rgba(170, 31, 191, 0.2);
        }

        .tags-filter {
          display: flex;
          flex-wrap: wrap;
          gap: 0.8rem;
          margin-top: 1rem;
          width: 100%;
        }

        .tag {
          padding: 0.6rem 1.2rem;
          background: #f8f4ff;
          border: none;
          border-radius: 20px;
          color: #aa1fbf;
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .tag:hover {
          background: #f3e5ff;
          transform: translateY(-2px);
          box-shadow: 0 2px 8px rgba(170, 31, 191, 0.1);
        }

        .tag.active {
          background: linear-gradient(135deg, #cd5cde 0%, #aa1fbf 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(170, 31, 191, 0.2);
        }

        .no-results {
          text-align: center;
          padding: 3rem;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }

        .no-results h3 {
          color: #cd5cde;
          margin-bottom: 1rem;
        }

        .no-results p {
          color: #666;
        }

        @media (max-width: 768px) {
          .quiz-list-container {
            padding: 0 15px;
          }

          .filters-section {
            padding: 1rem !important;
          }

          .search-input,
          .category-filter,
          .difficulty-filter {
            padding: 0.6rem !important;
            font-size: 0.95rem !important;
          }

          .tag {
            padding: 0.5rem 1rem !important;
            font-size: 0.9rem !important;
          }

          .filters-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default QuizListPage;