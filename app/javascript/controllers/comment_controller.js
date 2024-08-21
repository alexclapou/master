import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["update", "cancel", "edit", "button", "input", "dropdown"];

  connect() {
    document.addEventListener("click", this.checkClickOutside.bind(this));
  }
  disconnect() {}

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

  edit_comment() {
    const more_options = document.getElementsByClassName("more-dd");
    const comment_inputs = document.getElementsByClassName("edit-input");
    const comment_elements = document.getElementsByClassName("comment-display");

    for (let i = 0; i < more_options.length; i++) {
      more_options[i].classList.add("hidden");
      comment_elements[i].classList.remove("hidden");
      comment_inputs[i].classList.add("hidden");
    }

    const closestComment = this.editTarget.closest(".comm").querySelector(".comment-display");
    const closestCommentUpdate = this.editTarget.closest(".comm").querySelector(".edit-input");
    closestComment.classList.add("hidden");
    closestCommentUpdate.classList.remove("hidden");

    const newComment = this.editTarget.closest(".comm").querySelector(".comment-display").innerHTML;
    console.log(newComment);
    closestCommentUpdate.querySelector("input").value = newComment;
  }

  cancel_update() {
    const comment_inputs = document.getElementsByClassName("edit-input");
    const comment_elements = document.getElementsByClassName("comment-display");

    for (let i = 0; i < comment_elements.length; i++) {
      comment_elements[i].classList.remove("hidden");
      comment_inputs[i].classList.add("hidden");
    }
  }
  update_comment() {
    const closestComment = this.updateTarget.closest(".comm").querySelector(".edit-input");
    const closestComm = this.updateTarget.closest(".comm").querySelector(".comment-display");
    const closestInput = closestComment.querySelector("input");
    const newComment = closestInput.value;
    if (newComment != "") {
      const closestLink = closestComment.querySelector("a");
      closestLink.href = closestLink.href + `?body=${newComment}`;
      closestComm.innerHTML = newComment;
    }
    const comment_inputs = document.getElementsByClassName("edit-input");
    const comment_elements = document.getElementsByClassName("comment-display");

    for (let i = 0; i < comment_elements.length; i++) {
      comment_elements[i].classList.remove("hidden");
      comment_inputs[i].classList.add("hidden");
    }
  }
}
