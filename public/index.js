/*
This is an auditory-motor mapping experiment that can be adapted depending on the target file.
Update necessary fields before starting the game. 
All fields that require change are marked by a "####" comment.
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
const fileName = "./tgt_files/csv_tgt_file_testing.json";
let fileContent;

// Global flag to prevent double randomization
let dataAlreadyLoaded = false;

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

// ==================================================
// Function to shuffle array with seeded randomness
// ==================================================
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
function shuffleBlocks(testing_data, participantId) {
    if (!participantId) {
        console.warn("No participant ID provided, using original order");
        return testing_data;
    }
    // Add comprehensive validation
    if (!testing_data || typeof testing_data !== 'object') {
      console.error("Invalid testing_data provided:", testing_data);
      return testing_data;
    }
    if (!testing_data.numtrials || typeof testing_data.numtrials !== 'number') {
      console.error("Invalid or missing numtrials in testing_data:", testing_data.numtrials);
      return testing_data;
    }

    const seed = getParticipantSeed(participantId);
    console.log(`Using seed ${seed} for participant ${participantId}`);
    
    const numtrials = testing_data.numtrials;
    const block_size = 8; // 8 angles per block
    const num_blocks = numtrials / block_size; // Should be 12 blocks
    
    // Validate that numtrials is divisible by block_size
    if (numtrials % block_size !== 0) {
        console.error(`Number of trials (${numtrials}) is not divisible by block size (${block_size})`);
        return testing_data;
    }

    console.log(`Found ${num_blocks} blocks of ${block_size} trials each`);
    
    // Validate that all required data arrays exist and have the correct length
    const requiredFields = ['rotation', 'tgt_angle', 'between_blocks', 'target_jump'];
    for (const field of requiredFields) {
        if (!testing_data[field]) {
            console.error(`Missing field: ${field}`);
            return testing_data;
        }
        
        // Check if we have enough data for all trials
        for (let i = 0; i < numtrials; i++) {
            if (testing_data[field][i] === undefined) {
                console.error(`Missing data for ${field}[${i}]. Available indices:`, Object.keys(testing_data[field]));
                return testing_data;
            }
        }
    }

    // Create array of block indices [0, 1, 2, ..., 11]
    const block_indices = [];
    for (let i = 0; i < num_blocks; i++) {
        block_indices.push(i);
    }
    
    // Shuffle the block order
    const shuffled_block_indices = shuffleWithSeed(block_indices, seed);
    console.log(`Block order: ${shuffled_block_indices.join(', ')}`);
    
    // Create new data structure with shuffled blocks
    const shuffled_data = {
        numtrials: numtrials,
        trial_num: {},
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
    let new_index = 0;
    for (const block_index of shuffled_block_indices) {
        // For each block, copy its 8 trials
        for (let trial_in_block = 0; trial_in_block < block_size; trial_in_block++) {
            const original_index = block_index * block_size + trial_in_block;
            const original_key = original_index.toString();
            const new_key = new_index.toString();
            
            // Validate original_index is within bounds
            if (original_index >= numtrials) {
                console.error(`Original index ${original_index} exceeds numtrials ${numtrials}`);
                return testing_data;
            }
            
            // Copy all the trial data with validation
            try {
                shuffled_data.trial_num[new_key] = testing_data.trial_num ? testing_data.trial_num[original_key] : new_index + 1;
                shuffled_data.aiming_landmarks[new_key] = testing_data.aiming_landmarks ? testing_data.aiming_landmarks[original_key] : null;
                shuffled_data.online_fb[new_key] = testing_data.online_fb ? testing_data.online_fb[original_key] : null;
                shuffled_data.endpoint_feedback[new_key] = testing_data.endpoint_feedback ? testing_data.endpoint_feedback[original_key] : null;
                shuffled_data.rotation[new_key] = testing_data.rotation[original_key];
                shuffled_data.tgt_angle[new_key] = testing_data.tgt_angle[original_key];
                shuffled_data.tgt_distance[new_key] = testing_data.tgt_distance ? testing_data.tgt_distance[original_key] : null;
                shuffled_data.between_blocks[new_key] = testing_data.between_blocks[original_key];
                shuffled_data.target_jump[new_key] = testing_data.target_jump[original_key];
            } catch (error) {
                console.error(`Error copying data for trial ${original_index}:`, error);
                console.error(`Available keys in rotation:`, Object.keys(testing_data.rotation).slice(0, 10));
                return testing_data;
            }
            
            new_index++;
        }
    }
    
    // Debug: Verify the shuffling worked
    console.log("First few angles in shuffled order:");
    for (let i = 0; i < Math.min(16, numtrials); i++) {
        console.log(`Trial ${i}: angle ${shuffled_data.tgt_angle[i.toString()]}`);
    }
    
    return shuffled_data;
}

// Load and randomize data
function loadAndRandomizeData(participantId) {
    // Prevent double loading
    if (dataAlreadyLoaded && fileContent) {
        console.log("Data already loaded and randomized, returning cached version");
        return Promise.resolve(fileContent);
    }
    return new Promise((resolve, reject) => {
        $.getJSON(fileName)
            .done(function(json) {
                console.log(`Successfully loaded template file: ${fileName}`);

                // Get participant's condition to determine block order
                const participantCondition = getConditionFromId(participantId);
                console.log('Shuffling blocks for participant:', participantId, 'Condition:', participantCondition);
                
                // Shuffle blocks for both conditions
                const randomizedJson = {
                    conditionA: {
                        training: json.conditionA.training, // Keep training the same
                        testing: json.conditionA.testing
                    },
                    conditionB: {
                        training: json.conditionB.training, // Keep training the same
                        testing: json.conditionB.testing
                    }
                };
                
                // Only shuffle the condition this participant will use
                if (participantCondition === 'A') {
                    randomizedJson.conditionA.testing = shuffleBlocks(json.conditionA.testing, participantId);
                    console.log("Shuffled conditionA testing data");
                } else {
                    randomizedJson.conditionB.testing = shuffleBlocks(json.conditionB.testing, participantId);
                    console.log("Shuffled conditionB testing data");
                }

                fileContent = randomizedJson;
                dataAlreadyLoaded = true; // *** THIS WAS MISSING! ***
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

// ==================================================
// Game components
// ==================================================
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

// ==================================================
// Setup for database saving
// ==================================================

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
  constructor(experiment_id, id) {
    super("trial");
    this.id = id;
    this.experiment_id = experiment_id;

    // Arrays to store data from all completed trials
    this.all_trials_basic_positions = [];    // Array of arrays: basic position data per trial
    this.all_trials_enhanced_positions = []; // Array of arrays: enhanced position data per trial
    this.blocks = [];                   // Trial metadata and results

    // Add these new fields
    this.start_x = [];
    this.start_y = [];
    this.screen_height = [];
    this.screen_width = [];
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
    basic_positions_array,
    enhanced_positions_array,
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

// ==================================================
// Saved start position and screen size for each trial before final push to database
// ==================================================
// Store copies of position data
    const basic_data_copy = [...basic_positions_array];
    const enhanced_data_copy = [...enhanced_positions_array];
    
    this.all_trials_basic_positions.push(basic_data_copy);    // ✅ Matches temp array naming
    this.all_trials_enhanced_positions.push(enhanced_data_copy); // ✅ Matches temp array naming

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

// ==================================================
// Validation for html elements
// ==================================================

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

// ==================================================
// Event listeners to handle initial page load
// ==================================================
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

// ==================================================
// Consent form validation setup
// ==================================================
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

// ==================================================
// Function to validate consent checkboxes
// ==================================================
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
  // Additional validation to ensure music_experience is not empty
  if (!music_experience) {
    alert("Please enter your music experience!");
    document.getElementById("music_experience").focus();
    return false;
}
  // Ensure it's a number and non-negative
  if (isNaN(music_experience)) {
    alert("Please enter a valid number for music experience!");
    document.getElementById("music_experience").focus();
    return false;
}

// ==================================================
// Create initial subject object - missing fields to be filled later
// ==================================================  

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

// ==================================================
// Assign condition
// ==================================================
  
  subject.condition = getConditionFromId(prolific_id);
  console.log("Participant assigned to condition:", subject.condition);

  // Also set the global variable if you need it elsewhere
  window.experiment_condition = subject.condition;

  // Load participant-specific data ONLY if not already loaded
    if (!dataAlreadyLoaded || !fileContent) {
        console.log("Loading and randomizing data for the first time...");
        loadAndRandomizeData(prolific_id)
            .then(function(data) {
                console.log("Participant data loaded and randomized successfully");
            })
            .catch(function(error) {
                console.error("Failed to load participant data:", error);
                alert("Error loading experiment data. Please refresh the page and try again, or contact the experimenter.");
            });
    } else {
        console.log("Data already loaded and randomized, skipping reload");
    }

  // ==================================================
  // HEADPHONE CHECK
  // ==================================================
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

// ==================================================
// PRE-EXPERIMENT INSTRUCTIONS
// ==================================================
function showPreExperimentInstructions() {
  // Turn on/off at the top of this code (approx line 22)
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
          message: 'The training includes 4 auditory targets -- and there are 8 targets in total!',
      },
      'B': {
          message: 'The training includes 4 auditory targets -- and there are 8 targets in total!',
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

// ==================================================
// START EXPERIMENT
// ==================================================
function startExperiment() {
  console.log("startExperiment called, disableFullScreen:", disableFullScreen);
  
  // CRITICAL: Hide the pre-experiment container first
  const preExpContainer = document.getElementById('container-pre-experiment');
  if (preExpContainer) {
    preExpContainer.style.display = 'none';
    console.log("Pre-experiment container hidden");
  }
  
  // Clear any content from the pre-experiment instructions div
  const preExpInstructions = document.getElementById('condition-specific-instructions');
  if (preExpInstructions) {
    preExpInstructions.innerHTML = '';
    console.log("Pre-experiment instructions cleared");
  }
  
  // Enter full screen if not disabled
  if (!disableFullScreen) {
    console.log("Attempting to enter full screen");
    openFullScreen();
  } else {
    console.log("Full screen disabled");
  }
  
  console.log("Starting game with subject data:", subject);

  // IMPORTANT: Show the experiment container first, then start the game
  show('container-exp');
  
  // Small delay to ensure proper page transition
  setTimeout(() => {
    startGame();
  }, 100);

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

// Object used track subject data (uploaded to database)
let subject; // : Subject

// Enhanced Movement Analysis Integration - Global Variables
let current_trial_enhanced_positions = []; // Enhanced data with velocity, acceleration, etc.
let trial_analytics = []; // Store analysis results for each trial

// ==================================================
// FIREBASE INITIALIZATION CHECK
// ==================================================
try {
  let app = firebase.app();
  console.log("✅ Firebase initialized successfully");
} catch (e) {
  console.error(e);
  console.error("❌ Firebase initialization failed:", e);
}

// Initialize Firebase
// Setting up firebase variables
const firestore = firebase.firestore(); // (a.k.a.) db
const firebase_storage = firebase.storage();
const subject_collection = firestore.collection("Subjects");
const trial_collection = firestore.collection("Trials");

// ==================================================
// PRODUCTION CONFIGURATION
// ==================================================

// Define PRODUCTION_CONFIG first
const PRODUCTION_CONFIG = {
    // Security settings
    REQUIRE_AUTHENTICATION: false,
    USE_ANONYMOUS_AUTH: true,  // Set to true to allow anonymous sign-in w/o user accounts
    VALIDATE_PARTICIPANT_ID: true,
    
    // Upload settings (will be overridden below)
    MAX_FILE_SIZE_MB: 50,
    ALLOWED_FILE_TYPES: ['application/json'],
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY_MS: 2000,
    
    // Data validation
    VALIDATE_DATA_STRUCTURE: true, // Check data format before saving
    REQUIRE_MINIMUM_TRIALS: 10, // Need at least 80 trials for valid dataset, set to 10 for testing
    
    // Logging
    ENABLE_DETAILED_LOGGING: true, // Show detailed console messages
    LOG_UPLOAD_PROGRESS: true // Show upload progress to participants
};

// Now override with your specific settings
Object.assign(PRODUCTION_CONFIG, {
    // Adjust these based on study requirements
    MAX_FILE_SIZE_MB: 1000,  // Increase if you have lots of movement data
    REQUIRE_MINIMUM_TRIALS: 10,  // Adjust based on your experiment design
    RETRY_ATTEMPTS: 5,  // More retries for production reliability
    
    // Enable detailed logging for initial deployment
    ENABLE_DETAILED_LOGGING: true,
    LOG_UPLOAD_PROGRESS: true
});

console.log("🏭 Production configuration loaded:", PRODUCTION_CONFIG);

// ==================================================
// AUTHENTICATION MANAGER
// ==================================================
class AuthenticationManager {
    constructor() {
        this.isAuthenticated = false,  // Track if user is logged in
        this.currentUser = null,       // Store user info
        this.authPromise = null;       // Prevent multiple auth attempts
    }

    async ensureAuthenticated() {
        if (this.isAuthenticated && this.currentUser) {
            return this.currentUser; // Already logged in, return immediately
        }

        if (this.authPromise) {
            return this.authPromise; // Authentication in progress, wait for it
        }

        this.authPromise = this._performAuthentication(); // Start authentication process
        return this.authPromise;
    }

    async _performAuthentication() {
    try {
        console.log("🔐 Starting authentication process...");
        console.log("🔐 Current config:", {
            REQUIRE_AUTHENTICATION: PRODUCTION_CONFIG.REQUIRE_AUTHENTICATION,
            USE_ANONYMOUS_AUTH: PRODUCTION_CONFIG.USE_ANONYMOUS_AUTH
        });

        // Check if already authenticated
        const currentUser = firebase.auth().currentUser;
        console.log("🔐 Current user check:", currentUser);
        
        if (currentUser) {
            console.log("✅ Already authenticated:", currentUser.uid);
            console.log("🔐 User details:", {
                uid: currentUser.uid,
                isAnonymous: currentUser.isAnonymous,
                providerData: currentUser.providerData
            });
            this.isAuthenticated = true;
            this.currentUser = currentUser;
            return currentUser;
        }

        // Wait for auth state to be determined
        console.log("🔐 Waiting for auth state...");
        const user = await new Promise((resolve, reject) => {
            const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
                console.log("🔐 Auth state changed:", user);
                unsubscribe();
                resolve(user);
            });
        });

        if (user) {
            console.log("✅ User already signed in:", user.uid);
            this.isAuthenticated = true;
            this.currentUser = user;
            return user;
        }

        // Sign in anonymously for research studies
        if (PRODUCTION_CONFIG.USE_ANONYMOUS_AUTH) {
            console.log("🔐 Signing in anonymously...");
            console.log("🔐 Firebase auth available:", !!firebase.auth);
            console.log("🔐 signInAnonymously method:", !!firebase.auth().signInAnonymously);
            
            const userCredential = await firebase.auth().signInAnonymously();
            const newUser = userCredential.user;
            
            console.log("✅ Anonymous authentication successful!");
            console.log("🔐 New user details:", {
                uid: newUser.uid,
                isAnonymous: newUser.isAnonymous,
                providerData: newUser.providerData
            });
            
            this.isAuthenticated = true;
            this.currentUser = newUser;
            return newUser;
        }

        throw new Error("Authentication required but no method available");

    } catch (error) {
        console.error("❌ Authentication failed:", error);
        console.error("🔐 Error details:", {
            code: error.code,
            message: error.message,
            stack: error.stack
        });
        this.isAuthenticated = false;
        this.currentUser = null;
        this.authPromise = null;
        throw new Error(`Authentication failed: ${error.message}`);
    }
}

    getUser() {
        return this.currentUser;
    }

    isUserAuthenticated() {
        return this.isAuthenticated && this.currentUser;
    }
}

// ==================================================
// DATA VALIDATOR
// ==================================================
class DataValidator {
    static validateDataset(dataset) {
        const errors = [];

        // Basic structure validation
        if (!dataset || typeof dataset !== 'object') {
            errors.push("Dataset is not a valid object");
            return { isValid: false, errors };
        }

        // Participant validation
        if (!dataset.participant || !dataset.participant.id) {
            errors.push("Missing participant information");
        }

        // Experiment validation
        if (!dataset.experiment || !dataset.experiment.id) {
            errors.push("Missing experiment information");
        }

        // Trials validation
        if (!dataset.trials || !Array.isArray(dataset.trials)) {
            errors.push("Missing or invalid trials data");
        } else if (dataset.trials.length < PRODUCTION_CONFIG.REQUIRE_MINIMUM_TRIALS) {
            errors.push(`Insufficient trials: ${dataset.trials.length} < ${PRODUCTION_CONFIG.REQUIRE_MINIMUM_TRIALS}`);
        }

        return {
            isValid: errors.length === 0,
            errors,
            warnings: []
        };
    }

    static validateParticipantId(participantId) {
        if (!participantId || typeof participantId !== 'string') {
            return { isValid: false, error: "Participant ID must be a non-empty string" };
        }

        if (participantId.length < 3) {
            return { isValid: false, error: "Participant ID too short" };
        }

        if (participantId.length > 50) {
            return { isValid: false, error: "Participant ID too long" };
        }

        return { isValid: true };
    }
}

// ==================================================
// SECURE STORAGE MANAGER
// ==================================================
class SecureStorageManager {
    constructor() {
        this.authManager = new AuthenticationManager();
    }

    async uploadDataset(dataset, participantId) {
        const uploadId = this._generateUploadId();
        
        try {
            console.log(`🚀 [${uploadId}] Starting secure dataset upload`);

            // 1. Validate inputs
            await this._validateInputs(dataset, participantId);

            // 2. Ensure authentication
            const user = await this.authManager.ensureAuthenticated();
            console.log(`🔐 [${uploadId}] Authenticated as: ${user.uid}`);

            // 3. Prepare upload
            const uploadData = await this._prepareUpload(dataset, participantId, user.uid, uploadId);

            // 4. Execute upload with retry logic
            const result = await this._executeUploadWithRetry(uploadData, uploadId);

            console.log(`✅ [${uploadId}] Upload completed successfully`);
            return result;

        } catch (error) {
            console.error(`❌ [${uploadId}] Upload failed:`, error);
            throw new Error(`Upload failed: ${error.message}`);
        }
    }

    async _validateInputs(dataset, participantId) {
        // Validate participant ID
        const participantValidation = DataValidator.validateParticipantId(participantId);
        if (!participantValidation.isValid) {
            throw new Error(`Invalid participant ID: ${participantValidation.error}`);
        }

        // Validate dataset structure
        if (PRODUCTION_CONFIG.VALIDATE_DATA_STRUCTURE) {
            const datasetValidation = DataValidator.validateDataset(dataset);
            if (!datasetValidation.isValid) {
                console.warn("Dataset validation warnings:", datasetValidation.errors);
                // Don't throw for warnings in production, just log them
            }
        }
    }

    async _prepareUpload(dataset, participantId, userId, uploadId) {
        // Add production metadata
        const enhancedDataset = {
            ...dataset,
            production_metadata: {
                upload_id: uploadId,
                upload_timestamp: new Date().toISOString(),
                authenticated_user: userId,
                validation_passed: true,
                production_version: "v1.0",
                client_metadata: {
                    user_agent: navigator.userAgent,
                    screen_resolution: `${screen.width}x${screen.height}`,
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                    language: navigator.language
                }
            }
        };

        // Generate secure filename
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const dateStr = new Date().toISOString().split('T')[0];
        const filename = `production_datasets/${dateStr}/${participantId}_${uploadId}_${timestamp}.json`;

        // Convert to JSON and validate size
        const jsonData = JSON.stringify(enhancedDataset, null, 2);
        const sizeMB = jsonData.length / (1024 * 1024);

        if (sizeMB > PRODUCTION_CONFIG.MAX_FILE_SIZE_MB) {
            throw new Error(`Dataset too large: ${sizeMB.toFixed(2)}MB > ${PRODUCTION_CONFIG.MAX_FILE_SIZE_MB}MB`);
        }

        // Create blob with proper content type
        const blob = new Blob([jsonData], {
            type: 'application/json; charset=utf-8'
        });

        // Prepare metadata
        const metadata = {
            contentType: 'application/json',
            customMetadata: {
                participant_id: participantId,
                upload_id: uploadId,
                authenticated_user: userId,
                experiment_condition: enhancedDataset.participant?.condition || 'unknown',
                trial_count: (enhancedDataset.trials?.length || 0).toString(),
                movement_samples: (enhancedDataset.metadata?.total_movement_samples || 0).toString(),
                upload_timestamp: new Date().toISOString(),
                production_upload: 'true'
            }
        };

        return {
            filename,
            blob,
            metadata,
            sizeMB,
            enhancedDataset
        };
    }

    async _executeUploadWithRetry(uploadData, uploadId) {
        const { filename, blob, metadata, sizeMB } = uploadData;
        let lastError;

        for (let attempt = 1; attempt <= PRODUCTION_CONFIG.RETRY_ATTEMPTS; attempt++) {
            try {
                console.log(`📤 [${uploadId}] Upload attempt ${attempt}/${PRODUCTION_CONFIG.RETRY_ATTEMPTS}`);
                console.log(`📁 File: ${filename} (${sizeMB.toFixed(2)} MB)`);

                const result = await this._performUpload(filename, blob, metadata, uploadId);
                
                console.log(`✅ [${uploadId}] Upload successful on attempt ${attempt}`);
                return result;

            } catch (error) {
                lastError = error;
                console.error(`❌ [${uploadId}] Attempt ${attempt} failed:`, error.message);

                // Don't retry on certain errors
                if (this._isNonRetryableError(error)) {
                    console.error(`🚫 [${uploadId}] Non-retryable error, not retrying`);
                    throw error;
                }

                // Wait before retry (except on last attempt)
                if (attempt < PRODUCTION_CONFIG.RETRY_ATTEMPTS) {
                    const delay = PRODUCTION_CONFIG.RETRY_DELAY_MS * attempt;
                    console.log(`⏳ [${uploadId}] Waiting ${delay}ms before retry...`);
                    await this._sleep(delay);
                }
            }
        }

        throw new Error(`Upload failed after ${PRODUCTION_CONFIG.RETRY_ATTEMPTS} attempts. Last error: ${lastError.message}`);
    }

    async _performUpload(filename, blob, metadata, uploadId) {
        const storageRef = firebase_storage.ref();
        const fileRef = storageRef.child(filename);

        return new Promise((resolve, reject) => {
            const uploadTask = fileRef.put(blob, metadata);

            uploadTask.on('state_changed',
                // Progress callback
                (snapshot) => {
                    if (PRODUCTION_CONFIG.LOG_UPLOAD_PROGRESS) {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        if (progress % 25 < 1) { // Log every 25%
                            console.log(`📊 [${uploadId}] Progress: ${progress.toFixed(1)}%`);
                        }
                    }
                },
                // Error callback
                (error) => {
                    console.error(`❌ [${uploadId}] Upload error:`, error);
                    reject(error);
                },
                // Success callback
                async () => {
                    try {
                        resolve({
                            filename,
                            storage_path: filename,
                            size_bytes: blob.size,
                            size_mb: blob.size / (1024 * 1024),
                            upload_time: new Date().toISOString(),
                            upload_id: uploadId,
                            authenticated_user: this.authManager.getUser()?.uid
                        });
                    } catch (urlError) {
                        reject(urlError);
                    }
                }
            );
        });
    }

    _isNonRetryableError(error) {
        const nonRetryableCodes = [
            'storage/unauthorized',
            'storage/unauthenticated',
            'storage/invalid-format',
            'storage/no-default-bucket'
        ];
        
        return nonRetryableCodes.includes(error.code);
    }

    _generateUploadId() {
        return `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    _sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// ==================================================
// PRODUCTION DATA MANAGER
// ==================================================
class ProductionDataManager {
    constructor() {
        this.storageManager = new SecureStorageManager();
    }
    async saveExperimentData(subject, subjTrials, enhanced_data = {}) {
        try {
            console.log("🏭 Starting production data save...");

            // Validate essential inputs
            if (!subject || !subject.id) {
                throw new Error("Invalid subject data");
            }

            if (!subjTrials || !subjTrials.blocks) {
                throw new Error("Invalid trial data");
            }

            // Build production-ready dataset with ALL data (no reduction)
            const dataset = this._buildProductionDataset(subject, subjTrials, enhanced_data);

            // Upload to secure storage
            const uploadResult = await this.storageManager.uploadDataset(dataset, subject.id);

            console.log("🎉 Production data save completed successfully!");
            return uploadResult;

        } catch (error) {
            console.error("❌ Production data save failed:", error);
            throw error;
        }
    }

    _buildProductionDataset(subject, subjTrials, enhanced_data) {
        const now = new Date();
        
        return {
            // Participant information
            participant: {
                id: subject.id,
                age: subject.age || "",
                gender: subject.gender || "",
                handedness: subject.handedness || "",
                mouse_type: subject.mouse_type || "",
                returner: subject.returner || "",
                ethnicity: subject.ethnicity || "",
                race: subject.race || "",
                music_experience: subject.music_experience || "",
                language_count: subject.language_count || "",
                music_instrument: subject.music_instrument || "",
                music_practice: subject.music_practice || "",
                comments: subject.comments || "",
                distractions: subject.distractions || [],
                distracto: subject.distracto || "",
                condition: subject.condition || "unknown"
            },

            // Experiment metadata
            experiment: {
                id: subjTrials.experiment_id || `AudioMotor_${subject.condition}`,
                condition: subject.condition || "unknown",
                target_file: fileName || "",
                data_collection_time: now.toISOString(),
                screen_dimensions: {
                    width: window.screen_width || self.innerWidth,
                    height: window.screen_height || self.innerHeight,
                    center_x: window.center?.x || (self.innerWidth / 2),
                    center_y: window.center?.y || (self.innerHeight / 2),
                    target_distance: window.tgt_distance,
                    square_bounds: {
                        left: window.squareLeft,
                        top: window.squareTop,
                        size: window.squareSize
                    }
                },
                data_format_version: "production_v1.0",
                browser_info: {
                    user_agent: navigator.userAgent,
                    platform: navigator.platform,
                    language: navigator.language
                }
            },

            // Complete trial data with ALL movement samples (NO REDUCTION)
            trials: this._buildTrialData(subjTrials),

            // Enhanced analytics if available
            enhanced_analytics: enhanced_data.trial_analytics || null,

            // Raw enhanced hand positions (FULL RESOLUTION)
            raw_current_trial_enhanced_positions: enhanced_data.current_trial_enhanced_positions || [],

            // Metadata
            metadata: {
                numtrials: subjTrials.blocks?.length || 0,
                total_movement_samples: this._calculateTotalSamples(subjTrials),
                total_enhanced_samples: enhanced_data.current_trial_enhanced_positions?.length || 0,
                file_created: now.toISOString(),
                production_build: true,
                data_validated: true,
                data_reduction_applied: "NONE", // Critical: No data reduction!
                storage_strategy: "all_data_full_resolution"
            }
        };
    }

    _buildTrialData(subjTrials) {
        if (!subjTrials.blocks) return [];

        return subjTrials.blocks.map((block, index) => ({
            // Basic trial info
            trial_number: block.trial_num ?? index + 1,
            current_date: block.current_date || new Date().toISOString(),
            target_angle: block.target_angle ?? 0,
            rotation: block.rotation ?? 0,
            hand_fb_angle: block.hand_fb_angle ?? 0,
            reaction_time: block.reaction_time ?? 0,
            movement_time: block.movement_time ?? 0,
            search_time: block.search_time ?? 0,
            reach_feedback: block.reach_feedback || "unknown",

            // ✅ FIXED: Use the correct property names
        movement_data: {
            basic_positions: subjTrials.all_trials_basic_positions?.[index] || [],
            enhanced_positions: subjTrials.all_trials_enhanced_positions?.[index] || [],
            total_samples: subjTrials.all_trials_enhanced_positions?.[index]?.length || 0,
            duration_ms: this._calculateTrialDuration(subjTrials.all_trials_enhanced_positions?.[index])
        },

            // Screen position data
            start_position: {
                x: subjTrials.start_x?.[index] || window.center?.x,
                y: subjTrials.start_y?.[index] || window.center?.y
            },

            // Screen dimensions for this trial
            screen_dimensions: {
                height: subjTrials.screen_height?.[index] || window.screen_height,
                width: subjTrials.screen_width?.[index] || window.screen_width
            },

            // Analytics if available
            analytics: block.path_analysis || null,

            // Experimental parameters
            experimental_params: {
                target_jump: window.target_jump ? window.target_jump[index] : null,
                between_blocks: window.between_blocks ? window.between_blocks[index] : null,
                rotation_applied: window.rotation ? window.rotation[index] : null,
                target_angle_original: window.tgt_angle ? window.tgt_angle[index] : null
            }
        }));
    }

    _calculateTotalSamples(subjTrials) {
        if (!subjTrials.hand_path) return 0;
        
        return subjTrials.hand_path.reduce((total, path) => {
            return total + (Array.isArray(path) ? path.length : 0);
        }, 0);
    }

    _calculateTrialDuration(hand_path) {
        if (!hand_path || hand_path.length < 2) return 0;
        return hand_path[hand_path.length - 1].time - hand_path[0].time;
    }
}

// ==================================================
// PRODUCTION ERROR HANDLER
// ==================================================
class ProductionErrorHandler {
    static handleUploadError(error, participantId) {
        console.error("🚨 PRODUCTION UPLOAD ERROR:", error);

        let userMessage = "An error occurred while saving your data. ";
        let technicalMessage = error.message;

        // Provide specific guidance based on error type
        if (error.message.includes('Authentication failed')) {
            userMessage += "Please refresh the page and try again.";
            technicalMessage = "Authentication error - check Firebase config";
        } else if (error.message.includes('storage/unauthorized')) {
            userMessage += "Permission denied. Please contact the experimenter.";
            technicalMessage = "Storage rules deny access - check Firebase Storage rules";
        } else if (error.message.includes('storage/quota-exceeded')) {
            userMessage += "Storage limit reached. Please contact the experimenter.";
            technicalMessage = "Storage quota exceeded";
        } else if (error.message.includes('Network error')) {
            userMessage += "Network error. Please check your connection and try again.";
            technicalMessage = "Network connectivity issue";
        } else {
            userMessage += "Please contact the experimenter with your participant ID.";
        }

        // Log for debugging
        console.error("Error details for support:", {
            participant_id: participantId,
            error_message: error.message,
            error_code: error.code,
            timestamp: new Date().toISOString(),
            user_agent: navigator.userAgent
        });

        return {
            userMessage: `${userMessage}\n\nParticipant ID: ${participantId}`,
            technicalMessage,
            shouldRetry: !error.message.includes('unauthorized') && 
                         !error.message.includes('quota-exceeded')
        };
    }
}

// Make classes available globally
window.ProductionDataManager = ProductionDataManager;
window.ProductionErrorHandler = ProductionErrorHandler;
window.AuthenticationManager = AuthenticationManager;

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
  console.log("startGame called");
  // verify we have necessary data
  if (!fileContent) {
        console.error("No file content loaded, attempting to load...");
        if (subject && subject.id) {
            return loadAndRandomizeData(subject.id)
              .then(function(data) {
                console.log("Data loaded successfully, starting game");
                gameSetup(data);
              })
              .catch(function(error) {
                console.error("Failed to load data:", error);
                alert("Experiment data not loaded. Please refresh the page.");
              });
        } else {
            alert("Participant ID not available. Please refresh the page.");
        }
        return;
    }

    // If we have fileContent, proceed with gameSetup
    console.log(`Starting game with file: ${fileName}`);
    gameSetup(fileContent);
  }

function createGameCircles(handler, center, tgt_distance) {
  const calibration = new Circle(
    handler,
    center,
    Math.round(tgt_distance * 4.5 / 80.0),
    "none",
    "white"
  );

  const target = new Circle(
    handler,
    center,
    Math.round(tgt_distance * 4.5 / 80.0),
    "blue",
    "none"
  );

  const cursor = new Circle(
    handler,
    center,
    Math.round(tgt_distance * 1.75 * 1.5 / 80.0),
    "white",
    "none"
  );

  return { calibration, target, cursor };
}

function monitorWindow(_event) {
  const curr_size = self.innerHeight * self.innerWidth;
  if (prev_screen_size > curr_size) {
    alert(
      "Please enter full screen and click your mouse to continue the experiment! (Shortcut for Mac users: Command + Control + F. Shortcut for PC users: F11) ",
    );
  }
  prev_screen_size = curr_size;
}

// ==================================================
// Enhanced Movement Analysis Helper Functions - globally accessible
// ==================================================
// Analyze behavior in a window
function analyzeBehaviorWindow(positions) {
    if (positions.length === 0) return { strategy: 'unknown', confidence: 0 };
    
    const avg_velocity = positions.reduce((sum, pos) => sum + (pos.velocity || 0), 0) / positions.length;
    const avg_acceleration = positions.reduce((sum, pos) => sum + Math.abs(pos.acceleration || 0), 0) / positions.length;
    
    // Simple strategy classification
    let strategy = 'systematic';
    if (avg_velocity > 100 && avg_acceleration > 200) {
        strategy = 'exploratory';
    } else if (avg_velocity < 50) {
        strategy = 'deliberate';
    }
    
    return {
        strategy: strategy,
        avg_velocity: avg_velocity,
        avg_acceleration: avg_acceleration,
        confidence: Math.min(1.0, positions.length / 5) // More confidence with more data
    };
}

// Detect strategy shifts
function detectStrategyShift(behavior1, behavior2) {
    return behavior1.strategy !== behavior2.strategy && 
           behavior1.confidence > 0.5 && 
           behavior2.confidence > 0.5;
}

// Calculate shift confidence
function calculateShiftConfidence(behavior1, behavior2) {
    const velocity_diff = Math.abs(behavior1.avg_velocity - behavior2.avg_velocity);
    const acceleration_diff = Math.abs(behavior1.avg_acceleration - behavior2.avg_acceleration);
    
    // Normalize and combine differences
    const normalized_vel_diff = Math.min(1.0, velocity_diff / 100);
    const normalized_acc_diff = Math.min(1.0, acceleration_diff / 500);
    
    return (normalized_vel_diff + normalized_acc_diff) / 2;
}

// Helper function to determine quadrant
function getQuadrant(pos) {
    const centerX = window.center.x;
    const centerY = window.center.y;
    
    if (pos.x >= centerX && pos.y <= centerY) return 1; // Top-right
    if (pos.x < centerX && pos.y <= centerY) return 2;  // Top-left
    if (pos.x < centerX && pos.y > centerY) return 3;   // Bottom-left
    return 4; // Bottom-right
}

// Enhanced velocity calculation
function getVelocity(pos1, pos2, timeDiff) {
    if (!pos1 || !pos2 || timeDiff <= 0) return 0;
    
    const distance = Math.sqrt(
        Math.pow(pos2.x - pos1.x, 2) + 
        Math.pow(pos2.y - pos1.y, 2)
    );
    return distance / (timeDiff / 1000); // pixels per second
}

// Enhanced acceleration calculation
function calculateAcceleration(pos1, pos2, pos3) {
    if (!pos1 || !pos2 || !pos3) return 0;
    
    const time_diff1 = (pos2.time - pos1.time) / 1000;
    const time_diff2 = (pos3.time - pos2.time) / 1000;
    
    if (time_diff1 <= 0 || time_diff2 <= 0) return 0;
    
    const vel1 = getVelocity(pos1, pos2, pos2.time - pos1.time);
    const vel2 = getVelocity(pos2, pos3, pos3.time - pos2.time);
    
    const avg_time_diff = (time_diff1 + time_diff2) / 2;
    return (vel2 - vel1) / avg_time_diff;
}


// Calculate pause duration
function calculatePauseDuration(current_trial_enhanced_positions, start_index) {
    let duration = 0;
    const velocity_threshold = 50;
    
    for (let i = start_index; i < current_trial_enhanced_positions.length; i++) {
        if (current_trial_enhanced_positions[i].velocity >= velocity_threshold) {
            break;
        }
        if (i > start_index) {
            duration += current_trial_enhanced_positions[i].time - current_trial_enhanced_positions[i-1].time;
        }
    }
    return duration;
}

// Get movement angle between two points
function getMovementAngle(pos1, pos2) {
    if (!pos1 || !pos2) return 0;
    return Math.atan2(pos2.y - pos1.y, pos2.x - pos1.x) * (180 / Math.PI);
}

function detect_pauses(current_trial_enhanced_positions) {
    const pauses = [];
    const velocity_threshold = 50; // pixels per second
    const min_pause_duration = 100; // milliseconds
    
    let pause_start = null;
    
    for (let i = 0; i < current_trial_enhanced_positions.length; i++) {
        const pos = current_trial_enhanced_positions[i];
        const velocity = pos.velocity || 0;
        
        if (velocity < velocity_threshold) {
            // Starting a potential pause
            if (pause_start === null) {
                pause_start = i;
            }
        } else {
            // End of pause (if there was one)
            if (pause_start !== null) {
                const duration = current_trial_enhanced_positions[i].time - current_trial_enhanced_positions[pause_start].time;
                if (duration >= min_pause_duration) {
                    pauses.push({
                        start_index: pause_start,
                        end_index: i - 1,
                        duration: duration,
                        start_time: current_trial_enhanced_positions[pause_start].time,
                        end_time: current_trial_enhanced_positions[i - 1].time
                    });
                }
                pause_start = null;
            }
        }
    }
    
    // Check if we ended in a pause
    if (pause_start !== null && current_trial_enhanced_positions.length > pause_start + 1) {
        const duration = current_trial_enhanced_positions[current_trial_enhanced_positions.length - 1].time - current_trial_enhanced_positions[pause_start].time;
        if (duration >= min_pause_duration) {
            pauses.push({
                start_index: pause_start,
                end_index: current_trial_enhanced_positions.length - 1,
                duration: duration,
                start_time: current_trial_enhanced_positions[pause_start].time,
                end_time: current_trial_enhanced_positions[current_trial_enhanced_positions.length - 1].time
            });
        }
    }
    
    return pauses;
}

// Function to detect direction changes
function detect_direction_changes(current_trial_enhanced_positions) {
    if (current_trial_enhanced_positions.length < 3) return [];
    
    const direction_changes = [];
    const angle_threshold = 45; // degrees
    
    for (let i = 1; i < current_trial_enhanced_positions.length - 1; i++) {
        const prev = current_trial_enhanced_positions[i - 1];
        const curr = current_trial_enhanced_positions[i];
        const next = current_trial_enhanced_positions[i + 1];
        
        // Calculate direction vectors
        const dir1 = {
            x: curr.x - prev.x,
            y: curr.y - prev.y
        };
        
        const dir2 = {
            x: next.x - curr.x,
            y: next.y - curr.y
        };
        
        // Calculate angle between directions
        const angle1 = Math.atan2(dir1.y, dir1.x);
        const angle2 = Math.atan2(dir2.y, dir2.x);
        
        let angle_diff = Math.abs(angle2 - angle1) * (180 / Math.PI);
        
        // Normalize angle difference to 0-180 range
        if (angle_diff > 180) {
            angle_diff = 360 - angle_diff;
        }
        
        // If angle change is significant, record it as a direction change
        if (angle_diff > angle_threshold) {
            direction_changes.push({
                index: i,
                time: curr.time,
                angle_change: angle_diff,
                position: { x: curr.x, y: curr.y }
            });
        }
    }
    
    return direction_changes;
}


// ==================================================
// GLOBAL GAME STATE VARIABLES
// ==================================================

// Game state variables
let numtrials = 0;
let experiment_condition = 'A';
let rotation = {};
let tgt_angle = {};
let between_blocks = {};
let target_jump = {};
let trial_order = [];
let is_phase_2 = false;
let current_trial_basic_positions = [];    // Basic x, y, time data for current trial
let trial = 0;

// Circle objects
let calibration = null;
let target = null;
let cursor = null;

// Timer variables
let movement_timeout = null;
let hold_timer = null;
let green_timer = null;
let stop_target_music_timer = null;
let target_display_timer = null;
let too_slow_timer = null;
let game_phase = -1;
let reach_feedback = "";
let play_sound = true;
let begin = new Date();

// Other variables
let bb_mess = 0; // Initialize to 0, will be set properly in gameSetup
let prev_screen_size = 0; // Initialize to 0, will be set properly in gameSetup
let hand_fb_angle = 0;
let reaction_time = 0;
let movement_time = 0;
let search_time = 0;

// Audio object
var musicBox;

// Game data objects
let subjTrials = null;

// ==================================================
// GLOBAL TIMING VARIABLES
// ==================================================
// length of time feedback remains on screen (ms)
const feedback_time = 50; 
// length of "too slow" feedback (ms)
const feedback_time_slow = 1500; 
// length of time users must hold in start before next trial (ms)
const hold_time = 500; 
// length of time the start circle in holding phase will turn to green (ms)
const green_time = 1000; 
// Parameters and display for when users take too long to locate the center (ms)
const search_too_slow = 3000;
// Setting up parameters and display when reach is too slow (ms) 
const too_slow_time = 5000; 

// ==================================================
// GLOBAL BETWEEN BLOCK MESSAGES
// ==================================================
const messages = [
  [
    // bb_mess == 0 - unused currently
    "Way to go! Press any key to continue."
  ],
  [
    // bb_mess == 1
    "Yes! Remember to listen carefully!",
    "Press 'b' to proceed.",
  ],
  [
    // bb_mess == 2
    "Phase 2:", 
    "The instrument will now play a sound,",
    "and then you have 5 seconds to find and mimic what you heard.",  
    "There are 8 auditory targets.",
    "Listen carefully, accuracy is important!",

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

// ==================================================
// UPDATE CURSOR FUNCTION
// ==================================================
/********************
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

  // ENHANCED ADDITIONS: Enhanced movement data collection
  if (game_phase === Phase.MOVING) {
      const currentTime = new Date() - begin;
      const current_pos = {
          time: currentTime,
          x: cursor.point.x,
          y: cursor.point.y
      };

      // Calculate velocity if we have previous positions
      if (current_trial_enhanced_positions.length > 0) {
          const lastPos = current_trial_enhanced_positions[current_trial_enhanced_positions.length - 1];
          const timeDiff = currentTime - lastPos.time;
          current_pos.velocity = getVelocity(lastPos, current_pos, timeDiff);
      } else {
          current_pos.velocity = 0;
      }

      // Calculate acceleration if we have 2+ previous positions
      if (current_trial_enhanced_positions.length >= 2) {
          const lastPos = current_trial_enhanced_positions[current_trial_enhanced_positions.length - 1];
          const secondLastPos = current_trial_enhanced_positions[current_trial_enhanced_positions.length - 2];
          current_pos.acceleration = calculateAcceleration(secondLastPos, lastPos, current_pos);
      } else {
          current_pos.acceleration = 0;
      }

      // Detect pauses (low velocity)
      current_pos.isPause = current_pos.velocity < 50;

      // Track which quadrant we're in
      current_pos.quadrant = getQuadrant(current_pos);

      // Store current sound parameters
      const point = cursor.point;
      if (point.x >= window.squareLeft && point.x <= window.squareLeft + window.squareSize &&
          point.y >= window.squareTop && point.y <= window.squareTop + window.squareSize) {
          const { f1, f2, _vowel } = getVowelFormants(point.x, window.squareLeft, window.squareSize);
          const y_proportion = 1 - (point.y - window.squareTop) / window.squareSize;
          const pitch = (350 - 80) * (Math.pow(2, y_proportion) - 1) + 80;
          
          current_pos.soundParams = { f1, f2, pitch, vowel: _vowel };
      }

      // Distance from target
      if (window.tgt_angle && window.tgt_distance) {
          const targetAngle = window.tgt_angle[trial] || 0;
          const targetX = window.center.x + window.tgt_distance * Math.cos(targetAngle * Math.PI / 180);
          const targetY = window.center.y - window.tgt_distance * Math.sin(targetAngle * Math.PI / 180);
          current_pos.distanceFromTarget = Math.sqrt(
              Math.pow(current_pos.x - targetX, 2) + 
              Math.pow(current_pos.y - targetY, 2)
          );
      }

      current_trial_enhanced_positions.push(current_pos);
  }
  // END OF ENHANCED ADDITIONS

  // Distance between cursor and start
  const distance = Math.sqrt(
      Math.pow(calibration.point.x - cursor.point.x, 2.0) +
      Math.pow(calibration.point.y - cursor.point.y, 2.0)
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
          // record mouse data - KEEP YOUR EXISTING current_trial_basic_positions FOR COMPATIBILITY
          current_trial_basic_positions.push({ time: new Date() - begin, x: cursor.point.x, y: cursor.point.y });

          // Check if cursor is within the red square
          if (
              point.x >= window.squareLeft &&
              point.x <= window.squareLeft + window.squareSize &&
              point.y >= window.squareTop &&
              point.y <= window.squareTop + window.squareSize
          ) {
              console.log(`point ${JSON.stringify(point)}`);
              // generate value for vowel formants
              // CHANGE: Now getting vowel formants from x position instead of y
              const { f1, f2, _vowel } = getVowelFormants(
                  point.x, // changed from point.y to point.x
                  window.squareLeft, // changed from squareTop to squareLeft
                  window.squareSize,
              );
              const lo_pitch = 80;
              const hi_pitch = 350;

              // CHANGE: Now calculating pitch based on y position instead of x
              // top of square is higher pitch, bottom is lower pitch
              const y_proportion = 1 - (point.y - window.squareTop) / window.squareSize;
              const pitch =
                  (hi_pitch - lo_pitch) * (Math.pow(2, y_proportion) - 1) + lo_pitch;

              console.log(`f1:${f1} f2: ${f2} pitch: ${pitch} vowel:${_vowel}`);
              // update musicbox
              musicBox.update(pitch, f1, f2);
          } else {
              musicBox.pause();
          }

          // Move from moving to feedback phase once their reach intersects the target ring
          if (distance > window.tgt_distance * 0.95) {
              // stop audio
              musicBox.pause();
              fb_phase();
          }
          break;
  }
}

// ==================================================
// GLOBAL GAME PHASE FUNCTIONS - mostly controls what is being displayed
// ==================================================

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

  // if we want to delay the target display --> do it here
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

// Used to help interpolate start to end target points
function animate(update, duration, onfinish) {
  const start = performance.now();

  requestAnimationFrame(function animate(time) {
    let timeFraction = (time - start) / duration;
    if (timeFraction > 1) timeFraction = 1;
    update(timeFraction);

    if (timeFraction < 1) {
      // How have we not reach stackoverflow here - because calling itself recursively but asynchronously :) 
      requestAnimationFrame(animate);
    } else {
      // callback once we're done with animation
      onfinish();
    }
  });
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
// Function to play sound along a path from start to end over a duration
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

  // DEBUGGING
  console.log("=== SHOW_TARGETS DEBUG ===");
  console.log(`Current trial: ${trial}`);
  console.log(`window.target_jump exists: ${!!window.target_jump}`);
  console.log(`window.tgt_angle exists: ${!!window.tgt_angle}`);
  console.log(`window.rotation exists: ${!!window.rotation}`);
  console.log(`window.tgt_distance: ${window.tgt_distance}`);

  if (window.target_jump) {
    console.log(`target_jump[${trial}]: ${window.target_jump[trial]}`);
    console.log(`Available target_jump keys:`, Object.keys(window.target_jump).slice(0, 10));
  }
  if (window.tgt_angle) {
    console.log(`tgt_angle[${trial}]: ${window.tgt_angle[trial]}`);
    console.log(`Available tgt_angle keys:`, Object.keys(window.tgt_angle).slice(0, 10));
  }
  
  if (window.rotation) {
    console.log(`rotation[${trial}]: ${window.rotation[trial]}`);
    console.log(`Available rotation keys:`, Object.keys(window.rotation).slice(0, 10));
  }

  // Safety checks for trial data
  if (!window.target_jump || !window.tgt_angle || !window.rotation) {
    console.error("Trial data not properly loaded:", {
      target_jump: !!window.target_jump,
      tgt_angle: !!window.tgt_angle,
      rotation: !!window.rotation,
      current_trial: trial
    });
    alert("Trial data error. Please refresh the page.");
    return;
  }
  // Ensure trial index is valid and data exists
  if (trial >= (window.numtrials || window.numtrials || 0) || trial < 0) {
    console.error(`Invalid trial index: ${trial}, numtrials: ${window.numtrials || window.numtrials}`);
    alert("Trial index error. Please refresh the page.");
    return;
  }

  // Check if data exists for this specific trial
  if (typeof window.target_jump[trial] === 'undefined' || 
      typeof window.tgt_angle[trial] === 'undefined' || 
      typeof window.rotation[trial] === 'undefined') {
    console.error(`Missing trial data for trial ${trial}:`, {
      target_jump: window.target_jump[trial],
      tgt_angle: window.tgt_angle[trial],
      rotation: window.rotation[trial]
    });
    alert(`Trial data missing for trial ${trial}. Please refresh the page.`);
    return;
  }

  // If jump is 1.0, this means no variation was added to this target
  const jump = window.target_jump[trial];
  const angle = window.tgt_angle[trial];
  const rotation_val = window.rotation[trial];

  console.log(`Trial ${trial} data: jump=${jump}, angle=${angle}, rotation=${rotation_val}`);
  const mathAngle = normalizeAngleForMath(angle); // Convert 360→0 for math
  target.setFill("blue");

  // Calculate target position - do this first so we have start/end available
  const start = calibration.point;
  const offset = (jump == 1.0) ? rotation_val : jump;
  const value = mathAngle + offset; 
  
  // Validation for tgt_distance
  if (!window.tgt_distance || isNaN(window.tgt_distance)) {
    console.error("Invalid tgt_distance:", window.tgt_distance);
    alert("Screen setup error. Please refresh the page.");
    return;
  }
  
  // When calculating a point on a circle (or positioning a target at a certain angle and distance): 
  // Math.cos is used for the x-coordinate because cosine represents the horizontal component of movement along a circle. When an angle is 0 degrees, cosine is 1, placing the point at maximum x-distance. 
  // Math.sin is used for the y-coordinate because sine represents the vertical component of movement along a circle. When an angle is 90 degrees, sine is 1, placing the point at maximum y-distance.
  const x = start.x + window.tgt_distance * Math.cos(value * deg2rad);
  const y = start.y - window.tgt_distance * Math.sin(value * deg2rad); // y is negative because screen y increases downward
  // Create end point for sound demo
  const end = new Point(x, y);

  // FIXED: Validate calculated coordinates
  if (isNaN(x) || isNaN(y)) {
    console.error("Calculated invalid target coordinates:", {
      x: x,
      y: y,
      start: start,
      angle: angle,
      mathAngle: mathAngle,
      value: value,
      tgt_distance: window.tgt_distance,
      trial: trial
    });
    alert("Target position calculation error. Please refresh the page.");
    return;
  }
  
  // Log for debugging
  console.log(`Trial: ${trial}, Phase2: ${is_phase_2}, Target angle: ${angle}, Position: (${x}, ${y})`);

  // Update target position (but don't display it)
  target.update(x, y); 

  // In phase 2, we initially hide the target but play the sound demo
  if (is_phase_2) {
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
   console.log(`Phase 1: Showing blue target at (${x.toFixed(1)}, ${y.toFixed(1)})`);
    } else {
      console.log(`Phase 1: Target hidden (jump=${jump})`);
    }
  }

  // Turn start circle green after a second
  green_timer = setTimeout(function () {
    calibration.setFill("green");
    calibration.setStroke("none");
  }, green_time);

  game_phase = Phase.SHOW_TARGETS;
}

// ==================================================
// MOVING PHASE - functionality when users are reaching
// ==================================================
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
  
  // Record reaction time as time spent with target visible before moving
  reaction_time = new Date() - begin; 
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


// ==================================================
// GLOBAL GAME FUNCTIONS THAT MOVE THE GAME ALONG
// ==================================================
// // Function used to initiate the next trial after uploading reach data and subject data onto the database
// Cleans up all the variables and displays to set up for the next reach
function next_trial() {
  // ENHANCED: Analyze the trial that just completed
  const trial_analysis = analyzeTrialPath(current_trial_enhanced_positions);
  trial_analytics.push(trial_analysis);
  
  console.log(`Trial ${trial} analysis:`, trial_analysis);
  
  // Record data for the trial that was just completed
  subjTrials.appendTrialBlock(
      tgt_angle[trial],
      rotation[trial],
      hand_fb_angle,
      reaction_time,
      movement_time,
      search_time,
      reach_feedback,
      current_trial_basic_positions,    // ✅ Array of position objects from current trial
      current_trial_enhanced_positions  // ✅ Array of position objects from current trial
  );

  // ENHANCED: Add the enhanced analysis to the trial data
  if (subjTrials.blocks.length > 0) {
      const last_block = subjTrials.blocks[subjTrials.blocks.length - 1];
      last_block.path_analysis = trial_analysis;
  }

  // Screen dimensions
  subjTrials.start_x.push(center.x);
  subjTrials.start_y.push(center.y);
  subjTrials.screen_height.push(screen_height);
  subjTrials.screen_width.push(screen_width);

  // ENHANCED: Reset timing variables
  reaction_time = 0;
  movement_time = 0;
  search_time = 0;
  play_sound = true;
  current_trial_basic_positions = []; // Keep this for compatibility
  current_trial_enhanced_positions = []; // Reset enhanced positions

  // Number of completed trials so far
  const completedTrials = subjTrials.blocks.length;
  console.log(`Completed ${completedTrials} trials out of ${window.numtrials}`);
  
  // Update the trial counter display - show consecutive numbers
  d3.select("#trialcount").text(`Reach Number: ${completedTrials} / ${window.numtrials}`);
  
  // Check if we've completed all trials
  if (completedTrials >= window.numtrials) {
    console.log("All trials completed. Ending experiment.");
    end_trial();
    return;
  }
  
  // 🔍 DEBUG: Check what we have before setting bb_mess
  console.log("=== NEXT_TRIAL DEBUG ===");
  console.log("Current trial:", trial);
  console.log("between_blocks exists:", !!window.between_blocks);
  console.log("between_blocks[0]:", window.between_blocks[0]);
  console.log("between_blocks[1]:", window.between_blocks[1]);
  console.log("between_blocks keys:", Object.keys(window.between_blocks || {}));
  console.log("Available between_blocks values:", window.between_blocks);
  console.log("=== END NEXT_TRIAL DEBUG ===");

  // Get the between blocks message for the trial we just completed
  bb_mess = window.between_blocks[trial];

  // Debug the phase transition
  console.log(`Trial completed: ${trial}, Next bb_mess: ${bb_mess}`);

  // When transitioning to Phase 2, just note the phase change
  if (bb_mess == 2) {
    console.log("Transitioning to Phase 2 - using pre-randomized order from JSON file");
    is_phase_2 = true;
    // No additional randomization needed - the JSON file already has the randomized order
}

  // Determine which trial to run next - simple sequential order
  trial += 1;
  console.log(`Moving to trial ${trial} (Phase ${is_phase_2 ? '2' : '1'})`);

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

function setupPageRender(center, screen_width, screen_height, squareLeft, squareTop, squareSize) {
// Set up the page rendering and initial display elements
// This function is called once at the start to set up the display
// and create the SVG container for D3.js
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

const reach_number_point = new Point(
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

// ==================================================
// GLOBAL GAME BUILDING BLOCKS - Build the Red Square
// ==================================================
  // COORDINATE CALCULATIONS
  function calculateCoordinates() {
    const screen_width = self.innerWidth;
    const screen_height = self.innerHeight;
    const tgt_distance = screen_height / 3;
    const center = new Point(screen_width / 2.0, screen_height / 2.0);
    // Red box dimensions
    const squareLeft = center.x - tgt_distance;
    const squareTop = center.y - tgt_distance;
    const squareSize = 2 * tgt_distance;

    return {
      screen_width,
      screen_height,
      tgt_distance,
      center,
      squareLeft,
      squareTop,
      squareSize      
    };
  }
  
  // Verify that all required global variables are initialized
  function verifyGlobalInitialization() {
    const required = ['center', 'tgt_distance', 'squareLeft', 'squareTop', 'squareSize', 'numtrials'];
    const missing = required.filter(prop => window[prop] === undefined);
    
    if (missing.length > 0) {
      console.error('Missing global variables:', missing);
      return false;
    }
    return true;
  }


// ==================================================
// GLOBAL GAME MECHANIC FUNCTIONS
// ==================================================

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

function start_trial() {
  // Ensure we have a valid experiment_id and subject ID
  const experiment_id = window.experiment_id || "AudioMotor_" + (subject?.condition || 'A');
  const subject_id = subject?.id || "unknown_participant";

  console.log("Starting trial with:", { experiment_id, subject_id });

  // Create a new Trial object for this subject
  subjTrials = new Trial(experiment_id, subject_id)

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

// ==================================================
// Function that sets up the game
// ==================================================
function gameSetup(data) {

  // If no data passed and we have fileContent, use that
  if (!data && fileContent) {
      console.log("Using already loaded fileContent in gameSetup");
      data = fileContent;
  }
  
  if (!data) {
      console.error("No data available for gameSetup");
      alert("Experiment data not loaded. Please refresh the page.");
      return;
  }
  
// Get the experiment condition from the subject object
const experiment_condition = subject.condition || 'A'; // Default to 'A' if missing
// Update experiment_id to include the condition
const experiment_id = "AudioMotor_" + experiment_condition;
// Make experiment_id globally accessible so start_trial can use it
window.experiment_id = experiment_id;

// Determine which condition's data to use
const condition_data = experiment_condition === 'A' 
  ? data.conditionA 
  : data.conditionB;

console.log(`Using data for condition ${experiment_condition}:`, {
    training_data: condition_data.training,
    testing_data: condition_data.testing
  });

// Combine training and testing data properly
const training_data = condition_data.training;
const testing_data = condition_data.testing;

// DEBUG: Check the data structure
console.log("Training data structure:", {
  numtrials: training_data.numtrials,
  sample_rotation: training_data.rotation ? Object.keys(training_data.rotation).slice(0, 5) : 'missing',
  sample_tgt_angle: training_data.tgt_angle ? Object.keys(training_data.tgt_angle).slice(0, 5) : 'missing'
});

console.log("Testing data structure:", {
  numtrials: testing_data.numtrials,
  sample_rotation: testing_data.rotation ? Object.keys(testing_data.rotation).slice(0, 5) : 'missing',
  sample_tgt_angle: testing_data.tgt_angle ? Object.keys(testing_data.tgt_angle).slice(0, 5) : 'missing'
});

// Calculate total trials from training + testing data
const numtrials = (training_data.numtrials || 0) + (testing_data.numtrials || 0);
console.log('Total trials calculation:', {
    training_numtrials: training_data.numtrials,
    testing_numtrials: testing_data.numtrials,
    sum: numtrials,
    training_type: typeof training_data.numtrials,
    testing_type: typeof testing_data.numtrials
  });

// Initialize musicBox EARLY in the function, before any other code might use it
if (typeof musicBox === 'undefined' || !musicBox) {
  musicBox = new MusicBox(self);
  console.log("MusicBox initialized successfully");
}

// Calculate coordinates using extracted functions
const coords = calculateCoordinates();

// Make coordinates globally accessible
window.tgt_distance = coords.tgt_distance;
window.squareLeft = coords.squareLeft;
window.squareTop = coords.squareTop;
window.squareSize = coords.squareSize;
window.center = coords.center;
window.screen_width = coords.screen_width;
window.screen_height = coords.screen_height;

console.log('=== START COORDINATE SETUP ===');
console.log('Screen:', screen_width, 'x', screen_height);
console.log('Center:', center.x, center.y);
console.log('Target distance:', tgt_distance);
console.log('Square bounds:', squareLeft, squareTop, 'size:', squareSize);
console.log('=== END COORDINATE SETUP ===');

prev_screen_size = coords.screen_width * coords.screen_height;

// Make numtrials global BEFORE using it
window.numtrials = numtrials;
console.log(`Total trials calculated: ${numtrials} (training: ${training_data.numtrials}, testing: ${testing_data.numtrials})`);

console.log("🔍 Starting data merge debugging...");
console.log("Training data exists:", !!training_data);
console.log("Testing data exists:", !!testing_data);

if (training_data) {
  console.log("Training structure:", {
    numtrials: training_data.numtrials,
    has_rotation: !!training_data.rotation,
    has_between_blocks: !!training_data.between_blocks,
    rotation_type: typeof training_data.rotation,
    rotation_length: training_data.rotation?.length,
    rotation_sample: training_data.rotation?.[0],
    between_blocks_sample: training_data.between_blocks?.[0]
  });
}

// Merge the arrays correctly
const rotation = {};
const tgt_angle = {};
const between_blocks = {};
const target_jump = {};

console.log("🔍 About to start training loop...");

// Add training data (trials 0 to training_data.numtrials-1)
for (let i = 0; i < training_data.numtrials; i++) {
  // Validate that each array element exists
  if (training_data.rotation[i] === undefined || 
      training_data.tgt_angle[i] === undefined || 
      training_data.between_blocks[i] === undefined || 
      training_data.target_jump[i] === undefined) {
    console.error(`Missing training data at index ${i}:`, {
      rotation: training_data.rotation[i],
      tgt_angle: training_data.tgt_angle[i],
      between_blocks: training_data.between_blocks[i],
      target_jump: training_data.target_jump[i]
    });
    alert(`Training data incomplete at trial ${i}. Please refresh the page.`);
    return;
  }

  rotation[i] = training_data.rotation[i];
  tgt_angle[i] = training_data.tgt_angle[i];
  between_blocks[i] = training_data.between_blocks[i];
  target_jump[i] = training_data.target_jump[i];

  // DEBUG: Log first few training trials
  if (i < 3) {
    console.log(`Training trial ${i}: angle=${tgt_angle[i]}, rotation=${rotation[i]}, between_blocks=${between_blocks[i]}, target_jump=${target_jump[i]}`);
  }
}
  
// Add testing data (trials training_data.numtrials to total-1)
for (let i = 0; i < testing_data.numtrials; i++) {
  const globalTrialIndex = training_data.numtrials + i;
  
  // Validate that each array element exists
  if (testing_data.rotation[i] === undefined || 
      testing_data.tgt_angle[i] === undefined || 
      testing_data.between_blocks[i] === undefined || 
      testing_data.target_jump[i] === undefined) {
    console.error(`Missing testing data at index ${i}:`, {
      rotation: testing_data.rotation[i],
      tgt_angle: testing_data.tgt_angle[i],
      between_blocks: testing_data.between_blocks[i],
      target_jump: testing_data.target_jump[i]
    });
    alert(`Testing data incomplete at trial ${i}. Please refresh the page.`);
    return;
  }

  rotation[globalTrialIndex] = testing_data.rotation[i];
  tgt_angle[globalTrialIndex] = testing_data.tgt_angle[i];
  between_blocks[globalTrialIndex] = testing_data.between_blocks[i];
  target_jump[globalTrialIndex] = testing_data.target_jump[i];

  // DEBUG: Log first few testing trials
  if (i < 3) {
    console.log(`Testing trial ${globalTrialIndex}: angle=${tgt_angle[globalTrialIndex]}, rotation=${rotation[globalTrialIndex]}, between_blocks=${between_blocks[globalTrialIndex]}, target_jump=${target_jump[globalTrialIndex]}`);
  }
} 

// **MAKE TRIAL DATA GLOBALLY ACCESSIBLE**
window.rotation = rotation;
window.tgt_angle = tgt_angle;
window.between_blocks = between_blocks;
window.target_jump = target_jump;

// 🔍 DEBUG: Check what we actually have in the arrays
console.log("=== DATA DEBUGGING ===");
console.log("Training data sample:", {
  rotation: training_data.rotation,
  tgt_angle: training_data.tgt_angle, 
  between_blocks: training_data.between_blocks,
  target_jump: training_data.target_jump
});
console.log("Merged arrays sample:", {
  rotation: {0: rotation[0], 1: rotation[1], 2: rotation[2]},
  tgt_angle: {0: tgt_angle[0], 1: tgt_angle[1], 2: tgt_angle[2]},
  between_blocks: {0: between_blocks[0], 1: between_blocks[1], 2: between_blocks[2]},
  target_jump: {0: target_jump[0], 1: target_jump[1], 2: target_jump[2]}
});
console.log("between_blocks[0] specifically:", between_blocks[0], typeof between_blocks[0]);
console.log("=== END DEBUG ===");

// FIXED: Verify the first few trials are set correctly
  console.log("First few combined trials:", {
    trial_0: { 
      angle: tgt_angle[0], 
      rotation: rotation[0], 
      between_blocks: between_blocks[0], 
      target_jump: target_jump[0] 
    },
    trial_1: { 
      angle: tgt_angle[1], 
      rotation: rotation[1], 
      between_blocks: between_blocks[1], 
      target_jump: target_jump[1] 
    },
    trial_2: { 
      angle: tgt_angle[2], 
      rotation: rotation[2], 
      between_blocks: between_blocks[2], 
      target_jump: target_jump[2] 
    }
  });

  // FIXED: Validate that trial 0 data is properly set
  if (between_blocks[0] === undefined) {
    console.error("ERROR: between_blocks[0] is undefined after data merging!");
    console.error("Training data between_blocks:", training_data.between_blocks);
    console.error("Final between_blocks object:", between_blocks);
    alert("Data merging failed. Please refresh the page and try again.");
    return;
  }

// Set other variables that depend on data
bb_mess = window.between_blocks[0];

console.log(`bb_mess set to: ${bb_mess} (from between_blocks[0])`);
console.log(`Total trials: ${numtrials}`);

// Reset the existing global arrays without redeclaring
current_trial_enhanced_positions.length = 0;            
trial_analytics.length = 0;        

console.log('Global variables set:', {
  tgt_distance: coords.tgt_distance,
  squareLeft: coords.squareLeft,
  squareTop: coords.squareTop,
  squareSize: coords.squareSize,
  center: coords.center,
  numtrials: numtrials
});
  
console.log('Total trials:', numtrials);
console.log("✅ All global variables verified");
console.log('=== END: GLOBAL VARIABLE SETUP ===');

// ==================================================
// PAGE SETUP AND Pointer Lock Variables and Functions - inside gameSetup to access screen variables
// ==================================================
  const handler = setupPageRender(
    coords.center,
    coords.screen_width,
    coords.screen_height,
    coords.squareLeft,
    coords.squareTop,
    coords.squareSize
  );

  // Create circles
  const circles = createGameCircles(handler, coords.center, coords.tgt_distance);
  // Assign to global variables that are already have declared globally
  calibration = circles.calibration;
  target = circles.target;
  cursor = circles.cursor;
  
// Initialize musicBox here (redundant but safe)
  if (!musicBox) {
    musicBox = new MusicBox(self);
  }

  // Set up pointer lock and event listeners AFTER stage is created
  document.requestPointerLock = document.requestPointerLock ||
    document.mozRequestPointerLock;
  document.exitPointerLock = document.exitPointerLock ||
    document.mozExitPointerLock;
  document.addEventListener("pointerlockchange", lockChangeAlert, false);
  document.addEventListener("mozpointerlockchange", lockChangeAlert, false);
  self.addEventListener("resize", monitorWindow, false);
  document.addEventListener("click", setPointerLock, false);

// Now the stage exists, so we can set pointer lock
  setPointerLock();

// Verify all globals are properly initialized
if (!verifyGlobalInitialization()) {
  console.error("❌ Global initialization failed - some variables missing");
  alert("Setup error. Please refresh the page.");
  return;
}
  
// start the trial
start_trial();
} // End of gameSetup function

// ==================================================
// FORMANT STRUCTURE CALCULATION
// ==================================================
function getVowelFormants(xPos, squareLeft, squareSize) {
  const vowelFormants = {
    i: { f1: 300, f2: 2300 },
    a: { f1: 700, f2: 1200 }
  };

  // First validation: Check for non-numeric values "NaN" 
  if (isNaN(xPos) || isNaN(squareLeft) || isNaN(squareSize)) {
    console.error('Invalid input for getVowelFormants - non-numeric values', { xPos, squareLeft, squareSize });
    return { f1: 500, f2: 1500, _vowel: 'a' };
  } 

  // Second validation: Check for negative or zero values
  if (xPos < 0 || squareLeft < 0 || squareSize <= 0) {
    console.error('Invalid input for getVowelFormants - invalid ranges', { xPos, squareLeft, squareSize });
    return { f1: 500, f2: 1500, _vowel: 'a' }; // Fallback values
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

  const f1 = vowelFormants[vowel1].f1 * (1 - t) + vowelFormants[vowel2].f1 * t;
  const f2 = vowelFormants[vowel1].f2 * (1 - t) + vowelFormants[vowel2].f2 * t;

  const currentVowel = t < 0.5 ? vowel1 : vowel2;

  return { f1, f2, _vowel: currentVowel };
}

// ==================================================
// FUNCTIONS FOR ENHANCED ANALYSIS
// ==================================================
 
// Function to analyze path after trial completion
function analyzeTrialPath(current_trial_enhanced_positions) {

    if (
    !Array.isArray(current_trial_enhanced_positions) ||
    current_trial_enhanced_positions.length === 0 ||
    typeof current_trial_enhanced_positions[0]?.x !== "number" ||
    typeof current_trial_enhanced_positions[0]?.y !== "number"
  ) {
    console.warn("Warning: current_trial_enhanced_positions is missing or malformed:", current_trial_enhanced_positions);
  }

    if (current_trial_enhanced_positions.length < 2) return {};
    
    // Path efficiency
    const start = current_trial_enhanced_positions[0];
    const end = current_trial_enhanced_positions[current_trial_enhanced_positions.length - 1];
    const direct_distance = Math.sqrt(
        Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
    );
    
    let total_distance = 0;
    for (let i = 1; i < current_trial_enhanced_positions.length; i++) {
        const prev = current_trial_enhanced_positions[i-1];
        const curr = current_trial_enhanced_positions[i];
        total_distance += Math.sqrt(
            Math.pow(curr.x - prev.x, 2) + Math.pow(curr.y - prev.y, 2)
        );
    }
    
    const path_efficiency = total_distance > 0 ? direct_distance / total_distance : 0;
    
    // Count pauses
    const pauses = detect_pauses(current_trial_enhanced_positions);
    
    // Count quadrant changes
    let quadrant_changes = 0;
    for (let i = 1; i < current_trial_enhanced_positions.length; i++) {
        if (current_trial_enhanced_positions[i].quadrant !== current_trial_enhanced_positions[i-1].quadrant) {
            quadrant_changes++;
        }
    }
    
    // Direction changes
    const direction_changes = detect_direction_changes(current_trial_enhanced_positions);
    
    // Average velocity and max acceleration
    const velocities = current_trial_enhanced_positions.filter(pos => pos.velocity !== undefined).map(pos => pos.velocity);
    const accelerations = current_trial_enhanced_positions.filter(pos => pos.acceleration !== undefined).map(pos => Math.abs(pos.acceleration));
    
    const avg_velocity = velocities.length > 0 ? velocities.reduce((a, b) => a + b) / velocities.length : 0;
    const max_acceleration = accelerations.length > 0 ? Math.max(...accelerations) : 0;
    
    return {
        path_efficiency,
        total_distance,
        direct_distance,
        pause_count: pauses.length,
        avg_pause_duration: pauses.length > 0 ? pauses.reduce((sum, p) => sum + p.duration, 0) / pauses.length : 0,
        quadrant_changes,
        direction_changes: direction_changes.length,
        avg_velocity,
        max_acceleration,
        total_samples: current_trial_enhanced_positions.length,
    };
}

// Function to get comprehensive experiment summary
function getExperimentSummary() {
    if (trial_analytics.length === 0) {
        return {
            numtrials: 0,
            overallPerformance: {
                avg_path_efficiency: 0,
                avg_velocity: 0,
            },
            learning_progression: [],
            }
        };
    }
    
  const summary = {
        numtrials: trial_analytics.length,
        overall_performance: {
            avg_path_efficiency: trial_analytics.reduce((sum, t) => sum + (t.path_efficiency || 0), 0) / trial_analytics.length,
            avg_velocity: trial_analytics.reduce((sum, t) => sum + (t.avg_velocity || 0), 0) / trial_analytics.length,
        },
        learning_progression: trial_analytics.map((analysis, index) => ({
            trial: index + 1,
            efficiency: analysis.path_efficiency || 0,
            velocity: analysis.avg_velocity || 0,
            pauses: analysis.pause_count || 0
        })),
    };


// helpEnd() function saves *everything* to Firebase Storage
function helpEnd() {
    console.log("🏁 Experiment completed - preparing for demographics collection...");
    
    // Restore UI state
    closeFullScreen();
    $("html").css("cursor", "auto");
    $("body").css("cursor", "auto");
    $("body").css("background-color", "white");
    $("html").css("background-color", "white");
    d3.select("#stage").attr("display", "none");

    // Validate that we have trial data before proceeding to demographics
    try {
        if (!subject || !subject.id) {
            throw new Error("Missing participant information");
        }

        if (!subjTrials || !subjTrials.blocks || subjTrials.blocks.length === 0) {
            throw new Error("No trial data available");
        }

        console.log(`✅ Trial data validation successful:`);
        console.log(`   👤 Participant: ${subject.id}`);
        console.log(`   🎯 Condition: ${subject.condition}`);
        console.log(`   🧪 Trials collected: ${subjTrials.blocks.length}`);
        console.log("📋 Proceeding to demographics questionnaire...");
        
        // Data will be saved in saveFeedback() after demographics are collected
        return true;

    } catch (error) {
        console.error("❌ Trial data validation failed:", error);
        alert(`Error: Trial data not collected properly. Please contact the experimenter.\n\nParticipant ID: ${subject?.id || 'unknown'}\nError: ${error.message}`);
        
        // Still show the questionnaire even if there's an issue
        // The experimenter can sort it out later
        return false;
    }
}

// Function that ends the game appropriately after the experiment has been completed
function endGame() {
  console.log("endGame() called - experiment completed successfully");
  // release fullscreen and restore cursor
  helpEnd();
  
  // show questionaire
  show("container-not-an-ad");
  // The questionnaire submit button will call saveFeedback() which handles
  // saving the participant demographics and final redirect
}

// ==================================================
// Demographics and Feedback Functions - in global scope
// ==================================================

// Function called when participant fails attention checks or needs to exit early
function badGame() {
    console.log("badGame() called - participant failed attention check or exited early");
    
    try {
        // Stop any ongoing audio
        if (typeof musicBox !== 'undefined' && musicBox) {
            musicBox.pause();
        }
        
        // Clear any active timers
        if (typeof hold_timer !== 'undefined' && hold_timer) {
            clearTimeout(hold_timer);
        }
        if (typeof green_timer !== 'undefined' && green_timer) {
            clearTimeout(green_timer);
        }
        if (typeof stop_target_music_timer !== 'undefined' && stop_target_music_timer) {
            clearTimeout(stop_target_music_timer);
        }
        if (typeof target_display_timer !== 'undefined' && target_display_timer) {
            clearTimeout(target_display_timer);
        }
        if (typeof too_slow_timer !== 'undefined' && too_slow_timer) {
            clearTimeout(too_slow_timer);
        }
        if (typeof movement_timeout !== 'undefined' && movement_timeout) {
            clearTimeout(movement_timeout);
        }
        
        // Remove event listeners
        document.removeEventListener("mousemove", update_cursor, false);
        document.removeEventListener("keydown", advance_block, false);
        document.removeEventListener("click", setPointerLock, false);
        self.removeEventListener("resize", monitorWindow, false);
        
        // Exit pointer lock
        if (document.exitPointerLock) {
            try {
                document.exitPointerLock();
            } catch (e) {
                console.log("Error exiting pointer lock:", e);
            }
        }
        
        // Exit full screen
        closeFullScreen();
        
        // Restore normal UI
        $("html").css("cursor", "auto");
        $("body").css("cursor", "auto");
        $("body").css("background-color", "white");
        $("html").css("background-color", "white");
        
        // Hide the game stage
        const stage = document.getElementById("stage");
        if (stage) {
            stage.style.display = "none";
        }
        
        // Record partial data if any trials were completed
        if (typeof subject !== 'undefined' && subject && subject.id) {
            // Add termination info to subject
            subject.early_termination = true;
            subject.termination_reason = "attention_check_failed";
            subject.termination_time = new Date().toISOString();
            
            // If we have some trial data, save it
            if (typeof subjTrials !== 'undefined' && subjTrials && subjTrials.blocks && subjTrials.blocks.length > 0) {
                console.log(`Saving partial data: ${subjTrials.blocks.length} trials completed before termination`);
                
                // Try to save partial data (don't block the UI if this fails)
                try {
                    const productionDataManager = new window.ProductionDataManager();
                    const partialEnhancedData = {
                        trial_analytics: window.trial_analytics || [],
                        current_trial_enhanced_positions: window.current_trial_enhanced_positions || [],
                        termination_info: {
                            reason: "attention_check_failed",
                            completed_trials: subjTrials.blocks.length,
                            termination_time: new Date().toISOString()
                        }
                    };
                    
                    // Save partial data (async, don't wait for it)
                    productionDataManager.saveExperimentData(subject, subjTrials, partialEnhancedData)
                        .then(result => {
                            console.log("✅ Partial data saved successfully:", result.filename);
                        })
                        .catch(error => {
                            console.error("❌ Failed to save partial data:", error);
                        });
                        
                } catch (saveError) {
                    console.error("Error attempting to save partial data:", saveError);
                }
            }
        }
        
        // Show the failed/terminated page
        show("container-failed");
        
    } catch (error) {
        console.error("Error in badGame() function:", error);
        // Even if there's an error, still try to show the failed page
        try {
            show("container-failed");
        } catch (showError) {
            console.error("Critical error: cannot show failed page:", showError);
            // Last resort: redirect to a safe page
            alert("Experiment terminated due to failed attention check. You may close this window.");
        }
    }
}

// Function to handle unexpected errors or crashes
function handleCriticalError(error, context = "unknown") {
    console.error(`Critical error in ${context}:`, error);
    
    try {
        // Log the error details for debugging
        console.error("=== CRITICAL ERROR DETAILS ===");
        console.error("Context:", context);
        console.error("Error message:", error.message);
        console.error("Stack trace:", error.stack);
        console.error("Participant ID:", typeof subject !== 'undefined' ? subject?.id : 'unknown');
        console.error("Current trial:", typeof trial !== 'undefined' ? trial : 'unknown');
        console.error("=== END ERROR DETAILS ===");
        
        // Try to save error info if we have participant data
        if (typeof subject !== 'undefined' && subject && subject.id) {
            subject.critical_error = {
                message: error.message,
                context: context,
                timestamp: new Date().toISOString(),
                stack: error.stack
            };
        }
        
        // Call badGame to clean up and terminate
        badGame();
        
    } catch (handlerError) {
        console.error("Error in error handler:", handlerError);
        // Ultimate fallback
        alert("A critical error occurred. Please contact the experimenter with your participant ID.");
    }
}

// Enhanced window error handler
window.onerror = function(message, source, lineno, colno, error) {
  console.error("=== WINDOW ERROR CAUGHT ===");
  console.error("Message:", message);
  console.error("Source:", source);
  console.error("Line:", lineno);
  console.error("Column:", colno);
  console.error("Error object:", error);
  console.error("=== END WINDOW ERROR ===");
    
  // Handle critical errors that might break the experiment
  if (message.includes("TypeError") || message.includes("ReferenceError")) {
      handleCriticalError(error || new Error(message), "window_error");
  }
  
    return true; // Prevent default browser error handling
};

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', function(event) {
  console.error("=== UNHANDLED PROMISE REJECTION ===");
  console.error("Reason:", event.reason);
  console.error("Promise:", event.promise);
  console.error("=== END PROMISE REJECTION ===");
  
  handleCriticalError(event.reason, "unhandled_promise");
  event.preventDefault(); // Prevent console error
});

// Function to validate the age input
function validateAge(input) {
  // Get the current value
  let value = input.value;

  // Remove any non-digit characters
  value = value.replace(/\D/g, '');
  // Ensure it's in the 0-99 range
  if (value !== "") {
    const num = parseInt(value);
    if (num > 99) {
      value = "99";
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
// Enhanced version of saveFeedback() that also uses production features
async function saveFeedback() {
  console.log("💾 Starting complete feedback save with demographics...");

  // 🔍 FIREBASE DEBUGGING
  console.log("🔥 Firebase debugging:");
  console.log("  - Firebase available:", !!window.firebase);
  console.log("  - Firebase.auth available:", !!window.firebase?.auth);
  console.log("  - Firebase.storage available:", !!window.firebase?.storage);
  console.log("  - Current user:", firebase.auth().currentUser);

  // Test anonymous auth directly
  try {
      console.log("🧪 Testing anonymous auth...");
      const testAuth = await firebase.auth().signInAnonymously();
      console.log("✅ Anonymous auth test successful:", testAuth.user.uid);
  } catch (authError) {
      console.error("❌ Anonymous auth test failed:", authError);
      alert(`Authentication test failed: ${authError.message}`);
      return false;
  }

  try {
      // ... rest of your existing saveFeedback code ...
  } catch (error) {
      // ... existing error handling ...
  }


    try {
        // Collect all demographic data 
        subject.distractions = [];
        
        // Process distraction checkboxes
        for (let i = 1; i <= 7; i++) {
            const checkbox = document.getElementById(`distract${i}`);
            if (checkbox && checkbox.checked) {
                subject.distractions.push(checkbox.value);
                
                if (checkbox.value === "other") {
                    const distractoInput = document.querySelector('input[name="distracto"]');
                    if (distractoInput) {
                        subject.distracto = distractoInput.value;
                    }
                }
            }
        }

        // Get demographic information
        const age = document.getElementById("age-input")?.value || "";
        const gender = document.getElementById("gender")?.value || "";
        const music_instrument = document.getElementById("music-instrument-input")?.value || "";
        const music_practice = document.getElementById("music-practice-input")?.value || "";
        const language_count = document.getElementById("language-count")?.value || "";
        const returner = document.getElementById("repeat")?.value || "";
        const handedness = document.getElementById("hand")?.value || "";
        const ethnicity = document.getElementById("ethnic")?.value || "";
        const race = document.getElementById("race")?.value || "";

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

        const missingFields = requiredFields.filter(field => !field.value);
        if (missingFields.length > 0) {
            alert(`Please complete all required fields: ${missingFields.map(f => f.name).join(", ")}`);
            return false;
        }

        // Validate age vs musical experience
        const age_num = parseInt(age) || 0;
        const music_experience = parseInt(subject.music_experience) || 0;
        if (age_num > 0 && music_experience > 0 && music_experience > age_num) {
            alert(`Error: Musical experience (${music_experience}) cannot exceed age (${age_num})`);
            return false;
        }

        // Update subject with all demographic data
        subject.age = age;
        subject.gender = gender;
        subject.handedness = handedness;
        subject.returner = returner;
        subject.ethnicity = ethnicity || "";
        subject.race = race || "";
        subject.language_count = language_count;
        subject.music_instrument = music_instrument;
        subject.music_practice = music_practice || "0";

        const feedbackInput = document.getElementById('feedback_final');
        subject.comments = (feedbackInput && feedbackInput.value) ? feedbackInput.value : "";

        console.log("📝 Demographic data collected and validated");

        // Show loading message to participant
        const loadingMessage = `Saving your data securely...\nParticipant ID: ${subject.id}`;

        // Create a simple loading overlay
        const loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'loading-overlay';
        loadingOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            font-size: 24px;
            font-family: Arial, sans-serif;
            z-index: 10000;
        `;
        loadingOverlay.innerHTML = `
            <div style="text-align: center;">
                <div style="margin-bottom: 20px;">💾 Saving your data...</div>
                <div style="font-size: 18px; color: #ccc;">Participant ID: ${subject.id}</div>
                <div style="font-size: 16px; color: #999; margin-top: 10px;">Please wait, do not close this page</div>
            </div>
        `;
        document.body.appendChild(loadingOverlay);

        // Prepare enhanced data for the complete set
        const enhancedData = {
            trial_analytics: window.trial_analytics || [],
            current_trial_enhanced_positions: window.current_trial_enhanced_positions || []
        };

        // Replace this section in saveFeedback():
        console.log("🏭 Saving complete dataset with demographics...");

        // NOW save the complete dataset with demographics using production features
        const uploadResult = await new ProductionDataManager().saveExperimentData(
            subject, 
            subjTrials, 
            enhancedData
        );

        // Remove loading overlay
        document.body.removeChild(loadingOverlay);

        if (uploadResult) {
            console.log("🎉 COMPLETE DATA SAVE SUCCESSFUL!");
            console.log("📋 Upload details:", uploadResult);
            
            // Show success message
            const successMessage = `✅ Your data has been saved successfully!\n\nParticipant ID: ${subject.id}\nFile: ${uploadResult.filename}\nSize: ${uploadResult.size_mb.toFixed(2)} MB\n\nThank you for participating!`;
            alert(successMessage);
            
            // Show completion page
            show("final-page");

            // Redirect after delay
            setTimeout(function() {
                window.location.href = "https://app.prolific.com/submissions/complete?cc=CSIP9LNR";
            }, 2000);

            return true;
        } else {
            throw new Error("Complete data save failed");
        }

    } catch (error) {
        console.error("❌ Error saving complete data:", error);
        
        // Remove loading overlay if it exists
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            document.body.removeChild(loadingOverlay);
        }
        
        // Production error handling
        const errorInfo = window.ProductionErrorHandler.handleUploadError(error, subject?.id || 'unknown');
        alert(`❌ Error saving data: ${errorInfo.userMessage}`);
        
        return false;
    }
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
