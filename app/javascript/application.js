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
});
