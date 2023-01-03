var isPlaying = false;
var alreadyUpdated = false;
var currentMusic = new Alarm({ music: MUSIC_FROM_URL });

const volumeInput = document.getElementById("volumeInput");
const loopInput = document.getElementById("loopInput");
const waveValue = document.getElementById("waveValue");
const voulumeSpan = document.getElementById("voulume-span");
voulumeSpan.innerHTML = `${volumeInput.value}% / (${parseFloat(volumeInput.value) / 100})`;



document.getElementById("saveButton").addEventListener("click", () => {
  isPlaying ? currentMusic.stop() : undefined;
  isPlaying = false;
  currentMusic = new Alarm({ music: MUSIC_FROM_URL, volume: parseInt(volumeInput.value), loop: loopInput.checked, waveType: waveValue.value });
  alreadyUpdated = true;
});


volumeInput.addEventListener("change", () => {
  voulumeSpan.innerHTML = `${volumeInput.value}% / (${parseFloat(volumeInput.value) / 100})`;
});


document.getElementById("playButton").addEventListener("click", () => {
  currentMusic.play();
  isPlaying = true;
});


document.getElementById("stopButton").addEventListener("click", () => {
  isPlaying ? currentMusic.stop() : undefined;
  isPlaying = false;
});