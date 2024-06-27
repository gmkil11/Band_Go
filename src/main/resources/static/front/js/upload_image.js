function renderImage(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      document.getElementById("profile_picture_img").src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}

async function uploadImage(event, uuid) {
  const avatarFile = event.target.files[0];
  const { data, error } = await client.storage
    .from("user_profile_images")
    .upload(`public/${uuid}`, avatarFile, {
      cacheControl: "3600",
      upsert: false,
    });
  console.log(data);
  console.log(error);
  if (error) {
    console.log("duplicate 탐");
    const { dataDuplicate, errorDuplicate } = await client.storage
      .from("user_profile_images")
      .update(`public/${uuid}`, avatarFile, {
        cacheControl: "3600",
        upsert: false,
      });
    console.log(dataDuplicate);
    console.log(errorDuplicate);
  }
}
