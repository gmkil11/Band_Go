document.addEventListener('DOMContentLoaded', async function () {
    if (!await checkLogin()) {
        window.location.href = "http://localhost:8080/login";
    }


})
