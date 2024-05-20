document.addEventListener('DOMContentLoaded', async function () {
    if (!await checkLogin()) {
        window.location.href = "http://localhost:8080/login";
    }

    const publicButtonBox = document.querySelector(".public_button_box")

    publicButtonBox.addEventListener('click', checkPublicButton);

    function checkPublicButton() {
        const publicButtonBox = document.querySelector(".public_button")
        const publicButton = document.getElementById("public");
        const nonPublicButtonBox = document.querySelector(".no_public_button");
        const nonPublicButton = document.getElementById("no_public")

        if (publicButton.checked) {
            publicButtonBox.classList.add("public_checked");
            nonPublicButtonBox.classList.add("public_no_checked");
            publicButtonBox.classList.remove("public_no_checked");
            nonPublicButtonBox.classList.remove("public_checked");
        }

        if (nonPublicButton.checked) {
            publicButtonBox.classList.add("public_no_checked");
            nonPublicButtonBox.classList.add("public_checked");
            publicButtonBox.classList.remove("public_checked");
            nonPublicButtonBox.classList.remove("public_no_checked");
        }
    }

    const sessionButtonBox = document.querySelector(".session_button_box")

    sessionButtonBox.addEventListener('click', checkSessionButton);
    function checkSessionButton() {
        const vocal = document.getElementById("vocal");
        const vocalBox = document.querySelector(".vocal_box");
        const guitar = document.getElementById("guitar");
        const guitarBox = document.querySelector(".guitar_box");
        const bass = document.getElementById("bass");
        const bassBox = document.querySelector(".bass_box");
        const drum = document.getElementById("drum");
        const drumBox = document.querySelector(".drum_box");
        const keyboard = document.getElementById("keyboard");
        const keyboardBox = document.querySelector(".keyboard_box");
        const brass = document.getElementById("brass");
        const brassBox = document.querySelector(".brass_box");

        if (vocal.checked) {
            vocalBox.classList.replace("session_no_checked", "session_checked");
        } if (!vocal.checked) {
            vocalBox.classList.replace("session_checked", "session_no_checked");
        }

        if (guitar.checked) {
            guitarBox.classList.replace("session_no_checked", "session_checked");
        } if (!guitar.checked) {
            guitarBox.classList.replace("session_checked", "session_no_checked");
        }

        if (bass.checked) {
            bassBox.classList.replace("session_no_checked", "session_checked");
        } if (!bass.checked) {
            bassBox.classList.replace("session_checked", "session_no_checked");
        }

        if (drum.checked) {
            drumBox.classList.replace("session_no_checked", "session_checked");
        } if (!drum.checked) {
            drumBox.classList.replace("session_checked", "session_no_checked");
        }

        if (keyboard.checked) {
            keyboardBox.classList.replace("session_no_checked", "session_checked");
        } if (!keyboard.checked) {
            keyboardBox.classList.replace("session_checked", "session_no_checked");
        }

        if (brass.checked) {
            brassBox.classList.replace("session_no_checked", "session_checked");
        } if (!brass.checked) {
            brassBox.classList.replace("session_checked", "session_no_checked");
        }
    }



})
