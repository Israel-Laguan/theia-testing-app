import React, { useState } from 'react';
import cuestionJs from '../../public/cuestions/cuestionsJS.json';

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);

  const handleAnswer = (points: any) => {
    setScore(score + points);

    if (currentQuestion < cuestionJs.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      alert(`Puntaje final: ${score} / ${cuestionJs.maxPointsPossible}`);
    }
  };

  const renderOptions = () => {
    const question = cuestionJs.questions[currentQuestion];
    return question.options.map((option, index) => (
      <div key={index}>
        <input type="radio" name="answer" id={`option${index}`} />
        <label htmlFor={`option${index}`} onClick={() => handleAnswer(option.points)}>
          {option.option}
        </label>
      </div>
    ));
  };

  return (
    <div>
      <h1>{cuestionJs.questions[currentQuestion].question}</h1>
      <p>{cuestionJs.questions[currentQuestion].hint}</p>
      <p>Pregunta {currentQuestion + 1} de {cuestionJs.questions.length}</p>
      <form>
        {renderOptions()}
      </form>
    </div>
  );
}
