import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  connect() {
    this.init_search_tabs();
    this.search_stories();
  }

  init_search_tabs() {
    const init_tab = document.getElementById("trigger-stories");
    init_tab.classList.add("search-active");

    const tabs = document.querySelectorAll("#trigger-stories, #trigger-users, #trigger-tags");
    function handleTabClick(event) {
      tabs.forEach((tab) => tab.classList.remove("search-active"));
      event.currentTarget.classList.add("search-active");
      event.currentTarget.classList.add("some-other-class");
    }

    tabs.forEach((tab) => {
      tab.addEventListener("click", handleTabClick);
    });
  }

  search_stories() {
    this.show_current_results_only("stories");
    const stories = document.getElementById("stories");
    const path = "/search_stories" + window.location.search;
    stories.src = path;
    stories.reload();
  }

  search_users() {
    this.show_current_results_only("users");
    const stories = document.getElementById("users");
    const path = "/search_users" + window.location.search;
    stories.src = path;
    stories.reload();
  }

  search_tags() {
    this.show_current_results_only("tags");
    const stories = document.getElementById("tags");
    const path = "/search_tags" + window.location.search;
    stories.src = path;
    stories.reload();
  }

  show_current_results_only(current_results) {
    var classes = ["stories", "users", "tags"].filter((item) => item !== current_results).map((item) => `#${item}`);

    const frames = document.querySelectorAll(classes);
    frames.forEach((frame) => frame.classList.add("hidden"));

    document.getElementById(current_results).classList.remove("hidden");
  }
}
