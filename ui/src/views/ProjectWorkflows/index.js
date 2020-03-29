import * as React from 'react'
import axios from 'axios'
import {
  Link,
  useParams
} from "react-router-dom"

export default function ProjectWorkflows () {
  const { projectSlug } = useParams()
  const [workflows, setWorkflows] = React.useState([])

  React.useEffect(() => {
    axios.get(`http://localhost:3000/projects/${projectSlug}/workflows`)
      .then((response) => setWorkflows(response.data.workflows))
  }, [])

  return (
    <div className='workflows'>
      <h1>Workflows</h1>

      {workflows.map((workflow) => (
        <Link key={workflow.path} to={`/projects/${projectSlug}/workflows/${workflow.path}`} className='workflow-link'>
          <div className='workflow'>
            {workflow.name}
          </div>
        </Link>
      ))}

      <Link to={`/projects/${projectSlug}/workflows/new`} className='workflow-link'>
        <div className='workflow'>
          Create new workflow...
        </div>
      </Link>

      <style jsx>{`
        .workflows {
          margin: 1em;
        }

        .workflows :global(.workflow-link) {
          text-decoration-color: #4702ef;
        }

        .workflow {
          font-size: 1.5em;
          padding: 1em;
          background-color: white;
          border: 1px solid #cecece;
          border-radius: 5px;
          color: black;
        }

        .workflow:hover {
          background-color: #fcfcfc;
          cursor: pointer;
        }
      `}</style>
    </div>
  )
}
