Rails.application.routes.draw do
  devise_for :users, controllers: { omniauth_callbacks: "users/omniauth_callbacks" }

  resources :stories do
    get "preview", to: "stories#preview"
    put "publish", to: "stories#publish"
  end

  get "search(/:q)", to: "search#index", as: :search
  
  root "application#index"
end
