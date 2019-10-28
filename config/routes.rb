Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  get '/sign_in', to: 'sessions#new'
  get '/users/sign_in', to: redirect('/sign_in')
  post '/sign_in', to: 'sessions#create'

  resources :questions, except: [:edit, :update] do
    member do
      post :resolve
      post :read
    end
  end

  resources :comments, only: [:create, :destroy]

  get '*path', to: 'spa#show'
end
