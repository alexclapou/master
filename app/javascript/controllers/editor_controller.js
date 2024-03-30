import { Controller } from "@hotwired/stimulus";
import { debounce } from "../custom/helpers";

const nonPrintableKeys = ["Shift", "Meta", "Control", "Alt", "CapsLock", "Tab", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12", "Escape", "Home", "End", "PageUp", "PageDown", "Insert", "Delete"];

export default class extends Controller {
  static targets = ["preview", "title", "title_length"];

  disconnect() {
    const button = document.querySelector("main");
    button.replaceWith(button.cloneNode(true));
  }

  enable_preview() {
    const is_disabled = this.previewTarget.disabled;
    if (is_disabled) {
      this.previewTarget.disabled = false;

      const text = this.previewTarget.nextElementSibling.nextElementSibling;
      text.classList.add("text-secondary");
    }
  }

  preview() {
    const should_preview = this.previewTarget.checked;
    const story_content = document.getElementById("story-content");
    const preview = document.getElementById("preview");

    if (should_preview) {
      story_content.style.display = "none";
      preview.style.display = "block";
    } else {
      story_content.style.display = "block";
      preview.style.display = "none";
      return;
    }

    const path = window.location.pathname.substring(0, window.location.pathname.lastIndexOf("/")) + "/preview";
    preview.src = path;
    preview.reload();
  }

  connect() {
    if (document.documentElement.hasAttribute("data-turbo-preview")) {
      return;
    }
    load_chips();
    this.check_limit();

    let timeout;
    let saveTimeout;

    const save_draft = () => {
      this.enable_preview();
      let new_story = window.location.pathname == "/stories/new";
      const story = this.story_data();
      const path = window.location.pathname.substring(0, window.location.pathname.lastIndexOf("/"));
      clearTimeout(timeout);
      timeout = null;

      let method;
      if (new_story) {
        method = "POST";
      } else {
        method = "PUT";
      }

      const feedback_span = document.getElementById("save_feedback");
      const csrfToken = document.querySelector('meta[name="csrf-token"]').content;

      feedback_span.innerHTML = "Saving...";
      fetch(path, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken, // Include the CSRF token in the request headers
        },
        body: JSON.stringify({ story }),
      })
        .then((response) => {
          feedback_span.innerHTML = "Saved";
          return response.json();
        })
        .then((data) => {
          if (new_story) {
            window.history.pushState({}, "", `/stories/${data}/edit`);
            new_story = false;
          }
        });

      clearTimeout(saveTimeout);
      saveTimeout = setTimeout(() => {
        feedback_span.innerHTML = "";
      }, 2000);
    };

    function force_save(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        save_draft();
      }
    }

    function load_chips() {
      const tags = document.getElementById("tag_list").value;
      document.getElementById("tag_list").remove();
      if (tags.length == 0) return;

      tags.split(" ").forEach((tag) => {
        create_chip(tag);
      });
    }

    function create_chip(tag) {
      const chip = document.createElement("span");
      const container = document.getElementById("tags-container");
      let formatted_input = tag.replace(/\s+/g, "-");
      formatted_input = tag.replace(/\.*$/g, "");

      chip.textContent = formatted_input;
      chip.style.border = "1px solid var(--color-border-fade)";

      chip.classList.add("h-8", "flex", "items-center", "whitespace-nowrap", "rounded", "bg-behindfade", "px-3", "text-xs", "font-bold", "lowercase", "text-primary", "m-1");

      const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svgElement.setAttribute("class", "w-4 ml-2 cursor-pointer"); // Added ml-2 for margin and cursor-pointer for pointer cursor
      svgElement.setAttribute("fill", "none");
      svgElement.setAttribute("stroke", "currentColor");
      svgElement.setAttribute("stroke-width", "2");
      svgElement.setAttribute("viewBox", "0 0 24 24");

      const pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
      pathElement.setAttribute("d", "M6 18L18 6M6 6l12 12");
      pathElement.setAttribute("stroke-linecap", "round");
      pathElement.setAttribute("stroke", "rgb(115,115,115)"); // Setting stroke color to red
      pathElement.setAttribute("stroke-linejoin", "round");

      svgElement.appendChild(pathElement);

      const hiddenInput = document.createElement("input");
      hiddenInput.setAttribute("type", "hidden");
      hiddenInput.setAttribute("name", "story[tags][]");
      hiddenInput.setAttribute("value", formatted_input);

      chip.appendChild(hiddenInput);
      chip.appendChild(svgElement);

      svgElement.addEventListener("click", function () {
        chip.remove();
        save_draft();
      });

      container.appendChild(chip);
    }

    if (!document.forceSaveAdded) {
      document.addEventListener("keydown", force_save);
      document.forceSaveAdded = true;
    }

    const inputs = document.querySelectorAll("trix-editor, textarea");
    inputs.forEach(function (input) {
      // Attach the event listener to each input and textarea element
      input.addEventListener(
        "keydown",
        debounce(function (e) {
          if (nonPrintableKeys.includes(e.key)) return;

          if ((e.metaKey || e.ctrlKey) && e.key === "s") {
            e.preventDefault();
            save_draft();
          } else {
            // Call save_draft after 3 seconds of inactivity
            save_draft();
          }
        }, 3000)
      ); // 3000 milliseconds = 3 seconds
    });

    const tags = document.getElementById("tags");
    tags.addEventListener("keydown", function (event) {
      const input = tags.value;
      const last_char = input.at(-1);

      const invalid_char = [" ", undefined].includes(last_char) && event.key === " ";
      if (invalid_char) {
        event.preventDefault();
        return;
      }

      if (event.key == "Enter") {
        if (last_char == undefined) {
          event.preventDefault();
          return;
        }

        create_chip(input);
        tags.value = "";
        event.preventDefault();
        save_draft();
        return;
      }
    });
  }

  story_data() {
    const form = document.querySelector("form");
    const tags_container = document.getElementById("tags-container");
    const tags = Array.from(tags_container.querySelectorAll("span")).map((span) => span.textContent);

    return {
      title: form.querySelector('[name="story[title]"]').value,
      content: form.querySelector('[name="story[content]"]').value,
      tags: tags,
    };
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
