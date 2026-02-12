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
    input.style.backgroundColor = cipherButtons.find(
      (item) => item[0] === buttonId
    )[1];
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

  /*For polygraphic inputs - ensures playfair keyword only shown when playfair chosen*/
  const polygraphic_options = document.querySelectorAll(
    'input[name="polygraphic_choice"]'
  );
  polygraphic_options.forEach((option) => {
    option.addEventListener("change", () => {
      const playfair_additional = document.getElementById(
        "playfair_additional"
      );
      const playfair = document.getElementById("polygraphic_playfair");
      if (playfair.checked) {
        playfair_additional.style.display = "flex";
      } else {
        playfair_additional.style.display = "none";
      }
    });
  });

  /*For homophonic inputs - ensures keyword only shown when keyword cipher chosen*/
  const homophonic_options = document.querySelectorAll(
    'input[name="homophonic_choice"]'
  );
  homophonic_options.forEach((option) => {
    option.addEventListener("change", () => {
      const homophonic_additional = document.getElementById(
        "homophonic_additional"
      );
      const keyword_choice = document.getElementById(
        "homophonic_keyword_choice"
      );
      if (keyword_choice.checked) {
        homophonic_additional.style.display = "flex";
      } else {
        homophonic_additional.style.display = "none";
      }
    });
  });

  /*For rsa inputs - shows relevant information*/
  const rsa_options = document.querySelectorAll(
    'input[name="rsa_choice"]'
  );
  rsa_options.forEach((option) => {
    option.addEventListener("change", () => {
      const rsa_big = document.getElementById("rsa_big");
      const rsa_small = document.getElementById("rsa_small");
      const rsa_big_additional = document.getElementById("rsa_big_additional");
      const rsa_small_additional = document.getElementById("rsa_small_additional");
      if (rsa_big.checked) {
        rsa_big_additional.style.display = "flex";
        rsa_small_additional.style.display = "none";
      } else {
        rsa_small_additional.style.display = "flex";
        rsa_big_additional.style.display = "none";
      }
    });
  });
}

function deselect(algo) {
  /* Undo everything that selection cause*/
  selected_algorithms.splice(selected_algorithms.indexOf(algo), 1);
  const input = document.getElementById(algo + "_inputs");
  input.style.display = "none";
  const parent_div = document.getElementById("selection");
  const button = document.getElementById(algo);
  button.style.width = "90%";
  button.draggable = true;
  /*Find where to insert in algorithm selection catalogue*/
  const index = available_algorithms.indexOf(algo);
  var insert_before = "";
  for (let i = index + 1; i < available_algorithms.length; i++) {
    if (!selected_algorithms.includes(available_algorithms[i])) {
      insert_before = available_algorithms[i];
      break;
    }
  }
  if (insert_before != "") {
    parent_div.insertBefore(button, document.getElementById(insert_before));
  } else {
    parent_div.appendChild(button);
  }
  /*Sets presence of submit button/drop section to align with validation*/
  const submitter = document.getElementById("submit");
  const container = document.getElementById("submit_container");
  const drop = document.getElementById("drop_target");
  switch (selected_algorithms.length) {
    case 0:
    case 1:
      submitter.style.display = "none";
      container.style.display = "none";
      drop.style.display = "flex";
      break;
    case 2:
    case 3:
      submitter.style.display = "flex";
      container.style.display = "flex";
      drop.style.display = "flex";
      break;
    case 4:
      submitter.style.display = "flex";
      container.style.display = "flex";
      drop.style.display = "none";
      break;
  }

  if (error_dict){
    for (key in error_dict){
      if (key.substring(0,algo.length) == algo){
        error_dict[key]=0
      }
    }
    check_errors()
  }
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

//Controls all individual validation after submit
function validate_initial_submit(){
  //Stores which elements have validation errors, global for easier use
  globalThis.error_dict = {}
  validate_element("plaintext", "plaintext")
  //Validate depending on selected algorithms
  for (const algo of selected_algorithms){
    switch (algo){
      case "caesar":
        validate_element("caesar_shift", 'number')
        break
      case "substitution":
        validate_element("substitution_keyword", 'keyword')
        break
      case "affine":
        validate_element("affine_a", 'number')
        validate_element("affine_b", 'number')
        break
      case "polygraphic":
        validate_radio("polygraphic_playfair", "polygraphic_random", "polygraphic_keyword")
        break
      case "homophonic":
        validate_radio("homophonic_keyword_choice", "homophonic_mantuan", "homophonic_keyword")
        break
      case "rsa":
        validate_radio("rsa_small", "rsa_big", false)
        break
    }
  }
  //Determine if all validation has passed
  error_count = check_errors()
  if (error_count == 0){
    initial_submit()
  }else{
    return false;
  }
}

//Validates one element by it's html id,
//Types available: number, keyword and plaintext (radio is separate)
function validate_element(element_name, type){
  var element = document.getElementById(element_name)
  error_dict[element_name] = 0
  //Check() validates depending on type
  if (check(type, element.value)==false){
    //Use dict to acknowledge the presence of error
    error_dict[element_name]=1
    //Apply red border
    error_css(element, element_name)
    //Event listener to determine if error gets fixed
  }
  element.addEventListener("input", () => {
    //If error is fixed then unfixed
    if (check(type, element.value)==false && error_dict[element_name]==0){
      error_css(element, element_name)
      error_dict[element_name]=1
    //If error is fixed
    }else if (check(type, element.value)==true&&error_dict[element_name]==1) {
      //Undoes red border 
      reverse_error_css(element, element_name)
      error_dict[element_name]=0
    }
    //Display or remove error box as necessary
    check_errors()
  })
  if (type == "plaintext"){
    var generate_text_button = document.getElementById("generate_text")
    generate_text_button.addEventListener("click", () => {
      reverse_error_css(element, element_name)
      error_dict[element_name]=0
      check_errors()
    })
  }
}

//Validate radio buttons and associated keyword (if no keyword, last parameter = false)
function validate_radio(keyword_opt_name, other_opt_name, keyword_entry_name){
  const keyword_opt = document.getElementById(keyword_opt_name)
  const other_opt = document.getElementById(other_opt_name)
  const opt_list = [keyword_opt, other_opt]
  error_dict[keyword_opt_name] = 0
  //If no option selected
  if (!keyword_opt.checked && !other_opt.checked){
    error_dict[keyword_opt_name] = 1
    //Simple error css for radios
    keyword_opt.style.outline = "0.2vw solid #ff2c2c"
    other_opt.style.outline = "0.2vw solid #ff2c2c"
    //Event listener detects if either of them changes
    opt_list.forEach((option) => {
      option.addEventListener("change", () => {
        //As soon as one is checked
        if (keyword_opt.checked || other_opt.checked){
          error_dict[keyword_opt_name] = 0
          keyword_opt.style.outline = ""
          other_opt.style.outline = ""
        }
        if (other_opt.checked){
          error_dict[keyword_entry_name]=0
        }
        //Display/remove error box as appropriate
        check_errors()
      })
    })
  }
  //If keyword exists
  if (keyword_entry_name!=false){
    //If correct option checkded, then validate
    if (keyword_opt.checked){
      validate_element(keyword_entry_name, "keyword")
    }
    //Use event listener to detect change, and then validate if present
    keyword_opt.addEventListener("change", () => {
      if (keyword_opt.checked){
        validate_element(keyword_entry_name, "keyword")
      }
      check_errors()
    })
    check_errors()
  }
  //Display/remove error box as appropriate
  check_errors()
}

//Controls error box
function check_errors(){
  var error_box = document.getElementById("validation_error")
  //Finds number of values that are equal to 1
  error_count = Object.values(error_dict).filter(val => val === 1).length
  //If 0 remove error box, else display it
  if (error_count == 0){
    error_box.style.display = 'none'
  }else{
    for (key in error_dict){
      if (error_dict[key] == 1){
        var first_error = key
        break;
      }
    }
    switch (first_error){
      case "plaintext":
        var msg = '(Plaintext must be between 1 and 3000 characters long)'
        break
      case "caesar_shift":
      case "affine_a":
      case "affine_b":
        var msg = '(Numerical inputs may have size restrictions)'
        break
      case "substitution_keyword":
      case "polygraphic_keyword":
      case "homophonic_keyword":
        var msg = '(Keyword inputs must only contain alphabetic characters)'
        break
      case "polygraphic_playfair":
      case "homophonic_keyword_choice":
      case "rsa_small":
        var msg = '(Ensure an option is chosen if two are presented)'
        break
    }
    document.getElementById("validation_error_specifics").innerHTML = msg
    error_box.style.display = 'flex'
  }
  return error_count
}

//Display red box around erroneous element
function error_css(element, element_name){
  //Plaintext handled separately 
  if (element_name == 'plaintext'){
    var plaintext_area = document.getElementById("plaintext_area")
    plaintext_area.style.border = '0.2vw solid #ff2c2c'
    plaintext_area.style.borderWidth = '0.4vw'
  }else{
    //Give a red border and undo default form styling as needed
    element.style.border = '0.2vw solid #ff2c2c'
    element.style.boxShadow = 'none'
    element.style.borderRadius = '0.4vw'
  }
}
//Undoes red box when errors fixed
function reverse_error_css(element, element_name){
  //Set all values to an empty string, this causes default styling as before
  if (element_name == 'plaintext'){
    var plaintext_area = document.getElementById("plaintext_area")
    plaintext_area.style.border = ''
    plaintext_area.style.borderWidth = ''
  }else{
    element.style.border = ''
    element.style.boxShadow = ''
    element.style.borderRadius = ''
  }
}

//Validate an element depending on type
function check(type, val){
  //Ensure all numbers only include digits
  if (type == 'number'){
    if (!/^\d+$/.test(val)){
      return false
    }
  //Ensure between 1-25 (for affine and caesar)
    if (Number(val) < 1 || Number(val) > 25){
      return false
    }
    return true
  //Ensure keywords only contain alphabetic letters
  }else if (type == "keyword"){
    if (!/^[A-Za-z]+$/.test(val)){
      return false
    }
    return true
  //Ensure plaintext between 1 and 3000 chars 
  }else if (type == "plaintext"){
    if (val.length>=1 && val.length<=3000){
      return true
    }
    return false
  }
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
        var substitution_keyword = document.getElementById(
          "substitution_keyword"
        ).value;
        sessionStorage.setItem("substitution_keyword", substitution_keyword);
        general_substitution_inputs("substitution");
      case "affine":
        var affine_a = document.getElementById("affine_a").value;
        sessionStorage.setItem("affine_a", affine_a);
        var affine_b = document.getElementById("affine_b").value;
        sessionStorage.setItem("affine_b", affine_b);
        general_substitution_inputs("affine");
      case "polygraphic":
        var polygraphic_mode = document.querySelector(
          "input[name='polygraphic_choice']:checked"
        ).value;
        sessionStorage.setItem("polygraphic_mode", polygraphic_mode);
        if (polygraphic_mode == "playfair") {
          var playfair_keyword = document.getElementById(
            "polygraphic_keyword"
          ).value;
          sessionStorage.setItem("playfair_keyword", playfair_keyword);
        }
        sessionStorage.setItem("polygraphic_spaces", true);
        sessionStorage.setItem("polygraphic_punctuation", true);
        sessionStorage.setItem("polygraphic_case", true);
      case "homophonic":
        var homophonic_mode = document.querySelector(
          "input[name='homophonic_choice']:checked"
        ).value;
        sessionStorage.setItem("homophonic_mode", homophonic_mode);
        if (homophonic_mode == "keyword_choice") {
          var homophonic_keyword =
            document.getElementById("homophonic_keyword").value;
          sessionStorage.setItem("homophonic_keyword", homophonic_keyword);
        }
        general_substitution_inputs("homophonic");
      case "rsa":
        var rsa_mode = document.querySelector(
          "input[name='rsa_choice']:checked"
        ).value;
        sessionStorage.setItem("rsa_mode", rsa_mode);
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
        break;
      case "substitution":
        substitution();
        break;
      case "affine":
        affine();
        break;
      case "polygraphic":
        polygraphic();
        break;
      case "homophonic":
        homophonic();
        break;
      case "rsa":
        rsa()
        break;
      case "md5":
        md5()
        break;
      case "sha256":
        sha256()
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
      section_id.style.backgroundColor = cipherButtons.find(
        (item) => item[0] === algo
      )[1];
    }
  }
  for (const section of sections) {
    var section_heights = [];
    for (const algo of selected_algorithms) {
      var section_id = document.getElementById(algo + "_" + section);
      section_heights.push(section_id.offsetHeight);
    }
    new_height = Math.max(...section_heights) - 8;
    for (const algo of selected_algorithms) {
      var section_id = document.getElementById(algo + "_" + section);
      section_id.style.minHeight =
        new_height / (window.innerWidth * 0.01) + "vw";
    }
  }
}

/* Acts on the inputs that are used across the general substitution ciphers */
function general_substitution_inputs_handling(algo, plaintext) {
  var spaces = sessionStorage.getItem(algo + "_spaces");
  var punctuation = sessionStorage.getItem(algo + "_punctuation");
  var char_case = sessionStorage.getItem(algo + "_case");

  if (spaces == "true") {
    plaintext = plaintext.replaceAll(" ", "");
    if (algo != "polygraphic") {
      plaintext = plaintext.replace(new RegExp(`.{${5}}`, "g"), "$&" + " ");
    }
  }
  if (punctuation == "true") {
    plaintext = plaintext.replace(/[.,\/#!|?'$"%\^&\*;:<{}=\-_`~()\[\]]/g, "");
  }
  if (char_case == "true") {
    plaintext = plaintext.toUpperCase();
  }
  return plaintext;
}

/* The following functions implement each algorithm and insert these into the results page */
function caesar() {
  /* Get inputs from session storage*/
  var plaintext = sessionStorage.getItem("plaintext");
  plaintext = general_substitution_inputs_handling("caesar", plaintext);
  var shift = parseInt(sessionStorage.getItem("caesar_shift")) % 26;
  var ciphertext = "";
  for (var i = 0; i < plaintext.length; i++) {
    var value = plaintext.charCodeAt(i);
    /* This shifts each uppercase character, ensuring mod 26*/
    if (value >= 65 && value <= 90) {
      if (value + shift > 90) {
        value += shift - 26;
      } else {
        value += shift;
      }
      ciphertext += String.fromCharCode(value);
      /* This shifts each lowercase character, ensuring mod 26*/
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
  /* Insert result into results page*/
  document.getElementById(
    "caesar_ciphertext_content"
  ).innerHTML += `<p>${ciphertext}</p>`;
}

function substitution() {
  var plaintext = sessionStorage.getItem("plaintext");
  plaintext = general_substitution_inputs_handling("substitution", plaintext);
  var keyword = sessionStorage.getItem("substitution_keyword").toUpperCase();
  var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var substitution_alphabet = "";
  /* Iterates through the keyword and adds it to the new alphabet */
  for (var i = 0; i < keyword.length; i++) {
    if (alphabet.includes(keyword[i])) {
      substitution_alphabet += keyword[i];
      alphabet = alphabet.replace(keyword[i], "");
    }
  }
  /* Adds the rest of the alphabet */
  substitution_alphabet += alphabet;
  alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  substitution_alphabet += substitution_alphabet.toLowerCase();
  var ciphertext = "";
  /* Uses the substitution alphabet to get the ciphertext */
  for (var i = 0; i < plaintext.length; i++) {
    if (alphabet.includes(plaintext[i])) {
      ciphertext += substitution_alphabet[alphabet.indexOf(plaintext[i])];
    } else {
      ciphertext += plaintext[i];
    }
  }
  /* Inserts into results page */
  document.getElementById(
    "substitution_ciphertext_content"
  ).innerHTML += `<p>${ciphertext}</p>`;
}

function affine() {
  var plaintext = sessionStorage.getItem("plaintext");
  plaintext = general_substitution_inputs_handling("affine", plaintext);
  var a = parseInt(sessionStorage.getItem("affine_a"));
  var b = parseInt(sessionStorage.getItem("affine_b"));
  var ciphertext = "";
  for (var i = 0; i < plaintext.length; i++) {
    var value = plaintext.charCodeAt(i);
    /* Handles upper case characters*/
    if (value >= 65 && value <= 90) {
      /* Converts to a number between 1 and 26 so MOD can be used */
      value -= 64;
      value = (value * a + b) % 26;
      if (value == 0) {
        value = 26;
      }
      ciphertext += String.fromCharCode(value + 64);
      /* Handles lower case characters*/
    } else if (value >= 97 && value <= 122) {
      /* Converts to a number between 1 and 26 so MOD can be used */
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
  document.getElementById(
    "affine_ciphertext_content"
  ).innerHTML += `<p>${ciphertext}</p>`;
}

function polygraphic() {
  var plaintext = sessionStorage.getItem("plaintext");
  plaintext = general_substitution_inputs_handling("polygraphic", plaintext);
  /*As polygraphic works on pairs of letters we need to also remove numbers 
  using the regex below */
  plaintext = plaintext.replace(/\d+/g, "");

  var ciphertext = "";

  var mode = sessionStorage.getItem("polygraphic_mode");
  if (mode == "playfair") {
    var keyword = sessionStorage.getItem("playfair_keyword").toUpperCase();
    /*As playfair uses a 25 letter alphabet*/
    plaintext = plaintext.replaceAll("J", "I");
    var alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ";
    var playfair_alphabet = "";
    /* This uses the keyword to determine the order of the letters in the grid*/
    for (var i = 0; i < keyword.length; i++) {
      if (alphabet.includes(keyword[i])) {
        playfair_alphabet += keyword[i];
        alphabet = alphabet.replace(keyword[i], "");
      }
    }
    playfair_alphabet += alphabet;
    var playfair_grid = [];
    /* Creates the grid as an array of 5 5-letter strings*/
    for (let i = 0; i < 25; i += 5) {
      playfair_grid.push(playfair_alphabet.slice(i, i + 5));
    }
    /*Playfair cipher cannot encrypt two of the same letter, 
    so this pads with an additional X in between*/
    var updated_plaintext = "";
    for (let i = 0; i < plaintext.length - 1; i+=2) {
      updated_plaintext += plaintext[i];
      if (plaintext[i] == plaintext[i + 1]) {
        updated_plaintext += "X";
        i -= 1
      }else{
        updated_plaintext += plaintext[i+1]
      }
      if (i == plaintext.length-3){
        updated_plaintext += plaintext[plaintext.length-1]
      }
    }
    /**for (let i = 0; i < plaintext.length - 1; i++) {
      updated_plaintext += plaintext[i];
      if (plaintext[i] == plaintext[i + 1]) {
        updated_plaintext += "X";
      }
    }**/
    plaintext = updated_plaintext;
    /*Holds row and column values for each letter in a dictionary to speed up 
    process for longer texts: key = letter, value = [row, column] */
    var grid_values = {};
    for (const line of playfair_grid) {
      for (const char of line) {
        grid_values[char] = [playfair_grid.indexOf(line), line.indexOf(char)];
      }
    }
    /*Pads with an X for odd length plaintext */
    if (plaintext.length % 2 == 1) {
      plaintext += "X";
    }
    /*below, x and y denote the first and second letter of 
    each pair and r and c denote their row and column values*/
    for (let i = 0; i < plaintext.length; i += 2) {
      var x = plaintext[i];
      var y = plaintext[i + 1];
      var xr = grid_values[x][0];
      var xc = grid_values[x][1];
      var yr = grid_values[y][0];
      var yc = grid_values[y][1];
      /*Below is each case following the rules of the playfair cipher*/
      if (xr == yr) {
        var new_x = playfair_grid[xr][(xc + 1) % 5];
        var new_y = playfair_grid[xr][(yc + 1) % 5];
      } else if (xc == yc) {
        var new_x = playfair_grid[(xr + 1) % 5][xc];
        var new_y = playfair_grid[(yr + 1) % 5][xc];
      } else {
        var new_x = playfair_grid[xr][yc];
        var new_y = playfair_grid[yr][xc];
      }
      ciphertext += new_x + new_y + " ";
    }
  } else {
    /* Random bigraphic substitution */
    var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    /*Forms array of all letter combinations of length 2*/
    var bigraphic_array = [];
    for (var letter1 of alphabet) {
      for (var letter2 of alphabet) {
        bigraphic_array.push(letter1 + letter2);
      }
    }
    /*Full deep copy of array so we can randomly shuffle*/
    var cipher_array = structuredClone(bigraphic_array);
    /*Uses Fisher-Yates shuffling algorithm to ensure a completely 
    random shuffle in efficient time complexity*/
    for (let i = cipher_array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cipher_array[i], cipher_array[j]] = [cipher_array[j], cipher_array[i]];
    }
    /*Pads with X if length is odd */
    if (plaintext.length % 2 == 1) {
      plaintext += "X";
    }
    /*Iterates through and substitutes */
    for (let i = 0; i < plaintext.length; i += 2) {
      var x = plaintext[i];
      var y = plaintext[i + 1];
      ciphertext += cipher_array[bigraphic_array.indexOf(x + y)] + " ";
    }
    ciphertext = ciphertext.slice(0, -1);
  }
  /*Insert into results page */
  document.getElementById(
    "polygraphic_ciphertext_content"
  ).innerHTML += `<p>${ciphertext}</p>`;
}

function homophonic() {
  /*Fetch and format plaintext using general substitution inputs, 
  and set up variable translation_dict to store letter conversions */
  var plaintext = sessionStorage.getItem("plaintext");
  plaintext = general_substitution_inputs_handling("homophonic", plaintext);
  var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var translation_dict = {};
  var mode = sessionStorage.getItem('homophonic_mode');
  /*Sets up translation_dict for keyword mode */
  if (mode == 'keyword_choice'){
    var translation_alphabet = '';
    var keyword = sessionStorage.getItem("homophonic_keyword").toUpperCase();
    /*Set up translation alphabet as in basic substitution*/
    for (var i = 0; i < keyword.length; i++) {
      if (alphabet.includes(keyword[i])) {
        translation_alphabet += keyword[i];
        alphabet = alphabet.replace(keyword[i], "");
      }
    }
    translation_alphabet += alphabet;
    alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; /*reset for later use*/
    /* Convert translation alphabet into translation_dict (where key = letter 
    and value = list of possible ciphertext sybmols) */
    for (let i=0; i<26; i++){
      translation_dict[alphabet[i]] = [translation_alphabet[i]]
    }
    /* Add 3 alternative ciphertext symbols randomly to each common letter so none are left */
    var common_letters = ['E', 'T', 'A', 'O', 'I']
    var special_chars = ['!', '%', ')', '@', '&', '-', '#', '*', '=', '$', '(', '+', ';', ':', '^']
    for (let i=0; i<5; i++){
      for (let j=0; j<3; j++){
        let character_index = Math.floor(Math.random()*special_chars.length)
        translation_dict[common_letters[i]].push(special_chars[character_index])
        special_chars.splice(character_index, 1)
      }
    }
  }else { /*Sets up translation_dict for mantuan mode */
    /* Use string functions to reverse alphabet*/
    var reversed_alphabet = alphabet.split("").reverse().join("");
    /* Use this as the translation alphabet (the convention for Mantuan) */
    for (let i=0; i<26; i++){
      translation_dict[alphabet[i]] = [reversed_alphabet[i]]
    }
    /* Include alternative ciphertext symbols (these are fixed in Mantuan) */
    translation_dict['A'].push('!', '%', ')')
    translation_dict['E'].push('@', '&', '-')
    translation_dict['O'].push('#', '*', '=')
    translation_dict['U'].push('$', '(', '+')
  }
  var ciphertext = '';
  /*Converts each letter to a randomly selected ciphertext symbol using the translation_dict*/
  for (let letter of plaintext) {
     if (alphabet.includes(letter)) { /*For uppercase letters*/
      ciphertext += translation_dict[letter][Math.floor(Math.random()*translation_dict[letter].length)]
     } else if (alphabet.includes(letter.toUpperCase())){ /*For lowercase letters - preserves case*/
      letter = letter.toUpperCase();
      ciphertext += translation_dict[letter][Math.floor(Math.random()*translation_dict[letter].length)].toLowerCase()
     }else { /*For punctuation and numbers*/
      ciphertext += letter;
     }
  }
  /*Insert into results page */
  document.getElementById(
    "homophonic_ciphertext_content"
  ).innerHTML += `<p>${ciphertext}</p>`;
}

// The following algorithms are all related to rsa, split up into individual helper functions
function rsa(){
  var rsa_mode = sessionStorage.getItem('rsa_mode')
  var plaintext = sessionStorage.getItem("plaintext")
  //Depending on the selected mode we set e (public key), and split the plaintext 
  // into individual sections (individual bytes for small and 128 bytes for big)
 if (rsa_mode=='small'){
    var e = 3n
    var plaintext_array = plaintext.match(/(.{1,1})/g);
  } else{
    var e = 65537n
    var plaintext_array = plaintext.match(/(.{1,128})/g);
  }
// Iterating through each individual section of 1 or 128 bytes, we convert each letter 
// to binary ASCII then concatenating each binary value, into a big int
  var m_array = []
  for (let element of plaintext_array){
    let m_current = ''
    for (let j=0; j<element.length; j++){
      m_current += element.charCodeAt(j).toString(2)
    }
  // We are left with an array of big ints
    m_array.push(BigInt(m_current))
  }
  //Helper function to generate primes p and q, ensuring they are not the same
  var p = generate_rsa_prime(rsa_mode)
  var q = generate_rsa_prime(rsa_mode)
  while (p==q){
    q = generate_rsa_prime(rsa_mode)
  }
  var n = p*q
  //Rules of RSA to generate the private key
  var totient = (p-1n)*(q-1n)
  var d = modular_inverse(e, totient)
  var c = ''
  //Carry out the RSA calculation and concat the hex value to the ciphertext string
  for (let m of m_array){
    c += modular_exponentiation(m, e, n).toString(16)
  }
  //Insert into results page
  document.getElementById(
    "rsa_ciphertext_content"
  ).innerHTML += `<p>${c}</p>`;
}

function generate_rsa_prime(mode){
  //If mode is small, choose randomly from all primes below 1000
  const small_primes = generate_primes_up_to_1000()
  if (mode == "small"){
    return BigInt(small_primes[Math.floor(Math.random()*(small_primes.length)-3)+3])
  }
  var p = 0n
  var length = 1024;
  //Generates a random big int, then checks to see if prime
  generationloop:
  while (true){
    p = generate_random_big_int(length, true, true)
    //Test divisibility with pre-generated small primes
    for (let small_prime of small_primes){
      if (p%BigInt(small_prime)==0){
        continue generationloop
      }
    }
    //Use miller-rabin primality test to be fairly certain it is prime
    if (miller_rabin(p, length)==false){
      continue;
    }
    return p
  }
}

//Generate small primes using sieve of erastosthenes
function generate_primes_up_to_1000(){
  var num_array = []
  //Array of all numbers from 2 to 1000
  for (let i=2; i<1000; i++){
    num_array.push(i)
  }
  //Replace numbers with 0 if they are divisible, 
  //iterate up to 32 (as this is bigger than sqrt(100))
  for (let i=0; i<32; i++){
    if (1 < num_array[i] && num_array[i] < 32){
      for (let j=i+1; j<num_array.length; j++){
        if (num_array[j]%num_array[i]==0){
          num_array[j] = 0
        }
      }
    }
  }
  //Remove all 0s
  return num_array.filter(element => element !== 0);
}

//As keys are larger than Numbers can take, we use Big int but this has no 
// simple random function, so we use crypto module to generate our own
function generate_random_big_int(length, min = false, odd = false){
  //Get random binary values up to desired length
  var array = crypto.getRandomValues(new Uint8Array(Math.ceil(length/8)))
  //Ensure the result starts with a 1 if needed (so it is not too small)
  if (min == true){
    //Bitwise and operation that uses a shift to get 10000...
    array[0] |= 1 << ((length-1)%8)
  }
  //If odd integer required, use bitwise and to fix last digit 1
  if (odd == true){
    array[array.length-1] |= 1
  }
  //Convert binary to big int
  var p = 0n
  for (let a of array){
    p = (p << 8n) | BigInt(a);
  }
  return p;
}

// n is odd and possibly prime, true = probably prime, false = composite
function miller_rabin(n, length) {
  var m = n - 1n
  var k = 0n
  //Get n in the form (2**k)*m to run the algorithm
  while (m%2n==0n){
    m /= 2n
    k += 1n
  }
  //More rounds = more certainty
  roundloop:
  for (let rounds=0; rounds<4; rounds++){
    //Generate random a less than n-1 
    //(no need to specify minimum or odd)
    var a = n + 1n
    while (a>n-1n){
      a = generate_random_big_int(length)
    }
    //Carry out modular exponentiation efficiently
    var b = modular_exponentiation(a, m, n)
    //Action occurs if b = 1 or -1 due to quirks of fermat's little theorem
    if (b==1n || b== n - 1n){
      continue
    }
    for (let i=0n; i<k-1n; i++){
      b = modular_exponentiation(b, 2n, n)
      if (b==n-1n){
        continue roundloop
      }else if (b==1n){
        return false
      }
    }
    return false
  } 
  //Not yet found to be composite, hence we are fairly certain it is prime 
  return true
}

// Use right to left binary method for modular exponentiation
function modular_exponentiation(base, pow, mod){
  //handle small cases faster for small mode
  if (pow<=5){
    return (base**pow)%mod
  }  
  var result = 1n
  //Iterate through each binary digit using right shift and bitwise and, 
  //this decreases time complexity logarithmically
  while (pow > 0n){
    if ((pow & 1n) == 1n){
      result = (result*base)%mod
    }
    pow >>= 1n
    base = (base**2n)%mod
  }
  return result
}

//Modular inverse finds d (private key) using extended euclidean algorithm
function modular_inverse(a,m){
  var results = extended_euclidean_algorithm(a, m)
  return results[1]%m
}

//A version of the euclidean algorithm for GCD that stored additional 
// results to find solutions for Bezout and hence modular inverse
function extended_euclidean_algorithm(a,b){
  if (b==0n){
    return [a,1n,0n]
  }
  var results = extended_euclidean_algorithm(b, a%b)
  var x = results[2]
  var y = results[1] - (a/b)*results[2]
  return [results[0], x, y]
}
//End of rsa linked algorithms

function md5(){
  //Generate array of s-values following pattern
  var s = Array(4).fill([7,12,17,22]).flat() 
  var s2 = Array(4).fill([5,9,14,20]).flat()
  var s3 = Array(4).fill([4,11,16,23]).flat()
  var s4 = Array(4).fill([6,10,15,21]).flat()
  s.push(s2,s3,s4)
  s = s.flat()
  
  //Generate k values using sine function
  var k = []
  for (let i=1; i<65; i++){
    k.push(Math.floor(2**32 * Math.abs(Math.sin(i))))
  }
  
  //Initialisation vectors for A-D
  var a0 = 0x67452301
  var b0 = 0xefcdab89
  var c0 = 0x98badcfe
  var d0 = 0x10325476

  //General handling for hashing algorithms, true = little endian
  var plaintext_array = hash_plaintext_handling(true)

  //Iterate through each 512 bit string
  for (let j=0; j<plaintext_array.length; j++){
    //Convert 512 bit string into 16 32-bit words
    var plaintext_divided = plaintext_array[j].match(/(.{1,32})/g)
    var binary_plaintext_divided = new Uint32Array(16)
    //Convert 32-bit words to binary values using little endian
    for (let i=0; i<16; i++){
      var byte_string = ''
      for (let k=24; k>=0; k-=8){
        byte_string += plaintext_divided[i].slice(k, k+8)
      }
      binary_plaintext_divided[i] = parseInt(byte_string, 2)
    }
    //Set ABCD to match initalisation vectors
    var A = a0
    var B = b0
    var C = c0
    var D = d0
    //Define which F and g to use depending on the round
    for (let i=0; i<64; i++){
      if (i >=0 && i<=15){
        var F = (B&C) | (D& (~B >>> 0))
        var g = i
      }else if (i >=16 && i<=31){
        var F = (B&D) | (C& (~D >>> 0))
        var g = (i*5 +1)%16
      }else if (i >=32 && i<=47){
        var F = B^C^D
        var g = (i*3 +5)%16
      }else if (i >=48 && i<=63){
        var F = C ^ (B| (~D >>> 0))
        var g = (i*7)%16
      }
      //Adjust ABCD following the algorithm
      F = (F + A + k[i] + binary_plaintext_divided[g]) >>> 0
      A = D
      D = C
      C = B
      B = (B + ((F << s[i]) | (F >>> (32-s[i])))) >>> 0
    }
    //Add these values to the overall values ensuring mod 2^32
    a0 = (a0 + A)%2**32
    b0 = (b0 + B)%2**32
    c0 = (c0 + C)%2**32
    d0 = (d0 + D)%2**32
  }

  //format output of final hash using little endian
  hash = format_output(a0) + format_output(b0) + format_output(c0) + format_output(d0)
  //Insert into results page
  document.getElementById(
    "md5_ciphertext_content"
  ).innerHTML += `<p>${hash}</p>`;
}

//For md5 - Given an 8 character hex string, convert to little endian output
function format_output(a){
  a = a.toString(16).padStart(8, '0')
  var out = ''
  for (let i=6; i>=0;i-=2){
    out += a.slice(i, i+2)
  }
  return out
}

function sha256(){
  //Initial values are calculated using the first 64 primes, hence reuse previous code to simplify this
  var small_primes = generate_primes_up_to_1000()
  //H values are the fractional parts of the square roots of the first 8 primes
  var h = new Uint32Array(8)
  for (let i=0; i<8; i++){
    var value = Math.floor((Math.sqrt(small_primes[i]) - Math.floor(Math.sqrt(small_primes[i])))* (2**32))
    h[i] = value
  }
  //K values are the fractional parts of the cube roots of the first 64 primes
  var k = new Uint32Array(64)
  for (let i=0; i<64; i++){
    var value = Math.floor((Math.cbrt(small_primes[i]) - Math.floor(Math.cbrt(small_primes[i])))* (2**32))
    k[i] = value
  }

  //Same handling for md5 inputs, except with false signifying big endian
  var plaintext_array = hash_plaintext_handling(false)

  for (let j=0; j<plaintext_array.length; j++){
    //Convert 512 bit string into 16 32-bit words
    var plaintext_divided = plaintext_array[j].match(/(.{1,32})/g)
    //First 16 W values are plaintext, the other 48 use combinations of 
    //rotations/shifts of these
    var w = new Uint32Array(64)
    for (let i=0; i<64; i++){
      if (i<16){
        w[i] = parseInt(plaintext_divided[i], 2)
      }else{
        var s0 = right_rotate(w[i-15],7) ^ right_rotate(w[i-15],18) ^ (w[i-15] >>> 3)
        var s1 = right_rotate(w[i-2],17) ^ right_rotate(w[i-2],19) ^ (w[i-2] >>> 10)
        w[i] = (w[i-16] + s0 + w[i-7] + s1) >>>0
      }
    }
    //Initialise a-h as the set h values
    var a = h[0]
    var b = h[1]
    var c = h[2]
    var d = h[3]
    var e = h[4]
    var f = h[5]
    var g = h[6]
    //We used an array for h rather than h0,h1 etc hence h would refer to the array, 
    //therefore h_val represents the h value in our implementation
    var h_val = h[7]

    //Calculate the values s0,s1,ch,maj,temp1,temp2 as defined in the algorithm
    for (let i=0; i<64; i++){
      var s1 = right_rotate(e, 6) ^ right_rotate(e, 11) ^ right_rotate(e, 25)
      var ch = (e&f) ^ ((~e >>> 0) &g)
      var temp1 = (h_val + s1 + ch + k[i] + w[i]) >>>0
      var s0 = right_rotate(a, 2) ^ right_rotate(a, 13) ^ right_rotate(a, 22)
      var maj = (a&b) ^ (a&c) ^ (b&c)
      var temp2 = (s0 + maj) >>>0

      //Update values a-h accordingly
      h_val = g
      g = f
      f = e
      e = (d + temp1) >>>0
      d = c
      c = b
      b = a
      a = (temp1 + temp2) >>>0
    }
    //Add a-h values to our h values (ensuring mod 2**32 using >>>0)
    h[0] = (h[0] + a)>>>0
    h[1] = (h[1] + b)>>>0
    h[2] = (h[2] + c)>>>0
    h[3] = (h[3] + d)>>>0
    h[4] = (h[4] + e)>>>0
    h[5] = (h[5] + f)>>>0
    h[6] = (h[6] + g)>>>0
    h[7] = (h[7] + h_val)>>>0
  }
  //Get final hash as hex string
  var hash = ''
  for (let i of h){
    hash += i.toString(16).padStart(8, '0')
  }
  //Insert into results page
  document.getElementById(
    "sha256_ciphertext_content"
  ).innerHTML += `<p>${hash}</p>`;
}

//Carries out a circular right rotation by shifting right to get the ending bits, 
//shifting (32 - places) left to get the starting bits and using an OR to combine them
function right_rotate(value, places){
  return ((value >>> places) | (value << (32 - places))) >>> 0;
}

function hash_plaintext_handling(endianness){
  //Encode text in binary
  var plaintext = sessionStorage.getItem("plaintext")
  var encoder = new TextEncoder()
  var plaintext_values = encoder.encode(plaintext)
  var plaintext_length = plaintext_values.length*8
  var binary_plaintext = ''
  for (let i of plaintext_values){
    binary_plaintext += i.toString(2).padStart(8, '0')
  }
  //Append 1 and then x 0s to ensure length is 448 mod 512
  binary_plaintext += '1'
  if (binary_plaintext.length%512 > 448){
    binary_plaintext += '0'.repeat(960 - binary_plaintext.length%512)
  }else {
    binary_plaintext += '0'.repeat(448 - binary_plaintext.length%512)
  }
  
  //Get length of plaintext in little or big endian binary
  var buffer = new ArrayBuffer(8)
  var view = new DataView(buffer)
  //setUint32 allows endianness to be passed in as we are using dataview,
  //however this must be done in two parts as there is no version for 64 bits, 
  //but we must these two steps in different orders to ensure endianness
  if (endianness == false){
    view.setUint32(4, plaintext_length>>>0, endianness)
    view.setUint32(0, Math.floor(plaintext_length/ (2**32)), endianness)
  }else{
    view.setUint32(0, plaintext_length>>>0, endianness)
    view.setUint32(4, Math.floor(plaintext_length/ (2**32)), endianness)
  }
  var lengthLE = new Uint8Array(buffer)
  for (let i of lengthLE){
    binary_plaintext += i.toString(2).padStart(8, '0')
  }
  //Split into array of 512 bit strings
  var plaintext_array = binary_plaintext.match(/(.{1,512})/g)
  return plaintext_array
}