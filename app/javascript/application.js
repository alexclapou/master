// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails";
import "controllers";

import "trix";
import "@rails/actiontext";

Trix.config.textAttributes.highlight = { tagName: "mark" };

addEventListener("trix-initialize", function (event) {
  var groupElement = event.target.toolbarElement.querySelector(
    ".trix-button-group.trix-button-group--text-tools"
  );

  groupElement.insertAdjacentHTML(
    "beforeend",
    '<button type="button" class="trix-button trix-button--icon trix-button--icon-highlight" data-trix-attribute="highlight" data-trix-key="y" title="Highlight" tabindex="-1">${lang.highlight}'
  );

  const TOOLBAR_BUTTON_ICONS = [{ identifier: ".trix-button--icon-bold", icon: "B" }];
  TOOLBAR_BUTTON_ICONS.forEach((group) => {
    event.target.toolbarElement.querySelector(group.identifier).textContent = "asd";
    console.log(event.target.toolbarElement.querySelector(group.identifier).textContent);
  });

  window.onscroll = function () {
    stickyToolbar();
  };

  var toolbar = document.querySelector("trix-toolbar");
  var sticky = toolbar.offsetTop;

  function stickyToolbar() {
    if (window.scrollY + 50 >= sticky) {
      toolbar.classList.add("stickytab");
    } else {
      toolbar.classList.remove("stickytab");
    }
  }
});
