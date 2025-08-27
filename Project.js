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

var selected_algorithms = [];

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

  button.style.width = "40%"
  const input = document.getElementById(buttonId + "_inputs")
  input.style.display = "flex"
  parent_div.insertBefore(button, drop);
  parent_div.insertBefore(input, drop);


  selected_algorithms.push(buttonId);
  console.log(selected_algorithms);
  if (selected_algorithms.length == 2) {
    submitter = document.getElementById("submit");
    submitter.style.display = "flex";
  }
  if (selected_algorithms.length == 4) {
    drop.style.display = "none";
  }
});

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

function final_submit(){


}