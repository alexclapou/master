import { Controller } from "@hotwired/stimulus";
import hljs from "highlight.js";

export default class extends Controller {
  static targets = ["button", "dropdown"];

  connect() {
    hljs.configure({
      ignoreUnescapedHTML: true,
    });

    document.querySelectorAll("pre").forEach((el) => {
      hljs.highlightElement(el);
    });
  }

  toggle_dropdown(event) {
    const button_clicked = this.buttonTarget.contains(event.target);

    if (button_clicked) this.dropdownTarget.classList.toggle("hidden");
  }

  close_dropdown(event) {
    const button_clicked = this.buttonTarget.contains(event.target);
    const dropdown_clicked = this.dropdownTarget.contains(event.target);

    if (dropdown_clicked || (button_clicked && event.type == "click")) return;

    this.dropdownTarget.classList.add("hidden");
    this.buttonTarget.blur();
  }
}
