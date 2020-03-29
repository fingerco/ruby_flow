class ProjectsController < ApplicationController
  PROJECTS_DIR = 'projects'
  STORAGE_TYPE = WorkflowStorage::FileStorage

  def index
    render json: {
      projects: storage.list_projects(params[:path] || PROJECTS_DIR)
    }
  end

  def create
    storage.create_project(params.require(:path), params.require(:name))
    head :created
  end

  private

  def storage
    @storage ||= STORAGE_TYPE.new('yaml')
  end

end
