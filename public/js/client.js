const socket = io();
let chats = document.querySelector(".chats");
var users_list = document.querySelector(".users_list");
var users_count = document.querySelector(".users_count");
var user_msg = document.querySelector("#user_msg");
var msg_send = document.querySelector("#user_send");

var username;
do {
  username = prompt("Enter Your Name: ");
} while (!username);
{
  //It will be called when user will join
  socket.emit("new-user-joined", username);
}

// Notifing that user is joined
socket.on("user-connected", (socket_name) => {
  userjoinLeft(socket_name, "Joined");
});
// function to create joinded status div
function userjoinLeft(name, status) {
  let div = document.createElement("div");
  div.classList.add("user_join");
  let content = `<p><b>${name}</b> ${status} the chat</p>`;
  div.innerHTML = content;
  chats.appendChild(div);
  chats.scrollTop = chats.scrollHeight

}

// Notifing that user has left
socket.on("user-disconnected", (user) => {
  userjoinLeft(user, "Left");
});

// For updating users list and user counts
socket.on("user-list", (users) => {
  users_list.innerHTML = "";
  users_arr = Object.values(users);
  for (i = 0; i < users_arr.length; i++) {
    let p = document.createElement("p");
    p.innerHTML = users_arr[i];
    users_list.appendChild(p);
  }
  users_count.innerHTML = users_arr.length;
});

// for sending Message
msg_send.addEventListener("click", () => {
  let data = {
    user: username,
    msg: user_msg.value,
  };
  if (user_msg.values != "") {
    appendMessage(data, "outgoing");
    socket.emit("message", data);
    user_msg.value = "";
  }
});

function appendMessage(data, status) {
  let div = document.createElement("div");
  div.classList.add("message", status);
  let content = `
  <h5>${data.user}</h5>
  <p>${data.msg}</p>
  `;
  div.innerHTML= content
  chats.appendChild(div)
  chats.scrollTop = chats.scrollHeight
}


socket.on("message", (data)=>{
  appendMessage(data, "incoming")
})