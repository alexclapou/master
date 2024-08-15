import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["dropdown", "button"];

  connect() {
    console.log("connect?");
    document.addEventListener("click", this.checkClickOutside.bind(this));
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const commentId = urlParams.get("jump_to");
    if (!commentId) return;

    const id = `comment_comment_${commentId}`;
    // Wait for the DOM to be fully loaded and stable before scrolling
    setTimeout(() => {
      const comment = document.getElementById(id);
      console.log(comment);
      if (comment) {
        console.log(comment);

        // Apply highlight class and scroll into view
        comment.classList.add("highlighted-comment");
        comment.scrollIntoView({ behavior: "smooth", block: "center" });

        // Remove the highlight class after 2 seconds
        setTimeout(() => {
          comment.classList.remove("highlighted-comment");
        }, 2000);
      } else {
        console.error(`Element with ID ${id} not found`);
      }
    }, 0); // Delay of 0 ms to ensure execution after other synchronous tasks
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
