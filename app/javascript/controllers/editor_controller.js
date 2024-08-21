import { Controller } from "@hotwired/stimulus";

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
    preview.innerHTML = "";

    if (should_preview) {
      story_content.style.display = "none";
      preview.style.display = "block";
      this.show_spinner();
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

    function debounce(func, delay, timeout) {
      return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          func.apply(this, args);
        }, delay);
      };
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

    const inputs = document.getElementById("editor").querySelectorAll("trix-editor, textarea");
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

  try_save() {
    this.enable_preview();
    let new_story = window.location.pathname == "/stories/new";
    const story = this.story_data();
    const path = window.location.pathname.substring(0, window.location.pathname.lastIndexOf("/"));

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
  }

  publish() {
    if (window.location.pathname == "/stories/new") return;

    const id = window.location.pathname.match(/\d+/g)[0];
    const path = `/stories/${id}/publish`;
    const csrfToken = document.querySelector('meta[name="csrf-token"]').content;

    fetch(path, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken,
        Accept: "text/vnd.turbo-stream.html", // Tell the server to return a Turbo Stream response
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.text(); // Get the response as text
        } else {
          console.error("Failed to publish the story");
        }
      })
      .then((html) => {
        if (html) {
          if (html.includes("success")) window.location.href = `/stories/${id}`;
          else Turbo.renderStreamMessage(html); // Render the Turbo Stream response
        }
      })
      .catch((error) => console.error("Error:", error));
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

  show_spinner() {
    var spinner_container = document.createElement("div");
    spinner_container.style.display = "flex";
    spinner_container.style.alignItems = "center";
    spinner_container.style.justifyContent = "center";
    spinner_container.style.marginTop = "10rem";

    var spinner = document.createElement("div");
    spinner.setAttribute("id", "spinner");

    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "inline w-10 h-10 text-behindfade animate-spin fill-secondary");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("fill", "none");
    svg.setAttribute("viewBox", "0 0 100 101");

    var path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path1.setAttribute("d", "M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z");
    path1.setAttribute("fill", "currentColor");

    var path2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path2.setAttribute("d", "M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z");
    path2.setAttribute("fill", "currentFill");

    svg.appendChild(path1);
    svg.appendChild(path2);

    spinner.appendChild(svg);

    spinner_container.appendChild(spinner);
    const preview_frame = document.getElementById("preview");
    preview_frame.appendChild(spinner_container);
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
