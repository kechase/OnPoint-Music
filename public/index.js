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

//#region Components
class Circle {
    constructor(parent, x, y, radius, fill, stroke){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.visible = false;
        this.element = parent.append('circle')
            .attr('r', radius)
            .attr('stroke-width', 2)
        this.update(x,y);
        this.setFill(fill);
        this.setStroke(stroke);
        this.display(false);
    }

    setFill(color) {
        this.element.attr('fill', color);
    }

    setStroke(color) {
        this.element.attr('stroke', color);
    }

    // control how the element is displayed
    display(isVisible) {
        this.visible = isVisible;
        const value = this.visible ? 'block' : 'none';
        this.element.attr('display', value);
    }

    // update position of the element
    update(x, y) {
        this.element.attr("cx", x).attr("cy", y);
    }
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
    constructor(experimentID, id) {
        super("trial");
        this.id = id; 
        this.experimentID = experimentID;
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
        const d = new Date();
        const current_date = (parseInt(d.getMonth()) + 1).toString() + "/" + d.getDate() + "/" + d.getFullYear() + " " + d.getHours() + ":" + d.getMinutes() + "." + d.getSeconds() + "." + d.getMilliseconds();
        
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
        super("Log");
        this.timestamp = new Date();
        this.mouse_x = mouse_x;
        this.mouse_y = mouse_y;
    }
}

//#endregion

//#region Global funciton

// Function used on html side of code.
function isNumericKey(event) {
    const code = (event.which) ? event.which : event.keyCode;
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

// variable to hold current display page. Will be used to hide when show is called
let prevpage = 'container-consent';

// Function to switch between HTML pages
function show(shown) {
    if ( prevpage !== null ) {
        document.getElementById(prevpage).style.display = 'none';
    }
    document.getElementById(shown).style.display = 'block';
    prevpage = shown;
    return false;
}

// Function used to enter full screen mode
function openFullScreen() {
    const elem = document.getElementById('container-info');
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
        try {
            document.exitFullscreen();
        } catch(e) {
            console.log("Somehow the client was not in full screen mode but we're still calling this anyway?",e );
        }
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}

// Object used track subject data (uploaded to database)
let subject;    // : Subject  

// Object used to track reaching data (updated every reach and uploaded to database)
let subjTrials; // : Trial

// Function used to check if all questions were filled in info form, if so, starts the experiment 
function checkInfo() {

    const values = $("#infoform").serializeArray();
    // form data used to create subject info
    const email = values[0].value;
    const age = values[1].value;
    const sex = values[2].value;
    const handedness = values[3].value;
    const mousetype = values[4].value;
    const returner = values[5].value;
    const ethnicity = values[6].value;
    const race = values[7].value;
    
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

    show('container-exp');
    createSubject(subjectcollection, subject);
    openFullScreen();
    startGame();
}

// Function used to create/update subject data in the database
function createSubject(collection, subject) {
    if (noSave) {
        return null;
    }

    // TODO: Test and verify this working
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
let svgContainer;
let screen_size;    // use ScreenSize object instead

/*
// Game Phase Flags
    // could this be made into enums?
    SEARCHING = 0; // Looking for the center after a reach
    HOLDING = 1; // Holding at start to begin the next target
    SHOW_TARGETS = 2; // Displaying the target
    MOVING = 3; // The reaching motion 
    FEEDBACK = 4; // Displaying the feedback after reach
    BETWEEN_BLOCKS = 5; // Displaying break messages if necessary
*/
const Phase = Object.freeze({
    UNINIT: -1, // to avoid handling keyboard inputs
    SEARCHING: 0,
    HOLDING: 1,
    SHOW_TARGETS: 2,
    MOVING: 3,
    FEEDBACK: 4,
    BETWEEN_BLOCKS: 5
});

const TrialType = Object.freeze({
    Clamped: "clamped_fb",
    Online: "online_fb",
    None: "no_fb",
});

// TODO: Digest through this and see how we can containerize this into objects instead?
let experiment_ID;
let subject_ID;
let target_dist = 0;
let trial_type = TrialType.None;

// Circle objects
let start = null;
let target = null;
let cursor = null;

// Currently in used in moveCursor and updateCursor function.
let hand_x = 0;
let hand_y = 0;

// The between block messages that will be displayed
// **TODO** Update messages depending on your experiment
// TODO: Talk to Katie if she wants to include messages inside JSON file?
const messages = [
    ["Dummy Message Test"],
    [ "Wait until the center circle turns green.", // Message displayed when bb_mess == 1
      "Listen to the sound, then move in the direction that recreates the sound.",
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
let counter = 1; // current reach count (starts at 1)
let target_file_data;
let rotation;
let target_angle;
let online_fb;
let endpt_fb;
let clamped_fb;
let between_blocks;

let trial = 0; // trial count (starts at 0)
let num_trials;
// let search_tolerance;
let hand_fb_angle;
let rt;
let mt;
let search_time;
const feedback_time = 50;       // length of time feedback remains (ms)
const feedback_time_slow = 750; // length of "too slow" feedback
const hold_time = 500;  // length of time users must hold in start before next trial (ms)
let hold_timer;
let begin;
let timing;
let game_phase = Phase.UNINIT;
let reach_feedback;
let bb_counter;
let play_sound = true;

// this seems wrong. We're loading files that already exist in the repository rather than recreate the sound ourselves?
// TODO: Find a way to drive the sound ourselves instead of relying on files created in folder structure such as this.
const audio270 = new Audio('/sounds/Trial12_Tgt270.m4a');
const audio45 = new Audio('/sounds/Trial19_Tgt45.m4a');
const audio135 = new Audio('/sounds/Trial20_Tgt135.m4a');
let handPositions = []; 

// Variables to track screen size
let prev_screen_size;

// audio controls. 
let audioContext, oscillator, gainNode, filter1, filter2;

// This in turn should return an object containing all of the audio examples and context. 
// This will make adjustment easy to perform on defined structure.    
function initAudio() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    gainNode = audioContext.createGain();
    gainNode.gain.value = 0.001;
    
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
}

// Function used to start running the game
function startGame() {
    // create a new audio context
    initAudio();

    // CORS error is blocking from loading this file
    // TODO: before we deploy this website - please serve this on NodeJS and see if we can load the file properly
    $.getJSON(fileName, function(json) {
        gameSetup(json);
    });
}


// Function to monitor changes in screen size;
// event is not used
function monitorWindow(_event) {
    const prev_size = prev_screen_size.width * prev_screen_size.height;
    const curr_size = self.innerHeight * self.innerWidth;
    console.log("prev size: " + prev_size + " curr size: " + curr_size);
    if (prev_size > curr_size) {
        alert("Please enter full screen and click your mouse to continue the experiment! (Shortcut for Mac users: Command + Control + F. Shortcut for PC users: F11) ");
    }
    prev_screen_size.width = self.innerWidth;
    prev_screen_size.height = self.innerHeight;
}

// Function that sets up the game 
// All game functions are defined within this main function, treat as "main"
function gameSetup(data) {
    /*********************
     * Browser Settings  *
     *********************/

    target_file_data = data;

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
    screen_size = new ScreenSize(self.screen.availWidth, self.screen.availHeight);
    // TODO: Need to see if I clone this value properly, if it referenced, both variable would receive identical value.
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
    target_dist = screen_size.height / 3;
    trial_type;

    // Setting parameters and drawing the center start circle
    start = new Circle(
        svgContainer // parent
        , screen_size.width / 2   // x
        , screen_size.height / 2    // y
        , Math.round(target_dist * 4.5 / 80.0) // radius
        , 'none' // color
        , 'white' // stroke
    ); 

    // visual setup
    const squareLeft = start.x - target_dist;
    const squareTop = start.y - target_dist;
    const squareSize = 2 * target_dist;

    // document.addEventListener('mousemove', (event) => {
    //     const x = event.clientX;
    //     const y = event.clientY;
    //     // const infoDisplay = document.getElementById('infoDisplay');

    //     if (x >= squareLeft && x <= squareLeft + squareSize && 
    //         y >= squareTop && y <= squareTop + squareSize) {
    //         gainNode.gain.setValueAtTime(8, audioContext.currentTime);

    //         const { f1, f2, _vowel } = getVowelFormants(y, squareTop, squareSize);
    //         const pitch = 100 * Math.pow(2, (x - squareLeft) / 97);

    //         // infoDisplay.textContent = `Mouse X: ${x}, Mouse Y: ${y}, F1: ${f1.toFixed(2)}, F2: ${f2.toFixed(2)}, Pitch: ${pitch.toFixed(2)}, Vowel: ${vowel}`;

    //         oscillator.frequency.setValueAtTime(pitch, audioContext.currentTime);
    //         filter1.frequency.setTargetAtTime(f1, audioContext.currentTime, 0.1);
    //         filter2.frequency.setTargetAtTime(f2, audioContext.currentTime, 0.1);
    //         filter1.Q.setValueAtTime(12, audioContext.currentTime);
    //         filter2.Q.setValueAtTime(12, audioContext.currentTime);
    //     } else {
    //         gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    //     }
    // });

    // Setting parameters and drawing the target
    target = new Circle(svgContainer, // parent
        screen_size.width / 2,  // x
        Math.round(screen_size.height / 10 * 2), // y
        Math.round(target_dist * 4.5 / 80.0), // radius
        'blue',  // color
        'none'  // stroke
    );

    /* Initializing variables for:
        - Coordinates of the mouse 
        - Coordinates where the mouse crosses the target distance
        - Radius from center to hand coordinates
        - Coordinates of the displayed cursor (different from mouse if rotated)
        - Size of the displayed cursor
    */
    hand_x = 0;
    hand_y = 0;
    r = 0;
    
    // Drawing the displayed cursor 
    cursor = new Circle(
        svgContainer, 
        0,
        0, 
        Math.round(target_dist * 1.75 * 1.5 / 80.0), 
        'white', 
        'none'
    );

    // Function to move cursor to random location near center
    // From my understanding - we're using this to randomize cursor location.
    function moveCursor() {
        const radius = start.radius;
        const off_x = Math.random() * radius + radius;
        const off_y = Math.random() * radius + radius;
        const flip_x = Math.floor(Math.random() * 2);
        const flip_y = Math.floor(Math.random() * 2);
        hand_x = start.x + flip_x ? -off_x : off_x;
        hand_y = start.y + flip_y ? -off_y : off_y;
        cursor.update(hand_x, hand_y);
    }
    
    // Setting size of the displayed letters and sentences
    const line_size = Math.round(screen_size.height / 30)
    const message_size = String(line_size).concat("px");

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
        .text('Wait until the center circle turns green.');

    svgContainer.append('text')
        .attr('text-anchor', 'middle')
        .attr('x', screen_size.width / 2)
        .attr('y', screen_size.height / 2 + line_size)
        .attr('fill', 'white')
        .attr('font-family', 'sans-serif')
        .attr('font-size', message_size)
        .attr('id', 'message-line-3')
        .attr('display', 'block')
        .text('Move to the blue target. Remember the sound.');

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
    too_slow_time = 5000; // in milliseconds
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

    svgContainer.append('text')
        .attr('text-anchor', 'end')
        .attr('x', 1500)
        .attr('y', screen_size.height / 20)
        .attr('fill', 'white')
        .attr('font-size', message_size)
        .attr('id', 'musicInfo')
        .attr('display', 'block')
        .text('Music Info:');
     
    svgContainer.append('rect')
        .attr('x', squareLeft) // Left boundary of the square
        .attr('y', squareTop) // Top boundary of the square
        .attr('width', squareSize) // Width of the square
        .attr('height', squareSize) // Height of the square
        .attr('fill', 'none') // Transparent fill
        .attr('stroke', 'red') // Border color
        .attr('stroke-width', 2) // Border thickness
        .attr('id', 'targetSquare') // Unique ID for the square
        .attr('display', 'block'); // Ensure it's visible
        
    /***************************************
     * Pointer Lock Variables and Functions *
     ***************************************/
    document.requestPointerLock = document.requestPointerLock || document.mozRequestPointerLock;
    document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;
    document.addEventListener('pointerlockchange', lockChangeAlert, false);
    document.addEventListener('mozpointerlockchange', lockChangeAlert, false);
    self.addEventListener('resize', monitorWindow, false);
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
    /*****************
     * Task Variables *
     *****************/

    // Reading the json target file into the game
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
    // TODO: Talk to Katie if we still need this? Used as an indicator to display cursor before moving back to start.
    // search_tolerance = start.radius * 4 + cursor.radius * 4;

    // Calculated hand angles
    hand_fb_angle = 0;

    // Timing Variables
    rt = 0; // reaction time
    mt = 0; // movement time
    search_time = 0; // time to reset trial (includes hold time)
    hold_time; 

    // Initializing timer objects and variables
    hold_timer = null;

    // Variable to start clock for calculating time spent in states
    begin;
    /* Flag variables for
        - Whether or not hand is within start circle
        - Whether or not previous reach was too slow
    */
    timing = true;
    if_slow = false;

    game_phase = Phase.BETWEEN_BLOCKS;

    // Initializing between block parameters
    reach_feedback;
    bb_counter = 0;
    bb_mess = between_blocks[0];

    // Flags to determine whether we are showing the target and cursor (not mouse)
    target.display(false);
    cursor.display(false);

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
        // event = event || window.event;
        event = event || self.event;
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

        // update cursor position
        cursor.update(hand_x, hand_y);

        // distance between cursor and start
        const r = Math.sqrt(Math.pow(start.x - hand_x, 2) + Math.pow(start.y - hand_y, 2));

        // Update hand angle
        // no longer in use since the code down below is commented out, we're using hand_fb_angle instead?
        // hand_angle = Math.atan2(start.y - hand_y, hand_x - start.x) * 100 / Math.PI;

        // Calculations done in the MOVING phase
        // if (game_phase == Phase.MOVING) {
            // handPositions.push({ time: new Date() - begin, x: hand_x, y: hand_y});
            // /*
            //   Jump target to clamp if target_jump[trial] == 1
            //   Jump target away from clamp by target_jump[trial] if value is neither 0 || 1
            // */
            // if (target_jump[trial] == 1) {
            //     const x = start.x + target_dist * Math.cos((target_angle[trial] + rotation[trial]) * Math.PI / 180);
            //     const y = start.y - target_dist * Math.sin((target_angle[trial] + rotation[trial]) * Math.PI / 180);
            //     target.update(x,y).display(true);
            //     // d3.select('#target').attr('cx', target_x).attr('cy', target_y).attr('display', 'block');
            // } else if (target_jump[trial] != 0) {
            //     const x = start.x + target_dist * Math.cos((target_angle[trial] + target_jump[trial]) * Math.PI / 180);
            //     const y = start.y - target_dist * Math.sin((target_angle[trial] + target_jump[trial]) * Math.PI / 180);
            //     target.update(x,y).display(true);
            //     // d3.select('#target').attr('cx', target_x).attr('cy', target_y).attr('display', 'block');
            // }

            // Updating cursor locations depending on clamp, fb, no_fb
            // if (clamped_fb[trial]) { // Clamped feedback
            //     const x = start.x + r * Math.cos((target_angle[trial] + rotation[trial]) * Math.PI / 180);
            //     const y = start.y - r * Math.sin((target_angle[trial] + rotation[trial]) * Math.PI / 180);
            //     cursor.update(x,y);
            // } else if (online_fb[trial]) { // Rotated feedback (vmr)
            //     const x = start.x + r * Math.cos((hand_angle + rotation[trial]) * Math.PI / 180);
            //     const y = start.y - r * Math.sin((hand_angle + rotation[trial]) * Math.PI / 180);
            //     cursor.update(x, y);
            // } else { // Veritical feedback
            //     cursor.update(hand_x, hand_y);
            // }
        // } 

        switch ( game_phase) {
            case Phase.HOLDING:
                // Move from hold back to search phase if they move back beyond the search tolerance
                if( r > start.radius ) {
                    search_phase();
                } 
                break;

            case Phase.SHOW_TARGETS:
                // Move from show targets to moving phase once user has begun their reach
                if ( r > start.radius) {
                    moving_phase();
                }
                break;

            case Phase.SEARCHING:    
                
                // TOOD: Move this inside resize function
                // Display the cursor if flag is on 
                // if (!cursor.visible) {
                //     $('html').css('cursor', 'none');
                //     $('body').css('cursor', 'none'); //ensure mouse is hidden
                //     cursor.display(false); // hide the cursor
                // }

                // Displaying searching too slow message if threshold is crossed
                if (new Date() - begin > search_too_slow) {
                    d3.select('#search_too_slow').attr('display', 'block');
                    // not sure if this is used?
                    // if (new Date() - begin > search_too_slow + 2000) {
                    //     // d3.select('#encouragement').attr('display', 'block')
                    // }
                }

                // Move from search to hold phase if they move within search tolerance of the start circle
                if( r <= start.radius ) {
                    hold_phase();
                }

                break;

            case Phase.MOVING: 
                handPositions.push({ time: new Date() - begin, x: hand_x, y: hand_y});
                cursor.display(online_fb[trial] || clamped_fb[trial]);

                // Check if mouse is within the square
                if (hand_x >= squareLeft &&
                    hand_x <= squareLeft + squareSize &&
                    hand_y >= squareTop &&
                    hand_y <= squareTop + squareSize
                ) {
                    gainNode.gain.setValueAtTime(8, audioContext.currentTime);

                    // omitting vowel, even though it's not used here?
                    const { f1, f2, _vowel } = getVowelFormants(hand_y, squareTop, squareSize);
                    const pitch = 100 * Math.pow(2, (hand_x - squareLeft) / 180); // 150 -

                    oscillator.frequency.setValueAtTime(pitch, audioContext.currentTime);
                    filter1.frequency.setTargetAtTime(f1, audioContext.currentTime, 0.1);
                    filter2.frequency.setTargetAtTime(f2, audioContext.currentTime, 0.1);

                    filter1.Q.setValueAtTime(12, audioContext.currentTime);
                    filter2.Q.setValueAtTime(12, audioContext.currentTime);
                } else {
                    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
                }

                // Move from moving to feedback phase once their reach intersects the target ring
                if ( r > target_dist ) {
                    // stop audio
                    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
                    fb_phase();
                }
                break;
        }
    }

    // Function called whenever a key is pressed
    // **TODO** Make sure the conditions match up to the messages displayed in "messages"
    function advance_block(event) {
        const SPACE_BAR = 32;
        const a = 65;
        const e = 69;
        const b = 66;
        // const f = 70;   // not in use?

        console.log(bb_mess, game_phase);

        if ( game_phase == Phase.BETWEEN_BLOCKS ) {
            
            // bb_mess 1 --> b, 2 or 5 --> a, 3 or 6 --> space, 4 --> e
            if ( bb_mess == 1 && event.keyCode == b ) {
                search_phase();
                return;
            }

            if (( bb_mess == 2 || bb_mess == 5) && event.keyCode == a) {
                search_phase();
                return;
            }

            if ( (bb_mess = 3 || bb_mess == 6 ) && event.keyCode == SPACE_BAR ) {
                search_phase();
                return;
            }
            
            if ( bb_mess == 4 && event.keyCode == e ) {
                search_phase();
                return;
            }

            badGame(); // Premature exit game if failed attention check
        }  

        // start of the trial - we do not ask for client keyboard feedback, immediately search_phase();
        if ( bb_mess == 0 ) {
            search_phase();
            return;
        }
    
        // bb_mess 1 --> b, 2 or 5 --> a, 3 or 6 --> space, 4 --> e
        // if ((game_phase == Phase.BETWEEN_BLOCKS && (bb_mess == 5 || bb_mess == 2) && event.keyCode == a) || bb_mess == 0) {
        //     search_phase();
        // } else if ((game_phase == Phase.BETWEEN_BLOCKS && bb_mess == 4 && event.keyCode == e)) {
        //     search_phase();
        // } else if (game_phase == Phase.BETWEEN_BLOCKS && bb_mess == 1 && event.keyCode == b) {
        //     search_phase();
        // } else if (game_phase == Phase.BETWEEN_BLOCKS && event.keyCode == SPACE_BAR && (bb_mess == 3 || bb_mess == 6)) {
        //     search_phase();
        // } else if (game_phase != Phase.BETWEEN_BLOCKS) {
        //     // Do nothing
        // } else {
        //     // Hmm>
        //     console.log("premature end");
        //     console.log(bb_mess);
        //     // self.removeEventListener('resize', monitorWindow, false);
        //     // window.removeEventListener('resize', monitorWindow, false);
        //     // document.removeEventListener('click', setPointerLock, false);
        //     // document.exitPointerLock();
        //     // badGame(); // Premature exit game if failed attention check
        // }
    }

    /***********************
     * Game Phase Functions *
     * Mostly controls what is being displayed *
     ************************/

    // Phase when searching for the center start circle
    function search_phase() {
        // Clear out timer if holding was incomplete
        if ( timing ) {
            clearTimeout(hold_timer);
            timing = false;
        }

        // Start of timer for search time
        begin = new Date();

        // Start circle becomes visible, target and cursor invisible
        start.display(true);
        start.setFill('none');
        start.setStroke('white');

        target.display(false);
        cursor.display(true);

        d3.select('#message-line-1').attr('display', 'none');
        d3.select('#message-line-2').attr('display', 'none');
        d3.select('#message-line-3').attr('display', 'none');
        d3.select('#message-line-4').attr('display', 'none');
        d3.select('#too_slow_message').attr('display', 'none');
        d3.select('#trialcount').attr('display', 'block');

        // update game_phase
        game_phase = Phase.SEARCHING;
    }

    // Phase when users hold their cursors within the start circle
    function hold_phase() {
        // Fill the center if within start radius
        cursor.display(false);
        start.display(true);
        start.setFill('white');
        d3.select('#search_too_slow').attr('display', 'none');
        
        timing = true;
        hold_timer = setTimeout(show_targets, hold_time);
        game_phase = Phase.HOLDING;
    }

    // Phase when users have held cursor in start circle long enough so target shows up 
    function show_targets() {
        // hide the cursor display ( Should be hidden already? )
        cursor.display(false);
        start.display(true);        

        // Record search time as the time elapsed from the start of the search phase to the start of this phase
        d3.select('#message-line-1').attr('display', 'none');
        search_time = new Date() - begin;

        // Start of timer for reaction time
        begin = new Date();

        // Target becomes visible
        target_x = start.x + target_dist * Math.cos(target_angle[trial] * Math.PI / 180);
        target_y = start.y - target_dist * Math.sin(target_angle[trial] * Math.PI / 180);

        target.setFill('blue');
        target.update(target_x, target_y);
        
        // TODO: Find a way to toggle target visibility here?
        if(target_jump[trial] == 1){
          //Show the target.
          target.display(true);
        }else{
          //Hiding the target. 
          target.display(false);
          // TODO: For Katie -  This is going to play only one sound...? Is this intentional?
          if(play_sound){
          
            if(target_angle[trial] == 45){
                audio45.play();
            }else if(target_angle[trial] == 135){
                audio135.play();
            }else if(target_angle[trial] == 270){
                audio270.play();
            }
            
            play_sound = false;
          } 
        }
        
        // Turn start circle green after a second
        // TODO: Hold reference to this in case we need to stop the timer.
        // Potentially a bug waiting to happen
        setTimeout(function() {
            start.setFill('green');
            start.setStroke('none');
        }, 1000); 
        
        game_phase = Phase.SHOW_TARGETS;
    }

    // Phase when users are reaching to the target
    function moving_phase() {
        // Record reaction time as time spent with target visible before moving
        rt = new Date() - begin;
        
        // Start of timer for movement time
        begin = new Date();
        
        // Play audio
        gainNode.gain.setValueAtTime(8, audioContext.currentTime);
        
        // Start circle disappears
        start.display(false);
        
        game_phase = Phase.MOVING;
    }

    // Phase where users have finished their reach and receive feedback
    function fb_phase() {
        // Record movement time as time spent reaching before intersecting target circle
        // Can choose to add audio in later if necessary
        mt = new Date() - begin;
        
        let timer = feedback_time;
        if (mt > too_slow_time) {
            target.setFill('red');
            start.display(false);
            d3.select('#too_slow_message').attr('display', 'block');
            reach_feedback = "too_slow";
            timer = feedback_time_slow;
        } else {
            target.setFill('green');
            reach_feedback = "good_reach";
        }
        setTimeout(next_trial, timer);
        
        // Record the hand location immediately after crossing target ring
        // projected back onto target ring (since mouse doesn't sample fast enough)
        hand_fb_angle = Math.atan2(start.y - hand_y, hand_x - start.x) * 180 / Math.PI;
        if (hand_fb_angle < 0) {
            hand_fb_angle = 360 + hand_fb_angle; // Corrected so that it doesn't have negative angles
        }
        hand_fb_x = start.x + target_dist * Math.cos(hand_fb_angle * Math.PI / 180);
        hand_fb_y = start.y - target_dist * Math.sin(hand_fb_angle * Math.PI / 180);

        // Display Cursor Endpoint Feedback
        if (clamped_fb[trial]) { // Clamped feedback
            const cursor_x = start.x + target_dist * Math.cos((target_angle[trial] + rotation[trial]) * Math.PI / 180);
            const cursor_y = start.y - target_dist * Math.sin((target_angle[trial] + rotation[trial]) * Math.PI / 180);
            cursor.update(cursor_x, cursor_y);
            cursor.display(true);
            trial_type = TrialType.Clamped;
        } else if (endpt_fb[trial] || online_fb[trial]) { // Visible feedback (may be rotated depending on rotation)
            const cursor_x = start.x + target_dist * Math.cos((hand_fb_angle + rotation[trial]) * Math.PI / 180);
            const cursor_y = start.y - target_dist * Math.sin((hand_fb_angle + rotation[trial]) * Math.PI / 180);
            cursor.update(cursor_x, cursor_y)
            cursor.display(true);
            trial_type = TrialType.Online;
        } else {
            cursor.display(false);
            trial_type = TrialType.None;
        }

        // Start next trial after feedback time has elapsed
        game_phase = Phase.FEEDBACK;
    }

    // Function used to initiate the next trial after uploading reach data and subject data onto the database
    // Cleans up all the variables and displays to set up for the next reach
    function next_trial() {
        // Uploading reach data for this reach onto the database
        //SubjTrials.group_type is defined in startGame
        if ( !subjTrials) {
            subjTrials = new Trial(experiment_ID, subject.id);
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
        play_sound = true;

        handPositions = [];

        // Between Blocks Message Index
        bb_mess = between_blocks[trial];
        
        // Increment the trial count
        trial += 1;
        counter += 1;
        d3.select('#trialcount').text('Reach Number: ' + counter + ' / ' + totalTrials);

        // Ensure target, cursor invisible
        target.display(false);
        cursor.display(false);
        
        // Teleport cursor back to center
        // setTimeout(moveCursor, 750);

        // Checks whether the experiment is complete, if not continues to next trial
        if (trial == num_trials) {
            self.removeEventListener('resize', monitorWindow, false);
            document.removeEventListener('click', setPointerLock, false);
            document.exitPointerLock();
            endGame();
        } else if (bb_mess || counter == 1) {
            console.log(bb_mess);
            
            // Load messages
            d3.select('#message-line-1').attr('display', 'block').text(messages[bb_mess][0]);
            d3.select('#message-line-2').attr('display', 'block').text(messages[bb_mess][1]);
            d3.select('#message-line-3').attr('display', 'block').text(messages[bb_mess][2]);
            d3.select('#message-line-4').attr('display', 'block').text(messages[bb_mess][3]);
            
            // hide too_slow_message? Is this a bug of some sort?
            d3.select('#too_slow_message').attr('display', 'none');
            d3.select('#trialcount').attr('display', 'block');

            start.display(false);
            bb_counter += 1;
            
            // Waiting for keyboard inputs to begin
            game_phase = Phase.BETWEEN_BLOCKS;
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

    const currentVowel = t < 0.5 ? vowel1 : vowel2;

    return { f1, f2, vowel: currentVowel };
}

// Helper function to end the game regardless good or bad
function helpEnd() {
    closeFullScreen();
    // return the cursor back
    $('html').css('cursor', 'auto');
    $('body').css('cursor', 'auto');

    // restore the screen state.
    $('body').css('background-color', 'white');
    $('html').css('background-color', 'white');

    start.display(false);
    target.display(false);
    cursor.display(false);
    d3.select('#stage').attr('display', 'none');
    // d3.select('#message-line-1').attr('display', 'none');
    // d3.select('#message-line-2').attr('display', 'none');
    // d3.select('#message-line-3').attr('display', 'none');
    // d3.select('#message-line-4').attr('display', 'none');
    // d3.select('#too_slow_message').attr('display', 'none');
    // d3.select('#search_too_slow').attr('display', 'none');
    // d3.select('#countdown').attr('display', 'none');
    // d3.select('#trialcount').attr('display', 'none');

    recordTrialSubj(trialcollection, subjTrials);
}
// Function that allows for the premature end of a game
function badGame() {
    show('container-failed');
    helpEnd();
}

// Function that ends the game appropriately after the experiment has been completed
function endGame() {
    show('container-not-an-ad');
    helpEnd();
}

// Function used to save the feedback from the final HTML page
function saveFeedback() {
    let values = $("#feedbackForm").serializeArray();
    for (let i = 0; i < values.length; i++) {
        if (values[0].value != "") {
            subject.comments = values[0].value;
        }

        values = $("#distractionForm").serializeArray();
        subject.distractions.push(values[i].value);
        if (values[i].value == "other") {
            subject.distracto = values[i + 1].value;
            break;
        }
    }

    createSubject(subjectcollection, subject);
    show('final-page');
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