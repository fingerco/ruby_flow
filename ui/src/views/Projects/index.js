import * as React from 'react'
import axios from 'axios'
import {
  Link
} from "react-router-dom"

export default function Projects () {
  const [projects, setProjects] = React.useState([])

  React.useEffect(() => {
    axios.get(`http://localhost:3000/projects/`)
      .then((response) => setProjects(response.data.projects))
  }, [])

  return (
    <div className='projects'>
      <h1>Projects</h1>

      {projects.map((project) => (
        <Link key={project.name} to={`/projects/${project.path}`} className='project-link'>
          <div className='project'>
            {project.name}
          </div>
        </Link>
      ))}

      <Link to={`/projects/new`} className='project-link'>
        <div className='project'>
          Create new project...
        </div>
      </Link>

      <style jsx>{`
        .projects {
          margin: 1em;
        }

        .projects :global(.project-link) {
          text-decoration-color: #ef02b1;
        }

        .project {
          font-size: 1.5em;
          padding: 1em;
          background-color: white;
          border: 1px solid #cecece;
          border-radius: 5px;
          color: black;
        }

        .project:hover {
          background-color: #fcfcfc;
          cursor: pointer;
        }
      `}</style>
    </div>
  )
}
