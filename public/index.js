/*
This is an auditory-motor mapping experiment that can be adapted to different reaching experiments depending on the target file.

Remember to update necessary fields before starting the game. All fields that require change will be marked by a "**TODO**" comment.
*/

// Set to 'true' if you wish to only test the front-end (will not access databases)
// **TODO** Make sure this is set to false before deploying!
const noSave = false;

// Set to 'true' to disable full screen mode during development
// **TODO** Make sure this is set to false before deploying!
const disableFullScreen = false;

// **TODO**: Replace this with your own experiment file.
// This is the file that will be used to generate the targets for the game alternately, you can hard enter the info below in the fileContent variable. 
const fileName = "./tgt_files/csv_tgt_file_2025-03-25.json";

// **TODO**: Add the json content below here:
// SHORTENED WHILE MAKING OTHER INFRANSTRUCTURE CHANGES
const fileContent = {
  "numtrials": 4, "trialnum": {"0": 1, "1": 2, "2": 3, "3": 4, 
  },
  "aiming_landmarks": {"0": 0, "1": 0, "2": 0, "3": 0, 
  },
  "online_fb": {"0": 1, "1": 1, "2": 1, "3": 1, 
  },
  "endpoint_feedback": {"0": 1, "1": 1, "2": 1, "3": 1, 
  },
  "rotation": {"0": 0.0, "1": 0.0, "2": 0.0, "3": 0.0, 
  },
  "clamped_fb": {"0": 0.0, "1": 0.0, "2": 0.0, "3": 0.0, 
  },
  "tgt_angle": {"0": 45, "1": 135, "2": 225, "3": 315, 
  },
  "tgt_distance": {"0": 80, "1": 80, "2": 80, "3": 80,  
  },
  "between_blocks": {"0": 0.0, "1": 0.0, "2": 0.0, "3": 0.0, 
  // #19 2.0 will be the number to trigger the chance of phase message to TESTING PHASE
  },
  "target_jump": {"0": 1.0, "1": 1.0, "2": 1.0, "3": 1.0}};


window.onerror = function(message, source, lineno, colno, error) {
  console.error("Error occurred: ", message, "at line", lineno);
  alert("Error: " + message + " at line " + lineno);
  return true;
};

//#region Components
class Circle {
  constructor(parent, point, radius, fill, stroke) {
    this.radius = radius;
    this.point = new Point(point.x, point.y);

    this.visible = false;
    this.element = parent.append("circle")
      .attr("r", radius)
      .attr("stroke-width", 2)
      .attr("cx", this.point.x)
      .attr("cy", this.point.y)
      .attr("display", "none");

    this.setFill(fill);
    this.setStroke(stroke);
  }

  setFill(color) {
    this.element.attr("fill", color);
  }

  setStroke(color) {
    this.element.attr("stroke", color);
  }

  // control how the element is displayed
  display(isVisible) {
    this.visible = isVisible;
    const value = this.visible ? "block" : "none";
    this.element.attr("display", value);
  }

  // update position of the element
  update(x, y) {
    const width = self.screen.availWidth;
    const height = self.screen.availHeight;

    if (x > width) {
      x = width + 0.0;
    } else if (x < 0) {
      x = 0.0;
    }

    if (y > height) {
      y = height + 0.0;
    } else if (y < 0) {
      y = 0.0;
    }
    this.point.x = x;
    this.point.y = y;
    this.element.attr("cx", x).attr("cy", y);
  }
}

class MusicBox {
  constructor(handler) {
    this.isPlaying = false;
    // audio controls.
    this.audioContext =
      new (handler.AudioContext || handler.webkitAudioContext)();
    this.gainNode = this.audioContext.createGain();
    this.gainNode.gain.value = 0.001;

    // Create main oscillator for f0 control
    this.oscillator = this.audioContext.createOscillator();
    this.oscillator.type = "sawtooth"; // Sawtooth, square.
    this.oscillator.frequency.value = 220;

    // Filter bank for enhanced spectral control
    // filter 1
    this.filter1 = this.audioContext.createBiquadFilter();
    this.filter1.type = "bandpass";
    this.filter1.Q.value = 1; // Wider, more gentle filter that affects a broader range of frequencies

    // filter 2
    this.filter2 = this.audioContext.createBiquadFilter();
    this.filter2.type = "bandpass";
    this.filter2.Q.value = 1;

    // Additional filters for spectral centroid control
    this.centroidFilter = this.audioContext.createBiquadFilter();
    this.centroidFilter.type = 'highshelf';

    // connect
    this.oscillator.connect(this.filter1);
    this.filter1.connect(this.filter2);
    this.filter2.connect(this.gainNode);
    this.gainNode.connect(this.audioContext.destination);

    // start
    this.oscillator.start();
  }

  play(currentTime) {
    this.isPlaying = true;
    this.gainNode.gain.setValueAtTime(8, currentTime);
    this.audioContext.resume();
  }

  update(pitch, f1, f2) {
    const currentTime = this.audioContext.currentTime;
    if (!this.isPlaying) {
      this.play(currentTime);
    }
    this.gainNode.gain.setValueAtTime(8, currentTime);
    this.oscillator.frequency.setValueAtTime(pitch, currentTime);
    this.filter1.frequency.setTargetAtTime(f1, currentTime, 0.1);
    this.filter2.frequency.setTargetAtTime(f2, currentTime, 0.1);

    this.filter1.Q.setValueAtTime(5, currentTime);
    this.filter2.Q.setValueAtTime(5, currentTime);
  }

  pause() {
    this.isPlaying = false;
    // Set gain to 0 immediately
    this.gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    // Also suspend the audio context to be extra sure
    this.audioContext.suspend();
  }
}

function Point(x, y) {
  this.x = x;
  this.y = y;
}

//#endregion

//#region Models

// This will be used to help create inheritance to save to database structure
class Database {
  constructor(table_name) {
    this.table_name = table_name;
  }

  save() {
    // for now we could just save this as Json file format?
    // const data = JSON.stringify(this);
    // fs.promises.writeFile(this.table_name + ".json", data)
    //     .then(() => {
    //         console.log(`Saved ${this.table_name}.json`);
    //     })
    //     .catch((err) => {
    //         console.error(`Failed to save ${this.table_name}.json`, err);
    //     });

    return this.collection.doc(this.id).set(this)
      .then(function () {
        return true;
      })
      .catch(function (err) {
        console.error(err);
        throw err;
      });
  }
}

class Subject extends Database {
  constructor(id, age, sex, handedness, mousetype, returner, ethnicity, race, musicExperience, languageCount, musicInstrument, musicPractice) {
    super("subject");
      this.id = id,
      this.age = age,
      this.sex = sex,
      this.handedness = handedness,
      this.mousetype = mousetype,
      this.returner = returner,
      this.musicExperience = musicExperience, 
      this.languageCount = languageCount,
      this.musicInstrument = musicInstrument,
      this.musicPractice = musicPractice,
      this.tgt_file = fileName,
      this.ethnicity = ethnicity,
      this.race = race,
      this.comments = null,
      this.distractions = [],
      this.distracto = null;
  }

  // contains the basic information required to proceed
  isValid() {
    // Validation logic - if these fields are required, add them to the check
    return this.id !== "" && this.age !== "" && this.sex !== "" && 
           this.handedness !== "" && this.mousetype !== "" && this.returner !== "" &&
           this.musicExperience !== "" && this.musicInstrument !== "" && this.musicPractice !== "" && this.languageCount !== "";
  }
}

class Trial extends Database {
  constructor(experimentID, id) {
    super("trial");
    this.id = id;
    this.experimentID = experimentID;
    this.cursor_data = [];
    this.blocks = [];
    this.hand_path = [];  // Will store position data for the hand
    // Add these new fields
    this.start_x = [];
    this.start_y = [];
    this.screen_height = [];
    this.screen_width = [];
    this.group_type = experimentID;
  }

  // return the current trial number (usually define as number of blocks we've created and stored)
  getBlockNum() {
    return this.blocks.length;
  }

  // array are treated as reference. https://stackoverflow.com/questions/6605640/javascript-by-reference-vs-by-value
  appendTrialBlock(
    target_angle,
    rotation,
    hand_angle,
    rt,
    mt,
    time,
    feedback,
    cursor_data,
    hand_path,
  ) {
    const lastTrialNum = this.getBlockNum();
    const block = new Block(
      lastTrialNum + 1, //  num
      target_angle,
      rotation,
      hand_angle,
      rt,
      mt,
      time,
      feedback,
    );

    // does this create a new array or clears the reference to it?
    // clone this array
    const data = [...cursor_data];
    const path = [...hand_path];

    // append newly copy data value.
    this.cursor_data.push(data);
    this.hand_path.push(path);

    // append data to this trial block
    this.blocks.push(block);
  }
}

class Block extends Database {
  constructor(num, target_angle, rotation, hand_angle, rt, mt, time, feedback) {
    super("block");
    // auto create the date
    const d = new Date();
    const current_date = (parseInt(d.getMonth()) + 1).toString() + "/" +
      d.getDate() + "/" + d.getFullYear() + " " + d.getHours() + ":" +
      d.getMinutes() + "." + d.getSeconds() + "." + d.getMilliseconds();

    this.trialNum = num;
    this.currentDate = current_date;
    this.target_angle = target_angle;
    // **TODO**: Check the other end process to see if this is still in use! This is deprecated for this experiment.
    this.trial_type = "online_fb"; // No longer needed - however to keep the rest of the process flow, we're filling in "online_fb" data instead.
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
  constructor(timestamp, x, y) {
    super("Log");
    this.timestamp = timestamp;
    this.x = x;
    this.y = y;
  }
}

//#endregion

//#region html event functions

// Function used on html side of code
function isNumericKey(event) {
  const code = (event.which) ? event.which : event.keyCode;
  return !(code > 31 && (code < 48 || code > 57));
}

function getFormValue(formValues, name) {
  for (let i = 0; i < formValues.length; i++) {
    if (formValues[i].name === name) {
      return formValues[i].value;
    }
  }
  return "";
}

// variable to hold current display page. Will be used to hide when show is called
let prevpage = "container-consent";

// headphone check added to global variables
let headphoneCheckPassed = false;
let headphoneCheck = null;

// Function to switch between HTML pages
window.show = function(shown) {
  // Pause any playing videos when switching pages
  const videos = document.querySelectorAll('video');
  videos.forEach(video => {
    video.pause();
  });
  
  if (prevpage !== null) {
    document.getElementById(prevpage).style.display = "none";
  }
  document.getElementById(shown).style.display = "block";
  prevpage = shown;

  // If we're showing the instructions page with the video
  if (shown === 'container-instructions2') {
    const demoVideo = document.getElementById('demo-video');
    if (demoVideo) {
      // Try to unmute and play
      demoVideo.muted = false;
      
      // Using promise to handle play
      const playPromise = demoVideo.play();
      
      // Handle potential rejection due to browser policies
      if (playPromise !== undefined) {
        playPromise.then(_ => {
          // Video playback started successfully
          console.log("Video is playing");
        })
        .catch(error => {
          // Auto-play with sound was prevented
          console.log("Autoplay prevented:", error);
          // Keep it muted but play anyway
          demoVideo.muted = true;
          demoVideo.play();
        });
      }
    }
  }
  return false;
}

// Additional event listener to handle initial page load
// Combine both DOMContentLoaded event listeners into one
document.addEventListener('DOMContentLoaded', function() {
  // Ensure only consent form is visible initially, all other containers are hidden
  document.getElementById('container-consent').style.display = 'block';
  document.getElementById('container-instructions1').style.display = 'none';
  document.getElementById('container-instructions2').style.display = 'none';
  document.getElementById('container-info').style.display = 'none';
  document.getElementById('container-headphone-check').style.display = 'none';
  document.getElementById('container-exp').style.display = 'none';
  document.getElementById('container-not-an-ad').style.display = 'none';
  document.getElementById('container-failed').style.display = 'none';
  document.getElementById('final-page').style.display = 'none';
  // Video player setup for instructions page
  const instructionButton = document.querySelector('button[onClick="return show(\'container-instructions2\');"]');
  if (instructionButton) {
    // Add extra click handler to ensure video plays
    instructionButton.addEventListener('click', function() {
      // Short timeout to ensure DOM has updated
      setTimeout(() => {
        const demoVideo = document.getElementById('demo-video');
        if (demoVideo) {
          demoVideo.muted = false;
          demoVideo.play().catch(e => {
            // If play with sound fails, try muted
            demoVideo.muted = true;
            demoVideo.play();
          });
        }
      }, 100);
    });
  }

  // Consent form validation setup
  const consentAge = document.getElementById('consent-age');
  const consentRead = document.getElementById('consent-read');
  const consentParticipate = document.getElementById('consent-participate');
  const agreeButton = document.getElementById('agreeButton');
  
  if (consentAge && consentRead && consentParticipate && agreeButton) {
    // Function to check if all consent boxes are checked
    function checkConsentStatus() {
      if (consentAge.checked && consentRead.checked && consentParticipate.checked) {
        agreeButton.disabled = false;
      } else {
        agreeButton.disabled = true;
      }
    }
    
    // Add event listeners to all checkboxes
    consentAge.addEventListener('change', checkConsentStatus);
    consentRead.addEventListener('change', checkConsentStatus);
    consentParticipate.addEventListener('change', checkConsentStatus);
    
    // Update the button's click handler
    agreeButton.onclick = function() {
      if (consentAge.checked && consentRead.checked && consentParticipate.checked) {
        return window.show("container-info");
      } else {
        alert("Please check all three consent boxes to proceed.");
        return false;
      }
    };
  }
});

// Function to validate consent checkboxes
// This function is called when the user clicks the "I agree" button
// It checks if all three consent checkboxes are checked
// If they are, it shows the next page; if not, it alerts the user
// and prevents the form from being submitted
// 
  function validateConsent() {
  const consentAge = document.getElementById('consent-age');
  const consentRead = document.getElementById('consent-read');
  const consentParticipate = document.getElementById('consent-participate');
  
  if (consentAge.checked && consentRead.checked && consentParticipate.checked) {
    return show('container-info');
  } else {
    alert("Please check all three consent boxes to proceed.");
    return false;
  }
}

// Function used to check if all pre-experiment questions were filled in
function checkInfo() {
  // Get form data using jQuery
  const values = $("#infoform").serializeArray();
  
  // Map the form values 
  const prolific_id = getFormValue(values, "prolific_id");
  const mousetype = getFormValue(values, "mousetype");
  const musicExperience = getFormValue(values, "music_experience");

  // Basic validation
  if (!prolific_id || !mousetype || !musicExperience ) {
    alert("Please fill out all required information!");
    return false;
  }
  
  // Trackpad validation
  if (mousetype !== 'trackpad') {
    alert("This experiment requires using a trackpad. Please switch to a trackpad to continue.");
    return false;
  }

  // music experience validation
  // Additional validation to ensure musicExperience is not empty
  if (!musicExperience) {
    alert("Please enter your music experience!");
    document.getElementById("music_experience").focus();
    return false;
}
  // Optional: Ensure it's a number if that's what you expect
  if (isNaN(musicExperience)) {
    alert("Please enter a valid number for music experience!");
    document.getElementById("music_experience").focus();
    return false;
}

  // Create subject with all fields
  subject = new Subject(
    prolific_id,  // Prolific ID
    "",              // Age (will collect later)
    "",              // Gender (will collect later)
    "",              // Handedness (will collect later)
    mousetype,       // Mouse type
    "",              // Returner (will collect later)
    "",              // Ethnicity (will collect later)
    "",              // Race (will collect later)
    musicExperience, // Music experience
    "",              // Language count (will collect later)
    "",              // Music instrument (will collect later)
    ""               // Music practice (will collect later)
  );

  // Show headphone check instead of starting the game immediately
  show("container-headphone-check");
  
  // Initialize the headphone check
  runHeadphoneCheck();
    
  return false; // Prevent form submission
}

function runHeadphoneCheck() {
  // Clear any previous instance
  document.getElementById('headphone-check-container').innerHTML = '';
  document.getElementById('headphone-buttons').style.display = 'none';
  
  // Initialize headphone check
  headphoneCheck = new HeadphoneCheck({
    trials: 6,
    passingScore: 5,
    volumeLevel: 0.6,
    onPass: (score) => {
      console.log('Headphone check passed with score:', score);
      headphoneCheckPassed = true;
      document.getElementById('headphone-buttons').style.display = 'block';
      document.getElementById('retry-headphone-check').style.display = 'none';
      document.getElementById('continue-after-headphone-check').style.display = 'inline-block';
    },
    onFail: (score) => {
      console.log('Headphone check failed with score:', score);
      headphoneCheckPassed = false;
      document.getElementById('headphone-buttons').style.display = 'block';
      document.getElementById('retry-headphone-check').style.display = 'inline-block';
      document.getElementById('continue-after-headphone-check').style.display = 'none';
    }
  });
  // Manually call init() after construction
  headphoneCheck.init();
  document.getElementById('continue-after-headphone-check').onclick = function() {
    console.log("Continue button clicked");
    continueAfterHeadphoneCheck();
  }
}

// Function to retry the headphone check 
function retryHeadphoneCheck() {
  console.log("Retrying headphone check");
  runHeadphoneCheck();
}

function continueAfterHeadphoneCheck() {
  console.log("continueAfterHeadphoneCheck called");
  console.log("headphoneCheckPassed:", headphoneCheckPassed);
  if (headphoneCheckPassed) {
    console.log("Headphone check passed, continuing to instructions");
    // Continue to instructions1
    show("container-instructions1");
    
    // Don't enter fullscreen or start game yet
    // These will be handled when the user clicks the final button on instructions2
  } else {
    console.log("Headphone check not passed, showing alert");
    alert("Please complete the headphone check successfully before continuing.");
  }
}

// Make these functions globally accessible
window.retryHeadphoneCheck = retryHeadphoneCheck;
window.continueAfterHeadphoneCheck = continueAfterHeadphoneCheck;
window.checkInfo = checkInfo;
window.validateConsent = validateConsent;

// Add this function
function startExperiment() {
  // Enter full screen if not disabled
  if (!disableFullScreen) {
    console.log("Entering full screen");
    openFullScreen();
  }
  
  console.log("Starting game with subject data:", subject);
  startGame();
  return true;
}

// Make it accessible
window.startExperiment = startExperiment;

// Function used to enter full screen mode
function openFullScreen() {
  const elem = document.getElementById("container-instructions2");
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
    console.log("enter1");
  } else if (elem.msRequestFullscreen) {
    elem.msRequestFullscreen();
    console.log("enter2");
  } else if (elem.mozRequestFullScreen) {
    elem.mozRequestFullScreen();
    console.log("enter3");
  } else if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen();
    console.log("enter4");
  }
}

// Function used to exit full screen mode
function closeFullScreen() {
  if (document.exitFullscreen) {
    try {
      document.exitFullscreen();
    } catch (e) {
      console.log(
        "Somehow the client was not in full screen mode but we're still calling this anyway?",
        e,
      );
    }
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
}

//#endregion
// Object used track subject data (uploaded to database)
let subject; // : Subject

// Object used to track reaching data (updated every reach and uploaded to database)
let subjTrials; // : Trial

/* TEMPORARY USE OF ORIGINAL CODE TO TEST THINGS OUT */
try {
  let app = firebase.app();
} catch (e) {
  console.error(e);
}

// Initialize Firebase
// Setting up firebase variables
const firestore = firebase.firestore(); // (a.k.a.) db
const firebasestorage = firebase.storage();
const subjectcollection = firestore.collection("Subjects");
const trialcollection = firestore.collection("Trials");

const Phase = Object.freeze({
  UNINIT: -1, // to avoid handling keyboard inputs
  SEARCHING: 0, // Looking for the center after a reach
  HOLDING: 1, // Holding at start to begin the next target
  SHOW_TARGETS: 2, // Displaying the target
  MOVING: 3, // The reaching motion
  FEEDBACK: 4, // Displaying the feedback after reach
  BETWEEN_BLOCKS: 5, // Displaying break messages if necessary
});

// Function used to create/update data in the target collection
function updateCollection(collection, subject) {
  if (noSave) {
    console.log("Would have saved to database:", subject);
    return null;
  }
  console.log("Saving to Firebase:", subject);

  // **TODO**: Test and verify this working
  return collection.doc(subject.id).set(subject)
    .then(function () {
      console.log("Successfully saved data:", subject);
      return true;
    })
    .catch(function (err) {
      console.error("Error saving to Firebase:", err);
      throw err;
    });
}

const deg2rad = Math.PI / 180;
const rad2deg = 180 / Math.PI;

// Function used to start running the game
function startGame() {
  gameSetup(fileContent);
  // $.getJSON(fileName, function(json) {
  //     gameSetup(json);
  // });
}

// Function to monitor changes in screen size;
// event is not used
// **TODO**: Need to see if I clone this value properly, if it referenced, both variable would receive identical value.
let prev_screen_size = 0;

function monitorWindow(_event) {
  const curr_size = self.innerHeight * self.innerWidth;
  if (prev_screen_size > curr_size) {
    alert(
      "Please enter full screen and click your mouse to continue the experiment! (Shortcut for Mac users: Command + Control + F. Shortcut for PC users: F11) ",
    );
  }
  prev_screen_size = curr_size;
}

// Function that sets up the game
// All game functions are defined within this main function, treat as "main"
function gameSetup(data) {
  // **TODO** Update experiment_ID to label your experiments
  const experiment_ID = "Katie2";
  
  // Add near the beginning of gameSetup function
  let trialOrder = [];

  // game state
  let isPhase2 = false;

  // array of cursor position during trials
  let handPositions = [];

  // current trial
  let trial = 0;

  // circle objects
  let calibration = null;
  let target = null;
  let cursor = null;

  // timeout timer
  let movement_timeout = null;

  const feedback_time = 50; // length of time feedback remains (ms)
  const feedback_time_slow = 1500; // length of "too slow" feedback (ms)
  const hold_time = 500; // length of time users must hold in start before next trial (ms)
  const green_time = 2000; // length of time the start circle in holding phase will turn to green (ms)
  const search_too_slow = 3000; // Parameters and display for when users take too long to locate the center (ms)
  const too_slow_time = 4000; // Setting up parameters and display when reach is too slow (ms)

  // The between block messages that will be displayed
  // **TODO** Update messages depending on your experiment
  const messages = [
    ["Way to go! Press any key to continue."],
    [
      // Message displayed when bb_mess == 1
      "Wait until the center circle turns green.", 
      "Listen to the sound, then move in the direction that recreates the sound.",
      "Press 'b' when you are ready to proceed.",
    ],
    [
      // Message displayed when bb_mess == 2
      "Phase 2: Listen to the sound,", 
      "then move in the direction that recreates the sound.", 
      "Don't worry if you miss one -- it takes a little practice!",
      "Press 'a' to continue.",
    ],
    [
      "The white dot will now be hidden.", // bb_mess == 3
      "Continue aiming DIRECTLY towards the target.",
      "Press SPACE BAR when you are ready to proceed.",
    ],
    [
      "This is an attention check.", // bb_mess == 4
      "Press the key 'e' on your keyboard to CONTINUE.",
      "Pressing any other key will result in a premature game termination and an incomplete HIT!",
    ],
    [
      "This is an attention check.", // bb_mess == 5
      "Press the key 'a' on your keyboard to CONTINUE.",
      "Pressing any other key will result in a premature game termination and an incomplete HIT!",
    ],
    [
      "The white dot will no longer be under your control.", // bb_mess == 6
      "IGNORE the white dot as best as you can and continue aiming DIRECTLY towards the target.",
      "This will be a practice trial",
      "Press SPACE BAR when you are ready to proceed.",
    ],
  ];

  const musicBox = new MusicBox(self);
  // Calculated hand angles
  let hand_fb_angle = 0;

  // Timing Variables
  let rt = 0; // reaction time
  let mt = 0; // movement time
  let search_time = 0; // time to reset trial (includes hold time);

  // Initializing timer objects and variables
  let hold_timer = null;
  let green_timer = null;
  let stop_target_music_timer = null; // timer used to stop the target music for audience to hear/listen to before moving
  let target_display_timer = null;
  let too_slow_timer = null;
  let game_phase = -1;
  let reach_feedback = ""; // could be made as a enum
  let play_sound = true;
  let begin = new Date();

  const target_file_data = data;

  /**
     * Python generate script output the following JSON format
    // obsolete
    "trialnum" = trialNums
    "aiming_landmarks" = aimingLandmarks
    "endpoint_feedback" = endpointFB
    "rotation" = rotation
    "tgt_angle" = anglesDict
    "tgt_distance" = tgtDistance
    "between_blocks" = betweenBlocks
    "target_jump" = targetJump
     */

  // Reading the json target file into the game
  // const endpt_fb = target_file_data.endpoint_feedback;
  const rotation = target_file_data.rotation; // degrees
  const tgt_angle = target_file_data.tgt_angle;
  tgt_distance = target_file_data.tgt_distance;
  const between_blocks = target_file_data.between_blocks;
  target_jump = target_file_data.target_jump;

  // there is missing variables unused - target_file_data.tgt_distance

  // Between blocks parameters
  // **TODO**: Data normalization - what is this suppose to be?
  let bb_mess = between_blocks[0];

  // [F] - Data optimization. We don't need to have a number of trials variable here. We would just rely on the number of trial we have in our collection in the database.
  const num_trials = target_file_data.numtrials;

  // **TODO**: Need to see if I clone this value properly, if it referenced, both variable would receive identical value.
  const screen_width = self.innerWidth;
  const screen_height = self.innerHeight;
  prev_screen_size = screen_width * screen_height;

  // potential bug - what if some of the client plays in portrait mode?
  const target_dist = screen_height / 3;
  const center = new Point(screen_width / 2.0, screen_height / 2.0);

  // Red box dimension
  const squareLeft = center.x - target_dist;
  const squareTop = center.y - target_dist;
  const squareSize = 2 * target_dist;

  function setupPageRender(center) {
    // Initializations to make the screen full size and black background
    $("html").css("height", "98%");
    $("html").css("width", "100%");
    $("html").css("background-color", "black");
    $("body").css("background-color", "black");
    $("body").css("height", "98%");
    $("body").css("width", "100%");

    // Hide the mouse from view
    $("html").css("cursor", "none");
    $("body").css("cursor", "none");

    // SVG container from D3.js to hold drawn items
    const svgContainer = d3.select("body").append("svg")
      .attr("width", "100%")
      .attr("height", "100%").attr("fill", "black")
      .attr("id", "stage")
      .attr("background-color", "black");

    // Setting size of the displayed letters and sentences
    const line_size = Math.round(screen_height / 30);
    const message_size = String(line_size).concat("px");

    // Setting up first initial display once the game is launched
    // **TODO** Update the '.text' sections to change initial displayed message
    svgContainer.append("text")
      .attr("text-anchor", "middle")
      .attr("x", center.x)
      .attr("y", center.y - line_size)
      .attr("fill", "white")
      .attr("font-family", "sans-serif")
      .attr("font-size", message_size)
      .attr("id", "message-line-1")
      .attr("display", "block")
      .text("Move the white dot to the center.");

    svgContainer.append("text")
      .attr("text-anchor", "middle")
      .attr("x", center.x)
      .attr("y", center.y)
      .attr("fill", "white")
      .attr("font-family", "sans-serif")
      .attr("font-size", message_size)
      .attr("id", "message-line-2")
      .attr("display", "block")
      .text("Wait until the center circle turns green.");

    svgContainer.append("text")
      .attr("text-anchor", "middle")
      .attr("x", center.x)
      .attr("y", center.y + line_size)
      .attr("fill", "white")
      .attr("font-family", "sans-serif")
      .attr("font-size", message_size)
      .attr("id", "message-line-3")
      .attr("display", "block")
      .text("Move to the blue target. Remember the sound.");

    svgContainer.append("text")
      .attr("text-anchor", "middle")
      .attr("x", center.x)
      .attr("y", center.y + line_size * 2)
      .attr("fill", "white")
      .attr("font-family", "sans-serif")
      .attr("font-size", message_size)
      .attr("id", "message-line-4")
      .attr("display", "block")
      .text("Press SPACE BAR when you are ready to proceed.");

    svgContainer.append("text")
      .attr("text-anchor", "middle")
      .attr("x", center.x)
      .attr("y", center.y)
      .attr("fill", "red")
      .attr("font-family", "sans-serif")
      .attr("font-size", message_size)
      .attr("id", "too_slow_message")
      .attr("display", "none")
      .text("Keep trying! You can do it!");

    svgContainer.append("text")
      .attr("text-anchor", "middle")
      .attr("x", center.x)
      .attr("y", center.y * 2)
      .attr("fill", "white")
      .attr("font-family", "san-serif")
      .attr("font-size", message_size)
      .attr("id", "search_too_slow")
      .attr("display", "none")
      .text(
        "To find your cursor, try moving your mouse to the center of the screen.",
      );

    reach_number_point = new Point(
      center.x + (squareSize / 2),
      squareTop + squareSize + line_size,
    );
    svgContainer.append("text")
      .attr("text-anchor", "end")
      // why is this special? What does the magic number represent?
      // .attr('x', center.x / 20 * 19)
      // .attr('y', center.y / 20 * 19)
      .attr("x", reach_number_point.x)
      .attr("y", reach_number_point.y)
      .attr("fill", "white")
      .attr("font-size", message_size)
      .attr("id", "trialcount")
      .attr("display", "block")
      .text("Reach Number: ? / ?");

    // Draw the red square
    svgContainer.append("rect")
      .attr("x", squareLeft) // Left boundary of the square
      .attr("y", squareTop) // Top boundary of the square
      .attr("width", squareSize) // Width of the square
      .attr("height", squareSize) // Height of the square
      .attr("fill", "none") // Transparent fill
      .attr("stroke", "red") // Border color
      .attr("stroke-width", 2) // Border thickness
      .attr("id", "targetSquare") // Unique ID for the square
      .attr("display", "block"); // Ensure it's visible

    return svgContainer;
  }

  const handler = setupPageRender(center);

  // Setting parameters and drawing the center start circle
  calibration = new Circle(
    handler, // parent
    center, // point
    Math.round(target_dist * 4.5 / 80.0), // radius
    "none", // color
    "white", // stroke
  );

  // Setting parameters and drawing the target
  target = new Circle(
    handler, // parent
    center, // point
    // this is confusing? How big is this suppose to be?
    Math.round(target_dist * 4.5 / 80.0), // radius
    "blue", // color
    "none", // stroke
  );
  // not sure where the extra value is coming from?
  // console.log("target", target, center);

  // original code had to move the circle away from origin to avoid accidential start. Apply offset here.
  // Draw the white circle mouse cursor
  cursor = new Circle(
    handler, // parent
    center, // point
    // this is confusing? How big is this suppose to be?
    // also what is the order of operation here? How are the number generated?
    Math.round(target_dist * 1.75 * 1.5 / 80.0), // radius
    "white",
    "none",
  );

  /***************************************
   * Pointer Lock Variables and Functions *
   ***************************************/
  document.requestPointerLock = document.requestPointerLock ||
    document.mozRequestPointerLock;
  document.exitPointerLock = document.exitPointerLock ||
    document.mozExitPointerLock;
  document.addEventListener("pointerlockchange", lockChangeAlert, false);
  document.addEventListener("mozpointerlockchange", lockChangeAlert, false);
  self.addEventListener("resize", monitorWindow, false);
  document.addEventListener("click", setPointerLock, false);

  // Function to monitor changes in pointer lock
  function lockChangeAlert() {
    if (
      document.pointerLockElement === stage ||
      document.mozPointerLockElement === stage
    ) {
      console.log("The pointer lock status is now locked");
      document.addEventListener("mousemove", update_cursor, false);
      document.addEventListener("keydown", advance_block, false);
    } else {
      console.log("The pointer lock status is now unlocked");
      document.removeEventListener("mousemove", update_cursor, false);
      document.removeEventListener("keydown", advance_block, false);
    }
  }

  // Function to set pointer lock and log it
  function setPointerLock() {
    console.log("Attempted to lock pointer");
    stage.requestPointerLock();
  }

  setPointerLock();

  // The distance from start at which they can see their cursor while searching in between trials
  // **TODO**: Talk to Katie if we still need this? Used as an indicator to display cursor before moving back to start.
  // search_tolerance = start.radius * 4 + cursor.radius * 4;

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
    event = event || self.event;

    const cursor_x = cursor.point.x + event.movementX;
    const cursor_y = cursor.point.y + event.movementY;

    // Ensure we do not exceed screen boundaries
    // update cursor position
    cursor.update(cursor_x, cursor_y);

    // distance between cursor and start
    const distance = Math.sqrt(
      Math.pow(calibration.point.x - cursor.point.x, 2.0) +
        Math.pow(calibration.point.y - cursor.point.y, 2.0),
    );

    // Update hand angle
    // no longer in use since the code down below is commented out, we're using hand_fb_angle instead?
    // hand_angle = Math.atan2(calibration.point.y - cursor.point.y, cursor.point.x - calibration.point.x) * rad2deg;

    const point = cursor.point;
    switch (game_phase) {
      case Phase.HOLDING:
        // Move from hold back to search phase if they move back beyond the search tolerance
        if (distance > calibration.radius) {
          search_phase();
        }
        break;

      case Phase.SHOW_TARGETS:
        // Move from show targets to moving phase once user has begun their reach
        if (distance > calibration.radius) {
          // we could also control if we want to wait for the target to finish the demo before moving the cursor.
          // right now, if the mouse move out, we will stop the target and let the user conduct the experiment.
          moving_phase();
        }
        break;

      case Phase.SEARCHING:
        // Move from search to hold phase if they move within search tolerance of the start circle
        if (distance <= calibration.radius) {
          hold_phase();
        }
        break;

      case Phase.MOVING:
        // record mouse data
        handPositions.push({ time: new Date() - begin, x: cursor.point.x, y: cursor.point.y });

        // Check if cursor is within the red square
        if (
          point.x >= squareLeft &&
          point.x <= squareLeft + squareSize &&
          point.y >= squareTop &&
          point.y <= squareTop + squareSize
        ) {
          console.log(`point ${JSON.stringify(point)}`);
          // generate value for vowel formants
          // CHANGE: Now getting vowel formants from x position instead of y
          const { f1, f2, _vowel } = getVowelFormants(
            point.x, // changed from point.y to point.x
            squareLeft, // changed from squareTop to squareLeft
            squareSize,
          );
          const lo_pitch = 80;
          const hi_pitch = 350;

          // CHANGE: Now calculating pitch based on y position instead of x
          // top of square is higher pitch, bottom is lower pitch
          const y_proportion = 1 - (point.y - squareTop) / squareSize;
          const pitch =
            (hi_pitch - lo_pitch) * (Math.pow(2, y_proportion) - 1) + lo_pitch;

          console.log(`f1:${f1} f2: ${f2} pitch: ${pitch} vowel:${_vowel}`);
          // update musicbox
          musicBox.update(pitch, f1, f2);
        } else {
          musicBox.pause();
        }

        // Move from moving to feedback phase once their reach intersects the target ring
        if (distance > target_dist *0.95) {
          // stop audio
          musicBox.pause();
          fb_phase();
        }
        break;
    }
  }

  // Function called whenever a key is pressed
  // **TODO** Make sure the conditions match up to the messages displayed in "messages"
  function advance_block(event) {
    const SPACE_BAR = " "; //32;
    const a = "a"; //97;
    const e = "e"; //101;
    const b = "b"; //98;
    // const f = 70;   // not in use?
    // keyCode is marked deprecated - https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode
    // use keyboardEvent.key instead - https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key
    const key = event.key.toLowerCase();

    // Debug info
  console.log(`Key pressed: ${key}, Current phase: ${game_phase}, bb_mess: ${bb_mess}`);

  // Start of the trial - if bb_mess is 0, any key press should advance
  if (game_phase == Phase.BETWEEN_BLOCKS && bb_mess == 0) {
    console.log("Advancing with bb_mess 0 (Way to go!)");
    search_phase();
    return;
  }

    // this could be converted as a separate block trial to run through.
    if (game_phase == Phase.BETWEEN_BLOCKS) {
      // bb_mess 1 --> b, 2 or 5 --> a, 3 or 6 --> space, 4 --> e
      if (bb_mess == 1 && key == b) {
        search_phase();
        return;
      }

      if ((bb_mess == 2 || bb_mess == 5) && key == a) {
        search_phase();
        return;
      }

      if ((bb_mess == 3 || bb_mess == 6) && key == SPACE_BAR) {
        search_phase();
        return;
      }

      if (bb_mess == 4 && key == e) {
        search_phase();
        return;
      }

      // Only call badGame if none of the above conditions are met
    console.log("Failed attention check - ending game");
    badGame(); // Premature exit game if failed attention check
    }
  }

  function displayMessage(idx) {
    // First clear existing messages
  hideMessage();

  // Safety check for undefined messages
  if (!messages[idx]) {
    console.error(`No message defined for index: ${idx}`);
    return;
  }

    // Load messages
    // Display line 1 (should always exist)
    d3.select("#message-line-1").attr("display", "block").text(
      messages[idx][0] || "");
  
    // Only display additional lines if they exist
    if (messages[idx][1]) {
      d3.select("#message-line-2").attr("display", "block").text(messages[idx][1]);
  }
  
    if (messages[idx][2]) {
      d3.select("#message-line-3").attr("display", "block").text(messages[idx][2]);
  }
  
    if (messages[idx][3]) {
      d3.select("#message-line-4").attr("display", "block").text(messages[idx][3]);
  }
}

  function hideMessage() {
    d3.select("#message-line-1").attr("display", "none");
    d3.select("#message-line-2").attr("display", "none");
    d3.select("#message-line-3").attr("display", "none");
    d3.select("#message-line-4").attr("display", "none");
  }

  /***********************
   * Game Phase Functions *
   * Mostly controls what is being displayed *
   ************************/

  // Phase when searching for the center start circle
  function search_phase() {
    // Clear out timer if holding was incomplete
    if (hold_timer != null) {
      clearTimeout(hold_timer);
      hold_timer = null;
    }

    if (too_slow_timer != null) {
      clearTimeout(too_slow_timer);
      too_slow_timer = null;
    }

    // Start of timer for search time
    begin = new Date();

    // Start circle becomes visible, target and cursor invisible
    calibration.display(true);
    calibration.setFill("none");
    calibration.setStroke("white");

    // if we want to delay the target display then we can do it here?
    target_display_timer = setTimeout(() => target.display(false), 500);
    cursor.display(true);

    hideMessage();
    d3.select("#too_slow_message").attr("display", "none");

    // Displaying searching too slow message if threshold is crossed
    too_slow_timer = setTimeout(() => {
      d3.select("#search_too_slow").attr("display", "block");
    }, search_too_slow);

    // update game_phase
    game_phase = Phase.SEARCHING;
  }

  // Phase when users hold their cursors within the start circle
  function hold_phase() {
    if (target_display_timer != null) {
      clearTimeout(target_display_timer);
      target_display_timer = null;
      target.display(false);
    }

    // Fill the center if within start radius
    cursor.display(false);
    calibration.display(true);
    calibration.setFill("white");

    clearTimeout(too_slow_timer);
    too_slow_timer = null;

    d3.select("#search_too_slow").attr("display", "none");

    hold_timer = setTimeout(show_targets, hold_time);
    game_phase = Phase.HOLDING;
  }

  // Used to help interpolate start to end target points.
  function animate(update, duration, onfinish) {
    const start = performance.now();

    requestAnimationFrame(function animate(time) {
      let timeFraction = (time - start) / duration;
      if (timeFraction > 1) timeFraction = 1;
      update(timeFraction);

      if (timeFraction < 1) {
        // How have we not reach stackoverflow here?
        requestAnimationFrame(animate);
      } else {
        // callback once we're done with animation.
        onfinish();
      }
    });
  }

  // **TODO** we could load a tween graph or animation path to let researcher define new custom behaviours.
  function play_sounds(start, end, duration, update) {
    // Make sure any previous sound is stopped
      musicBox.pause();
    function play_sound_along(t) {
      // linear interpolate between two points over time (0-1)
      // This can be changed using different kind of interpolation or animation curve - future features
      const x = start.x + (end.x - start.x) * t;
      const y = start.y + (end.y - start.y) * t;

      update(x, y); // callback to update others based on coordinate given.
      
      // Use the same pitch calculation as in update_cursor function
      // This is original for vowel formants from on y-axis
      // const { f1, f2, _vowel } = getVowelFormants(y, squareTop, squareSize);
      // CHANGE: Now getting vowel formants from x position instead of y
      const { f1, f2, _vowel } = getVowelFormants(x, squareLeft, squareSize);
    
      // Match the pitch calculation from the update_cursor function
      // CHANGE: Now calculating pitch from y position
      const lo_pitch = 80;
      const hi_pitch = 350;
      const y_proportion = 1 - (y - squareTop) / squareSize;
      const pitch = (hi_pitch - lo_pitch) * (Math.pow(2, y_proportion) - 1) + lo_pitch;

      // update musicbox
      musicBox.update(pitch, f1, f2);
    }
    // Play the sound along the animation path
    animate((t) => play_sound_along(t), duration, () => {
      console.log("Animation ended, stopping sound");
      musicBox.pause();
  });

    // Ensure the sound stops after the specified duration as a fallback
    if (stop_target_music_timer != null) {
      clearTimeout(stop_target_music_timer);
  }  
  
  stop_target_music_timer = setTimeout(() => {
    console.log("Duration timer triggered, stopping sound");
    musicBox.pause();
  }, duration);
}

  // Phase when users have held cursor in start circle long enough so target shows up
  function show_targets() {
    // Record search time as the time elapsed from the start of the search phase to the start of this phase
    d3.select("#message-line-1").attr("display", "none");
    search_time = new Date() - begin;

    // Start of timer for reaction time
    begin = new Date();

    // If jump is 1.0, this means no variation was added to this target
    const jump = target_jump[trial];
    const angle = tgt_angle[trial];
    target.setFill("blue");
  
    // Calculate target position - do this first so we have start/end available
    const start = calibration.point;
    const offset = (jump == 1.0) ? rotation[trial] : jump;
    const value = angle + offset;  
    // When calculating a point on a circle (or positioning a target at a certain angle and distance): 
    // Math.cos is used for the x-coordinate because cosine represents the horizontal component of movement along a circle. When an angle is 0 degrees, cosine is 1, placing the point at maximum x-distance. 
    // Math.sin is used for the y-coordinate because sine represents the vertical component of movement along a circle. When an angle is 90 degrees, sine is 1, placing the point at maximum y-distance.
    const x = start.x + target_dist * Math.cos(value * deg2rad);
    const y = start.y - target_dist * Math.sin(value * deg2rad);
    const end = new Point(x, y);

    // Log for debugging
    console.log(`Trial: ${trial}, Phase2: ${isPhase2}, Target angle: ${angle}, Position: (${x}, ${y})`);
  
    // Update target position (but don't display it)
    target.update(x, y); 

    // In phase 2, we initially hide the target but play the sound demo
    if (isPhase2) {
      // Keep target invisible during sound demo
      target.display(false);
  
    // Play the sound demonstration
    if (play_sound) {
    // Define the demo duration - match what is coded in play_sounds function
    const demoDuration = 2000;
    
    // Play sound demonstration with the proper duration parameter
    play_sounds(start, end, demoDuration, (x, y) => {
      // Don't update target position during sound demo
    });
    play_sound = false;
  }
} else {
  // Phase 1 behavior - show target if jump == 1.0
  if (jump == 1.0) {
    target.display(true);
  }
}

    // Turn start circle green after a second
    green_timer = setTimeout(function () {
      calibration.setFill("green");
      calibration.setStroke("none");
    }, green_time);

    game_phase = Phase.SHOW_TARGETS;
  }

  // Phase when users are reaching to the target
  function moving_phase() {
    if (stop_target_music_timer != null) {
      clearTimeout(stop_target_music_timer);
      stop_target_music_timer = null;
    }

    // clear timer
    if (green_timer !== null) {
      clearTimeout(green_timer);
      green_timer = null;
    }

    if (target_jump[trial] != 1.0) {
      target.display(false);
    }

    
    rt = new Date() - begin; // Record reaction time as time spent with target visible before moving
    begin = new Date(); // Start of timer for movement time

    // Play audio
    // musicBox.play(0);
    
    // Initialize but don't automatically play
    // Don't call musicBox.play(0) here, it will be played only when cursor moves in the red square
    musicBox.audioContext.resume();
    
    // Start circle disappears
    calibration.display(false);
    cursor.display(true);

    // Add timeout to automatically end trial if it's taking too long
    if (movement_timeout != null) {
      clearTimeout(movement_timeout);
  }
    // Set a timeout that will automatically call fb_phase() after max_movement_time
    const max_movement_time = 8000; // 8 seconds, adjust as needed
    movement_timeout = setTimeout(() => {
      // Stop audio if playing
      musicBox.pause();
      
      // Set feedback as "too slow"
      reach_feedback = "timeout";
      
      // Call feedback phase to end the trial
      fb_phase();
    }, max_movement_time);

    game_phase = Phase.MOVING;
  }
  // Phase where users have finished their reach and receive feedback
  function fb_phase() {
      // Clear the movement timeout if it exists
      if (movement_timeout != null) {
        clearTimeout(movement_timeout);
        movement_timeout = null;
      }

    // Record movement time as time spent reaching before intersecting target circle
    // Can choose to add audio in later if necessary
    mt = new Date() - begin;
    let timer = 0;
    musicBox.pause();

    // Gives "hurry" message upon completing a trial that was done too slowly
    if (mt > too_slow_time) {
      calibration.display(false);
      d3.select("#too_slow_message").attr("display", "block");
      target.setFill("red");
      reach_feedback = "Ok, let's do this!";
      timer = feedback_time_slow;
    } else {
      target.setFill("green");
      reach_feedback = "good_reach";
      timer = feedback_time;
    }
    setTimeout(next_trial, timer);

    // Record the hand location immediately after crossing target ring
    // projected back onto target ring (since mouse doesn't sample fast enough)
    hand_fb_angle = Math.atan2(
      calibration.point.y - cursor.point.y,
      cursor.point.x - calibration.point.x,
    ) * rad2deg;
    if (hand_fb_angle < 0) {
      hand_fb_angle = 360 + hand_fb_angle; // Math.atan2(y, x) calculates the angle between the positive x-axis and the point (x, y). When the point is in the 3rd or 4th quadrant (bottom-left or bottom-right of the coordinate system), the function returns negative angles. This converts from negative angles to positive angles (0° to 360°) 
    }

    hand_fb_x = calibration.point.x +
      target_dist * Math.cos(hand_fb_angle * deg2rad);
    hand_fb_y = calibration.point.y -
      target_dist * Math.sin(hand_fb_angle * deg2rad);

    cursor.display(true);

    // Start next trial after feedback time has elapsed
    game_phase = Phase.FEEDBACK;
  }

  function start_trial() {
    subjTrials = new Trial(experiment_ID, subject.id);

    d3.select("#too_slow_message").attr("display", "none");
    calibration.display(false);

    // Waiting for keyboard inputs to begin
    search_phase();
  }

  function end_trial() {
    self.removeEventListener("resize", monitorWindow, false);
    document.removeEventListener("click", setPointerLock, false);
    document.exitPointerLock();
    endGame();
  }

  // Function used to initiate the next trial after uploading reach data and subject data onto the database
  // Cleans up all the variables and displays to set up for the next reach
  function next_trial() {
    // Record data for the trial that was just completed
    subjTrials.appendTrialBlock(
      tgt_angle[trial],
      rotation[trial],
      hand_fb_angle,
      rt,
      mt,
      search_time,
      reach_feedback,
      handPositions, // cursor_data
      handPositions  // This captures the hand_path field
    );
  
    // Screen dimensions
    subjTrials.start_x.push(center.x);
    subjTrials.start_y.push(center.y);
    subjTrials.screen_height.push(screen_height);
    subjTrials.screen_width.push(screen_width);
  
    // Reset timing variables
    rt = 0;
    mt = 0;
    search_time = 0;
    play_sound = true;
    handPositions = [];
  
    // Number of completed trials so far
    const completedTrials = subjTrials.blocks.length;
    console.log(`Completed ${completedTrials} trials out of ${num_trials}`);
    
    // Update the trial counter display - show consecutive numbers
    d3.select("#trialcount").text(`Reach Number: ${completedTrials} / ${num_trials}`);
    
    // Check if we've completed all trials
    if (completedTrials >= num_trials) {
      console.log("All trials completed. Ending experiment.");
      end_trial();
      return;
    }
    
    // Get the between blocks message for the trial we just completed
    bb_mess = between_blocks[trial];
  
    // Debug the phase transition
    console.log(`Trial completed: ${trial}, Next bb_mess: ${bb_mess}`);
  
    // When transitioning to Phase 2, create randomized trial order for remaining trials
    if (bb_mess == 2) {
      console.log("Transitioning to Phase 2");
      isPhase2 = true;
      
      // Create array of remaining trial indices (current trial+1 to end)
      const remainingTrialIndices = [];
      for (let i = trial + 1; i < num_trials; i++) {
        remainingTrialIndices.push(i);
      } 
  
      // Shuffle the array using Fisher-Yates algorithm
      for (let i = remainingTrialIndices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [remainingTrialIndices[i], remainingTrialIndices[j]] = [remainingTrialIndices[j], remainingTrialIndices[i]];
      }
  
      trialOrder = remainingTrialIndices;
      console.log("Randomized trial order for Phase 2:", trialOrder);
    }
  
    // Determine which trial to run next
    if (isPhase2 && trialOrder.length > 0) {
      // In Phase 2, get the next trial from our randomized order
      trial = trialOrder.shift(); // Remove and return the first element
      console.log("Phase 2: Moving to randomized trial", trial);
    } else if (!isPhase2) {
      // In Phase 1, just increment normally
      trial += 1;
    } else {
      // We're in Phase 2 but out of trials in trialOrder
      // This shouldn't happen if all trials are accounted for
      console.error("Ran out of trials in Phase 2 order but haven't completed all trials");
      end_trial();
      return;
    }
  
    // Display any between-block messages if needed
    if (bb_mess || trial == 1) {
      game_phase = Phase.BETWEEN_BLOCKS;
      console.log(`Displaying message for bb_mess: ${bb_mess}`); 
      // Make sure all message lines exist in the messages array
      if (messages[bb_mess]) {
        displayMessage(bb_mess);
      } else {
        console.error(`No message found for bb_mess: ${bb_mess}`);
      }
    } else {
      // Continue to next trial
      search_phase();
    }
  }
  

  // start the trial
  start_trial();
}

function getVowelFormants(xPos, squareLeft, squareSize) {
  const vowelFormants = {
    i: { f1: 300, f2: 2300 },
    // u: { f1: 300, f2: 800 },
    a: { f1: 700, f2: 1200 },
    // æ: { f1: 700, f2: 1800 }
  };
  // need to be explicit about which segment these are delinating
  const vowels = Object.keys(vowelFormants);
  const segmentWidth = squareSize / (vowels.length - 1);
  const offset = Math.max(xPos - squareLeft, 0);
  const index = Math.min(Math.floor(offset / segmentWidth), vowels.length - 2); // which segment. floor(offset/segmentHeight) -> counts up through segments; vowels.length - 2 -> catches any round-off errors at the end.
  const t = ((xPos - squareLeft) % segmentWidth) / segmentWidth; // where we are in the segment
  const vowel1 = vowels[index]; // first fencepost for this segment
  const vowel2 = vowels[index + 1]; // second fencepost for this segment

  const f1 = vowelFormants[vowel1].f1 * (1 - t) + vowelFormants[vowel2].f1 * t;
  const f2 = vowelFormants[vowel1].f2 * (1 - t) + vowelFormants[vowel2].f2 * t;

  const currentVowel = t < 0.5 ? vowel1 : vowel2; // ? is an if then statement = "condition ? valueIfTrue : valueIfFalse"

  return { f1, f2, vowel: currentVowel }; // final answer of what vowel we're in
}

// Helper function to end the game regardless good or bad
function helpEnd() {
  closeFullScreen();
  // return the cursor back
  $("html").css("cursor", "auto");
  $("body").css("cursor", "auto");

  // restore the screen state
  $("body").css("background-color", "white");
  $("html").css("background-color", "white");

  d3.select("#stage").attr("display", "none");

  try {
    console.log("Preparing trial data for save...");
    
    // #### Create a comprehensive record of all trial data
    const subjTrial_data = {
      id: subjTrials.id,
      experimentID: subjTrials.experimentID,
      // cursor_data: subjTrials.cursor_data,
      trialNum: [],
      currentDate: [],
      target_angle: [],
      trial_type: [],
      rotation: [],
      hand_fb_angle: [],
      rt: [],
      mt: [],
      search_time: [],
      reach_feedback: [],
      start_x: subjTrials.start_x,
      start_y: subjTrials.start_y,
      screen_height: subjTrials.screen_height,
      screen_width: subjTrials.screen_width,
      group_type: subjTrials.group_type,
      // Flag that hand path is processed
      hand_path_flattened: true
    };

    // Extract data from blocks
    subjTrials.blocks.forEach((block, index) => {
      subjTrial_data.trialNum.push(block.trialNum);
      subjTrial_data.currentDate.push(block.currentDate);
      subjTrial_data.target_angle.push(block.target_angle);
      subjTrial_data.trial_type.push(block.trial_type);
      subjTrial_data.rotation.push(block.rotation);
      subjTrial_data.hand_fb_angle.push(block.hand_fb_angle);
      subjTrial_data.rt.push(block.rt);
      subjTrial_data.mt.push(block.mt);
      subjTrial_data.search_time.push(block.search_time);
      subjTrial_data.reach_feedback.push(block.reach_feedback)
      subjTrial_data.hand_path_flattened = true;
    });
    
    // Add hand path data in a safe format for Firebase
    if (subjTrials.hand_path && subjTrials.hand_path.length > 0) {
      // Store hand path data as separate objects to avoid arrays
      const handPathSummary = {};
      
      subjTrials.hand_path.forEach((path, index) => {
        if (path && path.length) {
          // For each trial, create:
          // 1. A count
          handPathSummary[`trial_${index+1}_count`] = path.length;
        
          // 2. First point as separate properties
          if (path.length > 0) {
            handPathSummary[`trial_${index+1}_first_x`] = path[0].x;
            handPathSummary[`trial_${index+1}_first_y`] = path[0].y;
            handPathSummary[`trial_${index+1}_first_time`] = path[0].time;
          }
          
          // 3. Last point as separate properties
          if (path.length > 0) {
            handPathSummary[`trial_${index+1}_last_x`] = path[path.length-1].x;
            handPathSummary[`trial_${index+1}_last_y`] = path[path.length-1].y;
            handPathSummary[`trial_${index+1}_last_time`] = path[path.length-1].time;
          }
          
          // 4. A few sample points (to keep data size manageable)
          if (path.length > 10) {
            [0, Math.floor(path.length/4), Math.floor(path.length/2), 
            Math.floor(3*path.length/4), path.length-1].forEach((idx, sampleIdx) => {
              handPathSummary[`trial_${index+1}_sample_${sampleIdx}_x`] = path[idx].x;
              handPathSummary[`trial_${index+1}_sample_${sampleIdx}_y`] = path[idx].y;
              handPathSummary[`trial_${index+1}_sample_${sampleIdx}_time`] = path[idx].time;
            });
        }
      }
  });
  
  // Add the flattened data to the main object
  Object.assign(subjTrial_data, handPathSummary);
}

    console.log("Data prepared, attempting to save...");
    console.log("Sample of data:", JSON.stringify(subjTrial_data).substring(0, 500));

    // Upload to Firebase
    updateCollection(trialcollection, subjTrial_data)
      .then(() => {
        console.log("Trial data successfully saved!");
      })
      .catch(error => {
        console.error("Failed to save trial data:", error);
        alert("There was an error saving your data. Please contact the experimenter.");
      });
  } catch (error) {
    console.error("Error in helpEnd function:", error);
  }
}

// Function that allows for the premature end of a game
function badGame() {
  show("container-failed");
  helpEnd();
}

// Function that ends the game appropriately after the experiment has been completed
function endGame() {
  // save the data

  // show questionaire
  show("container-not-an-ad");
  
  // release fullscreen and restore cursor
  helpEnd();

  // participant has completed the experiment
  // show the questionaire
  // the SUBMIT button will call the function to save the data
  // and close the questionaire
  // show("container-questionaire");
}

// Functions that need to be outside of the main function

// Function to validate the age input
function validateAge(input) {
  // Get the current value
  let value = input.value;

  // Remove any non-digit characters
  value = value.replace(/\D/g, '');
  // Ensure it's in the 0-120 range
  if (value !== "") {
    const num = parseInt(value);
    if (num > 120) {
      value = "120";
    }
  }
  // Update the input value
  input.value = value;
}
// Function to validate the music practice input
function validateHours(input) {
  // Get the current value
  let value = input.value;   
  // Remove any non-digit characters
  value = value.replace(/\D/g, '');
    // Ensure it's in the 0-168 range (max hours in a week)
    if (value !== "") {
      const num = parseInt(value);
      if (num > 168) {
          value = "168";
      }
  }
  // Update the input value
  input.value = value;
}

// Function used to save the feedback from the final HTML page
function saveFeedback() {
  // Initialize distractions array
  subject.distractions = [];
  
  // Process distraction checkboxes
  for (let i = 1; i <= 7; i++) {
    const checkbox = document.getElementById(`distract${i}`);
    if (checkbox && checkbox.checked) {
      subject.distractions.push(checkbox.value);
      
      // If "Other" is checked, get the text
      if (checkbox.value === "other") {
        const distractoInput = document.querySelector('input[name="distracto"]');
        if (distractoInput) {
          subject.distracto = distractoInput.value;
        }
      }
    }
  }

  // Get demographic information directly from DOM elements
  const age = document.getElementById("age-input") ? document.getElementById("age-input").value : "";
  const gender = document.getElementById("gender") ? document.getElementById("gender").value : "";
  const musicInstrument = document.getElementById("music-instrument-input") ? document.getElementById("music-instrument-input").value : "";
  const musicPractice = document.getElementById("music-practice-input") ? document.getElementById("music-practice-input").value : "";
  const languageCount = document.getElementById("language-count") ? document.getElementById("language-count").value : "";
  const returner = document.getElementById("repeat") ? document.getElementById("repeat").value : "";
  const handedness = document.getElementById("hand") ? document.getElementById("hand").value : "";
  const ethnicity = document.getElementById("ethnic") ? document.getElementById("ethnic").value : "";
  const race = document.getElementById("race") ? document.getElementById("race").value : "";

  
  // Calling the function to validate the age input
  const ageInput = document.getElementById("age-input");
  if (ageInput) {
    // Call the validation function
    validateAge(ageInput);
  }
  
  // Calling the function to validate the hours input
  const hoursInput = document.getElementById("music-practice-input");
  if (hoursInput) {
    // Call the validation function
    validateHours(hoursInput);
  }
  // Validate required fields
  const requiredFields = [
    { name: "Age", value: age },
    { name: "Music practice hours", value: musicPractice },
    { name: "Gender", value: gender },
    { name: "Musical instrument question", value: musicInstrument },
    { name: "Language count", value: languageCount },
    { name: "Experiment returner", value: returner },
    { name: "Handedness", value: handedness }
  ];
  
  // Get feedback text - SIMPLIFIED VERSION
  const feedbackInput = document.getElementById('feedback_final');
  // Always set comments to a string value, empty string if no input
  subject.comments = (feedbackInput && feedbackInput.value) ? feedbackInput.value : "";

  // Log for debugging
  console.log("Feedback captured:", subject.comments);

  const missingFields = requiredFields.filter(field => !field.value);
  
  if (missingFields.length > 0) {
    alert(`Please complete all required fields before submitting. Missing: ${missingFields.map(f => f.name).join(", ")}`);
    return false;
  }

  // Update the subject object with the new information
  subject.age = age;
  subject.sex = gender;
  subject.handedness = handedness;
  subject.returner = returner;
  subject.ethnicity = ethnicity || ""; // Optional field
  subject.race = race || ""; // Optional field
  subject.languageCount = languageCount;
  subject.musicInstrument = musicInstrument;
  subject.musicPractice = musicPractice || "0"; // Default to 0 if empty

  // Log for debugging
  console.log("Subject data before saving:", {
    id: subject.id,
    age: subject.age,
    sex: subject.sex,
    handedness: subject.handedness,
    mousetype: subject.mousetype,
    returner: subject.returner,
    musicExperience: subject.musicExperience,
    languageCount: subject.languageCount,
    musicInstrument: subject.musicInstrument,
    musicPractice: subject.musicPractice,
    ethnicity: subject.ethnicity,
    race: subject.race,
    comments: subject.comments,
    distractions: subject.distractions,
    distracto: subject.distracto
  });

  // Prepare data for Firebase
  const subject_data = {
    id: subject.id,
    age: subject.age,
    sex: subject.sex,
    handedness: subject.handedness,
    mousetype: subject.mousetype,
    returner: subject.returner,
    tgt_file: fileName,
    ethnicity: subject.ethnicity,
    race: subject.race,
    musicExperience: subject.musicExperience,
    languageCount: subject.languageCount,
    musicInstrument: subject.musicInstrument,
    musicPractice: subject.musicPractice,
    comments: subject.comments,
    distractions: subject.distractions,
    distracto: subject.distracto
  };

  // Save to Firebase
  updateCollection(subjectcollection, subject_data)
    .then(function() {
      console.log("Subject data successfully saved to Firebase");
      show("final-page");
    })
    .catch(function(error) {
      console.error("Error saving subject data to Firebase:", error);
      alert("There was an error saving your data. Please contact the experimenter.");
    });
}

document.addEventListener("DOMContentLoaded", function () {
  // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
  // // The Firebase SDK is initialized and available here!
  //
  //firebase.auth().onAuthStateChanged(user => { });
  //firebase.database().ref('./').on('value', snapshot => { });
  //firebase.messaging().requestPermission().then(() => { });
  //firebase.storage().ref('./').getDownloadURL().then(() => { });
  //
  // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
});