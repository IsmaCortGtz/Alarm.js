class Alarm {

  #CURRENT_OSC = [];
  #ALREADY_PLAYED = false;
  #CURRENT_PLAYING = false;
  #AUDIO_CTX;
  #GAIN_NODE;
  #CURRENT_TIMEOUT;
  #DEFAULT_MUSIC = [
    {'note':'G4','time':0.5},
    {'note':'Z0','time':0.2},
    {'note':'B4','time':0.5},
    {'note':'Z0','time':0.2},
    {'note':'D5','time':0.5}
  ]
  #NOTES_FREQUENCY = {
    "Z": [0],
    "C":  [16.35, 32.70, 65.41, 130.81, 261.63, 523.25, 1046.50, 2093.00, 4186.01],
    "C#": [17.32, 34.65, 69.30, 138.59, 277.18, 554.37, 1108.73, 2217.46, 4434.92],
    "Db": [17.32, 34.65, 69.30, 138.59, 277.18, 554.37, 1108.73, 2217.46, 4434.92],
    "D":  [18.35, 36.71, 73.42, 146.83, 293.66, 587.33, 1174.66, 2349.32, 4698.64],
    "D#": [19.45, 38.89, 77.78, 155.56, 311.13, 622.25, 1244.51, 2489.02, 4978.03],
    "Eb": [19.45, 38.89, 77.78, 155.56, 311.13, 622.25, 1244.51, 2489.02, 4978.03],
    "E":  [20.60, 41.20, 82.41, 164.81, 329.63, 659.26, 1318.51, 2637.02],
    "F":  [21.83, 43.65, 87.31, 174.61, 349.23, 698.46, 1396.91, 2793.83],
    "F#": [23.12, 46.25, 92.50, 185.00, 369.99, 739.99, 1479.98, 2959.96],
    "Gb": [23.12, 46.25, 92.50, 185.00, 369.99, 739.99, 1479.98, 2959.96],
    "G":  [24.50, 49.00, 98.00, 196.00, 392.00, 783.99, 1567.98, 3135.96],
    "G#": [25.96, 51.91, 103.83, 207.65, 415.30, 830.61, 1661.22, 3322.44],
    "Ab": [25.96, 51.91, 103.83, 207.65, 415.30, 830.61, 1661.22, 3322.44],
    "A":  [27.50, 55.00, 110.00, 220.00, 440.00, 880.00, 1760.00, 3520.00],
    "A#": [29.14, 58.27, 116.54, 233.08, 466.16, 932.33, 1864.66, 3729.31],
    "Bb": [29.14, 58.27, 116.54, 233.08, 466.16, 932.33, 1864.66, 3729.31],
    "B":  [30.87, 61.74, 123.47, 246.94, 493.88, 987.77, 1975.53, 3951.07]
  }

  constructor({ music=this.#DEFAULT_MUSIC, volume=100, waveType="sine", timeOut=800, loop=true } = {}){
    this.loop = loop;
    this.timeOut = timeOut;
    this.music = music;
    this.volume = volume;
    this.waveType = waveType;
  }


  #getNoteFrequency(note){
    let splitNote = note.split("");
    let noteOctave = splitNote.pop();
    let noteFull = splitNote.join("");

    if (!Object.keys(this.#NOTES_FREQUENCY).includes(noteFull)){
      console.error("NOTE ISNT IN DB");
      return;
    }

    if (this.#NOTES_FREQUENCY[noteFull][parseInt(noteOctave)] === undefined){
      console.error("NOTE ISNT IN DB");
      return;
    }

    return this.#NOTES_FREQUENCY[noteFull][parseInt(noteOctave)];
  }


  #playOsc(frequency, startTime, endTime){
    let oscillator = this.#AUDIO_CTX.createOscillator();
    this.#CURRENT_OSC.push(oscillator);
  
    oscillator.type = this.waveType;
    oscillator.frequency.value = frequency;
    oscillator.connect(this.#GAIN_NODE);
    oscillator.start(startTime);
    oscillator.stop(endTime);
  }


  #playOnce(){
    this.#AUDIO_CTX = new AudioContext();
    this.#GAIN_NODE = this.#AUDIO_CTX.createGain();
    this.#GAIN_NODE.gain.value = this.volume / 100;
    this.#GAIN_NODE.connect(this.#AUDIO_CTX.destination);

    let start = 0;
    Object.keys(this.music).forEach((element) => {
      this.#playOsc(this.#getNoteFrequency(this.music[element]["note"]), start, start + this.music[element]["time"]);
      start += this.music[element]["time"];
    });
  }


  #playLoop(){

    this.#playOnce();
    if (!this.loop){
      return;
    }

    let timeOut = 0;
    Object.keys(this.music).forEach((element) => {
      timeOut += this.music[element]["time"];
    });

    this.#CURRENT_TIMEOUT = setTimeout(() => {
      if (this.#CURRENT_PLAYING){
        this.#playLoop();
      }
    }, (timeOut * 1000) + this.timeOut);
  }

  #clearSound(){
    clearTimeout(this.#CURRENT_TIMEOUT);
    this.#GAIN_NODE.disconnect();
    this.#AUDIO_CTX.suspend();
  }


  play() {
    if (this.#ALREADY_PLAYED){ this.#clearSound(); }
    this.#ALREADY_PLAYED = true;
    this.#CURRENT_PLAYING = true;
    this.#playLoop();
  }


  stop(){
    this.#CURRENT_PLAYING = false;
    clearTimeout(this.#CURRENT_TIMEOUT);
    this.#GAIN_NODE.disconnect();
    this.#AUDIO_CTX.suspend();
  }

}