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
console.log(username)
username.addEventListener("change", (e) =>{
    e.preventDefault();
    if(! validateUsername(e.target.value)){
        showError("Invalid user name, must contain at least two unique characters!")        
    }
});

/*************************************************************** */
/*************Validation functions****************************** */
function validateUsername(username){
    console.log(username)
    username = String(username).toLowerCase();
    for (let i = 1; i < username.length; i++) {
        if ( username[i] !== username[0]) return true;
    }
    return false;
}



/***************************************************************** */
function showError(message){
    let err = errorDisplay.appendChild(document.createElement("h3"));
    username.focus();
    err.textContent = message;
    errorDisplay.style.display = "block";
}