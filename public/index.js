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
// Currently there's an issue trying to load this file into data. CORS is blocking me from accessing the file directly, To overcome this, we'll provide the file content here instead. (Now running in Node.js and connected to Firebase so I deleted the filepath and let the variable stand alone - Katie)
const fileName = "./tgt_files/Katie2_csv_file.json";

// TODO: Katie, add the json content below here:
const fileContent = {
  "numtrials": 40,
  "trialnum": {
    "0": 1,
    "1": 2,
    "2": 3,
    "3": 4,
    "4": 5,
    "5": 6,
    "6": 7,
    "7": 8,
    "8": 9,
    "9": 10,
    "10": 11,
    "11": 12,
    "12": 13,
    "13": 14,
    "14": 15,
    "15": 16,
    "16": 17,
    "17": 18,
    "18": 19,
    "19": 20,
    "20": 21,
    "21": 22,
    "22": 23,
    "23": 24,
    "24": 25,
    "25": 26,
    "26": 27,
    "27": 28,
    "28": 29,
    "29": 30,
    "30": 31,
    "31": 32,
    "32": 33,
    "33": 34,
    "34": 35,
    "35": 36,
    "36": 37,
    "37": 38,
    "38": 39,
    "39": 40,
  },
  "aiming_landmarks": {
    "0": 0,
    "1": 0,
    "2": 0,
    "3": 0,
    "4": 0,
    "5": 0,
    "6": 0,
    "7": 0,
    "8": 0,
    "9": 0,
    "10": 0,
    "11": 0,
    "12": 0,
    "13": 0,
    "14": 0,
    "15": 0,
    "16": 0,
    "17": 0,
    "18": 0,
    "19": 0,
    "20": 0,
    "21": 0,
    "22": 0,
    "23": 0,
    "24": 0,
    "25": 0,
    "26": 0,
    "27": 0,
    "28": 0,
    "29": 0,
    "30": 0,
    "31": 0,
    "32": 0,
    "33": 0,
    "34": 0,
    "35": 0,
    "36": 0,
    "37": 0,
    "38": 0,
    "39": 0,
  },
  "online_fb": {
    "0": 1,
    "1": 1,
    "2": 1,
    "3": 1,
    "4": 1,
    "5": 1,
    "6": 1,
    "7": 1,
    "8": 1,
    "9": 1,
    "10": 1,
    "11": 1,
    "12": 1,
    "13": 1,
    "14": 1,
    "15": 1,
    "16": 1,
    "17": 1,
    "18": 1,
    "19": 1,
    "20": 1,
    "21": 1,
    "22": 1,
    "23": 1,
    "24": 1,
    "25": 1,
    "26": 1,
    "27": 1,
    "28": 1,
    "29": 1,
    "30": 1,
    "31": 1,
    "32": 1,
    "33": 1,
    "34": 1,
    "35": 1,
    "36": 1,
    "37": 1,
    "38": 1,
    "39": 1,
  },
  "endpoint_feedback": {
    "0": 1,
    "1": 1,
    "2": 1,
    "3": 1,
    "4": 1,
    "5": 1,
    "6": 1,
    "7": 1,
    "8": 1,
    "9": 1,
    "10": 1,
    "11": 1,
    "12": 1,
    "13": 1,
    "14": 1,
    "15": 1,
    "16": 1,
    "17": 1,
    "18": 1,
    "19": 1,
    "20": 1,
    "21": 1,
    "22": 1,
    "23": 1,
    "24": 1,
    "25": 1,
    "26": 1,
    "27": 1,
    "28": 1,
    "29": 1,
    "30": 1,
    "31": 1,
    "32": 1,
    "33": 1,
    "34": 1,
    "35": 1,
    "36": 1,
    "37": 1,
    "38": 1,
    "39": 1,
  },
  "rotation": {
    "0": 0.0,
    "1": 0.0,
    "2": 0.0,
    "3": 0.0,
    "4": 0.0,
    "5": 0.0,
    "6": 0.0,
    "7": 0.0,
    "8": 0.0,
    "9": 0.0,
    "10": 0.0,
    "11": 0.0,
    "12": 0.0,
    "13": 0.0,
    "14": 0.0,
    "15": 0.0,
    "16": 0.0,
    "17": 0.0,
    "18": 0.0,
    "19": 0.0,
    "20": 0.0,
    "21": 0.0,
    "22": 0.0,
    "23": 0.0,
    "24": 0.0,
    "25": 0.0,
    "26": 0.0,
    "27": 0.0,
    "28": 0.0,
    "29": 0.0,
    "30": 0.0,
    "31": 0.0,
    "32": 0.0,
    "33": 0.0,
    "34": 0.0,
    "35": 0.0,
    "36": 0.0,
    "37": 0.0,
    "38": 0.0,
    "39": 0.0,
  },
  "clamped_fb": {
    "0": 0.0,
    "1": 0.0,
    "2": 0.0,
    "3": 0.0,
    "4": 0.0,
    "5": 0.0,
    "6": 0.0,
    "7": 0.0,
    "8": 0.0,
    "9": 0.0,
    "10": 0.0,
    "11": 0.0,
    "12": 0.0,
    "13": 0.0,
    "14": 0.0,
    "15": 0.0,
    "16": 0.0,
    "17": 0.0,
    "18": 0.0,
    "19": 0.0,
    "20": 0.0,
    "21": 0.0,
    "22": 0.0,
    "23": 0.0,
    "24": 0.0,
    "25": 0.0,
    "26": 0.0,
    "27": 0.0,
    "28": 0.0,
    "29": 0.0,
    "30": 0.0,
    "31": 0.0,
    "32": 0.0,
    "33": 0.0,
    "34": 0.0,
    "35": 0.0,
    "36": 0.0,
    "37": 0.0,
    "38": 0.0,
    "39": 0.0,
  },
  "tgt_angle": {
    "0": 45,
    "1": 135,
    "2": 225,
    "3": 315,
    "4": 45,
    "5": 135,
    "6": 225,
    "7": 315,
    "8": 45,
    "9": 135,
    "10": 225,
    "11": 315,
    "12": 45,
    "13": 135,
    "14": 225,
    "15": 315,
    "16": 45,
    "17": 135,
    "18": 225,
    "19": 315,
    "20": 45,
    "21": 135,
    "22": 225,
    "23": 315,
    "24": 45,
    "25": 135,
    "26": 225,
    "27": 315,
    "28": 45,
    "29": 135,
    "30": 225,
    "31": 315,
    "32": 45,
    "33": 135,
    "34": 225,
    "35": 315,
    "36": 45,
    "37": 135,
    "38": 225,
    "39": 315,
  },
  "tgt_distance": {
    "0": 80,
    "1": 80,
    "2": 80,
    "3": 80,
    "4": 80,
    "5": 80,
    "6": 80,
    "7": 80,
    "8": 80,
    "9": 80,
    "10": 80,
    "11": 80,
    "12": 80,
    "13": 80,
    "14": 80,
    "15": 80,
    "16": 80,
    "17": 80,
    "18": 80,
    "19": 80,
    "20": 80,
    "21": 80,
    "22": 80,
    "23": 80,
    "24": 80,
    "25": 80,
    "26": 80,
    "27": 80,
    "28": 80,
    "29": 80,
    "30": 80,
    "31": 80,
    "32": 80,
    "33": 80,
    "34": 80,
    "35": 80,
    "36": 80,
    "37": 80,
    "38": 80,
    "39": 80,
  },
  "between_blocks": {
    "0": 0.0,
    "1": 0.0,
    "2": 0.0,
    "3": 0.0,
    "4": 0.0,
    "5": 0.0,
    "6": 0.0,
    "7": 0.0,
    "8": 0.0,
    "9": 0.0,
    "10": 0.0,
    "11": 0.0,
    "12": 0.0,
    "13": 0.0,
    "14": 0.0,
    "15": 0.0,
    "16": 0.0,
    "17": 0.0,
    "18": 0.0,
    "19": 0.0,
    "20": 0.0,
    "21": 0.0,
    "22": 0.0,
    "23": 0.0,
    "24": 0.0,
    "25": 0.0,
    "26": 0.0,
    "27": 0.0,
    "28": 0.0,
    "29": 0.0,
    "30": 0.0,
    "31": 0.0,
    "32": 0.0,
    "33": 0.0,
    "34": 0.0,
    "35": 0.0,
    "36": 0.0,
    "37": 0.0,
    "38": 0.0,
    "39": 0.0,
  },
  "target_jump": {
    "0": 1.0,
    "1": 1.0,
    "2": 1.0,
    "3": 1.0,
    "4": 1.0,
    "5": 1.0,
    "6": 1.0,
    "7": 1.0,
    "8": 1.0,
    "9": 1.0,
    "10": 1.0,
    "11": 1.0,
    "12": 1.0,
    "13": 1.0,
    "14": 1.0,
    "15": 1.0,
    "16": 1.0,
    "17": 1.0,
    "18": 1.0,
    "19": 1.0,
    "20": 0.0,
    "21": 0.0,
    "22": 0.0,
    "23": 0.0,
    "24": 0.0,
    "25": 0.0,
    "26": 0.0,
    "27": 0.0,
    "28": 0.0,
    "29": 0.0,
    "30": 0.0,
    "31": 0.0,
    "32": 0.0,
    "33": 0.0,
    "34": 0.0,
    "35": 0.0,
    "36": 0.0,
    "37": 0.0,
    "38": 0.0,
    "39": 0.0,
  },
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

    // oscillator
    this.oscillator = this.audioContext.createOscillator();
    this.oscillator.type = "sawtooth";
    this.oscillator.frequency.value = 220;

    // filter 1
    this.filter1 = this.audioContext.createBiquadFilter();
    this.filter1.type = "bandpass";

    // filter 2
    this.filter2 = this.audioContext.createBiquadFilter();
    this.filter2.type = "bandpass";

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

    this.filter1.Q.setValueAtTime(4, currentTime);
    this.filter2.Q.setValueAtTime(4, currentTime);
  }

  pause() {
    this.isPlaying = false;
    this.gainNode.gain.setValueAtTime(0, 0);
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
  constructor(id, age, sex, handedness, mousetype, returner, ethnicity, race) {
    super("subject");
    this.id = id,
      this.age = age,
      this.sex = sex,
      this.handedness = handedness,
      this.mousetype = mousetype,
      this.returner = returner,
      this.tgt_file = fileName,
      this.ethnicity = ethnicity,
      this.race = race,
      this.comments = null,
      this.distractions = [],
      this.distracto = null;
  }

  // contains the basic information required to proceed
  isValid() {
    return !(!this.id || !this.age || !this.sex || !this.handedness ||
      !this.mousetype);
  }
}

class Trial extends Database {
  constructor(experimentID, id) {
    super("trial");
    this.id = id;
    this.experimentID = experimentID;
    this.cursor_data = [];
    this.blocks = [];
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

    // append newly copy data value.
    this.cursor_data.push(data);

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
    // TODO: Check the other end process to see if this is still in use! This is deprecated for this experiment.
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

// Function used on html side of code.
function isNumericKey(event) {
  const code = (event.which) ? event.which : event.keyCode;
  return !(code > 31 && (code < 48 || code > 57));
}

// variable to hold current display page. Will be used to hide when show is called
let prevpage = "container-consent";

// Function to switch between HTML pages
function show(shown) {
  if (prevpage !== null) {
    document.getElementById(prevpage).style.display = "none";
  }
  document.getElementById(shown).style.display = "block";
  prevpage = shown;
  return false;
}

// Function used to enter full screen mode
function openFullScreen() {
  const elem = document.getElementById("container-info");
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

// this issue may have to do with the fact that I'm running in offline mode, no internet connected to provide me access to firebase data information?
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
    return null;
  }

  // TODO: Test and verify this working
  return collection.doc(subject.id).set(subject)
    .then(function () {
      console.log(subject);
      return true;
    })
    .catch(function (err) {
      console.error(err);
      throw err;
    });
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
    comments: subject.comments,
    distractions: subject.distractions,
    distracto: subject.distracto,
  };

  // we should be saving the subject here?
  updateCollection(subjectcollection, subject_data);
  show("final-page");
}

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
  if (!subject.isValid()) {
    alert("Please fill out your basic information!");
    return;
  }

  // so what are we doing here?
  // updateCollection(subjectcollection, subject);

  show("container-exp");
  openFullScreen();
  startGame();
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
// TODO: Need to see if I clone this value properly, if it referenced, both variable would receive identical value.
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
  // Experiment parameters, subject_ID is no obsolete
  // **TODO** Update experiment_ID to label your experiments
  const experiment_ID = "Katie2";
  // This is not used anywhere? Where is this being used?
  // const subject_ID = Math.floor(Math.random() * 10000000000);
  // array of cursor position during trials
  let handPositions = [];

  // current trial
  let trial = 0;

  // Circle objects
  let calibration = null;
  let target = null;
  let cursor = null;

  const feedback_time = 50; // length of time feedback remains (ms)
  const feedback_time_slow = 750; // length of "too slow" feedback (ms)
  const hold_time = 500; // length of time users must hold in start before next trial (ms)
  const green_time = 1000; // length of time the start circle in holding phase will turn to green (ms)
  const search_too_slow = 3000; // Parameters and display for when users take too long to locate the center (ms)
  const too_slow_time = 5000; // Setting up parameters and display when reach is too slow (ms)

  // The between block messages that will be displayed
  // **TODO** Update messages depending on your experiment
  const messages = [
    ["Way to go! Press any key to continue."],
    [
      "Wait until the center circle turns green.", // Message displayed when bb_mess == 1
      "Listen to the sound, then move in the direction that recreates the sound.",
      "Press 'b' when you are ready to proceed.",
    ],
    [
      "This is an instruction understanding check, you may proceed ONLY if you choose the correct choice.", // Message displayed when bb_mess == 2
      "Choosing the wrong choice will result in early game termination and an incomplete HIT!",
      "Press 'a' if you should ignore the white dot and aim directly towards the target.",
      "Press 'b' if you should be aiming away from the target.",
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
    // May be obsolete
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
  // TODO: Data normalization - what is this suppose to be?
  let bb_mess = between_blocks[0];

  // [F] - Data optimization. We don't need to have a number of trials variable here. We would just rely on the number of trial we have in our collection in the database.
  const num_trials = target_file_data.numtrials;

  // TODO: Need to see if I clone this value properly, if it referenced, both variable would receive identical value.
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
      .text("Move Faster");

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
  // TODO: Talk to Katie if we still need this? Used as an indicator to display cursor before moving back to start.
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
        handPositions.push(new Log(new Date() - begin, cursor_x, cursor_y));

        // Check if cursor is within the red square
        if (
          point.x >= squareLeft &&
          point.x <= squareLeft + squareSize &&
          point.y >= squareTop &&
          point.y <= squareTop + squareSize
        ) {
          console.log(`point ${JSON.stringify(point)}`);
          // generate value for vowel formants
          const { f1, f2, _vowel } = getVowelFormants(
            point.y,
            squareTop,
            squareSize,
          );
          const lo_pitch = 150;
          const hi_pitch = 800;

          const x_proportion = (point.x - squareLeft) / squareSize;
          const pitch =
            (hi_pitch - lo_pitch) * (Math.pow(2, x_proportion) - 1) + lo_pitch;
          // const pitch = 100 * Math.pow(2, (point.x - squareLeft) / 180); // 150 -

          console.log(`f1:${f1} f2: ${f2} pitch: ${pitch} vowel:${_vowel}`);
          // update musicbox
          musicBox.update(pitch, f1, f2);
        } else {
          musicBox.pause();
        }

        // Move from moving to feedback phase once their reach intersects the target ring
        if (distance > target_dist) {
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
    const a = "a"; //65;
    const e = "e"; //69;
    const b = "b"; //66;
    // const f = 70;   // not in use?
    // keyCode is marked deprecated - https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode
    // use keyboardEvent.key instead - https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key
    const key = event.key.toLowerCase();

    // start of the trial - we do not ask for client keyboard feedback, immediately search_phase();
    if (bb_mess == 0) {
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

      badGame(); // Premature exit game if failed attention check
    }
  }

  function displayMessage(idx) {
    // Load messages
    d3.select("#message-line-1").attr("display", "block").text(
      messages[idx][0],
    );
    d3.select("#message-line-2").attr("display", "block").text(
      messages[idx][1],
    );
    d3.select("#message-line-3").attr("display", "block").text(
      messages[idx][2],
    );
    d3.select("#message-line-4").attr("display", "block").text(
      messages[idx][3],
    );
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

  // todo we could load a tween graph or animation path to let researcher define new custom behaviours.
  function play_sounds(start, end, duration, update) {
    function play_sound_along(t) {
      // linear interpolate between two points over time (0-1)
      // This can be changed using different kind of interpolation or animation curve - future features
      const x = start.x + (end.x - start.x) * t;
      const y = start.y + (end.y - start.y) * t;

      update(x, y); // callback to update others based on coordinate given.
      const { f1, f2, _vowel } = getVowelFormants(y, squareTop, squareSize);
      const pitch = 100 * Math.pow(2, (x - squareLeft) / 180); // 150 -
      // update musicbox
      musicBox.update(pitch, f1, f2);
    }

    // TODO: How to stop this animation?
    animate((t) => play_sound_along(t), 1000, () => musicBox.pause());

    // this should be outside of frame update loop
    stop_target_music_timer = setTimeout(() => musicBox.pause(), duration);
  }

  // Phase when users have held cursor in start circle long enough so target shows up
  function show_targets() {
    // Record search time as the time elapsed from the start of the search phase to the start of this phase
    d3.select("#message-line-1").attr("display", "none");
    search_time = new Date() - begin;

    // Start of timer for reaction time
    begin = new Date();

    // I'm a bit confused with the logic here.
    // if this equals to one, this means no variation was added to this target.
    const jump = target_jump[trial];
    const angle = tgt_angle[trial];
    target.setFill("blue");

    // If we are not in practice trial display target (0.0 = invisible, 1.0 = visible)
    if (jump == 1.0) {
      target.display(true);
    }

    const offset = (jump == 1.0) ? rotation[trial] : jump;
    const value = angle + offset;
    const start = calibration.point;
    const x = start.x + target_dist * Math.cos(value * deg2rad);
    const y = start.y - target_dist * Math.sin(value * deg2rad);
    const end = new Point(x, y);

    target.update(x, y);
    if (play_sound) {
      play_sounds(start, end, 1, (x, y) => {
        // this gets called every frame. Part of the animation process. X, y are midpoint values between start and end over duration.
        if (jump != 1.0) {
          target.update(x, y);
        }
      });
      play_sound = false;
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
    musicBox.play(0);

    // Start circle disappears
    calibration.display(false);
    cursor.display(true);
    game_phase = Phase.MOVING;
  }

  // Phase where users have finished their reach and receive feedback
  function fb_phase() {
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
      reach_feedback = "let's pick up the pace!";
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
      hand_fb_angle = 360 + hand_fb_angle; // Corrected so that it doesn't have negative angles // can't imagine why it'd be negative?
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
    // TODO: add data to append to block for this Trial
    subjTrials.appendTrialBlock(
      tgt_angle[trial],
      rotation[trial],
      hand_fb_angle,
      rt,
      mt,
      search_time,
      reach_feedback,
      handPositions,
    );
    // where do we save the hand position data?

    // Reset timing variables
    rt = 0;
    mt = 0;
    search_time = 0;
    play_sound = true;

    // this clears it.
    handPositions = [];

    // Between Blocks Message Index
    // may potentially be a problem?
    // TODO, create a new trial that hold message block instead?
    bb_mess = between_blocks[trial];

    // Increment the trial count
    trial += 1;

    // update trial count display
    const totalTrials = target_file_data.numtrials;
    d3.select("#trialcount").text(
      "Reach Number: " + trial + " / " + totalTrials,
    );

    // Checks whether the experiment is complete, if not continues to next trial
    if (trial == num_trials) {
      end_trial();
      // display between block message
    } else if (bb_mess || trial == 1) {
      displayMessage(bb_mess);
      game_phase = Phase.BETWEEN_BLOCKS;
    } else {
      search_phase();
    }
  }

  // start the trial
  start_trial();
}

// Y should not be null?
function getVowelFormants(y, squareTop, squareSize) {
  const vowelFormants = {
    i: { f1: 300, f2: 2300 },
    // u: { f1: 300, f2: 800 },
    a: { f1: 700, f2: 1200 },
    // æ: { f1: 700, f2: 1800 }
  };
  // need to be explicit about which segment these are delinating
  const vowels = Object.keys(vowelFormants);
  const segmentHeight = squareSize / (vowels.length - 1);
  const offset = Math.max(y - squareTop, 0);
  const index = Math.min(Math.floor(offset / segmentHeight), vowels.length - 2); // which segment. floor(offset/segmentHeight) -> counts up through segments; vowels.length - 2 -> catches any round-off errors at the end.
  const t = ((y - squareTop) % segmentHeight) / segmentHeight; // where we are in the segment
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

  // restore the screen state.
  $("body").css("background-color", "white");
  $("html").css("background-color", "white");

  d3.select("#stage").attr("display", "none");

  const trialNum = [];
  const currentDate = [];
  const target_angle = [];
  const trial_type = [];
  const rotation = [];
  const hand_fb_angle = [];
  const rt = [];
  const mt = [];
  const search_time = [];
  const reach_feedback = [];

  subjTrials.blocks.forEach((e) => {
    trialNum.push(e.trialNum);
    currentDate.push(e.currentDate);
    target_angle.push(e.target_angle);
    trial_type.push(e.trial_type);
    rotation.push(e.rotation);
    hand_fb_angle.push(e.hand_fb_angle);
    rt.push(e.rt);
    mt.push(e.mt);
    search_time.push(e.search_time);
    reach_feedback.push(e.reach_feedback);
  });

  const subjTrial_data = {
    id: subjTrials.id,
    experimentID: subjTrials.experimentID,
    // cursor_data: subjTrials.cursor_data,
    trialNum,
    currentDate,
    target_angle,
    trial_type,
    rotation,
    hand_fb_angle,
    rt,
    mt,
    search_time,
    reach_feedback,
  };

  updateCollection(trialcollection, subjTrial_data);
}

// Function that allows for the premature end of a game
function badGame() {
  show("container-failed");
  helpEnd();
}

// Function that ends the game appropriately after the experiment has been completed
function endGame() {
  show("container-not-an-ad");
  helpEnd();
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
