// components/HomeCategories.js
import { Link } from 'react-router-dom';
import '../styles/styles.css';

const categories = [
  { id: 1, title: "Кино", icon: "🎬", color: "#FF6B6B" },
  { id: 2, title: "История", icon: "🏛️", color: "#4ECDC4" },
  { id: 3, title: "Наука", icon: "🔬", color: "#45B7D1" },
];

const HomeCategories = () => {
  return (
    <div className="categories-grid">
      {categories.map(category => (
        <Link 
          to={`/quizzes/${category.id}`} 
          className="category-card"
          style={{ '--category-color': category.color }}
          key={category.id}
        >
          <div className="category-icon">{category.icon}</div>
          <h3>{category.title}</h3>
        </Link>
      ))}
    </div>
  );
};
export default HomeCategories;