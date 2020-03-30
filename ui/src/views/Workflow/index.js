import * as React from 'react'
import { useParams } from "react-router-dom"
import axios from 'axios'
import YAML from 'yaml'
import WorkflowEditor from '~/components/WorkflowEditor'

export default function Workflow () {
  const { projectSlug, workflowSlug } = useParams()
  const [workflow, setWorkflow] = React.useState({})

  React.useEffect(() => {
    if (!workflowSlug) return

    axios.get(`http://localhost:3000/projects/${projectSlug}/workflows/${workflowSlug}`)
      .then((response) => setWorkflow(YAML.parse(response.data.workflow)))
  }, [projectSlug, workflowSlug])

  return (
    <WorkflowEditor
      projectSlug={projectSlug}
      workflowSlug={workflowSlug}
      name={workflow.name || ''}
      workflow={workflow} />
  )
}
