import * as React from 'react'
import AceEditor from "react-ace"

import SyntaxHighlighter from 'react-syntax-highlighter'
import { monokai } from 'react-syntax-highlighter/dist/esm/styles/hljs'

export default function Step ({ step, onChange, runData, steps, runStep }) {
  const myIdx = Object.keys(steps).indexOf(step.id)
  let currContext = {}
  Object.keys(steps).forEach((stepId, i) => {
    if (!runData || i > myIdx) return
    if (runData.contexts[stepId]) currContext = runData.contexts[stepId]
  })

  return (
    <div className='step'>
      <style type="text/css">{`
        .step pre {
          margin: 0;
        }
      `}</style>

      <div className='name'>
        <h2>{step.name}</h2>
      </div>

      <div className='code-and-outputs' style={{display: 'flex'}}>
        <div className='inputs' style={{height: '100%', boxSizing: 'border-box', minWidth: '40em', maxWidth: '50%'}}>
          <div className='code'>
            <SyntaxHighlighter language="ruby" style={monokai}>
              {step.code}
            </SyntaxHighlighter>
          </div>
        </div>

        <div className='run-data' style={{flex: 1}}>
          {runData && runData.outputs[step.id] && (
            <textarea value={runData.outputs[step.id] || ''} style={{width: '100%', height: '100%', marginLeft: '1em', boxSizing: 'border-box'}} readOnly />
          )}
        </div>
      </div>

    </div>
  )
}
