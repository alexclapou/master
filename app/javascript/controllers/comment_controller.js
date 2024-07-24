import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["input"];

  clear_input() {
    this.inputTarget.value = "";
  }
}
