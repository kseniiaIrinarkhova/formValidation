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

let username = regForm.elements["username"];
username.addEventListener("change", (e) => {
    e.preventDefault();
    if (!validateUsername(e.target.value)) {
        showError("Invalid user name, must contain at least two unique characters!", username)
    }
});

let email = regForm.elements["email"];
email.addEventListener("change", (e) => {
    e.preventDefault();
    if (!validateEmail(e.target.value)) {
        showError("The email must not be from the domain 'example.com'!", email);
    }
})

let password = regForm.elements["password"];
password.addEventListener("change", (e) => {
    e.preventDefault();
    let message = validatePassword(e.target.value)
    if (message.length > 0) {
        showError(message, password);
    }
})

regForm.addEventListener("submit", regFormCheck)

/*************************************************************** */
/*************Validation functions****************************** */
function regFormCheck(event) {
    event.preventDefault();
    let errors = "";
    let inputField = null;
    if (!validateUsername(username.value)) {

        errors += "\n Invalid user name, must contain at least two unique characters!";
        //add focus only for the 1st field
        if (inputField === null) inputField = username;

    }
    if (!validateEmail(email.value)) {
        errors += "\n The email must not be from the domain 'example.com'!"
        //add focus only for the 1st field
        if (inputField === null) inputField = email;
    }
    if (errors.length > 0) {
        event.returnValue = false;
        showError(errors, inputField);
        return false;
    }
    return true
}
function validateUsername(username) {
    console.log(username)
    username = String(username).toLowerCase();
    for (let i = 1; i < username.length; i++) {
        if (username[i] !== username[0]) return true;
    }
    return false;
}

function validateEmail(email) {
    console.log(email);
    email = String(email).toLowerCase();
    let regex = new RegExp(".*@example\.com$")
    if (regex.test(email)) return false;
    return true;
}

function validatePassword(password) {
    let errorMessages = "";
    // Passwords must have at least one uppercase and one lowercase letter.
    let regex = new RegExp("([a-z]{1,}[A-Z]{1,})|([A-Z]{1,}[a-z]{1,})");
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
function showError(message, object) {
    let err = errorDisplay.appendChild(document.createElement("pre"));
    if (object) object.focus();
    err.textContent = message;
    errorDisplay.style.display = "block";
}