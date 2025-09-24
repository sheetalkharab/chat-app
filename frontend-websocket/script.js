const username = document.getElementById("userName");
const newMessage = document.getElementById("newMessage");
const messagesDiv = document.getElementById("messages");
const sendBtn = document.getElementById("enter");

const ws = new WebSocket("ws://localhost:3000");
ws.onopen = () => {
  console.log("connected to webSocket server");
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);

  if (data.command === "all-messages") {
    messagesDiv.innerHTML = "";
    data.messages.forEach(renderMessage);
  }
  if (data.command === "new-message") {
    renderMessage(data.message);
  }
};

function renderMessage(msg) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerText = `${msg.user}: ${msg.text} (${new Date(
    msg.time
  ).toLocaleTimeString()})`;
  messagesDiv.appendChild(div);

  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}
// Send new message
function sendMessage() {
  const user = userName.value || "Anonymous";
  const text = newMessage.value.trim();
  if (!text) return alert("Please enter your message");

  ws.send(
    JSON.stringify({
      command: "send-message",
      message: { user, text },
    })
  );

  newMessage.value = "";
  username.value = "";
}

sendBtn.addEventListener("click", sendMessage);
