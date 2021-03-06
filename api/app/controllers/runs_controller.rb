class RunsController < ApplicationController
  def create
    runner = WorkflowRunner::Runner.new(params.require(:workflow))
    runner.run

    render json: {
      outputs: runner.outputs,
      errors: runner.errors,
      contexts: runner.contexts,
      timings: runner.timings,
      allocations: runner.allocations
    }

  end

  def run_step
    runner = WorkflowRunner::Runner.new(params.require(:workflow))
    runner.run_step(id: params.require(:step_id), context: params[:context] || {})

    render json: {
      outputs: runner.outputs,
      errors: runner.errors,
      contexts: runner.contexts,
      timings: runner.timings,
      allocations: runner.allocations
    }

  end
end
