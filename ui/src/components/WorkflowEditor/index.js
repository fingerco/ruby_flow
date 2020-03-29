import * as React from 'react'
import axios from 'axios'
import YAML from 'yaml'
import { v4 as uuidv4 } from 'uuid'
import Step from './Step'
import WorkflowName from './WorkflowName'

const formatSteps = (steps) => {
  if (!steps) return {}

  let formatted = {}
  steps.forEach((step) => formatted[step.id] = step)
  return formatted
}

export default function WorkflowEditor ({ projectSlug, name = '', workflow = {} }) {
  const [workflowName, setWorkflowName] = React.useState(name)
  const [steps, setSteps] = React.useState(formatSteps(workflow.steps))
  const [runData, setRunData] = React.useState(null)

  React.useEffect(() => {
    setWorkflowName(name)
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
    const workflow = {name: workflowName, steps: Object.values(steps)}
    const workflowSlug = workflowName.replace(' ', '-').toLowerCase()

    axios.post(`http://localhost:3000/projects/${projectSlug}/workflows/${workflowSlug}`, {
      name: workflowName,
      workflow: YAML.stringify(workflow)
    })
  }, [steps])

  return (
    <div className='workflow-editor'>
      <WorkflowName name={workflowName} onChange={setWorkflowName} />

      <div className='steps'>
        {Object.values(steps).map((step) => (
          <Step
            key={step.id}
            step={step}
            onChange={(newStep) => setSteps({...steps, [step.id]: newStep})}
            runData={runData} />
        ))}

        <div className='add'>
          <a href='#' onClick={addStep}>Add Step</a>
        </div>
      </div>

      <div className='run'>
        <button onClick={run}>Run All Steps</button>
        <button onClick={save}>Save Workflow</button>
      </div>

      <style jsx>{`
        .workflow-editor {
          margin-left: 3em;
        }

        .steps {
          border-top: 1px solid #cecece;
          border-bottom: 1px solid #cecece;
          padding-top: 1em;
          padding-bottom: 1em;
          margin-top: 1em;
          margin-bottom: 1em;
        }

        .steps .add {
          margin-top: 1em;
        }

        .run button {
          margin-top: 2rem;
          font-size: 1.2em;
        }
      `}</style>
    </div>
  )
}
