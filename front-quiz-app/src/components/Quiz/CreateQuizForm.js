// import { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import '/Users/darinautalieva/Desktop/JavaProject/front-quiz-app/src/styles.css';

// const CreateQuizForm = ({ addQuiz }) => {
//   const [quizData, setQuizData] = useState({
//     title: '',
//     description: '',
//     difficulty: 'легкий',
//     tags: [],
//     questions: [{
//       question: '',
//       options: ['', '', '', ''],
//       correctIndex: 0
//     }]
//   });
//   const [currentTag, setCurrentTag] = useState('');
  
//   const navigate = useNavigate();

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     addQuiz(quizData);
//     navigate('/profile');
//   };

//   const handleQuestionChange = (index, field, value) => {
//     const newQuestions = [...quizData.questions];
//     newQuestions[index][field] = value;
//     setQuizData({...quizData, questions: newQuestions});
//   };

//   const handleOptionChange = (qIndex, oIndex, value) => {
//     const newQuestions = [...quizData.questions];
//     newQuestions[qIndex].options[oIndex] = value;
//     setQuizData({...quizData, questions: newQuestions});
//   };

//   const addQuestion = () => {
//     setQuizData({
//       ...quizData,
//       questions: [...quizData.questions, {
//         question: '',
//         options: ['', '', '', ''],
//         correctIndex: 0
//       }]
//     });
//   };

//   const handleAddTag = (e) => {
//     if (e.key === 'Enter' || e.key === ',') {
//       e.preventDefault();
//       const tag = currentTag.trim().toLowerCase();
//       if (tag && !quizData.tags.includes(tag)) {
//         setQuizData({
//           ...quizData,
//           tags: [...quizData.tags, tag]
//         });
//         setCurrentTag('');
//       }
//     }
//   };

//   const removeTag = (indexToRemove) => {
//     setQuizData({
//       ...quizData,
//       tags: quizData.tags.filter((_, index) => index !== indexToRemove)
//     });
//   };

//   return (
//     <div className="create-quiz-container">
//       <h2>Создать новую викторину</h2>
//       <form onSubmit={handleSubmit}>
//         <div className="form-group">
//           <label>Название викторины:</label>
//           <input
//             type="text"
//             value={quizData.title}
//             onChange={(e) => setQuizData({...quizData, title: e.target.value})}
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label>Описание:</label>
//           <textarea
//             value={quizData.description}
//             onChange={(e) => setQuizData({...quizData, description: e.target.value})}
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label>Сложность:</label>
//           <select
//             value={quizData.difficulty}
//             onChange={(e) => setQuizData({...quizData, difficulty: e.target.value})}
//           >
//             <option value="легкий">Легкий</option>
//             <option value="средний">Средний</option>
//             <option value="сложный">Сложный</option>
//           </select>
//         </div>

//         <div className="form-group">
//           <label>Теги (вводите через запятую или Enter):</label>
//           <div className="tags-input-container">
//             <div className="tags-list">
//               {quizData.tags.map((tag, index) => (
//                 <span key={index} className="tag">
//                   {tag}
//                   <button 
//                     type="button" 
//                     onClick={() => removeTag(index)}
//                     className="remove-tag"
//                   >
//                     ×
//                   </button>
//                 </span>
//               ))}
//             </div>
//             <input
//               type="text"
//               value={currentTag}
//               onChange={(e) => setCurrentTag(e.target.value.replace(',', ''))}
//               onKeyDown={handleAddTag}
//               placeholder="Добавьте теги..."
//             />
//           </div>
//         </div>

//         {quizData.questions.map((question, qIndex) => (
//           <div key={qIndex} className="question-block">
//             <h3>Вопрос {qIndex + 1}</h3>
            
//             <div className="form-group">
//               <label>Текст вопроса:</label>
//               <input
//                 type="text"
//                 value={question.question}
//                 onChange={(e) => handleQuestionChange(qIndex, 'question', e.target.value)}
//                 required
//               />
//             </div>

//             <div className="options-group">
//               {question.options.map((option, oIndex) => (
//                 <div key={oIndex} className="form-group">
//                   <label>Вариант {oIndex + 1}:</label>
//                   <input
//                     type="text"
//                     value={option}
//                     onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
//                     required
//                   />
//                 </div>
//               ))}
//             </div>

//             <div className="form-group">
//               <label>Правильный ответ:</label>
//               <select
//                 value={question.correctIndex}
//                 onChange={(e) => handleQuestionChange(qIndex, 'correctIndex', parseInt(e.target.value))}
//               >
//                 {question.options.map((_, index) => (
//                   <option key={index} value={index}>Вариант {index + 1}</option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         ))}

//         <button type="button" onClick={addQuestion} className="add-question-button">
//           Добавить вопрос
//         </button>

//         <button type="submit" className="submit-button">Создать викторину</button>
        
//         <Link to="/profile" className="cancel-button">Отмена</Link>
//       </form>
//     </div>
//   );
// };

// export default CreateQuizForm;

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '/Users/darinautalieva/Desktop/JavaProject/front-quiz-app/src/styles.css';

const CreateQuizForm = ({ addQuiz }) => {
  const [quizData, setQuizData] = useState({
    title: '',
    description: '',
    difficulty: 'легкий',
    tags: [],
    timeDuration: '', // New state variable for time duration
    questions: [{
      question: '',
      options: ['', '', '', ''],
      correctIndex: 0
    }]
  });
  const [currentTag, setCurrentTag] = useState('');

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    addQuiz(quizData);
    navigate('/profile');
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...quizData.questions];
    newQuestions[index][field] = value;
    setQuizData({...quizData, questions: newQuestions});
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQuestions = [...quizData.questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuizData({...quizData, questions: newQuestions});
  };

  const addQuestion = () => {
    setQuizData({
      ...quizData,
      questions: [...quizData.questions, {
        question: '',
        options: ['', '', '', ''],
        correctIndex: 0
      }]
    });
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const tag = currentTag.trim().toLowerCase();
      if (tag && !quizData.tags.includes(tag)) {
        setQuizData({
          ...quizData,
          tags: [...quizData.tags, tag]
        });
        setCurrentTag('');
      }
    }
  };

  const removeTag = (indexToRemove) => {
    setQuizData({
      ...quizData,
      tags: quizData.tags.filter((_, index) => index !== indexToRemove)
    });
  };

  return (
    <div className="create-quiz-container">
      <h2>Создать новую викторину</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Название викторины:</label>
          <input
            type="text"
            value={quizData.title}
            onChange={(e) => setQuizData({...quizData, title: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>Описание:</label>
          <textarea
            value={quizData.description}
            onChange={(e) => setQuizData({...quizData, description: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>Сложность:</label>
          <select
            value={quizData.difficulty}
            onChange={(e) => setQuizData({...quizData, difficulty: e.target.value})}
          >
            <option value="легкий">Легкий</option>
            <option value="средний">Средний</option>
            <option value="сложный">Сложный</option>
          </select>
        </div>

        <div className="form-group">
          <label>Время прохождения (в минутах):</label>
          <input
            type="number"
            value={quizData.timeDuration}
            onChange={(e) => setQuizData({...quizData, timeDuration: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>Теги (вводите через запятую или Enter):</label>
          <div className="tags-input-container">
            <div className="tags-list">
              {quizData.tags.map((tag, index) => (
                <span key={index} className="tag">
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(index)}
                    className="remove-tag"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value.replace(',', ''))}
              onKeyDown={handleAddTag}
              placeholder="Добавьте теги..."
            />
          </div>
        </div>

        {quizData.questions.map((question, qIndex) => (
          <div key={qIndex} className="question-block">
            <h3>Вопрос {qIndex + 1}</h3>

            <div className="form-group">
              <label>Текст вопроса:</label>
              <input
                type="text"
                value={question.question}
                onChange={(e) => handleQuestionChange(qIndex, 'question', e.target.value)}
                required
              />
            </div>

            <div className="options-group">
              {question.options.map((option, oIndex) => (
                <div key={oIndex} className="form-group">
                  <label>Вариант {oIndex + 1}:</label>
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                    required
                  />
                </div>
              ))}
            </div>

            <div className="form-group">
              <label>Правильный ответ:</label>
              <select
                value={question.correctIndex}
                onChange={(e) => handleQuestionChange(qIndex, 'correctIndex', parseInt(e.target.value))}
              >
                {question.options.map((_, index) => (
                  <option key={index} value={index}>Вариант {index + 1}</option>
                ))}
              </select>
            </div>
          </div>
        ))}

        <button type="button" onClick={addQuestion} className="add-question-button">
          Добавить вопрос
        </button>

        <button type="submit" className="submit-button">Создать викторину</button>

        <Link to="/profile" className="cancel-button">Отмена</Link>
      </form>
    </div>
  );
};

export default CreateQuizForm;
