window.onload = async function() {


    const { data: { user } } = await client.auth.getUser()

    if (user) {
        const uid = user.user_metadata.user_name;
        console.log(user);
        const userInfoDiv = document.getElementById('user-info');
        userInfoDiv.textContent = uid + "님 안녕하세요";
    } else {
        console.log('session is none');
    }

}