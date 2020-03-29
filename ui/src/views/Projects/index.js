import * as React from 'react'
import axios from 'axios'
import {
  Link
} from "react-router-dom"

export default function Projects () {
  const [projects, setProjects] = React.useState([])
  const [newProjectName, setNewProjectName] = React.useState('')

  React.useEffect(() => {
    axios.get(`http://localhost:3000/projects/`)
      .then((response) => setProjects(response.data.projects))
  }, [])

  const createProject = React.useCallback(() => {
    axios.post(`http://localhost:3000/projects/${newProjectName.replace(' ', '-').toLowerCase()}`, {name: newProjectName})

  }, [newProjectName])

  return (
    <div>
      {projects.map((project) => (
        <div key={project.name}>
          <Link to={`/projects/${project.path}`}>{project.name}</Link>
        </div>
      ))}

      <div>
        <input
          type="text"
          value={newProjectName}
          onChange={(evt) => setNewProjectName(evt.target.value)}
          placeholder="New Project Name" />

        <button onClick={createProject}>Create Project</button>
      </div>
    </div>
  )
}
