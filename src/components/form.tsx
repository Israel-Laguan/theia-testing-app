export default function Form({
  questions,
  selectedOptions,
  setSelectedOptions,
  currentQuestionIndex,
  setIsoptionSelected,
  handlePreviousQuestion,
  handleNextQuestion,
  surveyEnd,
}: any) {
  return (
    <form id="surveyForm">
      <div key={currentQuestionIndex}>
        <ul>{questions[currentQuestionIndex].question}</ul>
        {questions[currentQuestionIndex].options.map((option: any, k2: number) => (
          <li className="surveyF" key={k2}>
            <input
              type="radio"
              name={questions[currentQuestionIndex].question}
              value={option.option}
              checked={
                selectedOptions[
                  questions[currentQuestionIndex].question as keyof typeof selectedOptions
                ] === option.option || false
              }
              onChange={(event) => {
                setIsoptionSelected(true)
                setSelectedOptions((prevOptions: object) => ({
                  ...prevOptions,
                  [questions[currentQuestionIndex].question]: event.target.value,
                }))
              }}
            />
            {option.option}
          </li>
        ))}
      </div>
      <div>
        {currentQuestionIndex > 0 && (
          <button onClick={handlePreviousQuestion} type="submit">
            Before
          </button>
        )}
        {questions.length > 0 && currentQuestionIndex < questions.length - 1 && (
          <button onClick={handleNextQuestion} type="submit">
            Next
          </button>
        )}
        {currentQuestionIndex === questions.length - 1 && (
          <button onClick={surveyEnd} type="button">
            Finish
          </button>
        )}
      </div>
    </form>
  )
}
