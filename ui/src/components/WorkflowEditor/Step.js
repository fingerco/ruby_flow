import * as React from 'react'
import AceEditor from "react-ace"

import "ace-builds/src-noconflict/mode-ruby"
import "ace-builds/src-noconflict/theme-monokai"

export default function Step ({ step, onChange, runData, steps, runStep }) {
  const [name, setName] = React.useState(step['name'] || '')
  const [code, setCode] = React.useState(step['code'] || '')

  React.useEffect(() => {
    onChange({...step, name: name, code: code})
  }, [name, code])

  const myIdx = Object.keys(steps).indexOf(step.id)
  let currContext = {}
  Object.keys(steps).forEach((stepId, i) => {
    if (!runData || i > myIdx) return
    if (runData.contexts[stepId]) currContext = runData.contexts[stepId]
  })

  return (
    <div className='step'>

      <div className='inputs'>
        <div className='name'>
          <input type="text" value={name} onChange={(evt) => setName(evt.target.value)} placeholder='Step Name' />
        </div>

        <div className='code'>
          <AceEditor
            mode="ruby"
            theme="monokai"
            tabSize={2}
            value={code}
            onChange={setCode}
            name={`step_code_${step.id}`}
            editorProps={{ $blockScrolling: true }}
            width='60em'
          />
        </div>

        <button onClick={() => runStep(step.id, currContext)}>Run Step</button>
      </div>

      <div className='run-data'>
        {runData && runData.outputs[step.id] && (
          <textarea value={runData.outputs[step.id] || ''} readOnly />
        )}
      </div>

      <style jsx>{`
        .step {
          margin-bottom: 1em;
          border-botom: 1px solid #cecece;
          display: flex;

          width: 100%;
        }

        .outputs {

        }

        .name {
          margin-bottom: 1em;
        }

        .name input {
          width: 20rem;
          font-size: 1.3em;
        }

        .run-data {
          flex: 1;
          min-height: 5em;
          margin-left: 1em;
          margin-right: 1em;
        }

        .run-data textarea {
          width: 100%;
          height: 100%;
        }
      `}</style>
    </div>
  )
}
