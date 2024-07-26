import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  connect() {
    this.search_stories();
  }

  search_stories() {
    console.log("search stories");
    const stories = document.getElementById("stories");
    const path = "/search_stories" + window.location.search;
    stories.src = path;
    stories.reload();
  }
}
