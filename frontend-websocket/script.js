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
    data.messages.forEach((msg, i) => renderMessage(msg, i));
  }
  if (data.command === "new-message") {
    renderMessage(data.message, data.index || messagesDiv.children.length);
  }

  if (data.command === "update-message") {
    const { message, index } = data;
    const messageDiv = messagesDiv.children[index];
    if (messageDiv) {
      // update counts inside existing div
      messageDiv.querySelector(".like-count").textContent = message.likes;
      messageDiv.querySelector(".dislike-count").textContent = message.dislikes;
    }
  }
};
function likeMessage(index) {
  ws.send(JSON.stringify({ command: "like-message", index }));
}

function dislikeMessage(index) {
  ws.send(JSON.stringify({ command: "dislike-message", index }));
}

function renderMessage(msg, index) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<strong>${msg.user}:</strong> ${msg.text} <small>(${new Date(
    msg.time
  ).toLocaleTimeString()})</small><br>
    👍 <span class="like-count">${msg.likes || 0}</span>
    <button onclick="likeMessage(${index})">Like</button>
    👎 <span class="dislike-count">${msg.dislikes || 0}</span>
    <button onclick="dislikeMessage(${index})">Dislike</button>`;
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
