Rails.application.routes.draw do
  devise_for :users, controllers: { omniauth_callbacks: "users/omniauth_callbacks" }

  resources :stories do
    get "preview", to: "stories#preview"
  end

  root "application#index"
end
