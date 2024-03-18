import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["title", "title_length"];

  connect() {
    let lastInputMethod = null;

    document.querySelector("trix-editor").addEventListener("mousedown", () => {
      lastInputMethod = "mouse";
    });

    document.querySelector("trix-editor").addEventListener("keydown", () => {
      lastInputMethod = "keyboard";
    });

    document.addEventListener("mouseup", () => {
      const editor_clicked = document.activeElement.id == "story_content";
      if (!editor_clicked) return;

      const selectedText = this.getSelectedText();
      if (selectedText.trim().length > 0) this.handleSelectionChange();
    });

    document.addEventListener("selectionchange", (e) => {
      console.log(this.getSelectedText());
      const editor_clicked = document.activeElement.id == "story_content";
      if (!editor_clicked || lastInputMethod == "mouse") {
        this.hideTextOptions();
        return;
      }

      // const popup = document.getElementById("text-options"); don't remember why i added this; might help later
      if (editor_clicked) this.handleSelectionChange();
    });
  }

  handleSelectionChange() {
    const selectedText = this.getSelectedText();

    if (document.activeElement.id == "text-options") {
      return;
    }

    if (selectedText.trim().length > 0) {
      this.showTextOptions();
    } else {
      this.hideTextOptions();
    }
  }

  showTextOptions() {
    this.hideTextOptions();

    this.selectionDiv = document.createElement("div");

    this.selectionDiv.setAttribute("id", "text-options");
    this.selectionDiv.setAttribute("tabindex", "0");
    this.selectionDiv.style.position = "absolute";
    this.selectionDiv.style.backgroundColor = "rgba(255, 255, 255)";
    this.selectionDiv.style.border = "1px solid black";
    this.selectionDiv.style.padding = "4px";
    this.selectionDiv.textContent = "Hello";
    this.selectionDiv.style.userSelect = "none";

    // Get the selection range
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      // Calculate the middle position of the selected text
      const middleX = rect.left + rect.width / 2;

      // Set the position of the div to be in the middle of the selected text
      this.selectionDiv.style.top = rect.top - 40 + "px";
      this.selectionDiv.style.left = middleX + "px";

      document.body.appendChild(this.selectionDiv);
    }
  }

  hideTextOptions() {
    if (this.selectionDiv && this.selectionDiv.parentNode) {
      this.selectionDiv.parentNode.removeChild(this.selectionDiv);
      this.selectionDiv = null;
    }
  }

  getSelectedText() {
    if (window.getSelection) {
      return window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
      return document.selection.createRange().text;
    }
    return "";
  }

  check_limit() {
    // set rows to 1 => we calculate them after
    this.titleTarget.rows = 1;

    // resize it as much as we need
    while (this.should_resize(this.titleTarget)) {
      this.resize(this.titleTarget);
    }

    // there is a bug, where a row is added even if we are not at the end of line (1/2 charcters left to fill the row)
    // so in this case, just remove a row (the possible new row added - bug) and resize if needed after
    this.titleTarget.rows = Math.max(1, this.titleTarget.rows - 1);

    if (this.should_resize(this.titleTarget)) {
      this.resize(this.titleTarget);
    }

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
}
