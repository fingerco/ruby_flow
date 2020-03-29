Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  post 'runs' => 'runs#create'

  get 'workflows' => 'workflows#index'
  get 'workflows/:path' => 'workflows#show', :constraints => {:path => /.*/}
  post 'workflows/:path' => 'workflows#create', :constraints => {:path => /.*/}
end
