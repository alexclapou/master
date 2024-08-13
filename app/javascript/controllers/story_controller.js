import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["dropdown", "button"];

  connect() {
    document.addEventListener("click", this.checkClickOutside.bind(this));
  }

  checkClickOutside(event) {
    if (!this.hasDropdownTarget) return;

    if (!this.element.contains(event.target) && !this.dropdownTarget.classList.contains("hidden")) {
      this.dropdownTarget.classList.add("hidden");
    }
  }

  show_options() {
    const hidden = this.dropdownTarget.classList.contains("hidden");
    const more_options = document.getElementsByClassName("more-dds");

    for (let i = 0; i < more_options.length; i++) {
      more_options[i].classList.add("hidden");
    }

    if (hidden) this.dropdownTarget.classList.toggle("hidden");
  }
}
