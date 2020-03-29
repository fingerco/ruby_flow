import React from 'react'
import axios from 'axios'
import './App.css'
import WorkflowEditor from '~/components/WorkflowEditor'
import YAML from 'yaml'

export default function App() {
  const workflowDir = 'shared'
  const [workflows, setWorkflows] = React.useState([])
  const [selectedWorkflow, setSelectedWorkflow] = React.useState(null)
  const [workflowData, setWorkflowData] = React.useState({})

  React.useEffect(() => {
    axios.get(`http://localhost:3000/workflows/${workflowDir}?do_action=list`)
      .then((response) => setWorkflows(response.data.workflows))
  }, [workflowDir])

  React.useEffect(() => {
    if (!workflowDir || !selectedWorkflow) return

    axios.get(`http://localhost:3000/workflows/${workflowDir}/${selectedWorkflow}`)
      .then((response) => setWorkflowData(YAML.parse(response.data.workflow)))
  }, [workflowDir, selectedWorkflow])

  return (
    <div className="App">
      <div className='workflows'>
        {workflows.map((workflow) => (
          <a
            key={workflow}
            href='#'
            onClick={(evt) => { evt.preventDefault(); setSelectedWorkflow(workflow)}}>{workflow}</a>
        ))}
      </div>

      <WorkflowEditor dir={workflowDir} name={selectedWorkflow || ''} workflow={workflowData} />
    </div>
  );
}
