import React from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import YAML from 'yaml'
import WorkflowEditor from '~/components/WorkflowEditor'

export default function Project ({ }) {
  const { path } = useParams()
  const [workflows, setWorkflows] = React.useState([])
  const [selectedWorkflow, setSelectedWorkflow] = React.useState(null)
  const [workflowData, setWorkflowData] = React.useState({})

  React.useEffect(() => {
    axios.get(`http://localhost:3000/projects/${path}/workflows?do_action=list`)
      .then((response) => setWorkflows(response.data.workflows))
  }, [path])

  React.useEffect(() => {
    if (!path || !selectedWorkflow) return

    axios.get(`http://localhost:3000/projects/${path}/workflows/${selectedWorkflow}`)
      .then((response) => setWorkflowData(YAML.parse(response.data.workflow)))
  }, [path, selectedWorkflow])

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

      <WorkflowEditor projectSlug={path} name={selectedWorkflow || ''} workflow={workflowData} />
    </div>
  );
}
