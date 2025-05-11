// components/RatingPage.js

const RatingPage = () => {
    // Здесь должна быть логика получения рейтинга из API
    const users = [
      { name: "User1", score: 150 },
      { name: "User2", score: 120 },
      { name: "User3", score: 100 }
    ];
  
    return (
      <div className="rating-container">
        <h1>Рейтинг пользователей</h1>
        <div className="rating-list">
          {users.map((user, index) => (
            <div key={index} className="rating-item">
              <span>{index + 1}. {user.name}</span>
              <span>{user.score} баллов</span>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default RatingPage;