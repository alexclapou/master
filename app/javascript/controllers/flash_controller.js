import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["message"];

  connect() {
    this.timeout = setTimeout(this.closeFlash, 2500);
  }

  disconnect() {
    clearTimeout(this.timeout);
  }

  closeFlash = () => {
    this.messageTarget.classList.add("hidden");
  };
}
