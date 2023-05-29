import { useContext } from 'react';
import { ResultContext } from '../utils/ResultContext';


export default function Results() {
    const result = useContext(ResultContext);

    return(
        <div>
            <ResultContext.Provider value={result}>
                <h1>Results</h1>
                {result}
            </ResultContext.Provider>
        </div>
    );
}
