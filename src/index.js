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
    let message = validateUsername(e.target.value)
    if (message) {
        showError(message, password);
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
regForm.addEventListener("submit", regFormCheck);

/*********************Login form******************************** */

loginForm.addEventListener("submit", (event) =>{
    event.preventDefault();
    //check username
    let username = loginForm.elements["username"];
    if(!userExist(username.value)){
        showError("Username does not exist!", username);
        return false;
    }

    let password = loginForm.elements["password"];
    if (!userDataCheck(username.value, password.value)) {
        showError("Password is incorrect");
        return false;
    }
    else{
        if (loginForm.querySelector("input[type = 'checkbox']").checked){
            alert(`Welcome, ${username.value}! Your information is saved for this page and you will be auto login next time.`);
        }else{
        alert(`Welcome, ${username.value}!`);
        }
        clearForm(loginForm);
    }
});

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
    let usernameErrors = validateUsername(username.value);
    if (usernameErrors) {

        errors += usernameErrors;
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
        clearForm(regForm);
        alert(`Congrads, ${user.username}! You are registred!`)        
    }
    return true
}

/**
 * Function for username validation
 * @param {string} username 
 * @returns error message
 */
function validateUsername(username) {
    //username would be in lowercase    
    username = String(username).toLowerCase();
    //return value
    let isvalid = false;
    //error message
    let errors = "";
    //check if we have any other character then the first one
    for (let i = 1; i < username.length; i++) {
        //if we find another character - username is valid
        if (username[i] !== username[0]) {
            isvalid = true;
            break;
        }
    }
    if (!isvalid) errors += "Invalid user name, must contain at least two unique characters!";
    
    //try to find the same user in localStodage
    let userFromLS = localStorage.getItem(username);
    console.log(userFromLS)
    if (userFromLS !== null) errors +=  username + " is already taken!" ;

    return errors;
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

/**
 * Save user after form validation
 * @returns user object
 */
function saveUser(){
let newUser = {};
newUser["username"] = username.value.toLowerCase();
newUser["email"] = email.value.toLowerCase();
newUser["password"] = password.value;
localStorage.setItem(newUser.username, JSON.stringify(newUser));
    //console.log(JSON.parse(localStorage.getItem(newUser.username)));
return newUser;
}

/**
 * clear all registration form
 */
function clearForm(form){
    form.reset();
}

function userExist(username){
   return localStorage.getItem(username.toLowerCase()) !== null ;
}

function userDataCheck(username, password){
    //as we checked firstly username, user should exist in this check
    let userData = JSON.parse(localStorage.getItem(username.toLowerCase()));
    return userData.password === password;
}
