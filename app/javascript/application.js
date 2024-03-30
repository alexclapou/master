// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
//= require custom/helpers
import "@hotwired/turbo-rails";
import "controllers";

import "trix";
import "@rails/actiontext";

Trix.config.textAttributes.highlight = { tagName: "mark" };

addEventListener("trix-initialize", function (event) {
  var groupElement = event.target.toolbarElement.querySelector(".trix-button-group.trix-button-group--text-tools");
  groupElement.insertAdjacentHTML("beforeend", '<button type="button" class="trix-button trix-button--icon trix-button--icon-highlight" data-trix-attribute="highlight" data-trix-key="y" title="Highlight" tabindex="-1">${lang.highlight}');

  window.onscroll = function () {
    stickyToolbar();
  };

  var toolbar = document.querySelector("trix-toolbar");
  var sticky = toolbar.offsetTop;

  function stickyToolbar() {
    if (window.scrollY + 50 >= sticky) {
      toolbar.classList.add("stickytab");
      toolbar.classList.remove("notstickybar");
    } else {
      if (toolbar.classList.contains("stickytab")) {
        toolbar.classList.remove("stickytab");
        toolbar.classList.add("notstickybar");
      }
    }
  }
});
