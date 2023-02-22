const video = document.querySelector("#video");
const videoResult = document.getElementById("video");
const startId = document.getElementById("start");
const stopId = document.getElementById("stop");
const closeId = document.getElementById("close");

let nIntervId;
let initialStream = null;
let newStream = null;

let formats;
// Save all formats to formats var
BarcodeDetector.getSupportedFormats().then((arr) => (formats = arr));
// Create new barcode detector with all supported formats
const barcodeDetector = new BarcodeDetector({ formats });

// back camera
var constraints = {
  video: {
    facingMode: { exact: "environment" }, //"user"// { exact: "environment" },
  },
  audio: false,
};

async function fetchStreamFunction() {
  initialStream = await navigator.mediaDevices.getUserMedia(constraints);
  if (initialStream) {
    await attachToDOM(initialStream);
    nIntervId = setInterval(detectCode, 500, video);
  }
}

async function attachToDOM(stream) {
  newStream = new MediaStream(stream.getTracks());
  video.srcObject = newStream;
  console.log("start",newStream);
}

async function stopTracksFunction() {
  let videoTrack = newStream.getVideoTracks()[0];
  newStream.removeTrack(videoTrack);
  // console.log("stop",videoTrack);
  // console.log("stop obj",video.srcObject);
  // console.log("stop stm",newStream);
}

async function closeTracksFunction() {
  let tracks = video.srcObject.getTracks();
  tracks.forEach((track) => track.stop());
  video.srcObject = null;
  console.log("close",newStream);
  clearInterval(nIntervId);
}

startId.addEventListener('click', fetchStreamFunction);
stopId.addEventListener('click', stopTracksFunction);
closeId.addEventListener('click', closeTracksFunction);

// if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
//   // Start video stream
//   navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
//     video.srcObject = stream;
//   });
// }



// async function openStream(){
//   if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
//     initialStream  = await navigator.mediaDevices.getUserMedia(constraints);
//     video.srcObject = initialStream ;
//   }
// }

async function detectCode(frame) {
  // Start detecting codes on to the video element
  try {
    let codes = await barcodeDetector.detect(frame);
    if (codes.length === 0) return;
    for (const barcode of codes) {
      console.log(barcode.rawValue);
      alert(barcode.rawValue);
    }
  } catch (err) {
    console.log(err);
  }
}



// startId.addEventListener("click", () => {
//   console.log("start");
// });
