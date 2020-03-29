class WorkflowsController < ApplicationController
  DEFAULT_DIR = 'shared'
  STORAGE_TYPE = WorkflowStorage::FileStorage

  def index
    render json: {
      workflows: storage.list_workflows(params[:path] || DEFAULT_DIR)
    }

    head :ok
  end

  def show
    case params[:do_action]
    when 'list'
      render json: {
        workflows: storage.list_workflows(params[:path])
      }

    else
      render json: {
        workflow: storage.get_workflow(params[:path])
      }

    end
  end

  def create
    storage.save_workflow(params.require(:path), params.require(:workflow))

    head :created
  end

  private

  def storage
    @storage ||= STORAGE_TYPE.new('yaml')
  end

end
