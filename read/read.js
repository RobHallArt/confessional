var msgArray = [];

var osc = [5];
var otp = [5];
var bpm = 20;
var myPart = [5];
var timeouts = [5];
var floatyElements = [];
var textScrollers = [10];

var chorus, chorusButton;

var notes = [{note: "A2", freq: 110.000, letter: "a", no: 0},
            {note: "B2", freq: 123.471, letter: "b", no: 1},
            {note: "C2", freq: 65.4064, letter: "c", no: 2},
            {note: "D2", freq: 73.4162, letter: "d", no: 3},
            {note: "E2", freq: 82.4069, letter: "e", no: 4},
            {note: "F2", freq: 87.3071, letter: "f", no: 5},
            {note: "G2", freq: 97.9989, letter: "g", no: 6},
            {note: "A3", freq: 220.000, letter: "h", no: 7},
            {note: "B3", freq: 246.942, letter: "i", no: 8},
            {note: "C3", freq: 130.813, letter: "j", no: 9},
            {note: "D3", freq: 146.832, letter: "k", no: 10},
            {note: "E3", freq: 164.814, letter: "l", no: 11},
            {note: "F3", freq: 174.614, letter: "m", no: 12},
            {note: "G3", freq: 195.998, letter: "n", no: 13},
            {note: "A4", freq: 440.000, letter: "o", no: 14},
            {note: "B4", freq: 493.883, letter: "p", no: 15},
            {note: "C4", freq: 261.626, letter: "q", no: 16},
            {note: "D4", freq: 293.665, letter: "r", no: 17},
            {note: "E4", freq: 329.628, letter: "s", no: 18},
            {note: "F4", freq: 349.228, letter: "t", no: 19},
            {note: "G4", freq: 391.995, letter: "u", no: 20},
            {note: "A5", freq: 880.000, letter: "v", no: 21},
            {note: "B5", freq: 987.767, letter: "w", no: 22},
            {note: "C5", freq: 523.251, letter: "x", no: 23},
            {note: "D5", freq: 587.330, letter: "y", no: 24},
            {note: "E5", freq: 659.255, letter: "z", no: 25},
            {note: "F5", freq: 698.456, letter: " ", no: 26}];

function preload(){
    // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAsjeoh_0bNonX2R_4XNa9b0ry2Pb2s5D4",
    authDomain: "ddi-cousework-2-otp.firebaseapp.com",
    databaseURL: "https://ddi-cousework-2-otp.firebaseio.com",
    projectId: "ddi-cousework-2-otp",
    storageBucket: "ddi-cousework-2-otp.appspot.com",
    messagingSenderId: "753890436273"
  };
  firebase.initializeApp(config);
}

function gotData(data){
    //console.log(data.val());
    var messages = data.val();
    var keys = Object.keys(messages);
    //console.log(messages);
    for(var i=0; i<keys.length; i++){
        var k = keys[i];
        var messageCipher = messages[k].messageCipher;
        //console.log(messageCipher);
        msgArray.push(messageCipher);
    }
    for(var i = 0; i< 5; i++){
        //console.log(msgArray[int(random(msgArray.length))]);
        sendNotesOnChannel(msgArray[int(random(msgArray.length))], i);
    }
}

function gotErr(data){
    console.log("Err" + data);
}

function setup() {
    createCanvas(1280,720);
    
    chorus = createA('../write', "");
    chorus.position(0,0)
    chorusButton = createButton('Make a Confession');
    chorusButton.parent(chorus);
    
    var database = firebase.database();
    var ref = database.ref('messages');
    
    ref.on('value', gotData, gotErr);
    
    for(var i = 0; i<5 ;i++){
        osc[i]= new p5.Oscillator();
        osc[i].setType('sine');
        osc[i].freq(0);
        osc[i].amp(1);
        otp[i] = new OTP;
    }
    
    masterVolume(0.5);
    
    for(var i = 0; i<10 ;i++){
        textScrollers[i] = null;
    }
}

function draw() {
    //background(map(mouseX, 0,1280, 255,0));
    scrollTextUpdate();
}

function soundMaker0(time, freq) {
    osc[0].freq(freq);
}
function soundMaker1(time, freq) {
    osc[1].freq(freq);
}
function soundMaker2(time, freq) {
    osc[2].freq(freq);
}
function soundMaker3(time, freq) {
    osc[3].freq(freq);
}
function soundMaker4(time, freq) {
    osc[4].freq(freq);
}

function startPhrase(channel){
    if(channel == 0){
        myPhrase = new p5.Phrase('bbox0', soundMaker0, otp[channel].freqPattern);
        timeouts[0] = setTimeout(nextPhrase0,(16000/bpm)*otp[channel].cipherTextAsString.length);
    } else if (channel == 1){
        myPhrase = new p5.Phrase('bbox1', soundMaker1, otp[channel].freqPattern);
        timeouts[1] = setTimeout(nextPhrase1,(16000/bpm)*otp[channel].cipherTextAsString.length);
    } else if (channel == 2){
        myPhrase = new p5.Phrase('bbox2', soundMaker2, otp[channel].freqPattern);
        timeouts[2] = setTimeout(nextPhrase2,(16000/bpm)*otp[channel].cipherTextAsString.length);
    } else if (channel == 3){
        myPhrase = new p5.Phrase('bbox3', soundMaker3, otp[channel].freqPattern);
        timeouts[3] = setTimeout(nextPhrase3,(16000/bpm)*otp[channel].cipherTextAsString.length);
    } else if (channel == 4){
        myPhrase = new p5.Phrase('bbox4', soundMaker4, otp[channel].freqPattern);
        timeouts[4] = setTimeout(nextPhrase4,(16000/bpm)*otp[channel].cipherTextAsString.length);
    }
    
    myPart[channel] = new p5.Part();
    myPart[channel].addPhrase(myPhrase);
    myPart[channel].setBPM(bpm);
    osc[channel].start();
    myPart[channel].start();
    console.log(otp[channel].freqPattern);
};

function nextPhrase0(){
    myPart[0].stop();
    sendNotesOnChannel(msgArray[int(random(msgArray.length))], 0);
}
function nextPhrase1(){
    myPart[1].stop();
    sendNotesOnChannel(msgArray[int(random(msgArray.length))], 1);
}
function nextPhrase2(){
    myPart[2].stop();
    sendNotesOnChannel(msgArray[int(random(msgArray.length))], 2);
}
function nextPhrase3(){
    myPart[3].stop();
    sendNotesOnChannel(msgArray[int(random(msgArray.length))], 3);
}
function nextPhrase4(){
    myPart[4].stop();
    sendNotesOnChannel(msgArray[int(random(msgArray.length))], 4);
}

function OTP(){
    this.cipher = [];
    this.cipherText = [];
    this.cipherTextAsString;
    this.freqPattern = [];
    this.notePattern = [];
    this.notePatternAsString;
    this.cipherNotes = [];
    this.cipherNotesAsString;
    this.generate = function(messagePlain){
        this.cipher = [];
        this.cipherText = [];
        this.freqPattern = [];
        this.notePattern = [];
        this.cipherNotes = [];
        for(var i = 0; i<messagePlain.length; i++){
            this.cipherText[i] = noToLetter((letterToNo(messagePlain[i])));
            this.freqPattern[i] = noToFreq((letterToNo(messagePlain[i])));
            this.notePattern[i] = letterToNote(this.cipherText[i]);
        }
        this.cipherTextAsString = this.cipherText.join("");
        this.notePatternAsString = this.notePattern.join(" ");
        this.cipherNotesAsString = this.cipherNotes.join(" ");
    }
}

function letterToNo(letter){
    
    var obj = findObjectByKey(notes, 'letter', letter);
    return obj.no;
    
}

function noToLetter(no){
    
    var obj = findObjectByKey(notes, 'no', no);
    return obj.letter;
    
}

function letterToNote(letter){

    var obj = findObjectByKey(notes, 'letter', letter);
    return obj.note;

}

function lettersToNotes(msg){
    var msgarr = [];
    for(var i = 0; i<msg.length; i++){
        msgarr[i] = letterToNote(msg[i]);
    }
    var notes = msgarr.join(" ");
    return notes;
}

function noteToFreq(note){
    
    var obj = findObjectByKey(notes, 'note', note);
    return obj.freq;
    
}

function noToFreq(no){
    
    var obj = findObjectByKey(notes, 'no', no);
    return obj.freq;
    
}

function findObjectByKey(array, key, value) { //Borrowed... Write Own Code for this!
    for (var i = 0; i < array.length; i++) {
        if (array[i][key] === value) {
            return array[i];
        }
    }
    return null;
}

function simplifyLetters(msg){
    var bsg = [];
    for(var i=0; i<msg.length;i++){
        for(var x=0; x<notes.length;x++){
            if(msg[i] == notes[x].letter){
                console.log("match");
                bsg[i] = msg[i];
                break;
            }else{
                console.log("notmatch");
                bsg[i] = " ";
            }
        } 
    }
    return bsg.join("");
}
    
function sendNotesOnChannel(message, channel){
    
    scrollTextInit(lettersToNotes(message));
    clearTimeout(timeouts[channel]);
    otp[channel].generate(message);
    startPhrase(channel);
}

function scrollTextInit(message){
    for(var i = 0; i<textScrollers.length; i++){
        if(textScrollers[i] == null){
            console.log("1");
            textScrollers[i] = {message: message, posx: 0-(message.length*60), posy: random(innerHeight-100)};
            textScrollers[i].element = createElement('h1',message);
            textScrollers[i].element.position(textScrollers[i].posx,textScrollers[i].posy);
            textScrollers[i].element.style('font-family','sans-serif');
            textScrollers[i].element.style('font-size','72pt');
            return true;
        }
    }
    console.log("2");
    var newScroller = textScrollers.length;
    textScrollers[newScroller] = {message: message, posx: 0-(message.length*60), posy: random(innerHeight-100)};
    textScrollers[newScroller].element = createElement('h1',message);
    textScrollers[newScroller].element.position(textScrollers[newScroller].posx,textScrollers[newScroller].posy);
    textScrollers[newScroller].element.style('font-family','sans-serif');
    textScrollers[newScroller].element.style('font-size','72pt');
}

function scrollTextUpdate(){
    for(var i = 0; i<textScrollers.length; i++){
        if(textScrollers[i] != null){
            if(textScrollers[i].posx>innerWidth){
                textScrollers[i].element.remove();
                textScrollers[i] = null;
            } else {
                textScrollers[i].element.position(textScrollers[i].posx,textScrollers[i].posy);
                textScrollers[i].posx+=2;
            }
        }
    }
}
