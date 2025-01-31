/*
This current experiment is a auditory motor mapping experiment that can easily be adapted into variations of different reaching experiments depending on the target file.

*/

// Set to 'true' if you wish to only test the front-end (will not access databases)
// **TODO** Make sure this is set to false before deploying! 
const noSave = false;

var fileName;

/* TEMPORARY USE OF ORIGINAL CODE TO TEST THINGS OUT */
try {
    let app = firebase.app(); // Tries to get the Firebase app instance
} catch (e) {
    console.error(e); // If it fails, logs the error in red to the console
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

// Function to save the dpi
function saveDPI() {
    if (noSave) {
        show('container-instructions2', 'container-dpi')
        return false;
    }
    var values = $("#dpiform").serializeArray();
    var dpi = values[0].value;
    dpi = +dpi;
    if (!dpi) {
        alert("Please input a valid number!");
        return;
    }
    subject.dpi = dpi;
    show('container-instructions2', 'container-dpi')
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
var subject = {
    id: null,
    age: null,
    sex: null,
    handedness: null,
    mousetype: null,
    returner: null,
    currTrial: 0,
    tgt_file: null,
    ethnicity: null,
    race: null,
    comments: null,
    distractions: [],
    distracto: null,
    dpi: null
}

// Object used to track reaching data (updated every reach and uploaded to database)
var subjTrials = {
    id: null,
    experimentID: null,
    trialNum: [],
    currentDate: [],
    target_angle: [],
    trial_type: [],
    rotation: [],
    hand_fb_angle: [],
    hand_path: [],
    rt: [],
    mt: [],
    search_time: [],
    reach_feedback: [],
    start_x: [],
    start_y: [], 
    screen_height: [], 
    screen_width: [], 
    group_type: null
}

// Function used to check if all questions were filled in info form, if so, starts the experiment 
function checkInfo() {
    var actualCode = "rice"; // **TODO: Update depending on the "code" set in index.html
    var values = $("#infoform").serializeArray();
    subject.id = values[0].value;
    subject.age = values[1].value;
    subject.sex = values[2].value;
    subject.handedness = values[3].value;
    subject.mousetype = values[4].value;
    subject.returner = values[5].value;
    subject.ethnicity = values[6].value;
    subject.race = values[7].value;
    if (noSave) {
        show('container-exp', 'container-info');
        openFullScreen();
        startGame();
        return;
    }
    console.log(subject.id);
    console.log(subject.handedness);
    console.log(values)
    if (!subject.id || !subject.age || !subject.sex || !subject.handedness || !subject.mousetype) {
        alert("Please fill out your basic information!");
        return;
    } else {
        show('container-exp', 'container-info');
        createSubject(subjectcollection, subject);
        openFullScreen();
        startGame();
    }
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

// Function used for music
const vowelFormants = {
    i: { f1: 300, f2: 2300 },
    //e: { f1: 300, f2: 800 },
    //E: { f1: 700, f2: 1200 },
    æ: { f1: 1000, f2: 1300 }
};

let audioContext, oscillator, gainNode, filter1, filter2;


function getVowelFormants(y, squareTop, squareSize) {
    const vowels = Object.keys(vowelFormants);
    const segmentHeight = squareSize / (vowels.length - 1);
    const index = Math.min(
        Math.floor((y - squareTop) / segmentHeight),
        vowels.length - 2
    );
    const t = ((y - squareTop) % segmentHeight) / segmentHeight;
    const vowel1 = vowels[index];
    const vowel2 = vowels[index + 1];

    const f1 = vowelFormants[vowel1].f1 * (1 - t) + vowelFormants[vowel2].f1 * t;
    const f2 = vowelFormants[vowel1].f2 * (1 - t) + vowelFormants[vowel2].f2 * t;

    const currentVowel = t <0.5 ? vowel1 : vowel2;

    return { f1, f2, vowel: currentVowel };
}

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

function updateHandDisplay(hand_x, hand_y, pitch, f1, f2, vowel) {
    const musicInfoText = `
        Hand X: ${hand_x.toFixed(1)},
        Hand Y: ${hand_y.toFixed(1)},
        Pitch: ${pitch.toFixed(2)},
        F1: ${f1.toFixed(1)},
        F2: ${f2.toFixed(1)},
        Vowel: ${vowel}
    `;
    d3.select('#musicInfo')
        .text(musicInfoText)
        .attr('display', 'block'); // Show the text if hidden
}


// Variables used throughout the experiment
var svgContainer;
var screen_height;
var screen_width;
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
var counter; // current reach count (starts at 1)
var target_file_data;
var rotation;
var target_angle;
var online_fb;
var endpt_fb;
var clamped_fb;
var between_blocks;
var trial; // trial count (starts at 0)
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
var audio_flag = 0;
var play_sound = 1; 

// Variables to track screen size
var prev_height;
var prev_width;
const audio270 = new Audio('/sounds/Trial12_Tgt270.m4a');
const audio45 = new Audio('/sounds/Trial19_Tgt45.m4a');
const audio135 = new Audio('/sounds/Trial20_Tgt135.m4a');
var handPositions = []; 

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

    // Getting the screen resolution
    screen_height = window.screen.availHeight;
    screen_width = window.screen.availWidth;
    prev_height = screen_height;
    prev_width = screen_width;
    // Experiment parameters, subject_ID is no obsolete
    experiment_ID = "test"; // **TODO** Update experiment_ID to label your experiments
    subject_ID = Math.floor(Math.random() * 10000000000);

    /***************************
     * Drawn Element Properties *
     ***************************/

    // Setting the radius from center to target location 
    target_dist = screen_height / 3;
    trial_type;

    // Setting parameters and drawing the center start circle
    start_x = screen_width / 2;
    start_y = screen_height / 2;
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
    target_x = screen_width / 2;
    target_y = Math.round(screen_height / 10 * 2);
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

    // Setting size of the displayed letters and sentences
    line_size = Math.round(screen_height / 30)
    message_size = String(line_size).concat("px");

    // Setting up first initial display once the game is launched 
    // **TODO** Update the '.text' sections to change initial displayed message
    svgContainer.append('text')
        .attr('text-anchor', 'middle')
        .attr('x', screen_width / 2)
        .attr('y', screen_height / 2 - line_size)
        .attr('fill', 'white')
        .attr('font-family', 'sans-serif')
        .attr('font-size', message_size)
        .attr('id', 'message-line-1')
        .attr('display', 'block')
        .text('This is a new instrument! We're going to give you a short training to learn how it sounds and then let you play it. First, move your white cursor to the center.');

    svgContainer.append('text')
        .attr('text-anchor', 'middle')
        .attr('x', screen_width / 2)
        .attr('y', screen_height / 2)
        .attr('fill', 'white')
        .attr('font-family', 'sans-serif')
        .attr('font-size', message_size)
        .attr('id', 'message-line-2')
        .attr('display', 'block')
        .text('Wait until the center circle turns green.');

    svgContainer.append('text')
        .attr('text-anchor', 'middle')
        .attr('x', screen_width / 2)
        .attr('y', screen_height / 2 + line_size)
        .attr('fill', 'white')
        .attr('font-family', 'sans-serif')
        .attr('font-size', message_size)
        .attr('id', 'message-line-3')
        .attr('display', 'block')
        .text('Move to the blue target. Remember the sound.');

    svgContainer.append('text')
        .attr('text-anchor', 'middle')
        .attr('x', screen_width / 2)
        .attr('y', screen_height / 2 + line_size * 2)
        .attr('fill', 'white')
        .attr('font-family', 'sans-serif')
        .attr('font-size', message_size)
        .attr('id', 'message-line-4')
        .attr('display', 'block')
        .text('Press SPACE BAR when you are ready to proceed.');

    // Setting up parameters and display when reach is too slow
    too_slow_time = 9000; // in milliseconds
    svgContainer.append('text')
        .attr('text-anchor', 'middle')
        .attr('x', screen_width / 2)
        .attr('y', screen_height / 2)
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
        .attr('x', screen_width / 2)
        .attr('y', screen_height / 3 * 2)
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
        .attr('x', screen_width / 20 * 19)
        .attr('y', screen_height / 20 * 19)
        .attr('fill', 'white')
        .attr('font-size', message_size)
        .attr('id', 'trialcount')
        .attr('display', 'none')
        .text('Reach Number: ' + counter + ' / ' + totalTrials);
        
   svgContainer.append('text')
        .attr('text-anchor', 'end')
        .attr('x', screen_width / 20 * 19)
        .attr('y', screen_height / 20 * 19)
        .attr('fill', 'white')
        .attr('font-size', message_size)
        .attr('id', 'trialcount')
        .attr('display', 'none')
        .text('Reach Number: ' + counter + ' / ' + totalTrials);
        
  svgContainer.append('text')
        .attr('text-anchor', 'end')
        .attr('x', 1500)
        .attr('y', screen_height / 20)
        .attr('fill', 'white')
        .attr('font-size', message_size)
        .attr('id', 'musicInfo')
        .attr('display', 'block')
        .text('Music Info:');

    const squareLeft = start_x - target_dist; // Left boundary of the square
    const squareTop = start_y - target_dist; // Top boundary of the square
    const squareSize = 2 * target_dist; // Full size of the square
        
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
        var prev_size = prev_width * prev_height;
        var curr_size = window.innerHeight * window.innerWidth;
        console.log("prev size: " + prev_size + " curr size: " + curr_size);
        if (prev_size > curr_size) {
            alert("Please enter full screen and click your mouse to continue the experiment! (Shortcut for Mac users: Command + Control + F. Shortcut for PC users: F11) ");
        }
        prev_width = window.innerWidth;
        prev_height = window.innerHeight;
        return;
    }
    /*****************
     * Task Variables *
     *****************/

    // Reading the json target file into the game
    target_file_data = data;
    rotation = target_file_data.rotation; // degrees
    target_angle = target_file_data.tgt_angle; //degrees
    endpt_fb = target_file_data.endpoint_feedback;
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
    
    if (trial == 0 & audio_flag == 0) {
        initAudio();
        audio_flag = 1;
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
        if (hand_x > screen_width) {
            hand_x = screen_width;
        } else if (hand_x <0) {
            hand_x = 0;
        }
        if (hand_y > screen_height) {
            hand_y = screen_height;
        } else if (hand_y <0) {
            hand_y = 0;
        }
        // Update radius between start and hand location
        r = Math.sqrt(Math.pow(start_x - hand_x, 2) + Math.pow(start_y - hand_y, 2));

        // Update hand angle
        hand_angle = Math.atan2(start_y - hand_y, hand_x - start_x) * 100 / Math.PI;
        
        // Check if mouse is within the square
            if (game_phase == MOVING &&
                hand_x >= squareLeft &&
                hand_x <= squareLeft + squareSize &&
                hand_y >= squareTop &&
                hand_y <= squareTop + squareSize
            ) {
                gainNode.gain.setValueAtTime(8, audioContext.currentTime);
    
                const { f1, f2, vowel } = getVowelFormants(hand_y, squareTop, squareSize);
    
                const pitch = 100 * Math.pow(2, (hand_x - squareLeft) / 180); // 150 -
    
                oscillator.frequency.setValueAtTime(pitch, audioContext.currentTime);
                filter1.frequency.setTargetAtTime(f1, audioContext.currentTime, 0.1);
                filter2.frequency.setTargetAtTime(f2, audioContext.currentTime, 0.1);
    
                filter1.Q.setValueAtTime(12, audioContext.currentTime);
                filter2.Q.setValueAtTime(12, audioContext.currentTime);
                updateHandDisplay(hand_x, hand_y, pitch, f1, f2, vowel);
            } else {
                // Mute the audio when outside the square
                gainNode.gain.setValueAtTime(0, audioContext.currentTime);
                //updateHandInfo(hand_x, hand_y, squareLeft, squareTop, squareSize, pitch, formants);
            };
            
            
        // Calculations done in the MOVING phase
        if (game_phase == MOVING) {
            
            handPositions.push({ time: new Date() - begin, x: hand_x, y: hand_y });

            // Updating cursor locations depending on clamp, fb, no_fb
            

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
            d3.select('#musicInfo').attr('display', 'block');

            // Displaying searching too slow message if threshold is crossed
            if (new Date() - begin > search_too_slow) {
                d3.select('#search_too_slow').attr('display', 'block');
                if (new Date() - begin > search_too_slow + 2000) {
                    // d3.select('#encouragement').attr('display', 'block')
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
            //window.removeEventListener('resize', monitorWindow, false);
            //document.removeEventListener('click', setPointerLock, false);
            //document.exitPointerLock();
            //badGame(); // Premature exit game if failed attention check
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
        d3.select('#musicInfo').attr('display', 'block');
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
        
        if(target_jump[trial] == 1){
          //Show the target.
          d3.select('#target').attr('display', 'block').attr('cx', target_x).attr('cy', target_y);
        }else{
          //Hiding the target. 
          d3.select('#target').attr('display', 'none').attr('cx', target_x).attr('cy', target_y);
          
          if(play_sound == 1){
          
          if(target_angle[trial] == 45){
            audio45.play();
          }else if(target_angle[trial] == 135){
            audio135.play();
          }else if(target_angle[trial] == 270){
            audio270.play();
          }
          
          play_sound == 0;
          }
          
        }
        
        target_invisible = false;
        
          
          // Turn start circle green
          setTimeout(function() {
              d3.select('#start')
                .attr('display', 'block')
                .attr('fill', 'green');
          }, 1000);

       
        
    }

    function moving_phase() {
        game_phase = MOVING;
    
        // Record reaction time as time spent with target visible before moving
        rt = new Date() - begin;
    
        // Start of timer for movement time
        begin = new Date();
       
        // Hide the start circle
        d3.select('#start').attr('fill', 'none');
    }

    // Phase where users have finished their reach and receive feedback
    function fb_phase() {
        game_phase = FEEDBACK;

        // Turn off sound: 
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
        var d = new Date();
        var current_date = (parseInt(d.getMonth()) + 1).toString() + "/" + d.getDate() + "/" + d.getFullYear() + " " + d.getHours() + ":" + d.getMinutes() + "." + d.getSeconds() + "." + d.getMilliseconds();

        cursor_show = false;
        // Uploading reach data for this reach onto the database
        //SubjTrials.group_type is defined in startGame
        subjTrials.experimentID = experiment_ID;
        subjTrials.id = subject.id;
        subjTrials.currentDate.push(current_date);
        subjTrials.trialNum.push(trial + 1);
        subjTrials.target_angle.push(target_angle[trial]);
        subjTrials.trial_type.push(trial_type);
        subjTrials.rotation.push(rotation[trial]);
        subjTrials.hand_fb_angle.push(hand_fb_angle);
        subjTrials.rt.push(rt);
        subjTrials.mt.push(mt);
        subjTrials.search_time.push(search_time);
        subjTrials.reach_feedback.push(reach_feedback);
        subjTrials.hand_path.push({ positions: handPositions });
        subjTrials.start_x.push(start_x);
        subjTrials.start_y.push(start_y);
        subjTrials.screen_height.push(screen_height);
        subjTrials.screen_width.push(screen_width);
        
        // Updating subject data to display most recent reach on database
        subject.currTrial = trial + 1;

        // Reset timing variables
        rt = 0;
        mt = 0;
        search_time = 0;
        play_sound = 1; 
        handPositions = []; 
        
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
        setTimeout(moveCursor, 250);
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

// Function used to start running the game
// **TODO** Update the 'fileName' to path to targetfile
function startGame() {
    fileName = "tgt_files/Katie2_csv_file.json";
    subject.tgt_file = fileName;
    subjTrials.group_type = "null"; // **TODO** update group_type to manage the groups
    $.getJSON(fileName, function(json) {
        target_file_data = json;
        gameSetup(target_file_data);
    });
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
    d3.select('#targetSquare').attr('display', 'none');

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
    show('final-page', 'container-exp');

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