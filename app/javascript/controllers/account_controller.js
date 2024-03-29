import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["button", "dropdown"];

  connect() {
    // these need to be removed and moved to a story_controller
    // document
    //   .querySelector(".trix-content")
    //   .querySelectorAll("a")
    //   .forEach(function (link) {
    //     console.log(link);
    //     if (link.host !== window.location.host) {
    //       link.target = "_blank";
    //     }
    //   });
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
