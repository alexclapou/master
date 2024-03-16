import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["button", "dropdown"]

  toggle_dropdown(event) {
    const button_clicked = this.buttonTarget.contains(event.target)
    if (button_clicked) this.dropdownTarget.classList.toggle("hidden")
  }

  close_dropdown(event) {
    const button_clicked = this.buttonTarget.contains(event.target)
    if (button_clicked && event.type == "click") return

    this.dropdownTarget.classList.add("hidden")
    this.buttonTarget.blur()
  }
}
