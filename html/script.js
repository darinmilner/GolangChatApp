let socket = null;
let output = document.getElementById("output");
let userField = document.getElementById("username");
let message = document.getElementById("message");

window.onbeforeunload = function () {
  console.log("leaving");
  let jsonData = {};
  jsonData["action"] = "Left the Chat";
  socket.send(JSON.stringify(jsonData));
};

document.addEventListener("DOMContentLoaded", function () {
  socket = new WebSocket("ws://127.0.0.1:3000/ws");
  socket.onopen = () => {
    console.log("Successfully connected");
  };

  socket.onclose = () => {
    console.log("Connection closed");
  };

  socket.onerror = (error) => {
    console.log("There was an error");
  };

  socket.onmessage = (msg) => {
    // console.log(msg);
    let data = JSON.parse(msg.data);
    console.log("Action is ", data.action);

    switch (data.action) {
      case "listUsers":
        let ul = document.getElementById("online-users");
        while (ul.firstChild) ul.removeChild(ul.firstChild);

        if (data.connectedUsers.length > 0) {
          data.connectedUsers.forEach(function (item) {
            let li = document.createElement("li");
            li.appendChild(document.createTextNode(item));
            ul.appendChild(li);
          });
        }
        break;

      case "broadcast":
        output.innerHTML = output.innerHTML + data.message + "<br>";
        break;
    }
  };

  // let userInput = document.getElementById("username");
  userField.addEventListener("change", function () {
    let jsonData = {};
    jsonData["action"] = "username";
    jsonData["username"] = this.value;

    socket.send(JSON.stringify(jsonData));
  });

  messageField.addEventListener("keydown", function (event) {
    if (event.code === "Enter") {
      if (!socket) {
        console.log("No Connection");
        //Display Alert
        return false;
      }
      event.preventDefault();
      event.stopPropagation();
      sendMessage();
    }
  });

  document.getElementById("sendBtn").addEventListener("click", function () {
    if (userField.value === "" || message.value === "") {
      alert("Fill out user field and message field");
      return false;
    } else {
      sendMessage();
    }
  });
});

function sendMessage() {
  let jsonData = {};
  jsonData["action"] = "broadcast";
  jsonData["username"] = document.getElementById("username").value;
  jsonData["message"] = document.getElementById("message").value;
  socket.send(JSON.stringify(jsonData));

  document.getElementByID("message").value = "";
}

function error(msg) {
  notie.alert({
    type: "error", // optional, default = 4, enum: [1, 2, 3, 4, 5, 'success', 'warning', 'error', 'info', 'neutral']
    text: msg,
  });
}
