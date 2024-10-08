document.addEventListener("DOMContentLoaded", async function () {
  showSpinner();
  const groupId = document.getElementById("group_id_span")?.innerText;
  const userId = await getLoggedInUserId();

  setupEventListeners(groupId, userId);

  await getGroupImg(groupId);

  if (groupId) {
    renderUsers(await getUserList(groupId));
    generateInviteLink(
      document.getElementById("invite_link_span"),
      groupId,
      userId,
    );
    await renderSchedules(
      await getScheduleList(groupId),
      groupId,
      document.getElementById("scheduleTableBody"),
      false,
    );
  }

  hideSpinner();
});
