import * as React from 'react'
import ReactDOMServer from "react-dom/server"
import axios from 'axios'
import YAML from 'yaml'
import download from 'downloadjs'
import { v4 as uuidv4 } from 'uuid'
import Step from './Step'
import WorkflowName from './WorkflowName'
import PrinterFriendlyOutput from '~/components/PrinterFriendlyOutput'

const formatSteps = (steps) => {
  if (!steps) return {}

  let formatted = {}
  steps.forEach((step) => formatted[step.id] = step)
  return formatted
}

export default function WorkflowEditor ({ projectSlug, workflowSlug, name = '', workflow = {} }) {
  const [workflowName, setWorkflowName] = React.useState(name)
  const [steps, setSteps] = React.useState(formatSteps(workflow.steps))
  const [runData, setRunData] = React.useState(null)

  React.useEffect(() => {
    setWorkflowName(name)
  }, [name])

  React.useEffect(() => {
    setWorkflowName(workflow.name)
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

  const runStep = React.useCallback((stepId, ctx) => {
    const workflow = {steps: Object.values(steps)}

    axios.post(`http://localhost:3000/runs/step/${stepId}`, {context: ctx, workflow: YAML.stringify(workflow)})
      .then((response) => {
        const currRunData = runData || {}
        const contexts = currRunData.contexts || {}
        const outputs = currRunData.outputs || {}
        const timings = currRunData.timings || {}

        setRunData({
          ...currRunData,
          contexts: {...contexts, [stepId]: response.data.contexts[stepId]},
          outputs: {...outputs, [stepId]: response.data.outputs[stepId]},
          timings: {...timings, [stepId]: response.data.timings[stepId]},
        })
      })
  }, [steps, runData])

  const save = React.useCallback(() => {
    const workflow = {name: workflowName, steps: Object.values(steps)}
    const slug = workflowSlug || workflowName.replace(' ', '-').toLowerCase()

    axios.post(`http://localhost:3000/projects/${projectSlug}/workflows/${slug}`, {
      name: workflowName,
      workflow: YAML.stringify(workflow)
    })
  }, [workflow, workflowName, steps])

  const printOutput = React.useCallback(() => {
    const workflow = {name: workflowName, steps: Object.values(steps)}

    const app = ReactDOMServer.renderToString(
      <PrinterFriendlyOutput
        workflow={workflow}
        runData={runData} />
    )

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${workflowName}</title>
        </head>

        <body>
          ${app}
        </body>
    </html>`

    download(html, "output.html", "text/html")

  }, [workflowName, steps, runData])

  return (
    <div className='workflow-editor'>
      <WorkflowName name={workflowName} onChange={setWorkflowName} />

      <div className='steps'>
        {Object.values(steps).map((step) => (
          <Step
            key={step.id}
            step={step}
            onChange={(newStep) => setSteps({...steps, [step.id]: newStep})}
            runData={runData}
            steps={steps}
            runStep={runStep} />
        ))}

        <div className='add'>
          <a href='#' onClick={addStep}>Add Step</a>
        </div>
      </div>

      <div className='run'>
        <button onClick={run}>Run All Steps</button>
        <button onClick={save}>Save Workflow</button>

        <button onClick={printOutput}>
          Download HTML
        </button>
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
