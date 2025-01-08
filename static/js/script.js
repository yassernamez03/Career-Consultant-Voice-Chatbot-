navbar = $(".navbar")

let theme = localStorage.getItem("theme") ? localStorage.getItem("theme") : "light"

$(window).on("load", ()=>{
    themeLoader(theme)
})

$(window).scroll(function() {
    
    navbar.css('padding-top', '1.5em')
    navbar.css('padding-bottom', '1.5em')
    navbar.css('padding-top', '1.5em')
    $(".navbar .btn-container").css('opacity', '1')
    $(".navbar .btn-container").css('pointer-events', 'all')


})

$("#theme-switcher").on("click", ()=>{
    themeToggle()
})

function themeLoader(theme){
    if(theme=="light"){
        $(".navbar #theme-switcher .circle").css("right", "2px")
        $(".navbar #theme-switcher .circle").css("left", "unset")

        document.documentElement.style.setProperty("--background", "#FAF3E0");
        document.documentElement.style.setProperty("--white", "#0e0e0e");
        document.documentElement.style.setProperty("--convo-grey", "#e4c295");
        document.documentElement.style.setProperty("--message-white", "#FFF");
        document.documentElement.style.setProperty("--background-image", "url('/static/res/logo-light.png')");
        document.documentElement.style.setProperty("--image", "url('/static/res/image-light.png')");
    } else {
        $(".navbar #theme-switcher .circle").css("left", "2px")
        $(".navbar #theme-switcher .circle").css("right", "unset")

        document.documentElement.style.setProperty("--background", "#2A2A2A");
        document.documentElement.style.setProperty("--white", "white");
        document.documentElement.style.setProperty("--convo-grey", "#1A1A1A");
        document.documentElement.style.setProperty("--message-white", "#e1e1e1");
        document.documentElement.style.setProperty("--background-image", "url('/static/res/logo.png')");
        document.documentElement.style.setProperty("--image", "url('/static/res/image.png')");
    }
}

function themeToggle(){
    if(theme=="dark"){
        localStorage.setItem("theme", "light")
        theme = "light" //toggling theme
        $(".navbar #theme-switcher .circle").css("right", "2px")
        $(".navbar #theme-switcher .circle").css("left", "unset")

        document.documentElement.style.setProperty("--background", "#FAF3E0");
        document.documentElement.style.setProperty("--white", "#0e0e0e");
        document.documentElement.style.setProperty("--convo-grey", "#e4c295");
        document.documentElement.style.setProperty("--message-white", "#FFF");
        document.documentElement.style.setProperty("--background-image", "url('/static/res/logo-light.png')");
        document.documentElement.style.setProperty("--image", "url('/static/res/image-light.png')");
    } else {
        localStorage.setItem("theme", "dark")
        theme = "dark"
        $(".navbar #theme-switcher .circle").css("left", "2px")
        $(".navbar #theme-switcher .circle").css("right", "unset")

        document.documentElement.style.setProperty("--background", "#2A2A2A");
        document.documentElement.style.setProperty("--white", "white");
        document.documentElement.style.setProperty("--convo-grey", "#1A1A1A");
        document.documentElement.style.setProperty("--message-white", "#e1e1e1");
        document.documentElement.style.setProperty("--background-image", "url('/static/res/logo.png')");
        document.documentElement.style.setProperty("--image", "url('/static/res/image.png')");
    }
}


let mediaRecorder;
let audioChunks = [];
let isRecording = false;

document.getElementById("record-button-container").addEventListener("click", async function (e) {
    e.preventDefault();

    const micIcon = document.getElementById("record-voice");

    if (!isRecording) {
        // Start recording
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start();

        isRecording = true;
        micIcon.style.color = "red"; // Indicate recording

        audioChunks = [];
        mediaRecorder.addEventListener("dataavailable", event => {
            audioChunks.push(event.data);
        });

        mediaRecorder.addEventListener("stop", () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            sendAudioToBackend(audioBlob);
        });

        console.log("Recording started...");
    } else {
        // Stop recording
        mediaRecorder.stop();
        isRecording = false;
        micIcon.style.color = ""; // Reset mic color
        console.log("Recording stopped.");
    }
});

function sendAudioToBackend(audioBlob) {
    const formData = new FormData();
    formData.append("audio", audioBlob);

    fetch("/upload-audio", {
        method: "POST",
        body: formData,
    })
    .then(response => response.json())
    .then(data => console.log("Audio uploaded:", data))
    .catch(error => console.error("Error uploading audio:", error));
}


function sendAudioToBackend(audioBlob) {
    const formData = new FormData();
    formData.append("audio", audioBlob);

    // Display the audio on the page
    displayRecordedAudio(audioBlob);

    fetch("/upload-audio", {
        method: "POST",
        body: formData,
    })
    .then(response => response.json())
    .then(data => console.log("Audio uploaded:", data))
    .catch(error => console.error("Error uploading audio:", error));
}

function displayRecordedAudio(audioBlob) {
    const audioURL = URL.createObjectURL(audioBlob);

    // Create an audio element
    const audioElement = document.createElement("audio");
    audioElement.controls = true; // Enable play/pause controls
    audioElement.src = audioURL;

    // Append the audio element to the conversation div
    const conversationDiv = document.querySelector(".conversation");
    const audioContainer = document.createElement("div");
    audioContainer.classList.add("audio-message");
    audioContainer.appendChild(audioElement);

    conversationDiv.appendChild(audioContainer);

    // Scroll to the bottom of the conversation div
    conversationDiv.scrollTop = conversationDiv.scrollHeight;
}
