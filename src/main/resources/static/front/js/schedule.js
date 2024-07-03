document.addEventListener("DOMContentLoaded", function () {
  const groupId = document.getElementById("group_id_span").innerText;

  function getTime(meridiem, hour, minute) {
    let adjustedHour = hour;

    if (meridiem === "PM" && hour !== 12) {
      adjustedHour += 12;
    } else if (meridiem === "AM" && hour === 12) {
      adjustedHour = 0;
    }

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}T${String(adjustedHour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00`;
  }

  document
    .querySelector("form")
    .addEventListener("submit", async function (event) {
      event.preventDefault();
      const startMeridiem = document.getElementById(
        "start-meridiem-dropdown",
      ).value;
      const startHour = parseInt(
        document.getElementById("start-hour-dropdown").value,
      );
      const startMinute = parseInt(
        document.getElementById("start-minute-dropdown").value,
      );

      const endMeridiem = document.getElementById(
        "end-meridiem-dropdown",
      ).value;
      const endHour = parseInt(
        document.getElementById("end-hour-dropdown").value,
      );
      const endMinute = parseInt(
        document.getElementById("end-minute-dropdown").value,
      );

      const startTime = getTime(startMeridiem, startHour, startMinute);
      const endTime = getTime(endMeridiem, endHour, endMinute);

      console.log("Start Time:", startTime);
      console.log("End Time:", endTime);

      const { data, error } = await client.from("group_schedule").insert([
        {
          group_id: groupId,
          place: "otherValue",
          datetime: startTime,
          users: "",
          songs: "",
          update_at: "",
        },
      ]);
      if (error) {
        console.error("Error insert schedule ", error);
      } else {
        console.log("insert schedule successfully:", data);
      }
    });
});
