const GITHUB_EXAMPLES_URL = "https://raw.githubusercontent.com/IsmaCortGtz/Alarm.js/master/examples";
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const url = urlParams.get('musicURL')
var MUSIC_FROM_URL = undefined;

async function loadFile(){ 
  var text = await fetch(url.replace("~", GITHUB_EXAMPLES_URL)).then(result => result.text());
  try {
    var jsonData = JSON.parse(text);
  } catch(e) {
      console.error(e);
      MUSIC_FROM_URL = undefined;
      return;
  }

  MUSIC_FROM_URL = jsonData;
  if (alreadyUpdated){
    currentMusic = new Alarm({ music: MUSIC_FROM_URL, volume: parseInt(volumeInput.value), loop: loopInput.checked, waveType: waveValue.value });
  }else if (alreadyUpdated === false){
    currentMusic = new Alarm({ music: MUSIC_FROM_URL });
  }
}

if (url !== null){
  loadFile();
}