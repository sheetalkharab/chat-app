const username = document.getElementById("userName");
const newMessage = document.getElementById("newMessage");
const messagesDiv = document.getElementById("messages");
const sendBtn = document.getElementById("enter");

const ws = new WebSocket(
  "wss://sheetalkharab-websocketchatapp.hosting.codeyourfuture.io"
);
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

  const userEl = document.createElement("strong");
  userEl.textContent = `${msg.user}: `;

  const textEl = document.createElement("span");
  textEl.textContent = msg.text;

  const timeEl = document.createElement("small");
  timeEl.textContent = ` (${new Date(msg.time).toLocaleTimeString()})`;

  // Like / Dislike section
  const likeBtn = document.createElement("button");
  likeBtn.textContent = "Like";
  likeBtn.onclick = () => likeMessage(index);

  const dislikeBtn = document.createElement("button");
  dislikeBtn.textContent = "Dislike";
  dislikeBtn.onclick = () => dislikeMessage(index);

  const likeCount = document.createElement("span");
  likeCount.classList.add("like-count");
  likeCount.textContent = msg.likes || 0;

  const dislikeCount = document.createElement("span");
  dislikeCount.classList.add("dislike-count");
  dislikeCount.textContent = msg.dislikes || 0;

  div.appendChild(userEl);
  div.appendChild(textEl);
  div.appendChild(timeEl);
  div.appendChild(document.createElement("br"));
  div.append("👍 ");
  div.appendChild(likeCount);
  div.append(" ");
  div.appendChild(likeBtn);

  div.append(" 👎 ");
  div.appendChild(dislikeCount);
  div.append(" ");
  div.appendChild(dislikeBtn);
  messagesDiv.appendChild(div);

  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}
// Send new message
function sendMessage() {
  const user = username.value || "Anonymous";
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
