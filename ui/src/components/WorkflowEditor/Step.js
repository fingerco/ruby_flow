import * as React from 'react'
import AceEditor from "react-ace"
import { RadialBarChart, RadialBar, Legend } from 'recharts';

import "ace-builds/src-noconflict/mode-ruby"
import "ace-builds/src-noconflict/theme-monokai"

export default function Step ({ step, onChange, runData, steps, runStep }) {
  const [name, setName] = React.useState(step.name || '')
  const [code, setCode] = React.useState(step.code || '')

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

      <div className='name'>
        <input type="text" value={name} onChange={(evt) => setName(evt.target.value)} placeholder='Step Name' />
      </div>

      <div className='code-and-output'>
        <div className='inputs'>
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
        </div>

        <div className='run-data'>
          {runData && (runData.errors[step.id] || runData.outputs[step.id]) && (
            <textarea value={runData.errors[step.id] || runData.outputs[step.id] || ''} readOnly />
          )}
        </div>
      </div>

      <button onClick={() => runStep(step.id, currContext)}>Run Step</button>
      <div className='timings'>
        {runData && runData.timings && runData.timings[step.id] && Object.keys(runData.timings[step.id]).map((name) => {
          const totalTime = runData.timings[step.id]['step_total'].real
          const currTime = runData.timings[step.id][name].real

          return (
            <div>{currTime.toFixed(2)} seconds ({(currTime / totalTime).toFixed(2) * 100}%) - {name}</div>
          )
        })}
      </div>

      <style jsx>{`
        .step {
          border-bottom: 1px solid #cecece;
          margin-bottom: 0.5em;
          padding-bottom: 0.5em;
        }
        .code-and-output {
          margin-bottom: 1em;
          display: flex;

          width: 100%;
        }

        .code-and-output :global(pre) {
          margin: 0;
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
          box-sizing: border-box;
        }

        .timings {
          margin-top: 1em;
        }
      `}</style>
    </div>
  )
}
