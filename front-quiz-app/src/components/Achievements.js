// components/Achievements.js
const achievements = [
    { id: 1, title: "Новичок", condition: (user) => user.quizzesCompleted >= 1 },
    { id: 2, title: "Эксперт", condition: (user) => user.quizzesCompleted >= 10 },
    { id: 3, title: "Автор", condition: (user) => user.quizzesCreated >= 1 },
  ];
  
  const Achievements = ({ userStats }) => {
    return (
      <div className="achievements-container">
        <h3>Достижения</h3>
        <div className="achievements-grid">
          {achievements.map(ach => (
            <div 
              key={ach.id}
              className={`achievement ${ach.condition(userStats) ? 'unlocked' : 'locked'}`}
            >
              <div className="achievement-icon">{ach.condition(userStats) ? '🏆' : '🔒'}</div>
              <div className="achievement-title">{ach.title}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  export default Achievements;