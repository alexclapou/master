import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["title", "title_length"]

  check_limit() {
    this.titleTarget.rows = 1
    const length = this.titleTarget.value.length
    let increase_height =
      this.titleTarget.clientHeight < this.titleTarget.scrollHeight

    while (increase_height) {
      this.titleTarget.rows++
      increase_height =
        this.titleTarget.clientHeight < this.titleTarget.scrollHeight
    }

    this.titleTarget.rows = Math.max(1, this.titleTarget.rows - 1)
    increase_height =
      this.titleTarget.clientHeight < this.titleTarget.scrollHeight
    if (increase_height) this.titleTarget.rows++

    this.title_lengthTarget.innerHTML = length
  }
}
