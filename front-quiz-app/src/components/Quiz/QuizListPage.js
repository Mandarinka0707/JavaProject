import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import QuizCard from './QuizCard';
import '/Users/darinautalieva/Desktop/JavaProject/front-quiz-app/src/styles.css';

const QuizListPage = ({ quizzes = [], filterByCategory }) => {
  const { categoryId } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedTags, setSelectedTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);

  // Получаем уникальные теги из всех викторин
  useEffect(() => {
    const tags = [...new Set(quizzes.flatMap(q => q.tags))];
    setAvailableTags(tags);
  }, [quizzes]);

  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesCategory = !categoryId || quiz.categoryId === Number(categoryId);
    const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quiz.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = selectedDifficulty === 'all' || 
                            quiz.difficulty === selectedDifficulty;
    const matchesTags = selectedTags.length === 0 || 
                       selectedTags.every(tag => quiz.tags.includes(tag));

    return matchesCategory && matchesSearch && matchesDifficulty && matchesTags;
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
            showDetails={true}
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