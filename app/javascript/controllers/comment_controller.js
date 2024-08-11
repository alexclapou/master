import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["button", "input", "dropdown"];

  connect() {
    document.addEventListener("click", this.checkClickOutside.bind(this));
  }

  clear_input() {
    this.inputTarget.value = "";
  }

  checkClickOutside(event) {
    if (!this.hasDropdownTarget) return;

    if (!this.element.contains(event.target) && !this.dropdownTarget.classList.contains("hidden")) {
      this.dropdownTarget.classList.add("hidden");
    }
  }

  show_options() {
    const hidden = this.dropdownTarget.classList.contains("hidden");
    const more_options = document.getElementsByClassName("more-dd");

    for (let i = 0; i < more_options.length; i++) {
      more_options[i].classList.add("hidden");
    }

    if (hidden) this.dropdownTarget.classList.toggle("hidden");
  }
}
