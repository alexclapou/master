import { Controller } from "@hotwired/stimulus";
const nonPrintableKeys = [
  "Shift",
  "Meta",
  "Control",
  "Alt",
  "CapsLock",
  "Tab",
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "F1",
  "F2",
  "F3",
  "F4",
  "F5",
  "F6",
  "F7",
  "F8",
  "F9",
  "F10",
  "F11",
  "F12",
  "Escape",
  "Home",
  "End",
  "PageUp",
  "PageDown",
  "Insert",
  "Delete",
];

export default class extends Controller {
  static targets = ["title", "title_length"];

  connect() {
    let timeout;

    const save_draft = () => {
      clearTimeout(timeout);
      timeout = null;
      const create_story = window.location.pathname == "/stories/new";

      if (create_story) {
        console.log("create story");
        // window.history.pushState({}, "", "/stories/6");
      } else {
        console.log("update story");
      }
    };

    function debounce(func, delay) {
      return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          func.apply(this, args);
        }, delay);
      };
    }

    document.addEventListener("keydown", function (e) {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        save_draft();
      }
    });

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

        const chip = document.createElement("span");
        const container = document.getElementById("tags-container");
        let formatted_input = input.replace(/\s+/g, "-");
        formatted_input = formatted_input.replace(/\.*$/g, "");

        chip.textContent = formatted_input;
        chip.style.border = "1px solid rgb(229, 229, 229)";
        chip.setAttribute("data-value", "makai");

        // Adding classes for chip styling
        chip.classList.add(
          "h-8",
          "flex",
          "items-center",
          "whitespace-nowrap",
          "rounded",
          "bg-behindfade",
          "px-3",
          "text-xs",
          "font-bold",
          "lowercase",
          "text-primary",
          "m-1"
        );
        // Creating the SVG element
        const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svgElement.setAttribute("class", "w-4 ml-2 cursor-pointer"); // Added ml-2 for margin and cursor-pointer for pointer cursor
        svgElement.setAttribute("fill", "none");
        svgElement.setAttribute("stroke", "currentColor");
        svgElement.setAttribute("stroke-width", "2");
        svgElement.setAttribute("viewBox", "0 0 24 24");

        // Creating the path element
        const pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
        pathElement.setAttribute("d", "M6 18L18 6M6 6l12 12");
        pathElement.setAttribute("stroke-linecap", "round");
        pathElement.setAttribute("stroke", "rgb(115,115,115)"); // Setting stroke color to red
        pathElement.setAttribute("stroke-linejoin", "round");

        // Appending the path element to the SVG element
        svgElement.appendChild(pathElement);

        // Appending the SVG element to the chip
        const hiddenInput = document.createElement("input");
        hiddenInput.setAttribute("type", "hidden");
        hiddenInput.setAttribute("name", "story[tags][]");
        hiddenInput.setAttribute("value", formatted_input);

        chip.appendChild(hiddenInput);
        chip.appendChild(svgElement);

        // Adding click event listener to remove chip when SVG icon is clicked
        svgElement.addEventListener("click", function () {
          chip.remove();
        });

        // Appending the chip to the container
        container.appendChild(chip);
        tags.value = "";

        event.preventDefault();
        save_draft();
        return;
      }
    });
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
