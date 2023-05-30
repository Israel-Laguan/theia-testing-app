import { useContext } from 'react'
import { ResultContext } from '../utils/ResultContext'

export default function Results() {
  const result = useContext(ResultContext)

  return (
    <div>
      <h1>Results</h1>
      {result}
    </div>
  )
}
