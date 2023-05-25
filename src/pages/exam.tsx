import { useState, useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Loader } from '../components/loader'

type QuestionOption = {
  option: string
  explanation: string
  points: number
}

type Question = {
  question: string
  hint: string
  options: QuestionOption[]
}

type FormData = {
  name: string
  maxPointsPossible: number
  description: string
  questions: Question[]
}

const Exam = () => {
  const [questions, setQuestions] = useState<Question[] | []>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [selectedOptions, setSelectedOptions] = useState({})
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [isOptionSelected, setIsoptionSelected] = useState(false)
  const handleGetJSON = async (event: any) => {
    const file = event.target.files[0]
    if (file) {
      setLoading(true)
      const reader = new FileReader()
      reader.onload = (event: any) => {
        try {
          const jsonData = JSON.parse(event.target.result)
          if (jsonData) {
            notify('Cargado de manera satisfactoria')

            setQuestions(jsonData.questions)
            setSuccess(true)
          }
        } catch (error) {
          notifyError('Archivo JSON Invalido')
          setSuccess(false)
          setError('JSON inválido')
        }
        setLoading(false)
      }

      reader.onerror = () => {
        setError('Error al leer el archivo')
      }
      reader.readAsText(file)
    }
  }

  const loadingInfo = () => {
    {
      loading ? 'Loading...' : 'Get a JSON'
    }
    setLoading(true)
  }

  useEffect(() => {
    let data = localStorage.setItem('selectedOptions', JSON.stringify(selectedOptions))
  }, [selectedOptions])

  const handlePreviousQuestion = (event: any) => {
    event.preventDefault()
    setCurrentQuestionIndex((prevIndex) => prevIndex - 1)
  }

  const handleNextQuestion = (event: any) => {
    event.preventDefault()

    if (!isOptionSelected) {
      notifyError('Seleccione una opción')
      return
    }

    setCurrentQuestionIndex((prevIndex) => prevIndex + 1)
    setIsoptionSelected(false)
  }

  const surveyEnd = () => {
    localStorage.setItem('surveyEnd', JSON.stringify(true))

    if (!isOptionSelected) {
      notifyError('¡Selecciona la respuesta!')
      return
    }
    window.location.href = '/exam' // Pending
  }

  const notify = (message: string) => {
    toast.success(message, {
      position: 'top-center',
      autoClose: 3000,
      hideProgressBar: false,
    })
  }

  const notifyError = (message: string) => {
    toast.error(message, {
      position: 'top-center',
      autoClose: 3000,
      hideProgressBar: false,
    })
  }

  return (
    <main className="main">
      <h1>Survey Data </h1>
      <input
        onClick={loadingInfo}
        onChange={handleGetJSON}
        id="jsondata"
        name="userData"
        accept=".json"
        type="file"
      />
      {loading ? <Loader /> : null}
      {error ? error : <p>{success}</p>}
      {questions.length > 0 && currentQuestionIndex < questions.length ? (
        <form id="surveyForm">
          {success ? success : error}
          <div key={currentQuestionIndex}>
            <ul>{questions[currentQuestionIndex].question}</ul>
            {questions[currentQuestionIndex].options.map((option: any, k2) => (
              <li className="surveyF" key={k2}>
                <input
                  type="radio"
                  name={questions[currentQuestionIndex].question}
                  value={option.option}
                  onChange={(event) => {
                    setIsoptionSelected(true)
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
          <div>
            {currentQuestionIndex > 0 && (
              <button onClick={handlePreviousQuestion} type="submit">
                Anterior
              </button>
            )}
            {questions.length > 0 && currentQuestionIndex < questions.length - 1 && (
              <button onClick={handleNextQuestion} type="submit">
                Siguiente
              </button>
            )}
            {currentQuestionIndex === questions.length - 1 && (
              <button onClick={surveyEnd} type="button">
                Finalizar
              </button>
            )}
          </div>
        </form>
      ) : null}
      <ToastContainer />
    </main>
  )
}

export default Exam
