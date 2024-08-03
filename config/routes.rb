Rails.application.routes.draw do
  devise_for :users, controllers: { omniauth_callbacks: "users/omniauth_callbacks" }

  resources :stories do
    get "preview", to: "stories#preview"
    put "publish", to: "stories#publish"
    resources :comments
    resource :like, module: :stories
  end

  get "search(/:q)", to: "search#index", as: :search
  get "search_stories(/:q)", to: "search#search_stories", as: :search_stories
  get "search_users(/:q)", to: "search#search_users", as: :search_users
  get "search_tags(/:q)", to: "search#search_tags", as: :search_tags

  root "application#index"
end
