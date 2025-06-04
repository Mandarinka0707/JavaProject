import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import QuizCard from './QuizCard';
import '../../styles/styles.css';

const QuizListPage = ({ quizzes = [], filterByCategory }) => {
  const { categoryId } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedTags, setSelectedTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);

  useEffect(() => {
    // Собираем все уникальные теги из викторин
    const tags = [...new Set(quizzes.flatMap(q => q.tags || []))];
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
    const matchesDifficulty = selectedDifficulty === 'all' || 
                            quiz.difficulty === selectedDifficulty;
    const matchesTags = selectedTags.length === 0 || 
                       (quiz.tags && selectedTags.every(tag => quiz.tags.includes(tag)));

    return matchesSearch && matchesDifficulty && matchesTags;
  });

  const handleTagToggle = tag => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="quiz-list-container">
      <div className="filters-section">
        <input
          type="text"
          placeholder="Поиск викторин..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <div className="filter-group">
          <label>Сложность:</label>
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="difficulty-filter"
          >
            <option value="all">Все</option>
            <option value="легкий">Легкий</option>
            <option value="средний">Средний</option>
            <option value="сложный">Сложный</option>
          </select>
        </div>

        <div className="tags-filter">
          {availableTags.map(tag => (
            <button
              key={tag}
              onClick={() => handleTagToggle(tag)}
              className={`tag ${selectedTags.includes(tag) ? 'active' : ''}`}
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
            quiz={quiz} 
          />
        ))}
      </div>

      {filteredQuizzes.length === 0 && (
        <div className="no-results">
          <h3>Ничего не найдено</h3>
          <p>Попробуйте изменить параметры поиска</p>
        </div>
      )}
    </div>
  );
};

export default QuizListPage;