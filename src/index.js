//get main elements:
console.log(document);
const body = document.querySelector("body");
console.log(body);

//registration form
const regForm = document.getElementById("registration");
console.log(regForm)
//login form 
const loginForm = document.getElementById("login");
//box for validation error
const errorDisplay = document.getElementById("errorDisplay");



/************************************************************** */
/**************Event Handlers********************************** */

/*************Registration form******************************** */

//Username
let username = regForm.elements["username"];
//on change event
username.addEventListener("change", (e) => {
    e.preventDefault();
    if (!validateUsername(e.target.value)) {
        showError("Invalid user name, must contain at least two unique characters!", username)
    }
});

//Email
let email = regForm.elements["email"];
//On change event
email.addEventListener("change", (e) => {
    e.preventDefault();
    if (!validateEmail(e.target.value)) {
        showError("The email must not be from the domain 'example.com'!", email);
    }
})

//Password
let password = regForm.elements["password"];
//on change event
password.addEventListener("change", (e) => {
    e.preventDefault();
    let message = validatePassword(e.target.value)
    if (message.length > 0) {
        showError(message, password);
    }
})

//Password check
let passwordCheck = regForm.elements["passwordCheck"];
// on input event check every letter
passwordCheck.addEventListener("input", (e) => {
    //password in passwordCheck input
    let pwd = e.target.value
    //find the index of last character
    let index = pwd.length - 1;
    //check if we have password and our passwordcheck is the same or less length
    if(password.value.length > index){
        //if last character in password check is not the same as in password - show an error
        if (password.value[index] !== pwd[index]) showError("Passwords do not match", passwordCheck);
        return false;
    }
    else{
        //threr is no password or password check longer than password
        showError("Passwords do not match", passwordCheck);
        return false;
    }
})

//event listener on submit event
regForm.addEventListener("submit", regFormCheck)

/*************************************************************** */
/*************Validation functions****************************** */

/**
 * Submit form validation
 * @param {submit} event 
 * @returns false if any inputs are invalid, true otherwise
 */
function regFormCheck(event) {
    event.preventDefault();
    //all error messages
    let errors = "";

    //check username
    if (!validateUsername(username.value)) {

        errors += "\n Invalid user name, must contain at least two unique characters!";
        //add focus only for the 1st field
        if (inputField === null) inputField = username;

    }
    //check email
    if (!validateEmail(email.value)) {
        errors += "\n The email must not be from the domain 'example.com'!"
        //add focus only for the 1st field
        if (inputField === null) inputField = email;
    }
    //check password
    let pwdErrors = validatePassword(password.value);
    if (pwdErrors) {
        errors += pwdErrors;
        if (inputField === null) inputField = password;
    }
    //check password match
    if(password.value !== passwordCheck.value){
        errors += "\n Passwords do not match!"
        //add focus only for the 1st field
        if (inputField === null) inputField = passwordCheck;
    }
    //check terms and conditions
    let isAccepted = regForm.querySelector("input[type = 'checkbox']").checked;
    if(!isAccepted){
        errors += "\n The terms and conditions must be accepted."
    }
    //if we got any error messages - validation failed
    if (errors.length > 0) {
        event.returnValue = false;
        showError(errors, inputField);
        return false;
    }

    //form is valid
    let user = saveUser();
    if (user !== null){
        alert(`Congrads, ${user.username}! You are registred!`)
        //clearRegForm();
    }
    return true
}

/**
 * Function for username validation
 * @param {string} username 
 * @returns true if username is valid, false if is not
 */
function validateUsername(username) {
    //username would be in lowercase    
    username = String(username).toLowerCase();
    //check if we have any other character then the first one
    for (let i = 1; i < username.length; i++) {
        //if we find another character - username is valid
        if (username[i] !== username[0]) return true;
    }
    //do not find unique 2 characters. username is invalid
    return false;
}

/**
 * Function for email validation
 * @param {string} email 
 * @returns true if email is valid, false if is not
 */
function validateEmail(email) {
    //email would be in lowercase only
    email = String(email).toLowerCase();
    //should not contain @example.com
    let regex = new RegExp(".*@example\.com$")
    //test for this regex if contains - email is invalid
    if (regex.test(email)) return false;
    //email is valid
    return true;
}

/**
 * Function for password validation
 * @param {string} password 
 * @returns true if password is complex enough, otherwise - false
 */
function validatePassword(password) {
    //collect all errors in password
    let errorMessages = "";
    // Passwords must have at least one uppercase and one lowercase letter.
    let regex = new RegExp("([a-z]{1,}.*[A-Z]{1,})|([A-Z]{1,}.*[a-z]{1,})");
    if (!regex.test(password)) errorMessages += "\n Password must have at least one uppercase and one lowercase letter."
    // Passwords must contain at least one number.
    regex = new RegExp("[0-9]+")
    if (!regex.test(password)) errorMessages += "\n Password must contain at least one number."
    // Passwords must contain at least one special character.
    regex = new RegExp("\W+");
    if (!regex.test(password)) errorMessages += "\n Password must contain at least one special character."
    // Passwords cannot contain the word "password"(uppercase, lowercase, or mixed).
    regex = new RegExp("password");
    if (regex.test(password.toLowerCase())) errorMessages += "\n Password cannot contain the word 'password'."
    // Passwords cannot contain the username.
    if (username.value) {
        regex = new RegExp(username.value);
        if (regex.test(password.toLowerCase())) errorMessages += "\n Password cannot contain the username."
    }
    
    return errorMessages;
}

/***************************************************************** */
/**
 * Utility function for error box display
 * @param {string} message 
 * @param {DOM object} object  - optional
 */
function showError(message, object) {
    //create new element in errorBox
    let err = errorDisplay.appendChild(document.createElement("pre"));
    //If we have invalid object - focus on it
    if (object) object.focus();
    //add error text in new DOM element
    err.textContent = message;
    //show error box on page
    errorDisplay.style.display = "block";
}