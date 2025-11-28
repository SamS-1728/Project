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

/* Button colors*/
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

/* Runs correct setup for that page */
document.addEventListener("DOMContentLoaded", function () {
  const page = document.body.id;
  if (page == "initial_page") {
    initial_page_setup();
  } else if (page == "final_page") {
    final_page_setup();
  }
});

/* Sets up initial page */
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

  /* Drop functionality */
  drop.addEventListener("drop", function (e) {
    e.preventDefault();
    const buttonId = e.dataTransfer.getData("text/plain");
    const button = document.getElementById(buttonId);
    const parent_div = document.getElementById("drop_area");

    /* Adds input section and displays both */
    button.style.width = "40%";
    const input = document.getElementById(buttonId + "_inputs");
    input.style.display = "flex";
    input.style.backgroundColor = cipherButtons.find((item) => item[0] === buttonId)[1];
    parent_div.insertBefore(button, drop);
    button.draggable = false;
    parent_div.insertBefore(input, drop);

    /* Selects algorithms and ensures 2-4 are selected */
    selected_algorithms.push(buttonId);
    if (selected_algorithms.length == 2) {
      submitter = document.getElementById("submit");
      submitter.style.display = "flex";
      container = document.getElementById("submit_container");
      container.style.display = "flex";
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
  text = text.slice(start, start + 1250);
  text = text.slice(text.indexOf("\n") + 1, text.lastIndexOf("\n"));
  text = text.replace(/\s+/g, " ");
  document.getElementById("plaintext").value = text.slice(1);
}

/* Handles the submission of the initial page */
function initial_submit() {
  sessionStorage.setItem(
    "selected_algorithms",
    JSON.stringify(selected_algorithms)
  );
  /* Stores all inputs */
  var plaintext = document.getElementById("plaintext").value;
  sessionStorage.setItem("plaintext", plaintext);
  /* Each case stores the inputs for that specific algorithm in session storage */
  for (const algo of selected_algorithms) {
    switch (algo) {
      case "caesar":
        var caesar_shift = document.getElementById("caesar_shift").value;
        sessionStorage.setItem("caesar_shift", caesar_shift);
        general_substitution_inputs("caesar");
      case "substitution":
        var substitution_keyword = document.getElementById("substitution_keyword").value;
        sessionStorage.setItem("substitution_keyword", substitution_keyword);
        general_substitution_inputs("substitution");
      case "affine":
        var affine_a = document.getElementById("affine_a").value;
        sessionStorage.setItem("affine_a", affine_a);
        var affine_b = document.getElementById("affine_b").value;
        sessionStorage.setItem("affine_b", affine_b);
        general_substitution_inputs("affine");
    }
  }
}

/* Stores the punctuation, space and case inputs that are repeated across general substitution ciphers */
function general_substitution_inputs(algo) {
  var spaces = document.getElementById(algo + "_spaces").checked;
  sessionStorage.setItem(algo + "_spaces", spaces);
  var punctuation = document.getElementById(algo + "_punctuation").checked;
  sessionStorage.setItem(algo + "_punctuation", punctuation);
  var char_case = document.getElementById(algo + "_case").checked;
  sessionStorage.setItem(algo + "_case", char_case);
}

/* Sets up the final page */
function final_page_setup() {
  selected_algorithms = JSON.parse(
    sessionStorage.getItem("selected_algorithms")
  );
  /* Runs each algorithm's function */
  for (const algo of selected_algorithms) {
    switch (algo) {
      case "caesar":
        caesar();
        break
      case "substitution":
        substitution();
        break;
      case "affine":
        affine();
        break;
    }
  }

  /* Displays results page dependent on algorithm selection (choices and number selected) */
  for (const algo of selected_algorithms) {
    const result = document.getElementById(algo + "_result");
    result.style.display = "flex";
    result.style.width = 100 / selected_algorithms.length - 1 + "%";
    for (const section of sections) {
      var section_id = document.getElementById(algo + "_" + section);
      section_id.style.backgroundColor = cipherButtons.find((item) => item[0] === algo)[1];
    }
  }
  for (const section of sections) {
    var section_heights = [];
    for (const algo of selected_algorithms) {
      var section_id = document.getElementById(algo + "_" + section);
      section_heights.push(section_id.offsetHeight);
    }
    new_height = Math.max(...section_heights) - 8;
    console.log(section_heights)
    console.log(new_height)
    for (const algo of selected_algorithms) {
      var section_id = document.getElementById(algo + "_" + section);
      section_id.style.minHeight = new_height + "px";
      console.log(section_id.offsetHeight);
    }
  }
}

/* The following functions implement each algorithm and insert these into the results page */
function caesar() {
  var plaintext = sessionStorage.getItem("plaintext");
  plaintext = general_substitution_inputs_handling("caesar", plaintext);
  var shift = parseInt(sessionStorage.getItem("caesar_shift")) % 26;
  var ciphertext = "";
  for (var i = 0; i < plaintext.length; i++) {
    var value = plaintext.charCodeAt(i);
    if (value >= 65 && value <= 90) {
      if (value + shift > 90) {
        value += shift - 26;
      } else {
        value += shift;
      }
      ciphertext += String.fromCharCode(value);
    } else if (value >= 97 && value <= 122) {
      if (value + shift > 122) {
        value += shift - 26;
      } else {
        value += shift;
      }
      ciphertext += String.fromCharCode(value);
    } else {
      ciphertext += plaintext[i];
    }
  }
  document.getElementById("caesar_ciphertext_content").innerHTML += `<p>${ciphertext}</p>`;
}

function substitution() {
  var plaintext = sessionStorage.getItem("plaintext");
  plaintext = general_substitution_inputs_handling("substitution", plaintext);
  console.log(plaintext)
  var keyword = sessionStorage.getItem("substitution_keyword").toUpperCase();
  var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var substitution_alphabet = "";
  for (var i = 0; i < keyword.length; i++) {
    if (alphabet.includes(keyword[i])) {
      substitution_alphabet += keyword[i];
      alphabet = alphabet.replace(keyword[i], "");
    }
  }
  substitution_alphabet += alphabet;
  alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  substitution_alphabet += substitution_alphabet.toLowerCase();
  console.log(substitution_alphabet)
  console.log(alphabet)
  var ciphertext = "";
  for (var i = 0; i < plaintext.length; i++) {
    if (alphabet.includes(plaintext[i])) {
      ciphertext += substitution_alphabet[alphabet.indexOf(plaintext[i])];
    } else {
      ciphertext += plaintext[i];
    }
  }
  document.getElementById("substitution_ciphertext_content").innerHTML += `<p>${ciphertext}</p>`;
}

function affine() {
  var plaintext = sessionStorage.getItem("plaintext");
  plaintext = general_substitution_inputs_handling("affine", plaintext);
  var a = parseInt(sessionStorage.getItem("affine_a"));
  var b = parseInt(sessionStorage.getItem("affine_b"));
  var ciphertext = "";
  for (var i = 0; i < plaintext.length; i++) {
    var value = plaintext.charCodeAt(i);
    if (value >= 65 && value <= 90) {
      value -= 64;
      value = (value * a + b) % 26;
      if (value == 0) {
        value = 26;
      }
      ciphertext += String.fromCharCode(value + 64);
    } else if (value >= 97 && value <= 122) {
      value -= 96;
      value = (value * a + b) % 26;
      if (value == 0) {
        value = 26;
      }
      ciphertext += String.fromCharCode(value + 96);
    } else {
      ciphertext += plaintext[i];
    }
  }
  document.getElementById("affine_ciphertext_content").innerHTML += `<p>${ciphertext}</p>`;
}

/* Acts on the inputs that are used across the general substitution ciphers */
function general_substitution_inputs_handling(algo, plaintext) {
  var spaces = sessionStorage.getItem(algo + "_spaces");
  var punctuation = sessionStorage.getItem(algo + "_punctuation");
  var char_case = sessionStorage.getItem(algo + "_case");

  if (spaces == "true") {
    plaintext = plaintext.replaceAll(" ", "");
    plaintext = plaintext.replace(new RegExp(`.{${5}}`, 'g'), '$&' + ' ');
  }
  if (punctuation == "true") {
    plaintext = plaintext.replace(/[.,\/#!?'$"%\^&\*;:{}=\-_`~()]/g, "");
  }
  if (char_case == "true") {
    plaintext = plaintext.toUpperCase();
  }
  return plaintext;
}
