document.addEventListener("DOMContentLoaded", async () => {
  const chatInput = document.getElementById("send_chat_input");
  const sendButton = document.getElementById("send_chat_button");
  const chatMessages = document.getElementById("chat_messages");
  const chatType = "group"; // 'group' 또는 'private', 상황에 맞게 설정
  const recipientId = "recipient-user-id"; // 개인 채팅인 경우 설정

  await renderGroup();

  async function getLoggedInUserId() {
    const authInfo = await client.auth.getSession();
    const session = authInfo.data.session;
    const userId = session.user.id;
    console.log("userId:", userId);
    return userId;
  }

  const loggedInUserId = await getLoggedInUserId(); // 사용자 ID를 비동기적으로 가져옴
  console.log("Logged In User ID:", loggedInUserId);

  // 그룹 멤버를 렌더링하는 함수
  async function renderGroup() {
    const groupId = "bbc263f3-7365-41f1-a9ad-6512e80e231b";
    const memberList = await getUserList(groupId);
    const memberListContainer = document.getElementById("member_list");

    memberListContainer.innerHTML = ""; // 기존 멤버 목록을 초기화

    // 그룹명 설정
    document.getElementById("group_name_span").textContent =
      await getGroupName(groupId);

    memberList.forEach((member) => {
      const memberElement = document.createElement("div");
      memberElement.classList.add("user_item");

      const img = document.createElement("img");
      img.src = "/img/icons/my_profile.svg"; // 실제 이미지 경로로 대체
      img.alt = "회원 이미지";

      const userName = document.createElement("span");
      userName.textContent = member.user_name;

      memberElement.appendChild(img);
      memberElement.appendChild(userName);
      memberListContainer.appendChild(memberElement);
    });
  }

  async function addMessageToChat(message) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message");
    if (message.sender_id === loggedInUserId) {
      messageElement.classList.add("message_self");
    }

    const img = document.createElement("img");
    img.src = "/img/icons/my_profile.svg"; // 실제 이미지 경로로 대체
    img.alt = "회원 이미지";

    const messageContent = document.createElement("div");
    messageContent.classList.add("message_content");

    const user = await getUserById(message.sender_id);
    const userName = document.createElement("span");
    userName.classList.add("user_name");
    userName.textContent = user ? `${user.user_name}` : "알 수 없는 사용자";

    const messageText = document.createElement("p");
    messageText.classList.add("message_text");
    messageText.textContent = message.content;

    const messageTime = document.createElement("span");
    messageTime.classList.add("message_time");
    messageTime.textContent = new Date(message.created_at).toLocaleTimeString();

    messageContent.appendChild(userName);
    messageContent.appendChild(messageText);
    messageContent.appendChild(messageTime);

    messageElement.appendChild(img);
    messageElement.appendChild(messageContent);

    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight; // 메시지를 추가한 후 스크롤을 맨 아래로 이동
  }

  sendButton.addEventListener("click", async () => {
    const content = chatInput.value;
    if (content.trim() === "") return;

    const messageData = {
      content,
      sender_id: loggedInUserId,
      chat_type: chatType,
    };

    if (chatType === "group") {
      messageData.group_id = "bbc263f3-7365-41f1-a9ad-6512e80e231b";
    } else {
      messageData.recipient_id = recipientId;
    }

    const { data, error } = await client.from("messages").insert([messageData]);

    if (error) {
      console.error("Error sending message:", error.message);
    } else {
      chatInput.value = "";
    }
  });

  const messageSubscription = client
    .channel("public:messages")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "messages" },
      (payload) => {
        const message = payload.new;
        addMessageToChat(message);
      },
    )
    .subscribe();

  async function loadMessages() {
    const { data, error } = await client
      .from("messages")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error loading messages:", error.message);
    } else {
      data.forEach((message) => {
        addMessageToChat(message);
      });
      // 메시지를 모두 로드한 후 스크롤을 맨 아래로 이동
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }

  await loadMessages();
});
