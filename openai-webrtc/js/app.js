// instance of RTCDataChannel https://developer.mozilla.org/ja/docs/Web/API/RTCDataChannel
var dc = null;
// instaance of RTCPeerConnection https://developer.mozilla.org/ja/docs/Web/API/RTCPeerConnection
var pc = null;

/*
 * OpenAIのRealtime APIのモデルと、WebRTCによる会話を開始する。
 */
async function init() {
  /*
   * Get an ephemeral key from the database running APEX app.
   */
  let EPHEMERAL_KEY = null;
  await apex.server.process("GET_EPHEMERAL_TOKEN", {},
    {
      success: (data) => {
        EPHEMERAL_KEY = data.client_secret.value;
      }
    }
  );
  // apex.debug.info("EPHEMERAL_KEY: ", EPHEMERAL_KEY);

  // Create a peer connection
  pc = new RTCPeerConnection();

  // Set up to play remote audio from the model
  const audioEl = document.createElement("audio");
  audioEl.autoplay = true;
  pc.ontrack = e => audioEl.srcObject = e.streams[0];

  // Add local audio track for microphone input in the browser
  const ms = await navigator.mediaDevices.getUserMedia({
    audio: true
  });
  pc.addTrack(ms.getTracks()[0]);

  // Set up data channel for sending and receiving events
  dc = pc.createDataChannel("oai-events");
  dc.addEventListener("message", (e) => {
    // Realtime server events appear here!
    console.log(e.data);
    /*
     * レスポンス完了時の音声データのトランスクリプトを
     * APEXアプリケーションのP1_RESPONSEにセットする。
     */
    const data = JSON.parse(e.data);
    if ( data.type === "response.done" ) {
      if ( data.response.status === "completed" ) {
        if ( data.response.output.length === 0 ) {
          return;
        };
        const content = data.response.output[0].content;
        const audioContent = content.find(item => item.type === 'audio');
        if ( audioContent != null ) {
          apex.item("P1_RESPONSE").setValue(audioContent.transcript);
        }
        const textContent = content.find(item => item.type === 'text');
        if ( textContent != null ) {
          apex.item("P1_RESPONSE").setValue(textContent.text);
        }
      } else if ( data.response.status === "failed" ) {
        apex.item("P1_RESPONSE").setValue( data.response.status_details.error.message );
      }
    }
  });
  /*
   * データチャンネルの状態をページ・アイテムP1_CONNECTION_STATEにセットする。
   */   
  dc.addEventListener("open", (element) => {
    apex.item("P1_CONNECTION_STATE").setValue("open");
  });
  dc.addEventListener("close", (element) => {
    apex.item("P1_CONNECTION_STATE").setValue("close");
  });

  // Start the session using the Session Description Protocol (SDP)
  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);

  const baseUrl = "https://api.openai.com/v1/realtime";
  const model = "gpt-4o-realtime-preview-2024-12-17";
  const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
    method: "POST",
    body: offer.sdp,
    headers: {
      Authorization: `Bearer ${EPHEMERAL_KEY}`,
      "Content-Type": "application/sdp"
    },
  });

  const answer = {
    type: "answer",
    sdp: await sdpResponse.text(),
  };
  await pc.setRemoteDescription(answer);
}

/*
 * ボタンSTARTとSTOPを押した時に、OpenAIのRealtime APIのモデルとの会話を開始または終了する。
 */
const controls = apex.actions.createContext("controls", document.getElementById("CONTROLS"));
controls.add([
  {
    "name": "START",
    action: (event, element, args) => {
      init();
    }
  },
  {
    "name": "STOP",
    action: (event, element, args) => {
      pc.close();
    }
  },
  {
    "name": "SEND",
    action: (event, element, args) => {
      const message = apex.item("P1_TEXT").getValue();
      const responseCreate = {
        type: "response.create",
        response: {
          modalities: ["text"],
          instructions: message
        },
      };
      dc.send(JSON.stringify(responseCreate));
    }
  }
]);