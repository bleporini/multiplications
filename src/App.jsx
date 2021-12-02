import { useState, createRef, useRef } from 'react'
import logo from './logo.svg'
import './App.css'

function App() {
    const initialState = {
        started: false,
    };
    const [state, setState] = useState(initialState);

  return (
    <div className="App">
      <header className="App-header">

        <p>Multiplications</p>
        <p>
            {state.started ? <p/>
                :<button type="button" onClick={() => setState(state => {
                    return {
                        ...state,
                        started:true
                    }
                })}>
                    Start!
                </button>

            }

        </p>
          
          <Game started={state.started}/>x

      </header>
    </div>
  )
}

const nextQuestion = state => state.questions[state.results.length];
const findStartedAt = state => state.startedAt[state.results.length];

const Game = props => {
    const initialState = {
        questions: generateQuestions(),
        currentAnswer: "",
        startedAt:[],
        results: []
    };
    const [state, setState] = useState(initialState);
    const inputRef=useRef(null);

    const processAnswer = () => {
        setState(submitAnswer);
        inputRef.current.focus();
    };



    if (props.started && state.results.length < state.questions.length) {
        const question = nextQuestion(state);
        if (!findStartedAt(state))
            return setState({
                ...state,
                startedAt: [
                    ...state.startedAt,
                    Date.now()
                ]
            });
        return <div>
            <Question question={question}/>
            <p>
                <input type="number" value={state.currentAnswer}
                       autoFocus={true}
                       pattern="\d*"
                       ref={inputRef}
                       onChange={e => setState({
                           ...state,
                           currentAnswer: parseInt(e.target.value, 10)
                       })}
                       onKeyPress={e => {
                           if (e.key === 'Enter') processAnswer();
                       }}
                       onLoad={() => inputRef.current.focus()}
                />
                <br/><button onClick={processAnswer}>Répondre</button>
            </p>
            <Results results={state.results}/>

        </div>;
    } else return <p><Results results={state.results}/></p>

};


const submitAnswer = state => {
    const responseTime = Date.now() - findStartedAt(state);
    const {operand1, operand2} = nextQuestion(state);
    if(state.currentAnswer === operand1 * operand2){
        return {
            ...state,
            currentAnswer:"",
            error: false,
            results:[
                ...state.results,
                {
                    correct: true,
                    responseTime
                }
            ]
        }
    } else {
        return {
            ...state,
            currentAnswer:"",
            error: true,
            results: [
                ...state.results,
                {
                    correct:false,
                    responseTime
                }
            ]
        }
    }

};

const Question = (props) => {
    const {question:{operand1,operand2}} = props;
    return <p>
        {operand1} * {operand2}
    </p>
};
const Results = props => {

    const Report = ({results}) => results.length === 10 ?
        <p>
            Vous avez {results.filter(({correct}) => correct).length} réponses justes et vous avez mis en moyenne &nbsp;
            {results.reduce((acc, {responseTime}, idx) => (acc*idx + responseTime) / (idx+1), 0)} ms pour répondre.
            
        </p> : <p/>;

    return Array.isArray(props.results) && props.results.length > 0 ?
        <div>
            <Report results={props.results}/>
        <table><tbody>
            {props.results.map((r, i) =>
                <tr key={`result${i}`}><td>{r.correct ? 'ok' : 'ko' }</td><td>{r.responseTime}</td></tr>
            )}
        </tbody></table></div> : <table/>;
};

const generateQuestions = () => {
    const questions = [];
    for (let i = 0; i < 10 ; i++) {
        questions.push({
            operand1: Math.floor(Math.random() * 8 + 2),
            operand2: Math.floor(Math.random() * 8 + 2)
        })
    }
    return questions;
};

export default App
