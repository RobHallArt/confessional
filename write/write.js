// Define Variables
var canvas, h1, p, confessButton, wakePriestButton, confessSpaceInput, musicArea, canvasDiv, confessSpaceDiv, chorus, chorusButton;
var otp;
var data;
var bpm = 10;
var socket;
var sun,fg;
var doorPos = 1000;
var priestStatus = "closed";
var eyeTargetx = 0;
var eyeTargety = 0;
var eyePosx = 0;
var eyePosy = 0;
var easing = 0.0075;

//Define Notes Etc
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
     //Initialize Firebase
    var config = {
        apiKey: "AIzaSyAsjeoh_0bNonX2R_4XNa9b0ry2Pb2s5D4",
        authDomain: "ddi-cousework-2-otp.firebaseapp.com",
        databaseURL: "https://ddi-cousework-2-otp.firebaseio.com",
        projectId: "ddi-cousework-2-otp",
        storageBucket: "ddi-cousework-2-otp.appspot.com",
        messagingSenderId: "753890436273"
    };
    firebase.initializeApp(config);
    
    //load Images
    sun = loadImage("Sun.png");
    fg = loadImage("WindowW.png");
    
    //Unmark when Printer Is Local
    socket = io.connect('http://localhost:3000');
}

function setup() {
    
    setupHtml();
    
    //Set images to draw from center
    imageMode(CENTER);
    
    //Initialize the oscilator for synthesis
    osc = new p5.Oscillator();
    osc.setType('sine');
    osc.freq(0);
    osc.amp(1);
    
    masterVolume(0.5);
    
    //Create an instance of the class which encrypts and generates one time pad
    otp = new OTP;
}

function draw() {
    
    //function that manages animation of elements in the canvas
    updatePriest();
    
    //draw stuff on canvas
    background(0);
    push();
    translate(500,250);
    image(sun,eyePosx,eyePosy,750,750);
    image(fg,0,0,1200,1200);
    pop();
    noStroke();
    fill(255);
    rect(0,0,doorPos,500);
}

//Creates HTML Elements to create page
function setupHtml(){
    
    h1 = createElement('h1', 'The Online Confessional');
    h1.style("font-family", "sans-serif");
    h1.style("font-size", "72px");
    h1.style("text-align","center");
    
    wakePriestButton = createButton('Summon Priest');
    wakePriestButton.touchStarted(wakePriest);
    wakePriestButton.style("font-family", "sans-serif");
    wakePriestButton.style("font-size", "32px");
    wakePriestButton.style("margin","auto");
    wakePriestButton.style("display","block");
    
    createElement('p', '');
    
    canvasDiv = createDiv('');
    canvasDiv.id('canvasDiv');
    canvasDiv.style('margin','0');
    canvasDiv.style('display','flex');
    canvasDiv.style('justify-content','center');
    canvas = createCanvas(1000,500);
    canvas.parent('canvasDiv');
    
    confessSpaceDiv = createDiv('');
    confessSpaceDiv.id('confessSpaceDiv');
    confessSpaceDiv.style("text-align","center");
    p = createElement('p','Please type a confession in the box and press confess. Your confession will be encrypted and added to the symphony of others. You will receive your penance and code to decipher your confession from the printer.');
    p.parent('confessSpaceDiv');
    p.style('font-family','sans-serif');
    p.style('font-size','36px');
    confessSpaceInput = createInput('', 'password');
    confessSpaceInput.parent('confessSpaceDiv');
    confessSpaceInput.style("font-size","64px");
    confessButton = createButton('Confess');
    confessButton.parent('confessSpaceDiv');
    confessButton.style("font-size","64px");
    confessButton.touchStarted(inputHandler);
    confessSpaceDiv.hide();
    
    chorus = createA('../read', "");
    chorus.position(0,0)
    chorusButton = createButton('Listen to the Chorus Of Confessions');
    chorusButton.parent(chorus);
    
}

function wakePriest(){
    //Wait 2500ms then draw the input box and button
    setTimeout(revealConfessSpace,2500);
    //Start the rolling back of the 'Priest Door'
    priestStatus = "open";
}

function sleepPriest(){
    //Start the closing of the 'Priest Door'
    priestStatus = "closed";
}

function revealConfessSpace(){
    //Set the show/hide value of the elements in the div below the canvas
    confessSpaceDiv.show();
}

function hideConfessSpace(){
    //Set the show/hide value of the elements in the div below the canvas
    confessSpaceDiv.hide();
    //Remove the notes from the page
    musicArea.remove();
    //Clear the input box
    confessSpaceInput.value('');
    //Close the 'Priest Door' and hide some text
    sleepPriest();
}

function inputHandler(){
    //inputHandler runs when 'confess' is clicked
    
    //Set the show/hide value of the elements in the div below the canvas
    confessSpaceDiv.hide();
    
    //Generate a One-Time-Pad encryption for the value typed
    otp.generate(simplifyLetters(confessSpaceInput.value()));
    
    //Notes transliterated from encrypted text displayed
    musicArea = createElement('h1', otp.notePatternAsString);
    musicArea.style("font-family", "sans-serif");
    musicArea.style("font-size", "128px");
    musicArea.style("text-align","center");
    
    //Encrypted text stored in Firebase Database in the cloud for the Chorus program to read later
    sendToFirebase(otp.cipherTextAsString);
    
    //Unmark when printer is Local
    //Notes for Decryption sent to Raspberry Pi for Printing
    socket.emit('notes', otp.cipherNotesAsString);
    
    //Start playing sequence of notes after 2000ms
    setTimeout(startPhrase,2000);
}

function OTP(){
    //Initialize internal variables
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
            //Generate a random number for each letter;
            this.cipher[i] = int(random(27));
            //Each letter is transliterated into a number before having the random number added
            this.cipherText[i] = noToLetter((letterToNo(messagePlain[i]) + this.cipher[i])%27);
            this.freqPattern[i] = noToFreq((letterToNo(messagePlain[i]) + this.cipher[i])%27);
            this.notePattern[i] = letterToNote(this.cipherText[i]);
            this.cipherNotes[i] = letterToNote(noToLetter(this.cipher[i]));
        }
        //Recombine arrays of letters into strings
        this.cipherTextAsString = this.cipherText.join("");
        this.notePatternAsString = this.notePattern.join(" ");
        this.cipherNotesAsString = this.cipherNotes.join(" ");
    }
}

function makeSound(time, freq) {
    //Set frequency of sound played based on sequence being played
    osc.freq(freq);
}

function startPhrase(){
    //Initialize and start sequence of notes
    myPhrase = new p5.Phrase('bbox', makeSound, otp.freqPattern);
    myPart = new p5.Part();
    myPart.addPhrase(myPhrase);
    myPart.setBPM(bpm);
    osc.start();
    myPart.start();
    
    //Stop playback after notes have been played
    setTimeout(stopPhrase,(16000/bpm)*otp.cipherTextAsString.length);
};

function stopPhrase(){
    //Stop Playback
    myPart.stop();
    osc.stop();
    
    //Start resetting page after 2000ms
    setTimeout(hideConfessSpace,2000);
}

//Functions to access array to transliterate
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

function noteToFreq(note){
    
    var obj = findObjectByKey(notes, 'note', note);
    return obj.freq;
    
}

function noToFreq(no){
    
    var obj = findObjectByKey(notes, 'no', no);
    return obj.freq;
    
}

//Function to find objects in array based on values in that object
function findObjectByKey(array, key, value) {
    for (var i = 0; i < array.length; i++) {
        if (array[i][key] === value) {
            return array[i];
        }
    }
    return null;
}

//Funtion to upload data to Firebase Database
function sendToFirebase(mCipher){
    var database = firebase.database();
    var ref = database.ref('messages');
    
    var data = {
        messageCipher : mCipher,
    }
    
    ref.push(data);
}

//Function to catch letters which are not included in the transliteration array
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

//Function to manage updates to the canvas
function updatePriest(){
    if(priestStatus == "closed" && doorPos<1000){
        doorPos+=8;
    } else if(priestStatus == "open" && doorPos>0){
        doorPos-=8;
    }
    
    if(frameCount%50 == 0){
        eyeTargetx = random(-200,200);
        eyeTargety = random(-150,150);
    }
        eyePosx += (eyeTargetx - eyePosx)*easing;
        eyePosy += (eyeTargety - eyePosy)*easing;
}