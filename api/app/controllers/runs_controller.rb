class RunsController < ApplicationController
  def create
    runner = WorkflowRunner::Runner.new(request.raw_post)
    runner.run

    render json: {
      outputs: runner.outputs,
      contexts: runner.contexts
    }

  end
end
