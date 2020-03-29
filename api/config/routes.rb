Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  post 'runs' => 'runs#create'
  post 'runs/step/:step_id' => 'runs#run_step'

  get 'projects' => 'projects#index'
  get 'projects/:path' => 'projects#show'
  post 'projects/:path' => 'projects#create'

  get 'projects/:project_slug/workflows' => 'workflows#index'
  get 'projects/:project_slug/workflows/:path' => 'workflows#show'
  post 'projects/:project_slug/workflows/:path' => 'workflows#create'
end
