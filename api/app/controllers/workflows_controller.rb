class WorkflowsController < ApplicationController
  STORAGE_TYPE = WorkflowStorage::FileStorage

  def index
    render json: {
      workflows: storage.list_workflows(workflows_root)
    }
  end

  def show
    case params[:do_action]
    when 'list'
      render json: {
        workflows: storage.list_workflows(File.join(workflows_root, params[:path]))
      }

    else
      render json: {
        workflow: storage.get_workflow(File.join(workflows_root, params[:path]))
      }

    end
  end

  def create
    storage.save_workflow(File.join(workflows_root, params[:path]), params.require(:workflow))

    head :created
  end

  private

  def workflows_root
    File.join('projects', params[:project_slug], 'workflows')
  end

  def storage
    @storage ||= STORAGE_TYPE.new('yaml')
  end

end
