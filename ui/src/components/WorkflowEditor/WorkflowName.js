import * as React from 'react'

export default function WorkflowName({ name, onChange, defaultEditing = false }) {
  const [origName] = React.useState(name)
  const [workflowName, setWorkflowName] = React.useState(name)
  const [editing, setEditing] = React.useState(defaultEditing)

  React.useEffect(() => {
    setWorkflowName(name)
  }, [name])

  return (
    <div className='meta'>
      {!editing && (
        <div className='content'>
          <h1>{workflowName}</h1>

          <span style={{marginLeft: '1em'}}>
            <a
              href='#'
              onClick={(evt) => { evt.preventDefault(); setEditing(true) }}>
              - Edit Name
            </a>
          </span>
        </div>
      )}

      {editing && (
        <div className='content'>
          <input
            type="text"
            placeholder="Workflow Name"
            value={workflowName}
            onChange={(evt) => onChange(evt.target.value)} />

          <span style={{marginLeft: '1em'}}>
            <button onClick={() => { onChange(workflowName); setEditing(false); }}>Change</button>
            <button onClick={() => { onChange(origName); setEditing(false); }}>Cancel</button>
          </span>
        </div>
      )}

      <style jsx>{`
        .content {
          display: flex;
          align-items: center;
        }

        .meta input {
          font-size: 2em;
          width: 20em;
        }
      `}</style>
    </div>
  )
}
