import { useState, useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Loader } from '../components/loader'
import { ResultContext } from '../utils/ResultContext'
import Results from './results'
import Form from '../components/Form'

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
  const [result, setResult] = useState(0)

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
            localStorage.removeItem('surveyEnd')
            localStorage.removeItem('points')
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
    setIsoptionSelected(true)
  }

  const handleNextQuestion = (event: any) => {
    event.preventDefault()
    if (!isOptionSelected) {
      notifyError('Seleccione una opción')
      return
    } else {
      const isOptionSelected =
        selectedOptions[
          questions[currentQuestionIndex + 1].question as keyof typeof selectedOptions
        ]
      {
        isOptionSelected ? setIsoptionSelected(true) : setIsoptionSelected(false)
      }
    }
    surveyResults()
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1)
  }

  const surveyResults = () => {
    let points = 0
    let average = 0
    questions.forEach((question: Question) => {
      const selectedOption = selectedOptions[question.question as keyof typeof selectedOptions]
      const correctOption = question.options.find((option) => option.points > 0)
      if (selectedOption === correctOption?.option) {
        points += correctOption.points
        average = points / questions.length
      }
    })

    localStorage.setItem('points', JSON.stringify(average))
    setResult(average)
  }

  const surveyEnd = () => {
    localStorage.setItem('surveyEnd', JSON.stringify(true))

    if (!isOptionSelected) {
      notifyError('¡Selecciona la respuesta!')
      return
    }

    surveyResults()
    //window.location.href = '/results' // Pending
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
    <ResultContext.Provider value={result}>
      <main className="main">
        <h1>Survey Data </h1>
        <p className="text-sky-400 shadow-inner"> Your score: {result}</p>
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
        {questions.length > 0 && (
          <Form
            success={success}
            questions={questions}
            selectedOptions={selectedOptions}
            setSelectedOptions={setSelectedOptions}
            currentQuestionIndex={currentQuestionIndex}
            setCurrentQuestionIndex={setCurrentQuestionIndex}
            isOptionSelected={isOptionSelected}
            setIsoptionSelected={setIsoptionSelected}
            surveyResults={surveyResults}
            handlePreviousQuestion={handlePreviousQuestion}
            handleNextQuestion={handleNextQuestion}
            surveyEnd={surveyEnd}
          />
        )}
        <ToastContainer />
      </main>
    </ResultContext.Provider>
  )
}

export default Exam
