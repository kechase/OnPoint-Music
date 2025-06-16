/*
This is an auditory-motor mapping experiment that can be adapted depending on the target file.

Update necessary fields before starting the game. All fields that require change will be marked by a "####" comment.
*/

// Set to 'true' if you only want to test front-end (i.e. it will not access databases)
// #### Make sure this is set to 'false' before deploying!
const noSave = false;

// Set to 'true' to disable **full screen mode** during development
// #### Make sure this is set to false before deploying!
const disableFullScreen = false;

// Set to 'true' to disable **headphone check** during development
// #### Make sure this is set to false before deploying!
const SKIP_HEADPHONE_CHECK = true;

// Set to 'true' to disable **pre-experiment instructions** during development
// #### Make sure this is set to false before deploying!
// This isn't fully functional as it requires additional logic in the showPreExperimentInstructions function related to pre-instructions and making it full screen; not ready yet.
const SKIP_PRE_EXPERIMENT_INSTRUCTIONS = false;



// Experiment files // #### Update this to the correct path of your target file
// Dynamic file loading based on participant ID
const fileName = "./tgt_files/csv_tgt_file_2025-05-27.json";
let fileContent;

// Add all the new functions here:
function getParticipantSeed(participantId) {
    let hash = 0;
    for (let i = 0; i < participantId.length; i++) {
        const char = participantId.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash);
}

function seededRandom(startNumber) {
    let current = startNumber;
    
    return function() {
        current = (current * 9301 + 49297) % 233280;
        return current / 233280;
    };
}

// Function to shuffle array with seeded randomness
function shuffleWithSeed(array, seed) {
    const rng = seededRandom(seed);
    const shuffled = [...array];
    
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    return shuffled;
}

// Simple function to shuffle blocks (8 trials each) while keeping each block intact
function shuffleBlocks(testingData, participantId) {
    if (!participantId) {
        console.warn("No participant ID provided, using original order");
        return testingData;
    }
    
    const seed = getParticipantSeed(participantId);
    console.log(`Using seed ${seed} for participant ${participantId}`);
    
    const numTrials = testingData.numtrials;
    const blockSize = 8; // 8 angles per block
    const numBlocks = numTrials / blockSize; // Should be 12 blocks
    
    console.log(`Found ${numBlocks} blocks of ${blockSize} trials each`);
    
    // Create array of block indices [0, 1, 2, ..., 11]
    const blockIndices = [];
    for (let i = 0; i < numBlocks; i++) {
        blockIndices.push(i);
    }
    
    // Shuffle the block order
    const shuffledBlockIndices = shuffleWithSeed(blockIndices, seed);
    console.log(`Block order: ${shuffledBlockIndices.join(', ')}`);
    
    // Create new data structure with shuffled blocks
    const shuffledData = {
        numtrials: numTrials,
        trialnum: {},
        aiming_landmarks: {},
        online_fb: {},
        endpoint_feedback: {},
        rotation: {},
        tgt_angle: {},
        tgt_distance: {},
        between_blocks: {},
        target_jump: {}
    };
    
    // Fill in the shuffled data
    let newIndex = 0;
    for (const blockIndex of shuffledBlockIndices) {
        // For each block, copy its 8 trials
        for (let trialInBlock = 0; trialInBlock < blockSize; trialInBlock++) {
            const originalIndex = blockIndex * blockSize + trialInBlock;
            const originalKey = originalIndex.toString();
            const newKey = newIndex.toString();
            
            // Copy all the trial data
            shuffledData.trialnum[newKey] = testingData.trialnum[originalKey];
            shuffledData.aiming_landmarks[newKey] = testingData.aiming_landmarks[originalKey];
            shuffledData.online_fb[newKey] = testingData.online_fb[originalKey];
            shuffledData.endpoint_feedback[newKey] = testingData.endpoint_feedback[originalKey];
            shuffledData.rotation[newKey] = testingData.rotation[originalKey];
            shuffledData.tgt_angle[newKey] = testingData.tgt_angle[originalKey];
            shuffledData.tgt_distance[newKey] = testingData.tgt_distance[originalKey];
            shuffledData.between_blocks[newKey] = testingData.between_blocks[originalKey];
            shuffledData.target_jump[newKey] = testingData.target_jump[originalKey];
            
            newIndex++;
        }
    }
    
    // Debug: Verify the shuffling worked
    console.log("First few angles in shuffled order:");
    for (let i = 0; i < Math.min(16, numTrials); i++) {
        console.log(`Trial ${i}: angle ${shuffledData.tgt_angle[i.toString()]}`);
    }
    
    return shuffledData;
}

// Load and randomize data
function loadAndRandomizeData(participantId) {
    return new Promise((resolve, reject) => {
        $.getJSON(fileName)
            .done(function(json) {
                console.log(`Successfully loaded template file: ${fileName}`);
                
                // Shuffle blocks for both conditions
                const randomizedJson = {
                    conditionA: {
                        training: json.conditionA.training, // Keep training the same
                        testing: shuffleBlocks(json.conditionA.testing, participantId)
                    },
                    conditionB: {
                        training: json.conditionB.training, // Keep training the same
                        testing: shuffleBlocks(json.conditionB.testing, participantId)
                    }
                };
                
                fileContent = randomizedJson;
                console.log("Blocks shuffled successfully for participant:", participantId);
                resolve(randomizedJson);
            })
            .fail(function() {
                console.error("Failed to load template file:", fileName);
                reject(new Error("Unable to load experiment data"));
            });
    });
}
// Normalize angles so 360 and 0 are equivalent 
function normalizeAngleForMath(angle) {
    // Convert 360 to 0 for mathematical calculations
    return angle === 360 ? 0 : angle;
}

window.onerror = function(message, source, lineno, colno, error) {
  console.error("=== DETAILED ERROR INFO ===");
  console.error("Message:", message);
  console.error("Source:", source);
  console.error("Line:", lineno);
  console.error("Column:", colno);
  console.error("Error object:", error);
  console.error("Stack trace:", error ? error.stack : "No stack trace available");
  console.error("=== END ERROR INFO ===");
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
    try {
        this.isPlaying = true;
        
        // Ensure currentTime is valid
        currentTime = isFinite(currentTime) ? currentTime : this.audioContext.currentTime;
        
        // Set gain with safety check
        this.gainNode.gain.setValueAtTime(
            Math.min(Math.max(8, 0), 10), // Clamp between 0 and 10
            currentTime
        ); 
        
        this.audioContext.resume();
    } catch (error) {
        console.error('MusicBox play error:', error);
    }
}

update(pitch, f1, f2) {
  try {
      const currentTime = this.audioContext.currentTime;

      // Validate and sanitize inputs
      pitch = isFinite(pitch) ? Math.abs(pitch) : 220;
      f1 = isFinite(f1) ? Math.abs(f1) : 440;
      f2 = isFinite(f2) ? Math.abs(f2) : 880;

      // Ensure playing
      if (!this.isPlaying) {
          this.play(currentTime);
      }

      // Set gain
      this.gainNode.gain.setValueAtTime(8, currentTime);

      // Set frequency and filters with safety checks
      this.oscillator.frequency.setValueAtTime(
          Math.min(Math.max(pitch, 20), 20000), // Audible frequency range
          currentTime
      );

      // Use setTargetAtTime for smoother transitions
      this.filter1.frequency.setTargetAtTime(
          Math.min(Math.max(f1, 10), 22000), 
          currentTime, 
          0.1
      );
      this.filter2.frequency.setTargetAtTime(
          Math.min(Math.max(f2, 10), 22000), 
          currentTime, 
          0.1
      );

      // Set Q values with safety
      this.filter1.Q.setValueAtTime(
          Math.min(Math.max(5, 0), 20), 
          currentTime
      );
      this.filter2.Q.setValueAtTime(
          Math.min(Math.max(5, 0), 20), 
          currentTime
      );

  } catch (error) {
      console.error('MusicBox update error:', {
          pitch, f1, f2, 
          error: error.message
      });
  }
}

pause() {
  try {
      this.isPlaying = false;
      
      // Use current time for more precise stopping
      const currentTime = this.audioContext.currentTime;
      
      // Gradual gain reduction
      this.gainNode.gain.setTargetAtTime(0, currentTime, 0.1);
      
      this.audioContext.suspend();
  } catch (error) {
      console.error('MusicBox pause error:', error);
  }
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
  constructor(id, age, gender, handedness, mouse_type, returner, ethnicity, race, music_experience, language_count, music_instrument, music_practice) {
    super("subject");
      this.id = id,
      this.age = age,
      this.gender = gender,
      this.handedness = handedness,
      this.mouse_type = mouse_type,
      this.returner = returner,
      this.music_experience = music_experience, 
      this.language_count = language_count,
      this.music_instrument = music_instrument,
      this.music_practice = music_practice,
      this.tgt_file = fileName,
      this.ethnicity = ethnicity,
      this.race = race,
      this.comments = null,
      this.distractions = [],
      this.distracto = null,
      this.condition = null; // to store the condition (A or B)
  }

  // Validation logic - if these fields are required, add them to the check
  isValid() {
    return this.id !== "" && this.age !== "" && this.gender !== "" && 
           this.handedness !== "" && this.mouse_type !== "" && this.returner !== "" &&
           this.music_experience !== "" && this.music_instrument !== "" && this.music_practice !== "" && this.language_count !== "";
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
    reaction_time,
    movement_time,
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
      reaction_time,
      movement_time,
      time,
      feedback,
    );

    // append the start position of the cursor
    const data = [...cursor_data];
    const path = [...hand_path];
    this.cursor_data.push(data);
    this.hand_path.push(path);

    // append data to this trial block
    this.blocks.push(block);
  }
}

class Block extends Database {
  constructor(num, target_angle, rotation, hand_angle, reaction_time, movement_time, time, feedback) {
    super("block");
    // auto create the date
    const d = new Date();
    const current_date = (parseInt(d.getMonth()) + 1).toString() + "/" +
      d.getDate() + "/" + d.getFullYear() + " " + d.getHours() + ":" +
      d.getMinutes() + "." + d.getSeconds() + "." + d.getMilliseconds();

    this.trial_num = num;
    this.current_date = current_date;
    this.target_angle = target_angle;
    this.trial_type = "online_fb"; // No longer needed - legacy code
    this.rotation = rotation;
    this.hand_fb_angle = hand_angle;
    this.reaction_time = reaction_time;
    this.movement_time = movement_time;
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

// Function to extract URL parameters
function getUrlParameter(name) {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  const results = regex.exec(location.search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Replace your existing getConditionFromId function with this enhanced version
function getConditionFromId(id) {
  // Check for URL parameter first
  const conditionParam = getUrlParameter('condition');
  if (conditionParam && (conditionParam.toUpperCase() === 'A' || conditionParam.toUpperCase() === 'B')) {
      console.log("Condition set by URL parameter:", conditionParam.toUpperCase());
      return conditionParam.toUpperCase();
  }
  
  // If no URL parameter, or invalid value, use the hash function
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
      const char = id.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
  }
  return Math.abs(hash) % 2 === 0 ? 'A' : 'B';
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
  document.getElementById('container-pre-experiment').style.display = 'none';
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
    

  }
});

// Function to validate consent checkboxes
// This function is called when the user clicks the "I agree" button
// It checks if all three consent checkboxes are checked
// If they are, it shows the next page; if not, it alerts the user
// and prevents the form from being submitted
// 
window.validateConsent = function() {
  const consentAge = document.getElementById('consent-age');
  const consentRead = document.getElementById('consent-read');
  const consentParticipate = document.getElementById('consent-participate');
  
  if (consentAge.checked && consentRead.checked && consentParticipate.checked) {
    console.log("All consent boxes checked - proceeding to next page");
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
  const mouse_type = getFormValue(values, "mouse_type");
  const music_experience = getFormValue(values, "music_experience");

  // Basic validation
  if (!prolific_id || !mouse_type || !music_experience ) {
    alert("Please fill out all required information!");
    return false;
  }
  
  // Trackpad validation
  if (mouse_type !== 'trackpad') {
    alert("This experiment requires using a trackpad. Please switch to a trackpad to continue.");
    return false;
  }

  // music experience validation
  // Additional validation to ensure musicExperience is not empty
  if (!music_experience) {
    alert("Please enter your music experience!");
    document.getElementById("music_experience").focus();
    return false;
}
  // Optional: Ensure it's a number if that's what you expect
  if (isNaN(music_experience)) {
    alert("Please enter a valid number for music experience!");
    document.getElementById("music_experience").focus();
    return false;
}

  // Create subject with all fields
  subject = new Subject(
    prolific_id,     // Prolific ID
    "",              // Age (will collect later)
    "",              // Gender (will collect later)
    "",              // Handedness (will collect later)
    mouse_type,      // Mouse type
    "",              // Returner (will collect later)
    "",              // Ethnicity (will collect later)
    "",              // Race (will collect later)
    music_experience,// Music experience
    "",              // Language count (will collect later)
    "",              // Music instrument (will collect later)
    ""               // Music practice (will collect later)
  );

  // Assign condition directly to subject
  subject.condition = getConditionFromId(prolific_id);
  console.log("Participant assigned to condition:", subject.condition);

  // Also set the global variable if you need it elsewhere
  window.experimentCondition = subject.condition;

  // Load participant-specific data in the background
  loadAndRandomizeData(prolific_id)  // <-- CHANGE THIS LINE
  .then(function(data) {
  console.log("Participant data loaded and randomized successfully");
})
.catch(function(error) {
  console.error("Failed to load participant data:", error);
  alert("Error loading experiment data. Please refresh the page and try again, or contact the experimenter.");
});

  // skip headphone check if SKIP_HEADPHONE_CHECK is true
  if (SKIP_HEADPHONE_CHECK) {
    show("container-instructions1");
  } else {
    show("container-headphone-check");
    // Initialize the headphone check when showing the container
    runHeadphoneCheck();
  }

  return false; // Prevent form submission
}

// Initialize the global variable at the top
window.headphoneCheckPassed = false;
window.headphoneCheckInstance = null;
window.headphoneCheckRunning = false;
window.headphoneCheckInitialized = false; // Add this flag

// Function to run the headphone check
function runHeadphoneCheck() {
  console.log("🔧 Starting runHeadphoneCheck()");
  
  // Check if already initialized
  if (window.headphoneCheckInitialized) {
    console.warn("⚠️ Headphone check already initialized!");
    return;
  }
  
  // Check if already running
  if (window.headphoneCheckRunning) {
    console.warn("⚠️ Headphone check already running!");
    return;
  }
  
  window.headphoneCheckRunning = true;
  window.headphoneCheckInitialized = true;
  
  // Clear any previous instance and ensure buttons are hidden
  document.getElementById('headphone-check-container').innerHTML = '<p>Loading headphone check...</p>';
  const buttonContainer = document.getElementById('headphone-buttons');
  if (buttonContainer) {
    buttonContainer.style.display = 'none';
    buttonContainer.style.visibility = 'hidden'; // Extra safety
    // Remove any inline styles that might override
    buttonContainer.removeAttribute('style');
    buttonContainer.style.cssText = 'display: none !important; visibility: hidden !important;';
  }
  
  // Also disable the continue button as extra safety
  const proceedBtn = document.getElementById('continue-after-headphone-check');
  if (proceedBtn) {
    proceedBtn.disabled = true;
  }
  
  // Reset global state
  window.headphoneCheckPassed = false;
  window.headphoneCheckInstance = null;

  // Check jQuery availability
  console.log("jQuery available:", typeof $ !== 'undefined');
  console.log("jQuery UI available:", typeof $.ui !== 'undefined');
  
  // Ensure DOM is ready
  $(document).ready(function() {
    console.log("DOM ready, initializing headphone check...");
    
    // Small delay to ensure everything is loaded
    setTimeout(function() {
      try {
        console.log("Creating HeadphonesCheck instance...");
        
        const headphoneCheck = new HeadphonesCheck({
          // Callback - this is called AFTER all trials are complete
          callback: function(result) {
            console.log("🎧 HEADPHONE CHECK CALLBACK TRIGGERED!");
            console.log("🎧 Result:", result);
            console.log("🎧 Result type:", typeof result);
            console.log("🎧 Time:", new Date().toISOString());
            
            // Add a delay to ensure dialog processing is complete
            setTimeout(function() {
              handleHeadphoneCheckResult(result);
            }, 300); // 300ms delay to ensure dialog cleanup
          },

          // Your settings
          volumeSound: 'stimuli_HugginsPitch/HugginsPitch_calibration.flac',
          checkExample: 'stimuli_HugginsPitch/HugginsPitch_example_2.flac',
          checkSounds: [
            {answer: 1, file: 'stimuli_HugginsPitch/HugginsPitch_set1_1.flac'},
            {answer: 2, file: 'stimuli_HugginsPitch/HugginsPitch_set1_2.flac'},
            {answer: 3, file: 'stimuli_HugginsPitch/HugginsPitch_set1_3.flac'},
            {answer: 1, file: 'stimuli_HugginsPitch/HugginsPitch_set2_1.flac'},
            {answer: 2, file: 'stimuli_HugginsPitch/HugginsPitch_set2_2.flac'},
            {answer: 3, file: 'stimuli_HugginsPitch/HugginsPitch_set2_3.flac'},
            {answer: 1, file: 'stimuli_HugginsPitch/HugginsPitch_set3_1.flac'},
            {answer: 2, file: 'stimuli_HugginsPitch/HugginsPitch_set3_2.flac'},
            {answer: 3, file: 'stimuli_HugginsPitch/HugginsPitch_set3_3.flac'},
            {answer: 1, file: 'stimuli_HugginsPitch/HugginsPitch_set4_1.flac'},
            {answer: 2, file: 'stimuli_HugginsPitch/HugginsPitch_set4_2.flac'},
            {answer: 3, file: 'stimuli_HugginsPitch/HugginsPitch_set4_3.flac'},
            {answer: 1, file: 'stimuli_HugginsPitch/HugginsPitch_set5_1.flac'},
            {answer: 2, file: 'stimuli_HugginsPitch/HugginsPitch_set5_2.flac'},
            {answer: 3, file: 'stimuli_HugginsPitch/HugginsPitch_set5_3.flac'},
            {answer: 1, file: 'stimuli_HugginsPitch/HugginsPitch_set6_1.flac'},
            {answer: 2, file: 'stimuli_HugginsPitch/HugginsPitch_set6_2.flac'},
            {answer: 3, file: 'stimuli_HugginsPitch/HugginsPitch_set6_3.flac'}
          ],
          checkType: 'huggins',
          trialCount: 6,
          passMark: 6,  // only perfect score is accepted
          maxAttempts: 2,
          checkVolume: 0.8,  // Increased volume
        });

        console.log("HeadphonesCheck instance created:", headphoneCheck);
        window.headphoneCheckInstance = headphoneCheck;

        // Start the headphone check
        console.log("Starting headphone check...");
        const checkPromise = headphoneCheck.checkHeadphones();
        console.log("checkHeadphones() called, promise:", checkPromise);

        // Monitor the promise - but don't rely on it for UI updates
        if (checkPromise && typeof checkPromise.then === 'function') {
          checkPromise
            .then((result) => {
              console.log("✅ Headphone check promise resolved (passed)");
              // The callback handles the UI updates
            })
            .catch((error) => {
              console.log("❌ Headphone check promise rejected (failed after max attempts)");
              // The callback handles the UI updates
            });
        }
          
      } catch (error) {
        console.error("❌ CRITICAL ERROR creating HeadphonesCheck:", error);
        console.error("Stack trace:", error.stack);
        
        window.headphoneCheckRunning = false;
        
        // Show error state
        document.getElementById('headphone-check-container').innerHTML = 
          '<p style="color: red;">Error loading headphone check. Please refresh the page.</p>';
        document.getElementById('headphone-buttons').style.display = 'block';
        document.getElementById('retry-headphone-check').style.display = 'inline-block';
        document.getElementById('continue-after-headphone-check').style.display = 'none';
        window.headphoneCheckPassed = false;
      }
    }, 100); // Small delay to ensure everything is ready
  });
}

// Separate function to handle the result with proper timing
function handleHeadphoneCheckResult(result) {
  console.log("🎯 handleHeadphoneCheckResult called with:", result);
  
  // The result is a boolean - true if passed, false if failed
  const passed = (result === true);
  
  console.log("🎧 Headphone check passed:", passed);
  
  // Set the global variable 
  window.headphoneCheckPassed = passed;
  window.headphoneCheckRunning = false;
  
  // Clear the container message
  document.getElementById('headphone-check-container').innerHTML = '';
  
  // Make sure all dialogs are closed
  $('.ui-dialog').each(function() {
    $(this).dialog('close');
  });
  
  // Wait a bit more to ensure dialog cleanup
  setTimeout(function() {
    // NOW show the buttons
    const buttonContainer = document.getElementById('headphone-buttons');
    if (buttonContainer) {
      // Force the buttons to be visible
      buttonContainer.removeAttribute('style');
      buttonContainer.style.cssText = 'display: block !important; visibility: visible !important; text-align: center; margin-top: 20px;';
    }
    
    if (passed) {
      // Passed 
      document.getElementById('retry-headphone-check').style.display = 'none';
      const proceedBtn = document.getElementById('continue-after-headphone-check');
      if (proceedBtn) {
        proceedBtn.style.display = 'inline-block';
        proceedBtn.disabled = false; // Enable the button
      }
      
      // Add success message
      const container = document.getElementById('headphone-check-container');
      if (container) {
        container.innerHTML = '<p style="color: green; font-weight: bold; font-size: 20px; text-align: center;">✓ Headphone check passed!</p>';
      }
      
      // Auto-click the continue button after a short delay
      setTimeout(function() {
        const continueBtn = document.getElementById('continue-after-headphone-check');
        if (continueBtn && continueBtn.style.display !== 'none') {
          console.log("Auto-clicking continue button after successful headphone check");
          continueBtn.click();
        }
      }, 800); // Longer delay to ensure everything is properly displayed
      
    } else {
      // Failed
      document.getElementById('retry-headphone-check').style.display = 'inline-block';    
      document.getElementById('continue-after-headphone-check').style.display = 'none';
      
      // Add failure message
      const container = document.getElementById('headphone-check-container');
      if (container) {
        container.innerHTML = '<p style="color: red; font-weight: bold; font-size: 20px; text-align: center;">✗ Headphone check failed. Please try again.</p>';
      }
    }
  }, 100); // Small additional delay for dialog cleanup
}

// Function to retry the headphone check 
function retryHeadphoneCheck() {
  console.log("🔄 Retrying headphone check");
  
  // Close any remaining dialogs
  $('.ui-dialog').each(function() {
    $(this).dialog('close');
  });
  
  // Reset state
  window.headphoneCheckPassed = false;
  window.headphoneCheckRunning = false;
  window.headphoneCheckInitialized = false; // Reset this flag for retry
  
  // Wait a moment for cleanup
  setTimeout(function() {
    runHeadphoneCheck();
  }, 200);
}

// Simplified continue function
function continueAfterHeadphoneCheck() {
  console.log("🚀 continueAfterHeadphoneCheck called");
  console.log("🎧 headphoneCheckPassed:", window.headphoneCheckPassed);
  console.log("🎧 Button container display:", document.getElementById('headphone-buttons').style.display);
  console.log("🎧 This button display:", document.getElementById('continue-after-headphone-check').style.display);
  
  if (window.headphoneCheckPassed === true) {
    console.log("✅ Headphone check passed, continuing to instructions");
    show("container-instructions1");
  } else {
    console.log("❌ Headphone check not passed");
    alert("Please complete the headphone check successfully before continuing.");
  }
}

// Debug function to check the current state
function debugHeadphoneCheck() {
  console.log("=== HEADPHONE CHECK DEBUG INFO ===");
  console.log("Global headphoneCheckPassed:", window.headphoneCheckPassed);
  console.log("headphoneCheckRunning:", window.headphoneCheckRunning);
  console.log("Buttons display:", document.getElementById('headphone-buttons').style.display);
  console.log("Continue button display:", document.getElementById('continue-after-headphone-check').style.display);
  console.log("Retry button display:", document.getElementById('retry-headphone-check').style.display);
  
  if (window.headphoneCheckInstance) {
    console.log("Instance exists:", true);
    console.log("Instance.isHeadphones:", window.headphoneCheckInstance.isHeadphones);
    console.log("Instance.attemptCount:", window.headphoneCheckInstance.attemptCount);
    console.log("Instance.attemptRecord:", window.headphoneCheckInstance.attemptRecord);
  } else {
    console.log("Instance exists:", false);
  }
  
  // Check for jQuery UI dialogs
  console.log("Active jQuery UI dialogs:", $('.ui-dialog').length);
  console.log("Visible jQuery UI dialogs:", $('.ui-dialog:visible').length);
  console.log("Headphones dialog exists:", $('#headphones-dialog').length);
  console.log("=================================");
}

// Add keyboard shortcut for debugging (Ctrl+Shift+D)
document.addEventListener('keydown', function(e) {
  if (e.ctrlKey && e.shiftKey && e.key === 'D') {
    debugHeadphoneCheck();
  }
});

// Make these functions globally accessible
window.runHeadphoneCheck = runHeadphoneCheck;
window.retryHeadphoneCheck = retryHeadphoneCheck;
window.continueAfterHeadphoneCheck = continueAfterHeadphoneCheck;
window.debugHeadphoneCheck = debugHeadphoneCheck;
window.handleHeadphoneCheckResult = handleHeadphoneCheckResult;

function showPreExperimentInstructions() {
  // Skip pre-experiment instructions if toggle is true
  if (SKIP_PRE_EXPERIMENT_INSTRUCTIONS) {
    console.log('Skipping pre-experiment instructions');
    return startExperiment(); // Go straight to the experiment
  }
  
  // Get the participant's condition
  const condition = subject.condition || 'A';
  
  // Define condition-specific instructions
  const conditionInstructions = {
      'A': {
          message: 'Training is just a subset of the potential targets. Targets can be in any direction!',
      },
      'B': {
          message: 'Training is just a subset of the potential targets. Targets can be in any direction!',
      }
  };
  
  // Get instructions for current condition
  const instructions = conditionInstructions[condition];
  
  // Build simple HTML content
  const instructionHTML = `
      <p style="font-size: 26px; color: #337ab7; font-weight: bold; margin: 20px 0;">
          ${instructions.message}
      </p>
  `;
  
  // Insert the content
  document.getElementById('condition-specific-instructions').innerHTML = instructionHTML;
  
  // Show the pre-experiment page
  return show('container-pre-experiment');
}

function startExperiment() {
  // Enter full screen if not disabled
  console.log("startExperiment called, disableFullScreen:", disableFullScreen);
  if (!disableFullScreen) {
    console.log("Attempting to enter full screen");
    openFullScreen();
  } else {
    console.log("Full screen disabled");
  }
  
  console.log("Starting game with subject data:", subject);

  // start the game phase
  startGame();

  return true;
}

function showStartupMessage() {
  // set up the game environment first
  gameSetup(fileContent);

  // then show the start up message
  game_phase = Phase.BETWEEN_BLOCKS;
  bb_mess = 7 // new start up message
  displayMessageFlexible(7);
}

// Make it accessible
window.startExperiment = startExperiment;

// Function used to enter full screen mode
function openFullScreen() {
  const elem = document.getElementById("container-instructions1");
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
  if (!fileContent) {
    console.error("No file content loaded");
    alert("Experiment data not loaded. Please refresh the page.");
    return;
  }
  
  console.log(`Starting game with file: ${fileName}`);
  gameSetup(fileContent);
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
function gameSetup(data) {

  // Get the experiment condition from the subject object
  const experimentCondition = subject.condition || 'A'; // Default to 'A' if missing
   
  // Update experiment_ID to include the condition
  const experiment_ID = "AudioMotor_" + experimentCondition;

  // Determine which condition's data to use
  const conditionData = experimentCondition === 'A' 
    ? data.conditionA 
    : data.conditionB;

  // COORDINATE CALCULATIONS
  const screen_width = self.innerWidth;
  const screen_height = self.innerHeight;
  const tgt_distance = screen_height / 3 * .80;
  const center = new Point(screen_width / 2.0, screen_height / 2.0);
  // Red box dimensions
  const squareLeft = center.x - tgt_distance;
  const squareTop = center.y - tgt_distance;
  const squareSize = 2 * tgt_distance;

  // **MAKE THESE VARIABLES GLOBALLY ACCESSIBLE**
  window.tgt_distance = tgt_distance;
  window.squareLeft = squareLeft;
  window.squareTop = squareTop;
  window.squareSize = squareSize;
  window.center = center;
  window.screen_width = screen_width;
  window.screen_height = screen_height;
    
  console.log('=== COORDINATE SETUP ===');
  console.log('Screen:', screen_width, 'x', screen_height);
  console.log('Center:', center.x, center.y);
  console.log('Target distance:', tgt_distance);
  console.log('Square bounds:', squareLeft, squareTop, 'size:', squareSize);
  console.log('=== END COORDINATE SETUP ===');
  
  // Combine training and testing data properly
  const trainingData = conditionData.training;
  const testingData = conditionData.testing;
  
  // Merge the arrays correctly
  const rotation = {};
  const tgt_angle = {};
  const between_blocks = {};
  const target_jump = {};

  // Add training data (trials 0-3)
  for (let i = 0; i < trainingData.numtrials; i++) {
    rotation[i] = trainingData.rotation[i];
    tgt_angle[i] = trainingData.tgt_angle[i];
    between_blocks[i] = trainingData.between_blocks[i];
    target_jump[i] = trainingData.target_jump[i];
  }
  
  // Add testing data (trials 4-104, but indexed as 0-99 in testing data)
  for (let i = 0; i < testingData.numtrials; i++) {
    const globalTrialIndex = trainingData.numtrials + i; // This will be 4, 5, 6, ... 51
    rotation[globalTrialIndex] = testingData.rotation[i];
    tgt_angle[globalTrialIndex] = testingData.tgt_angle[i];
    between_blocks[globalTrialIndex] = testingData.between_blocks[i];
    target_jump[globalTrialIndex] = testingData.target_jump[i];
  }
  // **MAKE TRIAL DATA GLOBALLY ACCESSIBLE**
  window.rotation = rotation;
  window.tgt_angle = tgt_angle;
  window.between_blocks = between_blocks;
  window.target_jump = target_jump;

  // **DEBUG: Verify specific trial that was failing**
  console.log('=== TRIAL 47 CHECK ===');
  console.log('Trial 47 angle:', tgt_angle[47]);
  console.log('Trial 47 rotation:', rotation[47]);
  console.log('Trial 47 jump:', target_jump[47]);
  console.log('=== END TRIAL 47 CHECK ===');

  // Number of trials from training + testing data
  const num_trials = trainingData.numtrials + testingData.numtrials;
  console.log('Total trials:', num_trials);

  console.log('Global variables set:', {
    tgt_distance,
    squareLeft,
    squareTop,
    squareSize,
    center,
    totalTrials: num_trials
  });

  // Game state variables
  let trialOrder = [];
  let isPhase2 = false;
  let handPositions = [];
  let trial = 0;

  // Circle objects
  let calibration = null;
  let target = null;
  let cursor = null;

  // Timeout timer
  let movement_timeout = null;

  // Timing variables
    // length of time feedback remains (ms)
  const feedback_time = 50; 
    // length of "too slow" feedback (ms)
  const feedback_time_slow = 1500; 
    // length of time users must hold in start before next trial (ms)
  const hold_time = 500; 
    // length of time the start circle in holding phase will turn to green (ms)
  const green_time = 2000; 
    // Parameters and display for when users take too long to locate the center (ms)
  const search_too_slow = 3000;
    // Setting up parameters and display when reach is too slow (ms) 
  const too_slow_time = 4000; 

// The between block messages that will be displayed
const messages = [
  [
    // bb_mess == 0 - unused currently
    "Way to go! Press any key to continue."
  ],
  [
    // bb_mess == 1
    "Way to go!",
    "Press 'b' when you are ready to proceed.",
  ],
  [
    // bb_mess == 2
    "Phase 2:", 
    "The instrument will now play a sound,",
    "then you move the cursor to mimic that sound.",  
    "Remember: Training was only a SUBSET of potential sounds.",
    "Accuracy is important! Listen carefully!",
    
    "Press 'a' to continue.",
  ],
  [
    // bb_mess == 3
    "The white dot will now be hidden.", 
    "Continue aiming DIRECTLY towards the target.",
    "Press SPACE BAR when you are ready to proceed.",
  ],
  [
    // bb_mess == 4
    "This is an attention check.", 
    "Press the key 'e' on your keyboard to CONTINUE.",
    "Pressing any other key will result in a premature game termination and an incomplete HIT!",
  ],
  [
    // bb_mess == 5
    "This is an attention check.", 
    "Press the key 'a' on your keyboard to CONTINUE.",
    "Pressing any other key will result in a premature game termination and an incomplete HIT!",
  ],
  [
    // bb_mess == 6
    "The white dot will no longer be under your control.", 
    "IGNORE the white dot as best as you can and continue aiming DIRECTLY towards the target.",
    "This will be a practice trial",
    "Press SPACE BAR when you are ready to proceed.",
  ],
  [ 
    // bb_mess == 7
    "Welcome to the experiment!",
    "Phase 1:",
    "A blue dot will appear somewhere within the box.",
    "Move your white dot toward it and listen to the sound along the way.",
    "Press SPACE BAR to begin.",
  ],
];

  // **CRITICAL DEBUGGING: Check if key variables are defined**
  console.log('=== GAMESETUP DEBUGGING ===');
  console.log('experimentCondition:', experimentCondition);
  console.log('conditionData:', conditionData);
  console.log('rotation:', rotation);
  console.log('tgt_angle:', tgt_angle);
  console.log('tgt_distance:', tgt_distance);
  console.log('between_blocks:', between_blocks);
  console.log('target_jump:', target_jump);

  const musicBox = new MusicBox(self);
  // Calculated hand angles
  let hand_fb_angle = 0;

  // Timing Variables
  let reaction_time = 0; // reaction time
  let movement_time = 0; // movement time
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

  // Between blocks parameters
  let bb_mess = between_blocks[0];

  prev_screen_size = screen_width * screen_height;

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
    Math.round(tgt_distance * 4.5 / 80.0), // radius
    "none", // color
    "white", // stroke
  );

  // Setting parameters and drawing the target
  target = new Circle(
    handler, // parent
    center, // point
    // this is confusing? How big is this suppose to be?
    Math.round(tgt_distance * 4.5 / 80.0), // radius
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
    Math.round(tgt_distance * 1.75 * 1.5 / 80.0), // radius
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
    const stage = document.getElementById("stage");
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
    // get the stage element by ID
    const stage = document.getElementById("stage");
    // Check if stage exists AND supports pointer lock
    if (stage && stage.requestPointerLock) {
      stage.requestPointerLock();
    } else {
      console.warn("Stage element not found or does not support pointer lock.");
      return;
    }
  }

  setPointerLock();

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
        if (distance > tgt_distance *0.95) {
          // stop audio
          musicBox.pause();
          fb_phase();
        }
        break;
    }
  }

  // Function called whenever a key is pressed
  // #### Make sure conditions trigger intended action in "bb_mess"
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

      if (bb_mess == 7 && key == SPACE_BAR) {
        // Start the actual first trial
        bb_mess = between_blocks[0]; // Get the first trial's bb_mess
        search_phase();
        return;
      }

      // Only call badGame if none of the above conditions are met
    console.log("Failed attention check - ending game");
    badGame(); // Premature exit game if failed attention check
    }
  }

  function displayMessageFlexible(idx) {
    // First clear existing messages
    hideMessageFlexible();
  
    // Safety check for undefined messages
    if (!messages[idx]) {
      console.error(`No message defined for index: ${idx}`);
      return;
    }
  
    console.log(`Displaying message ${idx}:`, messages[idx]);
  
    // Get styling info
    const line_size = Math.round(window.screen_height / 30);
    const message_size = String(line_size).concat("px");
  
    // Display each line of the message
    messages[idx].forEach((text, lineIndex) => {
      const lineId = `message-line-${lineIndex + 1}`;
      let lineElement = d3.select(`#${lineId}`);
      
      // Create the line element if it doesn't exist
      if (lineElement.empty()) {
        lineElement = d3.select("#stage").append("text")
          .attr("text-anchor", "middle")
          .attr("x", window.center.x)
          .attr("y", window.center.y + (lineIndex - 1) * line_size) // Center around middle
          .attr("fill", "white")
          .attr("font-family", "sans-serif")
          .attr("font-size", message_size)
          .attr("id", lineId)
          .attr("display", "none");
      }
      
      // Display the text
      lineElement.attr("display", "block").text(text);
    });
  }
  
  function hideMessageFlexible() {
    // Hide all message lines (assuming max 10 lines should be enough)
    for (let i = 1; i <= 10; i++) {
      d3.select(`#message-line-${i}`).attr("display", "none");
    }
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

    hideMessageFlexible();
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
      
      // Project the current position onto the red square to ensure the sound is generated within the square
      let soundX = x;
      let soundY = y;
      
      // Clamp coordinates to be within the red square
      soundX = Math.max(squareLeft, Math.min(soundX, squareLeft + squareSize));
      soundY = Math.max(squareTop, Math.min(soundY, squareTop + squareSize));

    // Use the clamped coordinates for sound generation
    const { f1, f2, _vowel } = getVowelFormants(soundX, squareLeft, squareSize);
  
    // Match the pitch calculation from the update_cursor function
    const lo_pitch = 80;
    const hi_pitch = 350;
    const y_proportion = 1 - (soundY - squareTop) / squareSize;
    const pitch = (hi_pitch - lo_pitch) * (Math.pow(2, y_proportion) - 1) + lo_pitch;

    console.log(`Demo sound: x=${soundX.toFixed(1)}, y=${soundY.toFixed(1)}, f1=${f1.toFixed(1)}, f2=${f2.toFixed(1)}, pitch=${pitch.toFixed(1)}, vowel=${_vowel}`);

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
    // "Search time" is time elapsed from start of the search phase to the start of movement phase
    d3.select("#message-line-1").attr("display", "none");
    search_time = new Date() - begin;

    // Start of timer for reaction time
    begin = new Date();

    // If jump is 1.0, this means no variation was added to this target
    const jump = target_jump[trial];
    const angle = tgt_angle[trial];
    const mathAngle = normalizeAngleForMath(angle); // Convert 360→0 for math
    target.setFill("blue");
  
    // Calculate target position - do this first so we have start/end available
    const start = calibration.point;
    const offset = (jump == 1.0) ? rotation[trial] : jump;
    const value = mathAngle + offset;  
    
    // When calculating a point on a circle (or positioning a target at a certain angle and distance): 
    // Math.cos is used for the x-coordinate because cosine represents the horizontal component of movement along a circle. When an angle is 0 degrees, cosine is 1, placing the point at maximum x-distance. 
    // Math.sin is used for the y-coordinate because sine represents the vertical component of movement along a circle. When an angle is 90 degrees, sine is 1, placing the point at maximum y-distance.
    const x = start.x + tgt_distance * Math.cos(value * deg2rad);
    const y = start.y - tgt_distance * Math.sin(value * deg2rad);
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
    
     // Callback that can visualize the sound path
     play_sounds(start, end, demoDuration, (demoX, demoY) => {
      // Optional: You could create a visual indicator during the demo
      // For now, just log the path for debugging
      // console.log(`Demo sound playing at: (${demoX.toFixed(1)}, ${demoY.toFixed(1)})`);
      
      // You could also temporarily show the cursor position during demo:
      // cursor.update(demoX, demoY);
      // cursor.display(true);
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

    
    reaction_time = new Date() - begin; // Record reaction time as time spent with target visible before moving
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
    movement_time = new Date() - begin;
    let timer = 0;
    musicBox.pause();

    // Gives "hurry" message upon completing a trial that was done too slowly
    if (movement_time > too_slow_time) {
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
      tgt_distance * Math.cos(hand_fb_angle * deg2rad);
    hand_fb_y = calibration.point.y -
      tgt_distance * Math.sin(hand_fb_angle * deg2rad);

    cursor.display(true);

    // Start next trial after feedback time has elapsed
    game_phase = Phase.FEEDBACK;
  }

  function start_trial() {
    subjTrials = new Trial(experiment_ID, subject.id);

    d3.select("#too_slow_message").attr("display", "none");
    
    // hide calibration initially
    calibration.display(false);

    // show the start up message first instead of going directly to search phase
    game_phase = Phase.BETWEEN_BLOCKS;
    bb_mess = 7; // start up message
    displayMessageFlexible(7);
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
      reaction_time,
      movement_time,
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
    reaction_time = 0;
    movement_time = 0;
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
  
    // When transitioning to Phase 2, just note the phase change
    if (bb_mess == 2) {
      console.log("Transitioning to Phase 2 - using pre-randomized order from JSON file");
      isPhase2 = true;
      // No randomization needed - the JSON file already has the randomized order
}
  
    // Determine which trial to run next - simple sequential order
    trial += 1;
    console.log(`Moving to trial ${trial} (Phase ${isPhase2 ? '2' : '1'})`);

    // Debug code to verify JSON randomization is working
    if (trial < num_trials) {
      console.log(`Next trial: ${trial}, Angle: ${tgt_angle[trial]}, Rotation: ${rotation[trial]}`);
    }
  
    // Display any between-block messages if needed
    if (bb_mess || trial == 1) {
      game_phase = Phase.BETWEEN_BLOCKS;
      console.log(`Displaying message for bb_mess: ${bb_mess}`); 
      // Make sure all message lines exist in the messages array
      if (messages[bb_mess]) {
        displayMessageFlexible(bb_mess);
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
    a: { f1: 700, f2: 1200 }
  };

  // ensure input is a number
  if (isNaN(xPos) || isNaN(squareLeft) || isNaN(squareSize)) {
    console.error('Invalid input for getVowelFormants', { xPos, squareLeft, squareSize });

  // validate input
  if (xPos < 0 || squareLeft < 0 || squareSize <= 0) {
    console.error('Invalid input for getVowelFormants', { xPos, squareLeft, squareSize });
    return { f1: 500, f2: 1500, vowel: 'a' }; // Fallback values
  }
}
  
  // Need to be explicit about which segment these are delinating
  const vowels = Object.keys(vowelFormants);
  
  // Ensure xPos is within the square boundaries
  xPos = Math.max(squareLeft, Math.min(xPos, squareLeft + squareSize));
  
  const segmentWidth = squareSize / (vowels.length - 1);
  const offset = Math.max(xPos - squareLeft, 0);
  
  // Ensure index is within bounds
  const index = Math.min(
    Math.max(Math.floor(offset / segmentWidth), 0), 
    vowels.length - 2
  );
  
  const t = ((xPos - squareLeft) % segmentWidth) / segmentWidth;
  
  const vowel1 = vowels[index];
  const vowel2 = vowels[index + 1];
  
  // Add safety checks
  if (!vowelFormants[vowel1] || !vowelFormants[vowel2]) {
    console.warn('Unexpected vowel formant calculation', { 
      xPos, 
      squareLeft, 
      squareSize, 
      index, 
      vowel1, 
      vowel2 
    });
    
    // Fallback to default values
    return { 
      f1: 500, 
      f2: 1500, 
      vowel: 'a' 
    };
  }

  const f1 = vowelFormants[vowel1].f1 * (1 - t) + vowelFormants[vowel2].f1 * t;
  const f2 = vowelFormants[vowel1].f2 * (1 - t) + vowelFormants[vowel2].f2 * t;

  const currentVowel = t < 0.5 ? vowel1 : vowel2;

  return { f1, f2, _vowel: currentVowel };
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
      experiment_ID: subjTrials.experimentID,
      // cursor_data: subjTrials.cursor_data,
      trial_num: [],
      current_date: [],
      target_angle: [],
      trial_type: [],
      rotation: [],
      hand_fb_angle: [],
      reaction_time: [],
      movement_time: [],
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
      subjTrial_data.trial_num.push(block.trial_num);
      subjTrial_data.current_date.push(block.current_date);
      subjTrial_data.target_angle.push(block.target_angle);
      subjTrial_data.trial_type.push(block.trial_type);
      subjTrial_data.rotation.push(block.rotation);
      subjTrial_data.hand_fb_angle.push(block.hand_fb_angle);
      subjTrial_data.reaction_time.push(block.reaction_time);
      subjTrial_data.movement_time.push(block.movement_time);
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
  const music_instrument = document.getElementById("music-instrument-input") ? document.getElementById("music-instrument-input").value : "";
  const music_practice = document.getElementById("music-practice-input") ? document.getElementById("music-practice-input").value : "";
  const language_count = document.getElementById("language-count") ? document.getElementById("language-count").value : "";
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

  // Validate age vs musical experience
const ageNum = parseInt(age) || 0;
const musicExperience = parseInt(document.getElementById('music_experience').value) || 0;
if (ageNum > 0 && musicExperience > 0 && musicExperience > ageNum) {
  alert(`Error: You entered ${musicExperience} years of musical experience but your age is ${ageNum}. This seems incorrect. Please correct your entry, contact the researcher if you believe this is an error, or refresh the page to restart the experiment.`);
  return false;
}
  // Validate required fields
  const requiredFields = [
    { name: "Age", value: age },
    { name: "Music practice hours", value: music_practice },
    { name: "Gender", value: gender },
    { name: "Musical instrument question", value: music_instrument },
    { name: "Language count", value: language_count },
    { name: "Experiment returner", value: returner },
    { name: "Handedness", value: handedness }
  ];
  
  // Get feedback 
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
  subject.gender = gender;
  subject.handedness = handedness;
  subject.returner = returner;
  subject.ethnicity = ethnicity || ""; // Optional field
  subject.race = race || ""; // Optional field
  subject.language_count = language_count;
  subject.music_instrument = music_instrument;
  subject.music_practice = music_practice || "0"; // Default to 0 if empty

  // Log for debugging
  console.log("Subject data before saving:", {
    id: subject.id,
    age: subject.age,
    gender: subject.gender,
    handedness: subject.handedness,
    mouse_type: subject.mouse_type,
    returner: subject.returner,
    music_experience: subject.music_experience,
    language_count: subject.language_count,
    music_instrument: subject.music_instrument,
    music_practice: subject.music_practice,
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
    gender: subject.gender,
    handedness: subject.handedness,
    mouse_type: subject.mouse_type,
    returner: subject.returner,
    tgt_file: fileName,
    ethnicity: subject.ethnicity,
    race: subject.race,
    music_experience: subject.music_experience,
    language_count: subject.language_count,
    music_instrument: subject.music_instrument,
    music_practice: subject.music_practice,
    comments: subject.comments,
    distractions: subject.distractions,
    distracto: subject.distracto,
    condition: subject.condition // to save condition
  };

  // Save to Firebase
  updateCollection(subjectcollection, subject_data)
    .then(function() {
      console.log("Subject data successfully saved to Firebase");
      show("final-page");

      // Redirect after 2 seconds
    setTimeout(function() {
      window.location.href = "https://app.prolific.com/submissions/complete?cc=CSIP9LNR";
    }, 2000);
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