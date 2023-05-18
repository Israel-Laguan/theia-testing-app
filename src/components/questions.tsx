import { useState, useEffect } from 'react'

const QuestionsForm = () => {
  // Preguntas del JSON
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  // Opciones seleccionadas por el usuario
  const [selectedOptions, setSelectedOptions] = useState({})
  // Identificador de la pregunta actual
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

  const handleGetJSON = async (event: any) => {
    const file = event.target.files[0]

    if (file) {
      setLoading(true)

      const reader = new FileReader()

      reader.onload = (event: any) => {
        try {
          const jsonData = JSON.parse(event.target.result)
          setQuestions(jsonData.questions)
          setSuccess(true)
        } catch (error) {
          setError('JSON inválido')
        }

        setLoading(false)
      }

      reader.onerror = () => {
        setError('Error al leer el archivo')
        setLoading(false)
      }

      reader.readAsText(file)
    }
  }

  const loadingInfo = () => {
    {
      loading ? 'Loading...' : 'Get a JSON'
    }
    console.log(`${loading ? 'Loading...' : 'Get a JSON'};`)
    setLoading(true)
  }

  useEffect(() => {
    // Vamos guardando cada seleccion del input radio en el localStorage
    let data = localStorage.setItem('selectedOptions', JSON.stringify(selectedOptions))
    // console.log(data);
  }, [selectedOptions])

  const handleSubmit = (event: any) => {
    event.preventDefault()
    // Pasamos a la siguiente pregunta
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1)
  }

  return (
    <div>
      <h1>Survey Data </h1>

      <input
        onClick={loadingInfo}
        onChange={handleGetJSON}
        id="jsondata"
        name="userData"
        accept=".json"
        type="file"
      />

      {error && <p>{error}</p>}
      {success && <p>JSON Cargado de manera satisfactoria</p>}
      {questions.length > 0 && currentQuestionIndex < questions.length && (
        <form id="surveyForm" onSubmit={handleSubmit}>
          <div key={currentQuestionIndex}>
            <ul>{questions[currentQuestionIndex].question}</ul>
            {/* Render question options */}
            {questions[currentQuestionIndex].options.map((option: any, k2) => (
              <li key={k2}>
                <input
                  type="radio"
                  name={questions[currentQuestionIndex].question}
                  value={option.option}
                  onChange={(event) => {
                    setSelectedOptions((prevOptions) => ({
                      ...prevOptions,
                      [questions[currentQuestionIndex].question]: event.target.value,
                    }))
                  }}
                />
                {option.option}
              </li>
            ))}
          </div>
          <button type="submit">Siguiente</button>
        </form>
      )}
    </div>
  )
}

export default QuestionsForm
