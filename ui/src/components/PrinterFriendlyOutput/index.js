import * as React from 'react'
import Step from './Step'

export default function PrinterFriendlyOutput ({ workflow, runData }) {
  return (
    <div>
      <h1>{workflow.name}</h1>

      <div className='workflow-editor'>
        <div className='steps'>
          {Object.values(workflow.steps).map((step) => (
            <Step
              key={step.id}
              step={step}
              runData={runData}
              steps={workflow.steps} />
          ))}
        </div>
      </div>

    </div>
  )
}
