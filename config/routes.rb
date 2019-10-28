Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  get '/sign_in', to: 'sessions#new'
  get '/users/sign_in', to: redirect('/sign_in')
  post '/sign_in', to: 'sessions#create'
end
