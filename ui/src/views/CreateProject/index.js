import * as React from 'react'
import axios from 'axios'
import { useHistory } from 'react-router-dom'
import { API_URL } from '~/utils/consts'

export default function CreateProject () {
  const [name, setName] = React.useState('')
  const history = useHistory()

  const createProject = React.useCallback(() => {
    const slug = name.replace(/ /g, '-').toLowerCase()
    axios.post(`${API_URL}/projects/${slug}`, {name: name})
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
