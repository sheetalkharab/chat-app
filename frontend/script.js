const userName = document.getElementById("userName");
const newMessage = document.getElementById("newMessage");
const messagesDiv = document.getElementById("messages");

const backendURL =
  "https://sheetalkharab-chatapp-backend.hosting.codeyourfuture.io/messages";
// Track last message timestamp
let lastMessageTime = null;

async function loadMessages() {
  try {
    const url = lastMessageTime
      ? `${backendURL}?since=${lastMessageTime}`
      : backendURL;
    const res = await fetch(url);
    const data = await res.json();
    messagesDiv.innerHTML = ""; // reset

    data.forEach((msg) => {
      const div = document.createElement("div");
      div.classList.add("message");
      div.innerText = `${msg.user}: ${msg.text} (${new Date(
        msg.time
      ).toLocaleTimeString()})`;
      messagesDiv.appendChild(div);

      lastMessageTime = msg.time; // update last seen time
    });
    // Scroll to bottom
    messagesDiv.scrollTop = messagesDiv.scrollHeight;

    // Immediately start polling again
    loadMessages();
  } catch (error) {
    console.error("Polling error:", error);
    setTimeout(loadMessages, 5000); // retry after 5 seconds
  }
}

async function addNewMessage() {
  const user = userName.value || "Anonymous";
  const text = newMessage.value.trim();
  if (!text) return alert("Please enter your text.");
  try {
    const res = await fetch(backendURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user, text }),
    });

    if (!res.ok) {
      const err = await res.json();
      return alert(err.error || "Failed to send message.");
    }
    userName.value = "";
    newMessage.value = "";
  } catch (error) {
    console.error("Error sending message:", error);
  }
}
document.getElementById("enter").addEventListener("click", addNewMessage);
loadMessages();
