import * as React from 'react'
import axios from 'axios'
import YAML from 'yaml'
import { v4 as uuidv4 } from 'uuid'
import Step from './Step'

const formatSteps = (steps) => {
  if (!steps) return {}

  let formatted = {}
  steps.forEach((step) => formatted[step.id] = step)
  return formatted
}

export default function WorkflowEditor ({ dir = 'shared', name = '', workflow = {} }) {
  const [workflowPath, setWorkflowPath] = React.useState(name)
  const [steps, setSteps] = React.useState(formatSteps(workflow.steps))
  const [runData, setRunData] = React.useState(null)

  React.useEffect(() => {
    setWorkflowPath(name)
  }, [name])

  React.useEffect(() => {
    setSteps(formatSteps(workflow.steps))
  }, [workflow])

  const addStep = React.useCallback((evt) => {
    evt.preventDefault()

    const id = uuidv4()
    setSteps({...steps, [id]: {id: id}})
  }, [steps])

  const run = React.useCallback(() => {
    const workflow = {steps: Object.values(steps)}
    axios.post('http://localhost:3000/runs', {workflow: YAML.stringify(workflow)})
      .then((response) => setRunData(response.data))


  }, [steps])

  const save = React.useCallback(() => {
    const workflow = {steps: Object.values(steps)}

    axios.post(`http://localhost:3000/workflows/${dir}/${name}`, {
      workflow: YAML.stringify(workflow)
    })
  }, [steps])

  return (
    <div>
      <div className='meta'>
        <input type="text" value={workflowPath} onChange={(evt) => setWorkflowPath(evt.target.value)} />
      </div>

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
        <button onClick={save}>Save Workflow</button>
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
