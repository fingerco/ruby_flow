class RunsController < ApplicationController
  def create
    runner = WorkflowRunner::Runner.new(params.require(:workflow))
    runner.run

    render json: {
      outputs: runner.outputs,
      contexts: runner.contexts
    }

  end
end
