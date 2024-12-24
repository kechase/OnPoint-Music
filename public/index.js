/*
This current experiment is a classic visuomotor rotation reaching experiment, but can easily be adapted into variations of different reaching experiments depending on the target file.
Currently supported experiments include:
- VMR
- Clamp
- Target-jump experiments
Remember to update necessary fields before starting the game. All fields that require change will be marked by a "**TODO**" comment.
*/

// Set to 'true' if you wish to only test the front-end (will not access databases)
// **TODO** Make sure this is set to false before deploying!
const noSave = true;
// TODO: Replace this with your own experiment file! 
// Currently there's an issue trying to load this file into data. CORS is blocking me from accessing the file directly, To overcome this, we'll provide the file content here instead.
const fileName = "./tgt_files/testShort.json";
const data = {"numtrials": 8, "trialnum": {"0": 1, "1": 2, "2": 3, "3": 4, "4": 5, "5": 6, "6": 7, "7": 8}, "aiming_landmarks": {"0": 0, "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0, "8": 0, "9": 0, "10": 0, "11": 0, "12": 0, "13": 0, "14": 0, "15": 0, "16": 0, "17": 0, "18": 0, "19": 0}, "online_fb": {"0": 0, "1": 0, "2": 0, "3": 0, "4": 1, "5": 1, "6": 1, "7": 1, "8": 1, "9": 1, "10": 1, "11": 1, "12": 1, "13": 1, "14": 1, "15": 1, "16": 0, "17": 0, "18": 0, "19": 0}, 
"endpoint_feedback": {"0": 0, "1": 0, "2": 0, "3": 0, "4": 1, "5": 1, "6": 1, "7": 1, "8": 1, "9": 1, "10": 1, "11": 1, "12": 1, "13": 1, "14": 1, "15": 1, "16": 0, "17": 0, "18": 0, "19": 0}, "rotation": {"0": 0.0, "1": 0.0, "2": 0.0, "3": 0.0, "4": 0.0, "5": 0.0, "6": 0.0, "7": 0.0, "8": -10.0, "9": -10.0, "10": -10.0, "11": -10.0, "12": -10.0, "13": -10.0, "14": -10.0, "15": -10.0, "16": 0.0, "17": 0.0, "18": 0.0, "19": 0.0}, "clamped_fb": {"0": 0.0, "1": 0.0, "2": 0.0, "3": 0.0, "4": 0.0, "5": 0.0, "6": 0.0, "7": 0.0, "8": 1.0, "9": 1.0, "10": 1.0, "11": 1.0, "12": 1.0, "13": 1.0, "14": 1.0, "15": 1.0, "16": 0.0, "17": 0.0, "18": 0.0, "19": 0.0}, "tgt_angle": {"0": 135.0, "1": 45.0, "2": 45.0, "3": 135.0, "4": 135.0, "5": 45.0, "6": 45.0, "7": 135.0, "8": 270.0, "9": 270.0, "10": 270.0, "11": 270.0, "12": 45.0, "13": 135.0, "14": 135.0, "15": 45.0, "16": 45.0, "17": 135.0, "18": 45.0, "19": 135.0}, "tgt_distance": {"0": 80, "1": 80, "2": 80, "3": 80, "4": 80, "5": 80, "6": 80, "7": 80, "8": 80, "9": 80, "10": 80, "11": 80, "12": 80, "13": 80, "14": 80, "15": 80, "16": 80, "17": 80, "18": 80, "19": 80}, "between_blocks": {"0": 0.0, "1": 0.0, "2": 0.0, "3": 1, "4": 0.0, "5": 0.0, "6": 0.0, "7": 6, "8": 6, "9": 6, "10": 6, "11": 2, "12": 0.0, "13": 0.0, "14": 0.0, "15": 3, "16": 0.0, "17": 0.0, "18": 0.0, "19": 0.0}, "target_jump": {"0": 0.0, "1": 0.0, "2": 0.0, "3": 0.0, "4": 0.0, "5": 0.0, "6": 0.0, "7": 0.0, "8": 0.0, "9": 0.0, "10": 0.0, "11": 0.0, "12": 0.0, "13": 0.0, "14": 0.0, "15": 0.0, "16": 0.0, "17": 0.0, "18": 0.0, "19": 0.0}}

//#region Components

function Circle(x, y) {
    this.x = x;
    this.y = y;
}

function ScreenSize(width, height) {
    this.width = width;
    this.height = height;
}

// we will create line soon here - Just need to make sure all of this still works.

//#endregion

//#region Models

// This will be used to help create inheritance to save to database structure
class Database {
    constructor(table_name) {
        this.table_name = table_name;
    }

    save() {
        // TODO: Impl. code to save data to table.
        // take this class and save the structure to approprate database location
        // e.g. class name should be used as target table name to save to
    }
}

class Subject extends Database  {
    constructor(id, age, sex, handedness, mousetype, returner, ethnicity, race) {
        super("subject");
        this.id = id,
        this.age = age,
        this.sex = sex,
        this.handedness = handedness,
        this.mousetype = mousetype,
        this.returner = returner,
        // **TODO** Update the 'fileName' to path to targetfile
        this.tgt_file = "tgt_files/testShort.json",
        this.ethnicity = ethnicity,
        this.race = race,
        this.comments = null,
        this.distractions = [],
        this.distracto = null
    }

    // contains the basic information required to proceed
    isValid() {
        return !(!this.id || !this.age || !this.sex || !this.handedness || !this.mousetype )
    }
}

class Trial extends Database {
    constructor(experimentID, id, group_type) {
        super("trial");
        this.id = id; 
        this.experimentID = experimentID;
        this.group_type = group_type;
        this.blocks = [];
    }    

    // return the current trial number (usually define as number of blocks we've created and stored)
    getBlockNum() {
        return this.blocks.length;
    }

    appendTrialBlock(target_angle, trial_type, rotation, hand_angle, rt, mt, time, feedback ) {
        let lastTrialNum = this.getBlockNum();
        let block = new Block(
            lastTrialNum + 1,   //  num
            target_angle, 
            trial_type,
            rotation,
            hand_angle,
            rt,
            mt, 
            time,
            feedback
        );

        // append data to this trial block
        this.blocks.push(block);
    }
}

class Block extends Database {
    constructor(num, target_angle, trial_type, rotation, hand_angle, rt, mt, time, feedback){
        super("block");
        // auto create the date
        var d = new Date();
        var current_date = (parseInt(d.getMonth()) + 1).toString() + "/" + d.getDate() + "/" + d.getFullYear() + " " + d.getHours() + ":" + d.getMinutes() + "." + d.getSeconds() + "." + d.getMilliseconds();
        
        this.trialNum = num;
        this.currentDate = current_date;
        this.target_angle = target_angle;
        this.trial_type = trial_type;
        this.rotation = rotation;
        this.hand_fb_angle = hand_angle;
        this.rt = rt;
        this.mt = mt;
        this.search_time = time;
        this.reach_feedback = feedback;
        // this.log = [];  // used to collect mouse movement
    }
} 

// used to track mouse movement when conducting the experiment run.
class Log extends Database {
    constructor(mouse_x, mouse_y) {
        this.timestamp = new Date();
        this.mouse_x = mouse_x;
        this.mouse_y = mouse_y;
    }
}

//#endregion

//#region Global funciton

function isNumericKey(event) {
    var code = (event.which) ? event.which : event.keyCode;
    return !(code > 31 && (code < 48 || code > 57));
}

//#endregion

/* TEMPORARY USE OF ORIGINAL CODE TO TEST THINGS OUT */
try {
    let app = firebase.app();
} catch (e) {
    console.error(e);
}

// Setting up firebase variables
const firestore = firebase.firestore(); // (a.k.a.) db
const firebasestorage = firebase.storage();
const subjectcollection = firestore.collection("Subjects");
const trialcollection = firestore.collection("Trials");

// Function to switch between HTML pages
function show(shown, hidden) {
    document.getElementById(shown).style.display = 'block';
    document.getElementById(hidden).style.display = 'none';
    return false;
}

// Close window (function no longer in use for this version)
function onexit() {
    window.close();
}

// Function used to enter full screen mode
function openFullScreen() {
    elem = document.getElementById('container-info');
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
        console.log("enter1")
    } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
        console.log("enter2")
    } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
        console.log("enter3")
    } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
        console.log("enter4")
    }
}

// Function used to exit full screen mode
function closeFullScreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}

// Object used track subject data (uploaded to database)
var subject;    // : Subject  

// Object used to track reaching data (updated every reach and uploaded to database)
var subjTrials; // : Trial

// Function used to check if all questions were filled in info form, if so, starts the experiment 
function checkInfo() {

    var values = $("#infoform").serializeArray();
    // form data used to create subject info
    let email = values[0].value;
    let age = values[1].value;
    let sex = values[2].value;
    let handedness = values[3].value;
    let mousetype = values[4].value;
    let returner = values[5].value;
    let ethnicity = values[6].value;
    let race = values[7].value;
    
    subject = new Subject(
        email, 
        age, 
        sex, 
        handedness,
        mousetype,
        returner, 
        ethnicity,
        race,
    );
    
    // validation proceed here
    // if (!subject.isValid()) {
    //     alert("Please fill out your basic information!");
    //     return;
    // }

    show('container-exp', 'container-info');
    if (!noSave) {
        createSubject(subjectcollection, subject);
    }
    openFullScreen();
    startGame();
}

// Function used to create/update subject data in the database
function createSubject(collection, subject) {
    if (noSave) {
        return null;
    }
    return collection.doc(subject.id).set(subject)
        .then(function() {
            console.log(subject);
            return true;
        })
        .catch(function(err) {
            console.error(err);
            throw err;
        });
}

// Function used to upload reach data in the database
function recordTrialSubj(collection, subjTrials) {
    if (noSave) {
        return null;
    }
    return collection.doc(subjTrials.id).set(subjTrials)
        .then(function() {
            return true;
        })
        .catch(function(err) {
            console.error(err);
            throw err;
        });
}

// Variables used throughout the experiment
var svgContainer;
var screen_size;    // use ScreenSize object instead
// var screen_height;
// var screen_width;

// TODO: Digest through this and see how we can containerize this into objects instead?
var elem;
var experiment_ID;
var subject_ID;
var target_dist;
var trial_type;
var start_x;
var start_y;
var start_radius;
var start_color;
var target_x;
var target_y;
var target_radius;
var target_color;
var hand_x;
var hand_y;
var hand_fb_x;
var hand_fb_y;
var r;
var cursor_x;
var cursor_y;
var cursor_radius;
var cursor_color;
var messages;
var line_size;
var message_size;
var counter = 1; // current reach count (starts at 1)
var target_file_data;
var rotation;
var target_angle;
var online_fb;
var endpt_fb;
var clamped_fb;
var between_blocks;
var trial = 0; // trial count (starts at 0)
var num_trials;
var search_tolerance;
var hand_angle;
var hand_fb_angle;
var rt;
var mt;
var search_time;
var feedback_time;
var feedback_time_slow;
var if_slow;
var hold_time;
var hold_timer;
var fb_timer;
var begin;
var timing;
var SEARCHING;
var HOLDING;
var SHOW_TARGETS;
var MOVING;
var FEEDBACK;
var BETWEEN_BLOCKS;
var game_phase = BETWEEN_BLOCKS;
var reach_feedback;
var bb_counter;
var target_invisible;
var cursor_show;

// Variables to track screen size
var prev_screen_size;

// audio controls. 
var oscillator, gainNode, filter1, filter2;

function initAudio() {
    let audioContext = new (window.AudioContext || window.webkitAudioContext)();
    gainNode = audioContext.createGain();
    gainNode.gain.value = 0.5;

    oscillator = audioContext.createOscillator();
    oscillator.type = 'sawtooth';
    oscillator.frequency.value = 220;

    filter1 = audioContext.createBiquadFilter();
    filter1.type = 'bandpass';
    filter2 = audioContext.createBiquadFilter();
    filter2.type = 'bandpass';

    oscillator.connect(filter1);
    filter1.connect(filter2);
    filter2.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    return audioContext;
}

// Function used to start running the game
function startGame() {
    // create a new audio context
    let audioContext = initAudio();

    // visual setup
    const vowelSquare = document.getElementById('vowelSquare');
    const rect = vowelSquare.getBoundingClientRect();
    const squareLeft = rect.left;
    const squareTop = rect.top;
    const squareSize = 600;

    document.addEventListener('mousemove', (event) => {
        const x = event.clientX;
        const y = event.clientY;
        // const infoDisplay = document.getElementById('infoDisplay');

        if (x >= squareLeft && x <= squareLeft + squareSize && 
            y >= squareTop && y <= squareTop + squareSize) {
            gainNode.gain.setValueAtTime(8, audioContext.currentTime);

            const { f1, f2, vowel } = getVowelFormants(y, squareTop, squareSize);
            const pitch = 100 * Math.pow(2, (x - squareLeft) / 97);

            // infoDisplay.textContent = `Mouse X: ${x}, Mouse Y: ${y}, F1: ${f1.toFixed(2)}, F2: ${f2.toFixed(2)}, Pitch: ${pitch.toFixed(2)}, Vowel: ${vowel}`;

            oscillator.frequency.setValueAtTime(pitch, audioContext.currentTime);
            filter1.frequency.setTargetAtTime(f1, audioContext.currentTime, 0.1);
            filter2.frequency.setTargetAtTime(f2, audioContext.currentTime, 0.1);
            filter1.Q.setValueAtTime(12, audioContext.currentTime);
            filter2.Q.setValueAtTime(12, audioContext.currentTime);
        } else {
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        }
    });
    
    // CORS error is blocking from loading this file
    // TODO: before we deploy this website - please serve this on NodeJS and see if we can load the file properly
    // currently using a hack to test this code on local development without NodeJS/Serve
    // $.getJSON(fileName, function(json) {
        // target_file_data = json;
    //     gameSetup(target_file_data);
    // });
    target_file_data = data;
    gameSetup(data);
}

// Function that sets up the game 
// All game functions are defined within this main function, treat as "main"
function gameSetup(data) {
    /*********************
     * Browser Settings  *
     *********************/

    // Initializations to make the screen full size and black background
    $('html').css('height', '98%');
    $('html').css('width', '100%');
    $('html').css('background-color', 'black')
    $('body').css('background-color', 'black')
    $('body').css('height', '98%');
    $('body').css('width', '100%');

    // Hide the mouse from view 
    $('html').css('cursor', 'none');
    $('body').css('cursor', 'none');

    // SVG container from D3.js to hold drawn items
    svgContainer = d3.select("body").append("svg")
        .attr("width", "100%")
        .attr("height", "100%").attr('fill', 'black')
        .attr('id', 'stage')
        .attr('background-color', 'black');

    // Get the screen resolution
    screen_size = new ScreenSize(window.screen.availWidth, window.screen.availHeight);
    prev_screen_size = screen_size;
    
    // Experiment parameters, subject_ID is no obsolete
    // **TODO** Update experiment_ID to label your experiments
    experiment_ID = "test"; 
    // This is not used anywhere? Where is this being used?
    subject_ID = Math.floor(Math.random() * 10000000000);

    /***************************
     * Drawn Element Properties *
     ***************************/

    // Setting the radius from center to target location 
    target_dist = screen_size.height / 4;
    trial_type;

    // Setting parameters and drawing the center start circle
    start_x = screen_size.width / 2;
    start_y = screen_size.height / 2;
    start_radius = Math.round(target_dist * 4.5 / 80.0);
    start_color = 'white';

    svgContainer.append('circle')
        .attr('cx', start_x)
        .attr('cy', start_y)
        .attr('r', start_radius)
        .attr('fill', 'none')
        .attr('stroke', start_color)
        .attr('stroke-width', 2)
        .attr('id', 'start')
        .attr('display', 'none');

    // Setting parameters and drawing the target 
    target_x = screen_size.width / 2;
    target_y = Math.round(screen_size.height / 10 * 2);
    target_radius = Math.round(target_dist * 4.5 / 80.0);
    target_color = 'blue';

    svgContainer.append('circle')
        .attr('cx', target_x)
        .attr('cy', target_y)
        .attr('r', target_radius)
        .attr('fill', target_color)
        .attr('id', 'target')
        .attr('display', 'none');

    /* Initializing variables for:
        - Coordinates of the mouse 
        - Coordinates where the mouse crosses the target distance
        - Radius from center to hand coordinates
        - Coordinates of the displayed cursor (different from mouse if rotated)
        - Size of the displayed cursor
    */
    hand_x = 0;
    hand_y = 0;
    hand_fb_x = 0;
    hand_fb_y = 0;
    r = 0;
    cursor_x = 0;
    cursor_y = 0;
    cursor_radius = Math.round(target_dist * 1.75 * 1.5 / 80.0);
    cursor_color = 'white';

    // Function to move cursor to random location near center
    // TODO Move this to circle object?
    function moveCursor() {
        var off_x = Math.random() * start_radius + start_radius;
        var off_y = Math.random() * start_radius + start_radius;
        var flip_x = Math.floor(Math.random() * 2);
        var flip_y = Math.floor(Math.random() * 2);
        if (flip_x) {
            hand_x = start_x - off_x;
        } else {
            hand_x = start_x + off_y;
        }
        if (flip_y) {
            hand_y = start_y - off_y;
        } else {
            hand_y = start_y + off_y;
        }
    }

    console.log("Initial X: " + hand_x + " Initial Y: " + hand_y);
    // Drawing the displayed cursor 
    svgContainer.append('circle')
        .attr('cx', hand_x)
        .attr('cy', hand_y)
        .attr('r', cursor_radius)
        .attr('fill', cursor_color)
        .attr('id', 'cursor')
        .attr('display', 'none');

    // The between block messages that will be displayed
    // **TODO** Update messages depending on your experiment
    messages = [
        ["Dummy Message Test"],
        ["The white dot will now be visible.", // Message displayed when bb_mess == 1
            "Quickly move your white dot to the target.",
            "Press 'b' when you are ready to proceed."
        ],
        ["This is an instruction understanding check, you may proceed ONLY if you choose the correct choice.", // Message displayed when bb_mess == 2
            "Choosing the wrong choice will result in early game termination and an incomplete HIT!",
            "Press 'a' if you should ignore the white dot and aim directly towards the target.",
            "Press 'b' if you should be aiming away from the target."
        ],
        ["The white dot will now be hidden.", // bb_mess == 3
            "Continue aiming DIRECTLY towards the target.",
            "Press SPACE BAR when you are ready to proceed."
        ],
        ["This is an attention check.", // bb_mess == 4
            "Press the key 'e' on your keyboard to CONTINUE.",
            "Pressing any other key will result in a premature game termination and an incomplete HIT!"
        ],
        ["This is an attention check.", // bb_mess == 5
            "Press the key 'a' on your keyboard to CONTINUE.",
            "Pressing any other key will result in a premature game termination and an incomplete HIT!"
        ],
        ["The white dot will no longer be under your control.", // bb_mess == 6
            "IGNORE the white dot as best as you can and continue aiming DIRECTLY towards the target.",
            "This will be a practice trial",
            "Press SPACE BAR when you are ready to proceed."
        ]
    ];

    // Setting size of the displayed letters and sentences
    line_size = Math.round(screen_size.height / 30)
    message_size = String(line_size).concat("px");

    // Setting up first initial display once the game is launched 
    // **TODO** Update the '.text' sections to change initial displayed message
    svgContainer.append('text')
        .attr('text-anchor', 'middle')
        .attr('x', screen_size.width / 2)
        .attr('y', screen_size.height / 2 - line_size)
        .attr('fill', 'white')
        .attr('font-family', 'sans-serif')
        .attr('font-size', message_size)
        .attr('id', 'message-line-1')
        .attr('display', 'block')
        .text('Move the white dot to the center.');

    svgContainer.append('text')
        .attr('text-anchor', 'middle')
        .attr('x', screen_size.width / 2)
        .attr('y', screen_size.height / 2)
        .attr('fill', 'white')
        .attr('font-family', 'sans-serif')
        .attr('font-size', message_size)
        .attr('id', 'message-line-2')
        .attr('display', 'block')
        .text('The white dot will be visible during your reach.');

    svgContainer.append('text')
        .attr('text-anchor', 'middle')
        .attr('x', screen_size.width / 2)
        .attr('y', screen_size.height / 2 + line_size)
        .attr('fill', 'white')
        .attr('font-family', 'sans-serif')
        .attr('font-size', message_size)
        .attr('id', 'message-line-3')
        .attr('display', 'block')
        .text('Quickly move your white dot to the target.');

    svgContainer.append('text')
        .attr('text-anchor', 'middle')
        .attr('x', screen_size.width / 2)
        .attr('y', screen_size.height / 2 + line_size * 2)
        .attr('fill', 'white')
        .attr('font-family', 'sans-serif')
        .attr('font-size', message_size)
        .attr('id', 'message-line-4')
        .attr('display', 'block')
        .text('Press SPACE BAR when you are ready to proceed.');

    // Setting up parameters and display when reach is too slow
    too_slow_time = 300; // in milliseconds
    svgContainer.append('text')
        .attr('text-anchor', 'middle')
        .attr('x', screen_size.width / 2)
        .attr('y', screen_size.height / 2)
        .attr('fill', 'red')
        .attr('font-family', 'sans-serif')
        .attr('font-size', message_size)
        .attr('id', 'too_slow_message')
        .attr('display', 'none')
        .text('Move Faster');

    // Parameters and display for when users take too long to locate the center
    search_too_slow = 3000; // in milliseconds
    svgContainer.append('text')
        .attr('text-anchor', 'middle')
        .attr('x', screen_size.width / 2)
        .attr('y', screen_size.height / 3 * 2)
        .attr('fill', 'white')
        .attr('font-family', 'san-serif')
        .attr('font-size', message_size)
        .attr('id', 'search_too_slow')
        .attr('display', 'none')
        .text('To find your cursor, try moving your mouse to the center of the screen.');

    // Parameters and display for the reach counter located at the bottom right corner
    counter = 1;
    totalTrials = target_file_data.numtrials;
    svgContainer.append('text')
        .attr('text-anchor', 'end')
        .attr('x', screen_size.width / 20 * 19)
        .attr('y', screen_size.height / 20 * 19)
        .attr('fill', 'white')
        .attr('font-size', message_size)
        .attr('id', 'trialcount')
        .attr('display', 'none')
        .text('Reach Number: ' + counter + ' / ' + totalTrials);

    /***************************************
     * Pointer Lock Variables and Functions *
     ***************************************/
    document.requestPointerLock = document.requestPointerLock || document.mozRequestPointerLock;
    document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;
    document.addEventListener('pointerlockchange', lockChangeAlert, false);
    document.addEventListener('mozpointerlockchange', lockChangeAlert, false);
    window.addEventListener('resize', monitorWindow, false);
    document.addEventListener('click', setPointerLock, false);
    // Function to monitor changes in pointer lock
    function lockChangeAlert() {
        if (document.pointerLockElement === stage ||
            document.mozPointerLockElement === stage) {
            console.log('The pointer lock status is now locked');
            document.addEventListener('mousemove', update_cursor, false);
            document.addEventListener('keydown', advance_block, false);
        } else {
            console.log('The pointer lock status is now unlocked');
            document.removeEventListener('mousemove', update_cursor, false);
            document.removeEventListener('keydown', advance_block, false);
        }
    }

    // Function to set pointer lock and log it
    function setPointerLock() {
        console.log("Attempted to lock pointer");
        stage.requestPointerLock();
    }
    setPointerLock();

    // Function to monitor changes in screen size;
    function monitorWindow(event) {
        var prev_size = prev_screen_size.width * prev_screen_size.height;
        var curr_size = window.innerHeight * window.innerWidth;
        console.log("prev size: " + prev_size + " curr size: " + curr_size);
        if (prev_size > curr_size) {
            alert("Please enter full screen and click your mouse to continue the experiment! (Shortcut for Mac users: Command + Control + F. Shortcut for PC users: F11) ");
        }
        prev_screen_size.width = window.innerWidth;
        prev_screen_size.height = window.innerHeight;
        return;
    }
    /*****************
     * Task Variables *
     *****************/

    // Reading the json target file into the game
    target_file_data = data;
    rotation = target_file_data.rotation; // degrees
    target_angle = target_file_data.tgt_angle; //degrees
    online_fb = target_file_data.online_fb;
    endpt_fb = target_file_data.endpoint_feedback;
    clamped_fb = target_file_data.clamped_fb;
    between_blocks = target_file_data.between_blocks;
    target_jump = target_file_data.target_jump;
    num_trials = target_file_data.numtrials;

    // Initializing trial count
    trial = 0;

    // The distance from start at which they can see their cursor while searching in between trials
    search_tolerance = start_radius * 4 + cursor_radius * 4;

    // Calculated hand angles
    hand_angle = 0;
    hand_fb_angle = 0;

    // Timing Variables
    rt = 0; // reaction time
    mt = 0; // movement time
    search_time = 0; // time to reset trial (includes hold time)
    feedback_time = 50; // length of time feedback remains (ms)
    feedback_time_slow = 750; // length of "too slow" feedback
    hold_time = 500; // length of time users must hold in start before next trial (ms)

    // Initializing timer objects and variables
    hold_timer = null;
    fb_timer = null;

    // Variable to start clock for calculating time spent in states
    begin;
    /* Flag variables for
        - Whether or not hand is within start circle
        - Whether or not previous reach was too slow
    */
    timing = true;
    if_slow = false;

    // Game Phase Flags
    // could this be made into enums?
    SEARCHING = 0; // Looking for the center after a reach
    HOLDING = 1; // Holding at start to begin the next target
    SHOW_TARGETS = 2; // Displaying the target
    MOVING = 3; // The reaching motion 
    FEEDBACK = 4; // Displaying the feedback after reach
    BETWEEN_BLOCKS = 5; // Displaying break messages if necessary

    game_phase = BETWEEN_BLOCKS;

    // Initializing between block parameters
    reach_feedback;
    bb_counter = 0;
    bb_mess = between_blocks[0];

    // Flags to determine whether we are showing the target and cursor (not mouse)
    target_invisible = true; // for clicking to see target
    cursor_show = false;

    if (trial == 0) {
        moveCursor();
    }

    /********************
    * Update Cursor Function*
    * This function gets called every time a participant moves their mouse.*
    * It does the following:
      * Tracks the mouse location (hand location) and calculates the radius
      from the start circle
      * Computes a rotation on the cursor if during appropriate game phase
      * Draws the cursor if in appropriate game phase
      * Triggers changes in game phase if appropriate conditions are met
    ********************/
    function update_cursor(event) {
        // Record the current mouse movement location
        event = event || window.event;
        hand_x += event.movementX;
        hand_y += event.movementY;

        // Ensure we do not exceed screen boundaries
        if (hand_x > screen_size.width) {
            hand_x = screen_size.width;
        } else if (hand_x < 0) {
            hand_x = 0;
        }
        if (hand_y > screen_size.height) {
            hand_y = screen_size.height;
        } else if (hand_y < 0) {
            hand_y = 0;
        }
        // Update radius between start and hand location
        r = Math.sqrt(Math.pow(start_x - hand_x, 2) + Math.pow(start_y - hand_y, 2));

        // Update hand angle
        hand_angle = Math.atan2(start_y - hand_y, hand_x - start_x) * 180 / Math.PI;

        // Calculations done in the MOVING phase
        if (game_phase == MOVING) {
            console.log(target_jump[trial]); // Debugging message to check if there was supposed to be a target jump
            /*
              Jump target to clamp if target_jump[trial] == 1
              Jump target away from clamp by target_jump[trial] if value is neither 0 || 1
            */
            if (target_jump[trial] == 1) {
                target_x = start_x + target_dist * Math.cos((target_angle[trial] + rotation[trial]) * Math.PI / 180);
                target_y = start_y - target_dist * Math.sin((target_angle[trial] + rotation[trial]) * Math.PI / 180);
                d3.select('#target').attr('cx', target_x).attr('cy', target_y).attr('display', 'block');
            } else if (target_jump[trial] != 0) {
                target_x = start_x + target_dist * Math.cos((target_angle[trial] + target_jump[trial]) * Math.PI / 180);
                target_y = start_y - target_dist * Math.sin((target_angle[trial] + target_jump[trial]) * Math.PI / 180);
                d3.select('#target').attr('cx', target_x).attr('cy', target_y).attr('display', 'block');
            }

            // Updating cursor locations depending on clamp, fb, no_fb
            if (clamped_fb[trial]) { // Clamped feedback
                cursor_x = start_x + r * Math.cos((target_angle[trial] + rotation[trial]) * Math.PI / 180);
                cursor_y = start_y - r * Math.sin((target_angle[trial] + rotation[trial]) * Math.PI / 180);
            } else if (online_fb[trial]) { // Rotated feedback (vmr)
                cursor_x = start_x + r * Math.cos((hand_angle + rotation[trial]) * Math.PI / 180);
                cursor_y = start_y - r * Math.sin((hand_angle + rotation[trial]) * Math.PI / 180);
            } else { // Veritical feedback
                cursor_x = hand_x;
                cursor_y = hand_y;
            }
        } else {
            cursor_x = hand_x;
            cursor_y = hand_y;
        }

        // Calculations done in the HOLDING phase
        if (game_phase == HOLDING) {
            if (r <= start_radius) { // Fill the center if within start radius
                d3.select('#cursor').attr('display', 'none');
                d3.select('#start').attr('fill', 'white');
            } else { // Display cursor otherwise
                d3.select('#cursor').attr('cx', cursor_x).attr('cy', cursor_y).attr('display', 'block');
                d3.select('#start').attr('fill', 'none');
            }
            // Calculations done in SHOW_TARTETS phase
        } else if (game_phase == SHOW_TARGETS) {
            d3.select('#cursor').attr('display', 'none');
            d3.select('#start').attr('fill', 'white');
            // Flag cursor to display if within certain distance to center
        } else if (game_phase == SEARCHING) {
            if (r <= target_dist * 1) {
                cursor_show = true;
            }

            // Display the cursor if flag is on 
            if (cursor_show) {
                d3.select('#cursor').attr('display', 'block'); // show cursor
                d3.select('#cursor').attr('cx', cursor_x).attr('cy', cursor_y).attr('display', 'block');
            } else {
                $('html').css('cursor', 'none');
                $('body').css('cursor', 'none'); //ensure mouse is hidden
                d3.select('#cursor').attr('display', 'none'); // hide the cursor
            }

            // Displaying the start circle and trial count 
            d3.select('#start').attr('display', 'block');
            d3.select('#trialcount').attr('display', 'block');

            // Displaying searching too slow message if threshold is crossed
            if (new Date() - begin > search_too_slow) {
                d3.select('#search_too_slow').attr('display', 'block');
                if (new Date() - begin > search_too_slow + 2000) {
                    // d3.select('#encouragement').attr('display', 'block')
                }
            }
            // Displaying the cursor during MOVING if targetfile indicates so for the reach
        } else if (game_phase == MOVING) {
            if (online_fb[trial] || clamped_fb[trial]) {
                d3.select('#cursor').attr('cx', cursor_x).attr('cy', cursor_y).attr('display', 'block');
            } else {
                d3.select('#cursor').attr('display', 'none'); // hide the cursor
            }
        }

        // Trigger Game Phase Changes that are Dependent on Cursor Movement

        // Move from search to hold phase if they move within search tolerance of the start circle 
        if (game_phase == SEARCHING && r <= search_tolerance && cursor_show) {
            d3.select('#search_too_slow').attr('display', 'none');
            // d3.select('#encouragement').attr('display', 'none');
            hold_phase();


            // Move from hold back to search phase if they move back beyond the search tolerance
        } else if (game_phase == HOLDING && r > search_tolerance) {
            search_phase();

            // Start the hold timer if they are within the start circle
            // Timing flag ensures the timer only gets started once
        } else if (game_phase == HOLDING && r <= start_radius && !timing) {
            timing = true;
            hold_timer = setTimeout(show_targets, hold_time);

            // Clear out timer if holding is completed
        } else if (game_phase == HOLDING && r > start_radius && timing) {
            timing = false;
            d3.select('#message-line-1').attr('display', 'none');
            clearTimeout(hold_timer);

            // Move from show targets to moving phase once user has begun their reach
        } else if (game_phase == SHOW_TARGETS && r > start_radius && !target_invisible) { // for clicking
            moving_phase();

            // Move from moving to feedback phase once their reach intersects the target ring
        } else if (game_phase == MOVING && r > target_dist) {
            fb_phase();
        }
    }

    // Function called whenever a key is pressed
    // **TODO** Make sure the conditions match up to the messages displayed in "messages"
    function advance_block(event) {
        var SPACE_BAR = 32;
        var a = 65;
        var e = 69;
        var b = 66;
        var f = 70;
        // bb_mess 1 --> b, 2 or 5 --> a, 3 or 6 --> space, 4 --> e
        if ((game_phase == BETWEEN_BLOCKS && (bb_mess == 5 || bb_mess == 2) && event.keyCode == a) || bb_mess == 0) {
            search_phase();
        } else if ((game_phase == BETWEEN_BLOCKS && bb_mess == 4 && event.keyCode == e)) {
            search_phase();
        } else if (game_phase == BETWEEN_BLOCKS && bb_mess == 1 && event.keyCode == b) {
            search_phase();
        } else if (game_phase == BETWEEN_BLOCKS && event.keyCode == SPACE_BAR && (bb_mess == 3 || bb_mess == 6)) {
            search_phase();
        } else if (game_phase != BETWEEN_BLOCKS) {
            // Do nothing
        } else {
            console.log("premature end");
            console.log(bb_mess);
            window.removeEventListener('resize', monitorWindow, false);
            document.removeEventListener('click', setPointerLock, false);
            document.exitPointerLock();
            badGame(); // Premature exit game if failed attention check
        }
    }

    /***********************
     * Game Phase Functions *
     * Mostly controls what is being displayed *
     ************************/

    // Phase when searching for the center start circle
    function search_phase() {
        game_phase = SEARCHING;

        // Start of timer for search time
        begin = new Date();

        // Start circle becomes visible, target, cursor invisible
        d3.select('#start').attr('display', 'block').attr('fill', 'none');
        d3.select('#target').attr('display', 'none').attr('fill', 'blue');
        d3.select('#cursor').attr('display', 'none');
        d3.select('#message-line-1').attr('display', 'none');
        d3.select('#message-line-2').attr('display', 'none');
        d3.select('#message-line-3').attr('display', 'none');
        d3.select('#message-line-4').attr('display', 'none');
        d3.select('#too_slow_message').attr('display', 'none');
        d3.select('#trialcount').attr('display', 'block');
    }

    // Obsolete function
    function end_game() {
        game_phase = END_GAME;
    }

    // Phase when users hold their cursors within the start circle
    function hold_phase() {
        game_phase = HOLDING;
    }

    // Phase when users have held cursor in start circle long enough so target shows up 
    function show_targets() {
        game_phase = SHOW_TARGETS;

        // Record search time as the time elapsed from the start of the search phase to the start of this phase
        d3.select('#message-line-1').attr('display', 'none');
        search_time = new Date() - begin;

        // Start of timer for reaction time
        begin = new Date();

        // Target becomes visible
        target_x = start_x + target_dist * Math.cos(target_angle[trial] * Math.PI / 180);
        target_y = start_y - target_dist * Math.sin(target_angle[trial] * Math.PI / 180);
        d3.select('#target').attr('display', 'block').attr('cx', target_x).attr('cy', target_y);
        target_invisible = false;
    }

    // Phase when users are reaching to the target
    function moving_phase() {
        game_phase = MOVING;

        // Record reaction time as time spent with target visible before moving
        rt = new Date() - begin;

        // Start of timer for movement time
        begin = new Date();

        // Start circle disappears
        //d3.select('#start').attr('display', 'block');
        d3.select('#start').attr('fill', 'none');
    }

    // Phase where users have finished their reach and receive feedback
    function fb_phase() {
        game_phase = FEEDBACK;

        // Record movement time as time spent reaching before intersecting target circle
        // Can choose to add audio in later if necessary
        mt = new Date() - begin;
        d3.select('#cursor').attr('display', 'none');

        if (mt > too_slow_time) {
            // d3.select('#target').attr('fill', 'red');
            if_slow = true;
            d3.select('#target').attr('display', 'none');
            d3.select('#cursor').attr('display', 'none');
            d3.select('#too_slow_message').attr('display', 'block');
            d3.select('#start').attr('display', 'none');
            reach_feedback = "too_slow";
        } else {
            // d3.select('#target').attr('fill', 'green');
            reach_feedback = "good_reach";
        }

        // Record the hand location immediately after crossing target ring
        // projected back onto target ring (since mouse doesn't sample fast enough)
        hand_fb_angle = Math.atan2(start_y - hand_y, hand_x - start_x) * 180 / Math.PI;
        if (hand_fb_angle < 0) {
            hand_fb_angle = 360 + hand_fb_angle; // Corrected so that it doesn't have negative angles
        }
        hand_fb_x = start_x + target_dist * Math.cos(hand_fb_angle * Math.PI / 180);
        hand_fb_y = start_y - target_dist * Math.sin(hand_fb_angle * Math.PI / 180);

        // Display Cursor Endpoint Feedback
        if (clamped_fb[trial]) { // Clamped feedback
            cursor_x = start_x + target_dist * Math.cos((target_angle[trial] + rotation[trial]) * Math.PI / 180);
            cursor_y = start_y - target_dist * Math.sin((target_angle[trial] + rotation[trial]) * Math.PI / 180);
            d3.select('#cursor').attr('cx', cursor_x).attr('cy', cursor_y).attr('display', 'block');
            trial_type = "clamped_fb";
        } else if (endpt_fb[trial] || online_fb[trial]) { // Visible feedback (may be rotated depending on rotation)
            cursor_x = start_x + target_dist * Math.cos((hand_fb_angle + rotation[trial]) * Math.PI / 180);
            cursor_y = start_y - target_dist * Math.sin((hand_fb_angle + rotation[trial]) * Math.PI / 180);
            d3.select('#cursor').attr('cx', cursor_x).attr('cy', cursor_y).attr('display', 'block');
            trial_type = "online_fb";
        } else {
            d3.select('#cursor').attr('display', 'none');
            trial_type = "no_fb";
        }
        // Start next trial after feedback time has elapsed
        if (if_slow) {
            if_slow = false;
            fb_timer = setTimeout(next_trial, feedback_time_slow)
        } else {
            fb_timer = setTimeout(next_trial, feedback_time);
        }
    }

    // Function used to initiate the next trial after uploading reach data and subject data onto the database
    // Cleans up all the variables and displays to set up for the next reach
    function next_trial() {
        cursor_show = false;
        // Uploading reach data for this reach onto the database
        //SubjTrials.group_type is defined in startGame
        if ( !subjTrials) {
            var group_type = "null"; // **TODO** update group_type to manage the groups
            subjTrials = new Trial(experiment_ID, subject.id, group_type);
        }

        // TODO: add data to append to block for this Trial
        subjTrials.appendTrialBlock(
            target_angle[trial],
            trial_type, 
            rotation[trial],
            hand_fb_angle, 
            rt,
            mt,
            search_time,
            reach_feedback
        );

        // Reset timing variables
        rt = 0;
        mt = 0;
        search_time = 0;

        // Between Blocks Message Index
        bb_mess = between_blocks[trial];
        
        // Increment the trial count
        trial += 1;
        counter += 1;
        d3.select('#trialcount').text('Reach Number: ' + counter + ' / ' + totalTrials);


        // Ensure target, cursor invisible
        d3.select('#target').attr('display', 'none');
        d3.select('#cursor').attr('display', 'none');
        target_invisible = true; // for clicking, currently not employed
        // Teleport cursor back to center
        setTimeout(moveCursor, 750);
        // Checks whether the experiment is complete, if not continues to next trial
        if (trial == num_trials) {
            window.removeEventListener('resize', monitorWindow, false);
            document.removeEventListener('click', setPointerLock, false);
            document.exitPointerLock();
            endGame();
        } else if (bb_mess || counter == 1) {
            console.log(bb_mess);
            game_phase = BETWEEN_BLOCKS;
            d3.select('#message-line-1').attr('display', 'block').text(messages[bb_mess][0]);
            d3.select('#message-line-2').attr('display', 'block').text(messages[bb_mess][1]);
            d3.select('#message-line-3').attr('display', 'block').text(messages[bb_mess][2]);
            d3.select('#message-line-4').attr('display', 'block').text(messages[bb_mess][3]);
            d3.select('#too_slow_message').attr('display', 'none');
            d3.select('#trialcount').attr('display', 'block');
            d3.select('#start').attr('display', 'none');
            bb_counter += 1;
        } else {
            // Start next trial
            search_phase();

        }
    }
}

function getVowelFormants(y, squareTop, squareSize) {
    const vowelFormants = {
        i: { f1: 300, f2: 2300 },
        u: { f1: 300, f2: 800 },
        a: { f1: 700, f2: 1200 },
        æ: { f1: 700, f2: 1800 }
    };
    
    const vowels = Object.keys(vowelFormants);
    const segmentHeight = squareSize / (vowels.length - 1);
    const index = Math.min(Math.floor((y - squareTop) / segmentHeight), vowels.length - 2);
    const t = ((y - squareTop) % segmentHeight) / segmentHeight;
    const vowel1 = vowels[index];
    const vowel2 = vowels[index + 1];

    const f1 = vowelFormants[vowel1].f1 * (1 - t) + vowelFormants[vowel2].f1 * t;
    const f2 = vowelFormants[vowel1].f2 * (1 - t) + vowelFormants[vowel2].f2 * t;

    return { f1, f2, vowel: t < 0.5 ? vowel1 : vowel2 };
}

// Helper function to end the game regardless good or bad
function helpEnd() {
    closeFullScreen();
    $('html').css('cursor', 'auto');
    $('body').css('cursor', 'auto');
    $('body').css('background-color', 'white');
    $('html').css('background-color', 'white');

    d3.select('#start').attr('display', 'none');
    d3.select('#target').attr('display', 'none');
    d3.select('#cursor').attr('display', 'none');
    d3.select('#message-line-1').attr('display', 'none');
    d3.select('#message-line-2').attr('display', 'none');
    d3.select('#message-line-3').attr('display', 'none');
    d3.select('#message-line-4').attr('display', 'none');
    d3.select('#too_slow_message').attr('display', 'none');
    d3.select('#search_too_slow').attr('display', 'none');
    d3.select('#countdown').attr('display', 'none');
    d3.select('#trialcount').attr('display', 'none');

    recordTrialSubj(trialcollection, subjTrials);
}
// Function that allows for the premature end of a game
function badGame() {
    helpEnd();
    show('container-failed', 'container-exp');
}

// Function that ends the game appropriately after the experiment has been completed
function endGame() {
    helpEnd();
    show('container-not-an-ad', 'container-exp');

}

// Function used to save the feedback from the final HTML page
function saveFeedback() {
    var values = $("#feedbackForm").serializeArray();
    if (values[0].value != "") {
        subject.comments = values[0].value;
    }
    values = $("#distractionForm").serializeArray();
    var i;
    for (i = 0; i < values.length; i++) {
        subject.distractions.push(values[i].value);
        if (values[i].value == "other") {
            subject.distracto = values[i + 1].value;
            break;
        }
    }

    createSubject(subjectcollection, subject);
    show('final-page', 'container-not-an-ad');
}

document.addEventListener('DOMContentLoaded', function() {
    // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
    // // The Firebase SDK is initialized and available here!
    //
    // firebase.auth().onAuthStateChanged(user => { });
    // firebase.database().ref('/path/to/ref').on('value', snapshot => { });
    // firebase.messaging().requestPermission().then(() => { });
    // firebase.storage().ref('/path/to/ref').getDownloadURL().then(() => { });
    //
    // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
});