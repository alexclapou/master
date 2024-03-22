import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["title", "tags", "title_length"];

  add_tags(event) {
    console.log(event.key);
  }

  check_limit() {
    // set rows to 1 => we calculate them after
    this.titleTarget.rows = 1;

    // resize it as much as we need
    this.resize_max(this.titleTarget);

    // there is a bug, where a row is added even if we are not at the end of line (1/2 charcters left to fill the row)
    // so in this case, just remove a row (the possible new row added - bug) and resize if needed after
    this.titleTarget.rows = Math.max(1, this.titleTarget.rows - 1);

    this.resize_if_need(this.titleTarget);

    this.title_lengthTarget.innerHTML = this.titleTarget.value.length;
  }

  should_resize(textarea) {
    return textarea.clientHeight < textarea.scrollHeight;
  }

  resize(textarea) {
    if (this.should_resize(textarea)) {
      textarea.rows++;
    }
  }

  resize_max(textarea) {
    while (this.should_resize(textarea)) {
      this.resize(textarea);
    }
  }

  resize_if_need(textarea) {
    if (this.should_resize(textarea)) {
      this.resize(textarea);
    }
  }
}
