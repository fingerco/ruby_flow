import * as React from 'react'
import axios from 'axios'
import YAML from 'yaml'
import { v4 as uuidv4 } from 'uuid'
import Step from './Step'

export default function WorkflowEditor () {
  const [steps, setSteps] = React.useState({})
  const [runData, setRunData] = React.useState(null)

  const addStep = React.useCallback((evt) => {
    evt.preventDefault()

    const id = uuidv4()
    setSteps({...steps, [id]: {id: id}})
  }, [steps])

  const run = React.useCallback(() => {
    const workflow = {steps: Object.values(steps)}
    axios.post(
      'http://localhost:3000/runs',
      YAML.stringify(workflow),
      {headers: {'Content-Type' : 'text/plain'}}
    ).then((response) => {
      setRunData(response.data)
    })


  }, [steps])

  return (
    <div>
      {Object.values(steps).map((step) => (
        <Step
          key={step.id}
          step={step}
          onChange={(newStep) => setSteps({...steps, [step.id]: newStep})}
          runData={runData} />
      ))}

      <a href='#' onClick={addStep}>Add Step</a>

      <div className='run'>
        <button onClick={run}>Run All Steps</button>
      </div>

      <style jsx>{`
        .run button {
          margin-top: 2rem;
          font-size: 1.2em;
        }
      `}</style>
    </div>
  )
}
