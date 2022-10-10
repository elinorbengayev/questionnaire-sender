
function showMessage(text, title, icon = 'warning'){
    swal({
        title: title,
        text:text,
        icon: icon,
        button: 'Got it',
    })
}

function handleLoadingSubmitButton(){
    let button = document.getElementById("submitButton")
    let spinner = document.getElementById("loadingSpinner")
    spinner.hidden = false;
    button.disabled = true;
}

function handleUnLoadingSubmitButton(){
    let button = document.getElementById("submitButton")
    let spinner = document.getElementById("loadingSpinner")
    spinner.hidden = true;
    button.disabled = false;
}

async function checkFetch(response) {
    let errorText = ""
    if (!response.ok) {
        if (response.statusText.includes("Failed to fetch") || response.status === 404) {
            errorText = "Problem with loading content, please check your connection.\n";
        } else if (response.status === 400)
            errorText = "Error with request's parameters[" + response.status + "]\n"
        else if (response.status === 403)
            errorText = "Problem with fetching content, please check the fetch url\n";
        else {
            errorText = "Problem with request [" + response.status + "]\n"
        }
        throw Error(errorText)
    }
    return response
}

async function triggerQuestionnaireMail(){
    let pID = document.getElementById("inputPatientID").value;
    if(!pID)
        showMessage("Missing patient's ID", "Invalid input", "error")
    let email = document.getElementById("inputPatientEmail").value;
    if(!email)
        showMessage("Missing patient's email", "Invalid input", "error")
    else{
        handleLoadingSubmitButton();
        let url = "https://czp2w6uy37-vpce-0bdf8d65b826a59e3.execute-api.us-east-1.amazonaws.com/test/questionnaire_sender?".concat("patient_id=", pID, "&email=", email)
        console.log(url)
        await fetch(url)
            .then(response => checkFetch(response))
            .then(
                result => {
                    showMessage("", "Mail trigger sent successfully", "success")
                    handleUnLoadingSubmitButton()
                    document.getElementById("inputPatientID").value = ""
                    document.getElementById("inputPatientEmail").value = ""
                }
            )
            .catch((error) => {
                error = error.toString()
                console.error(error)
                if(error.includes("Failed to fetch"))
                    alert("Problem with loading content, please check your connection.\n");
                else showMessage("Encountered an internal system error, unable to send details", "Problem triggering an email", "error")
                handleUnLoadingSubmitButton()
            });
    }
}

document.getElementById("submitButton").addEventListener("click", triggerQuestionnaireMail);

