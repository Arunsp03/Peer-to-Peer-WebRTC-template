const localConnection = new RTCPeerConnection();
let sendChannel;

function init() {
    localConnection.onicecandidate = e => {
        // Handle ICE candidate events
        console.log("New ICE candidate: " + JSON.stringify(localConnection.localDescription));
    };

    
    sendChannel = localConnection.createDataChannel("sendChannel");
    sendChannel.onmessage = e => console.log("Message received on sendChannel: " + e.data);
    sendChannel.onopen = () => console.log("sendChannel opened");
    sendChannel.onclose = () => console.log("sendChannel closed");

    localConnection.ondatachannel = e => {
       sendChannel = e.channel;
       sendChannel.onmessage = e => console.log("Message received: " + e.data);
       sendChannel.onopen = () => console.log("Data channel opened");
       sendChannel.onclose = () => console.log("Data channel closed");
    };


    console.log("Local connection initialized.");
}

function createOffer() {
    localConnection.createOffer()
        .then(o => localConnection.setLocalDescription(o))
        .then(() => console.log("Offer created: " + JSON.stringify(localConnection.localDescription)))
        .catch(error => console.error("Error creating offer: ", error));
}

async function setOffer() {
    let offer = new RTCSessionDescription(JSON.parse(document.getElementById("text1").value));
    await localConnection.setRemoteDescription(offer);
    await localConnection.createAnswer()
        .then(a => localConnection.setLocalDescription(a))
        .then(() => console.log("Answer created: " + JSON.stringify(localConnection.localDescription)))
        .catch(error => console.error("Error creating answer: ", error));
}

async function setAnswer() {
    let answer = new RTCSessionDescription(JSON.parse(document.getElementById("text1").value));
    await localConnection.setRemoteDescription(answer);
}

function sendMessage() {
    sendChannel.send("hello");
}

init();
