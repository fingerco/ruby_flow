import * as React from 'react'
import axios from 'axios'
import { useHistory } from 'react-router-dom'

export default function CreateProject () {
  const [name, setName] = React.useState('')
  const history = useHistory()

  const createProject = React.useCallback(() => {
    const slug = name.replace(' ', '-').toLowerCase()
    axios.post(`http://localhost:3000/projects/${slug}`, {name: name})
      .then(() => history.push(`/projects/${slug}`))
  }, [name])

  return (
    <div>
      <input
        type="text"
        value={name}
        onChange={(evt) => setName(evt.target.value)}
        placeholder="New Project Name" />

      <button onClick={createProject}>Create Project</button>
    </div>
  )
}
