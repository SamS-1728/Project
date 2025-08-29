const available_algorithms = [
  "caesar",
  "substitution",
  "affine",
  "polygraphic",
  "homophonic",
  "rsa",
  "md5",
  "sha256",
];

const cipherButtons = [
  ["caesar", "#B2F2B2"],
  ["substitution", "#C8E8A0"],
  ["affine", "#D9DB8F"],
  ["polygraphic", "#E6C87F"],
  ["homophonic", "#F0B370"],
  ["rsa", "#F89D63"],
  ["md5", "#FC8775"],
  ["sha256", "#FF6B6B"],
];

const sections = ["title", "history", "explanation", "ciphertext"];

var selected_algorithms = [];

document.addEventListener("DOMContentLoaded", function () {
  const page = document.body.id;
  if (page == "initial_page") {
    initial_page_setup();
  } else if (page == "final_page") {
    final_page_setup();
  }
});

function initial_page_setup() {
  /*Apply button colors*/
  for (const [button, color] of cipherButtons) {
    document.getElementById(button).style.backgroundColor = color;
  }
  /* Dragging functionality */
  for (const algo of available_algorithms) {
    const element = document.getElementById(algo);
    element.addEventListener("dragstart", function (e) {
      e.dataTransfer.setData("text/plain", e.target.id);
    });
  }

  const drop = document.getElementById("drop_target");

  drop.addEventListener("dragover", function (e) {
    e.preventDefault();
  });

  drop.addEventListener("drop", function (e) {
    e.preventDefault();
    const buttonId = e.dataTransfer.getData("text/plain");
    const button = document.getElementById(buttonId);
    const parent_div = document.getElementById("drop_area");

    button.style.width = "40%";
    const input = document.getElementById(buttonId + "_inputs");
    input.style.display = "flex";
    input.style.backgroundColor = cipherButtons.find((item) => item[0] === buttonId)[1];
    parent_div.insertBefore(button, drop);
    parent_div.insertBefore(input, drop);

    selected_algorithms.push(buttonId);
    if (selected_algorithms.length == 2) {
      submitter = document.getElementById("submit");
      submitter.style.display = "flex";
      note = document.getElementById("submit_note");
      note.style.display = "flex";
    }
    if (selected_algorithms.length == 4) {
      drop.style.display = "none";
    }
  });
}

/* Shakespeare text handling: random_text() is file handling, extract() is text formatting*/
function random_text() {
  fetch("shakespeare.txt")
    .then((response) => response.text())
    .then((text) => extract(text));
}
function extract(text) {
  start = Math.floor(Math.random() * 5200000);
  text = text.slice(start, start + 2000);
  text = text.slice(text.indexOf("\n") + 1, text.lastIndexOf("\n"));
  text = text.replace(/\s+/g, " ");
  document.getElementById("input_text").value = text.slice(1);
}

function initial_submit() {
  sessionStorage.setItem(
    "selected_algorithms",
    JSON.stringify(selected_algorithms)
  );
}

/* Initial page submission handling */
function final_page_setup() {
  selected_algorithms = JSON.parse(
    sessionStorage.getItem("selected_algorithms")
  );
  for (const algo of selected_algorithms) {
    const result = document.getElementById(algo + "_result");
    result.style.display = "flex";
    result.style.width = 100 / selected_algorithms.length-1 + "%";
    for (const section of sections) {
      var section_id = document.getElementById(algo + "_" + section);
      section_id.style.backgroundColor = cipherButtons.find((item) => item[0] === algo)[1];
  }
}
}
