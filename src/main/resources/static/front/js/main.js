window.onload = async function() {


    const { data: { user } } = await client.auth.getUser()


    var dropdown1 = document.querySelector(".dropdown_bar1");
    var dropdownContent1 = document.querySelector(".dropdown_content1");
    var dropdown2 = document.querySelector(".dropdown_bar2");
    var dropdownContent2 = document.querySelector(".dropdown_content2");

    dropdown1.addEventListener("click", function() {
        if (dropdownContent1.style.display === "block") {
            dropdownContent1.style.display = "none";
            console.log("알림버튼 클릭");
        } else {
            dropdownContent1.style.display = "block";
        }
    });

    dropdown2.addEventListener("click", function() {
        if (dropdownContent2.style.display === "block") {
            dropdownContent2.style.display = "none";
            console.log("마이페이지버튼 클릭");
        } else {
            dropdownContent2.style.display = "block";
        }
    });


}