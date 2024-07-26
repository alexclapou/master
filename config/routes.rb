Rails.application.routes.draw do
  devise_for :users, controllers: { omniauth_callbacks: "users/omniauth_callbacks" }

  resources :stories do
    get "preview", to: "stories#preview"
    put "publish", to: "stories#publish"
    resources :comments
  end

  get "search(/:q)", to: "search#index", as: :search
  get "search_stories(/:q)", to: "search#search_stories", as: :search_stories

  root "application#index"
end
