import { useState, useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { InfinitySpin } from 'react-loader-spinner'
import { Loader } from './loader';

const Exam = () => {
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
      console.log(loading, '*** 01 Loading ***')
      const reader = new FileReader()
      reader.onload = (event: any) => {
        try {
          const jsonData = JSON.parse(event.target.result);
          if (jsonData) {
            notify('Cargado de manera satisfactoria');
            
            // Enviamos las preguntas al estado
            setQuestions(jsonData.questions)
            setSuccess(true) // JSON cargado de manera satisfactoria
          }
        } catch (error) {
          notifyError('Archivo JSON Invalido')
          setSuccess(false)
          setError('JSON inválido')
          // setLoading(false);
        }
        setLoading(false)
      }

      reader.onerror = () => {
        setError('Error al leer el archivo')
      }
      // Leemos el archivo
      reader.readAsText(file)
    }
  }

  const loadingInfo = () => {
    {
      loading ? 'Loading...' : 'Get a JSON'
    }
    console.log(`${loading ? 'Loading...' : 'Get a JSON'};`)
    setLoading(true)
    return 
  }

  useEffect(() => {
    // Guardamos cada seleccion del input
    let data = localStorage.setItem('selectedOptions', JSON.stringify(selectedOptions))
  }, [selectedOptions])

  const handleSubmit = (event: any) => {
    event.preventDefault()
    // Pasamos a la siguiente pregunta
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1)
  }

  const surveyEnd = () => {

    // Finalizamos la encuesta
    localStorage.setItem('surveyEnd', JSON.stringify(true))

    // Redireccionamos a la pagina de resultados
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
    <main className='main'>
      <h1>Survey Data </h1>
      <input
        onClick={loadingInfo}
        onChange={handleGetJSON}
        id="jsondata"
        name="userData"
        accept=".json"
        type="file"
      />

      {error ? error : <p>{success}</p>}
      {questions.length > 0 && currentQuestionIndex < questions.length ? (
        <form id="surveyForm" onSubmit={handleSubmit}>
          {success ? success : error}
          <div key={currentQuestionIndex}>
            <ul>{questions[currentQuestionIndex].question}</ul>
            {/* Render question options */}
            {questions[currentQuestionIndex].options.map((option: any, k2) => (
              <li className="surveyF" key={k2}>
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
      ) : (
        <button onClick={surveyEnd} type="button">
          Finalizar
        </button>
      )}
      <ToastContainer />
    </main>
  )
}

export default Exam
