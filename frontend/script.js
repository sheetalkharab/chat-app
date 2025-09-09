async function loadMessages() {
  const res = await fetch(
    "https://sheetalkharab-chatapp-backend.hosting.codeyourfuture.io/messages"
  );
  const data = await res.json();

  const messagesDiv = document.getElementById("messages");
  messagesDiv.innerHTML = ""; // clear previous messages

  data.forEach((msg) => {
    const p = document.createElement("p");
    p.innerText = `${msg.user}: ${msg.text} (${new Date(
      msg.time
    ).toLocaleTimeString()})`;
    messagesDiv.appendChild(p);
  });
}
async function addNewMessage() {
  const userName = document.getElementById("userName").value;
  const newMessage = document.getElementById("newMessage").value;
  if (!newMessage || newMessage.trim() === "") {
    alert("Please enter your text.");
    return;
  }
  const res = await fetch(
    "https://sheetalkharab-chatapp-backend.hosting.codeyourfuture.io/messages",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user: userName || "Anonymous", text: newMessage }),
    }
  );

  if (res.ok) {
    alert("text added successfully!");
    // Optionally clear input fields after submission of new quote
    document.getElementById("newMessage").value = "";
    document.getElementById("userName").value = "";
    loadMessages();
  } else {
    alert("Failed to add message.");
  }
}
document.getElementById("enter").addEventListener("click", addNewMessage);
loadMessages();
