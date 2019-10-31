Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  get '/sign_in', to: 'sessions#new'
  get '/users/sign_in', to: redirect('/sign_in')
  post '/sign_in', to: 'sessions#create'

  resources :questions, only: [:create, :destroy] do
    member do
      post :resolve
      post :read
      post :vote
    end
  end

  resources :comments, only: [:create, :update, :destroy] do
    member do
      post :vote
    end
  end

  post 'api', to: 'api#show'

  get '*path', to: 'spa#show'
  root to: 'spa#show'
end
