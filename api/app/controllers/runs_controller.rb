class RunsController < ApplicationController
  def create
    runner = WorkflowRunner::Runner.new(request.raw_post)
    runner.run

  end
end
