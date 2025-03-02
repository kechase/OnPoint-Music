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
const noSave = false;
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
    "19": 2.0, // 2 will be the number to trigger the chance of phase message to TESTING
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

// Spatial Rhythm Sonification Experiment for Firebase
// Combines experiment structure with spatial rhythm sonification

// MusicBox class for audio sonification
class MusicBox {
  constructor(handler) {
    this.isPlaying = false;
    // Audio context setup - don't start it yet, needs user gesture
    this.audioContext = new (handler.AudioContext || handler.webkitAudioContext)();
    
    // Force audio context to be suspended initially
    if (this.audioContext.state !== 'suspended') {
      this.audioContext.suspend();
    }
    
    // Initialize properties
    this.initialized = false;
    this.lastPosition = { x: 0.5, y: 0.5 }; // Normalized position (0-1)
    
    // Rhythm patterns with increasing complexity (slightly less dense)
    this.rhythmPatterns = [
      [1, 0, 1, 0],                     // Simplest
      [1, 0, 1, 0, 1, 0],               // Basic
      [1, 1, 0, 0, 1, 0, 1, 0],         // Medium
      [1, 0, 1, 1, 0, 1, 0, 1],         // Complex
      [1, 1, 0, 1, 0, 1, 1, 0, 1, 0]    // Very complex
    ];
    
    // Sequence control
    this.currentStep = 0;
    this.currentPattern = this.rhythmPatterns[0];
    this.sequenceInterval = null;
    
    // Audio nodes - initialize them to null, but don't create them yet
    this.kickSynth = null;
    this.kickGain = null;
    this.hihatSynth = null;
    this.hihatGain = null;
    this.hihatFilter = null;
    this.toneSynth = null;
    this.toneGain = null;

    // Debug flag
    this.debug = false;
  }
  
  log(...args) {
    if (this.debug) {
      console.log(...args);
    }
  }
  
  // Safe initialization of audio components
  async initializeAudio() {
    if (this.initialized) return true;
    
    try {
      // Resume audio context (requires user gesture)
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }
      
      this.log("AudioContext state:", this.audioContext.state);
      
      // Create all audio nodes
      
      // Kick drum
      this.kickGain = this.audioContext.createGain();
      this.kickGain.gain.value = 0.001; // Start silent
      this.kickGain.connect(this.audioContext.destination);
      
      this.kickSynth = this.audioContext.createOscillator();
      this.kickSynth.type = 'sine';
      this.kickSynth.frequency.value = 150;
      this.kickSynth.connect(this.kickGain);
      this.kickSynth.start();
      
      // Hihat
      this.hihatGain = this.audioContext.createGain();
      this.hihatGain.gain.value = 0.001; // Start silent
      
      this.hihatFilter = this.audioContext.createBiquadFilter();
      this.hihatFilter.type = 'highpass';
      this.hihatFilter.frequency.value = 700;
      this.hihatFilter.Q.value = 15;
      this.hihatFilter.connect(this.hihatGain);
      this.hihatGain.connect(this.audioContext.destination);
      
      this.hihatSynth = this.audioContext.createOscillator();
      this.hihatSynth.type = 'square';
      this.hihatSynth.frequency.value = 800;
      this.hihatSynth.connect(this.hihatFilter);
      this.hihatSynth.start();
      
      // Tone for Bohlen-Pierce scale
      this.toneGain = this.audioContext.createGain();
      this.toneGain.gain.value = 0.001; // Start silent
      this.toneGain.connect(this.audioContext.destination);
      
      this.toneSynth = this.audioContext.createOscillator();
      this.toneSynth.type = 'sine';
      this.toneSynth.frequency.value = 130.81; // C3
      this.toneSynth.connect(this.toneGain);
      this.toneSynth.start();
      
      this.initialized = true;
      this.log("Audio initialized successfully");
      return true;
    } catch (error) {
      console.error("Error initializing audio:", error);
      return false;
    }
  }
  
  // Start playing with proper timing
  async play(currentTime) {
    if (!this.initialized) {
      if (!await this.initializeAudio()) {
        console.error("Failed to initialize audio!");
        return;
      }
    }
    
    this.log("Starting playback...");
    
    // Make sure audio context is running
    if (this.audioContext.state !== 'running') {
      try {
        await this.audioContext.resume();
        this.log("AudioContext resumed:", this.audioContext.state);
      } catch (error) {
        console.error("Error resuming audio context:", error);
        return;
      }
    }
    
    this.isPlaying = true;
    
    // Start the rhythm sequence
    this.startRhythmSequence();
  }
  
  // Handle rhythm sequencing
  startRhythmSequence() {
    // Clear any existing interval
    if (this.sequenceInterval) {
      clearInterval(this.sequenceInterval);
      this.sequenceInterval = null;
    }
    
    this.currentStep = 0;
    const tempo = this.getTempoForYValue(this.lastPosition.y);
    const stepTime = Math.floor(60000 / tempo / 2); // Convert BPM to milliseconds per 8th note
    
    this.log("Starting sequence with tempo:", tempo, "BPM, step time:", stepTime, "ms");
    
    // Create a new interval for the rhythm
    this.sequenceInterval = setInterval(() => {
      this.playNextStep();
    }, stepTime);
  }
  
  // Play a single step in the rhythm pattern
  playNextStep() {
    if (!this.isPlaying) return;
    
    const pattern = this.currentPattern;
    const patternIndex = this.currentStep % pattern.length;
    
    // If this step has a beat (1), play appropriate sounds
    if (pattern[patternIndex]) {
      const instruments = this.getInstrumentsForYValue(this.lastPosition.y);
      const currentTime = this.audioContext.currentTime;
      
      // Play each active instrument
      if (instruments.includes('kick')) {
        this.playKick(currentTime);
      }
      
      if (instruments.includes('hihat')) {
        this.playHihat(currentTime);
      }
      
      // Always play the tone based on X position
      this.playTone(currentTime);
    }
    
    this.currentStep++;
  }
  
  // Play kick drum sound with proper envelope
  playKick(time) {
    if (!this.kickSynth || !this.kickGain) return;
    
    const attackTime = 0.001;
    const releaseTime = 0.3;
    
    try {
      // Set frequency envelope for 'thump' effect
      this.kickSynth.frequency.cancelScheduledValues(time);
      this.kickSynth.frequency.setValueAtTime(150, time);
      this.kickSynth.frequency.exponentialRampToValueAtTime(60, time + 0.1);
      
      // Set amplitude envelope
      this.kickGain.gain.cancelScheduledValues(time);
      this.kickGain.gain.setValueAtTime(0.001, time);
      this.kickGain.gain.exponentialRampToValueAtTime(1, time + attackTime);
      this.kickGain.gain.exponentialRampToValueAtTime(0.001, time + attackTime + releaseTime);
    } catch (error) {
      console.error("Error playing kick:", error);
    }
  }
  
  // Play hihat sound with proper envelope
  playHihat(time) {
    if (!this.hihatSynth || !this.hihatGain) return;
    
    const attackTime = 0.001;
    const releaseTime = 0.1;
    
    try {
      // Set amplitude envelope
      this.hihatGain.gain.cancelScheduledValues(time);
      this.hihatGain.gain.setValueAtTime(0.001, time);
      this.hihatGain.gain.exponentialRampToValueAtTime(0.3, time + attackTime);
      this.hihatGain.gain.exponentialRampToValueAtTime(0.001, time + attackTime + releaseTime);
    } catch (error) {
      console.error("Error playing hihat:", error);
    }
  }
  
  // Play tone with proper envelope
  playTone(time) {
    if (!this.toneSynth || !this.toneGain) return;
    
    const frequency = this.getNoteForXValue(this.lastPosition.x);
    const attackTime = 0.02;
    const releaseTime = 0.3;
    
    try {
      // Set frequency
      this.toneSynth.frequency.cancelScheduledValues(time);
      this.toneSynth.frequency.setValueAtTime(frequency, time);
      
      // Set amplitude envelope
      this.toneGain.gain.cancelScheduledValues(time);
      this.toneGain.gain.setValueAtTime(0.001, time);
      this.toneGain.gain.exponentialRampToValueAtTime(0.4, time + attackTime);
      this.toneGain.gain.exponentialRampToValueAtTime(0.001, time + attackTime + releaseTime);
    } catch (error) {
      console.error("Error playing tone:", error);
    }
  }
  
  // Update sound based on cursor position
  update(x, y, squareLeft, squareTop, squareSize) {
    // Normalize position to 0-1 range
    const normalizedX = (x - squareLeft) / squareSize;
    const normalizedY = (y - squareTop) / squareSize;
    
    // Constrain to 0-1 range
    // Converts the cursor position to normalized values (0-1 range) relative to the square
    this.lastPosition.x = Math.max(0, Math.min(1, normalizedX));
    this.lastPosition.y = Math.max(0, Math.min(1, normalizedY));
    
    // Initialize and start if not already playing
    if (!this.isPlaying) {
      this.play(this.audioContext.currentTime);
      return;
    }
    
    // Uses the vertical (Y) position to select a pattern with getPatternForYValue()
    // Updates the current pattern only if it's different from the previous one
    const newPattern = this.getPatternForYValue(this.lastPosition.y);
    if (newPattern !== this.currentPattern) {
      this.currentPattern = newPattern;
    }
    
    // Update tempo if it has changed significantly
    const newTempo = this.getTempoForYValue(this.lastPosition.y);
    const currentTempo = this.currentTempo || 150;
    
    // Only update sequence if tempo changed by more than 5 BPM
    if (Math.abs(newTempo - currentTempo) > 5) {
      this.currentTempo = newTempo;
      this.startRhythmSequence(); // Restart with new tempo
    }
  }
  
  // Map Y value to rhythm pattern
  getPatternForYValue(y) {
    // Invert Y (since 0 is top, 1 is bottom in DOM)
    const invertedY = 1 - y;
    const patternIndex = Math.floor(invertedY * this.rhythmPatterns.length);
    return this.rhythmPatterns[Math.min(patternIndex, this.rhythmPatterns.length - 1)];
  }
  
  // Map Y value to tempo
  getTempoForYValue(y) {
    // Invert Y (since 0 is top, 1 is bottom in DOM)
    const invertedY = 1 - y;
    // Map to a range of 150-400 BPM
    return 150 + invertedY * 250;
  }
  
  // Map Y value to instrument selection
  getInstrumentsForYValue(y) {
    // Invert Y (since 0 is top, 1 is bottom in DOM)
    const invertedY = 1 - y;
    
    const instruments = [];
    instruments.push('kick');
    
    if (invertedY > 0.3) instruments.push('hihat');
    
    return instruments;
  }
  
  // Map X value to Bohlen-Pierce scale note
  getNoteForXValue(x) {
    // The Bohlen-Pierce scale divides the tritave (3:1 ratio) into 13 equal steps
    
    // Define the BP scale frequencies
    const bpScale = [
      146.3, // Base note (around D3)
      158.9,
      172.7,
      187.5,
      203.8,
      221.4,
      240.5,
      261.3,
      283.9,
      308.4,
      335.0,
      363.9,
      395.4,
      439.0  // Tritave (3x the base frequency)
    ];
    
    // Map x (0-1) directly to an index in the BP scale array
    const index = Math.floor(x * (bpScale.length - 1));
    
    // Return the corresponding BP frequency
    return bpScale[index];
  }
  
  // Stop all sounds and clean up
  pause() {
    this.isPlaying = false;
    
    // Stop the sequence
    if (this.sequenceInterval) {
      clearInterval(this.sequenceInterval);
      this.sequenceInterval = null;
    }
    
    // Silence all sounds immediately
    const now = this.audioContext.currentTime;
    
    if (this.kickGain) {
      this.kickGain.gain.cancelScheduledValues(now);
      this.kickGain.gain.setValueAtTime(0.001, now);
    }
    
    if (this.hihatGain) {
      this.hihatGain.gain.cancelScheduledValues(now);
      this.hihatGain.gain.setValueAtTime(0.001, now);
    }
    
    if (this.toneGain) {
      this.toneGain.gain.cancelScheduledValues(now);
      this.toneGain.gain.setValueAtTime(0.001, now);
    }
    
    // Suspend the audio context to save resources
    this.audioContext.suspend();
    
    this.log("Playback paused");
  }
}

// Circle class for visual elements
class Circle {
  constructor(parent, point, radius, fill, stroke) {
    this.radius = radius;
    this.point = { x: point.x, y: point.y };
    
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
  
  display(isVisible) {
    this.visible = isVisible;
    const value = this.visible ? "block" : "none";
    this.element.attr("display", value);
  }
  
  update(x, y) {
    const width = window.screen.availWidth;
    const height = window.screen.availHeight;
    
    // Constrain within screen boundaries
    if (x > width) {
      x = width;
    } else if (x < 0) {
      x = 0;
    }
    
    if (y > height) {
      y = height;
    } else if (y < 0) {
      y = 0;
    }
    
    this.point.x = x;
    this.point.y = y;
    this.element.attr("cx", x).attr("cy", y);
  }
}

// Main Experiment Class
class SpatialRhythmExperiment {
  constructor() {
    // Experiment phases
    this.Phase = Object.freeze({
      UNINIT: -1,        // Uninitialized
      SEARCHING: 0,      // Looking for the center 
      HOLDING: 1,        // Holding at start to begin the next target
      SHOW_TARGETS: 2,   // Displaying the target and playing demo sound
      MOVING: 3,         // The reaching motion with sonification
      FEEDBACK: 4,       // Displaying feedback after reach
      BETWEEN_BLOCKS: 5  // Displaying break messages if necessary
    });
    
    // Current experiment state
    this.game_phase = this.Phase.UNINIT;
    this.trial = 0;
    this.experimentID = "SpatialRhythmExperiment";
    
    // Timing variables
    this.rt = 0;              // reaction time
    this.mt = 0;              // movement time
    this.search_time = 0;     // time to reset trial
    this.begin = new Date();  // timestamp for timing measurements
    
    // Timer objects
    this.hold_timer = null;
    this.green_timer = null;
    this.stop_target_music_timer = null;
    this.target_display_timer = null;
    this.too_slow_timer = null;
    
    // Timing constants (ms)
    this.feedback_time = 50;         // regular feedback duration
    this.feedback_time_slow = 750;   // "too slow" feedback duration
    this.hold_time = 500;            // hold duration before target appears
    this.green_time = 1000;          // time until start circle turns green
    this.search_too_slow = 3000;     // threshold for search taking too long
    this.too_slow_time = 5000;       // threshold for reach taking too long
    
    // Screen size and layout
    this.screen_width = window.innerWidth;
    this.screen_height = window.innerHeight;
    this.center = { x: this.screen_width / 2, y: this.screen_height / 2 };
    this.target_dist = this.screen_height / 3;
    
    // Interactive area (red square) dimensions
    this.squareLeft = this.center.x - this.target_dist;
    this.squareTop = this.center.y - this.target_dist;
    this.squareSize = 2 * this.target_dist;
    
    // Circle objects (will be initialized in setupUI)
    this.calibration = null;  // center/start circle
    this.target = null;       // target circle
    this.cursor = null;       // cursor circle
    
    // Audio system
    this.musicBox = null;
    this.play_sound = true;
    
    // Data collection
    this.handPositions = [];
    this.hand_fb_angle = 0;
    this.reach_feedback = "";
    this.subject = null;
    this.subjTrials = null;
    
    // Experiment configuration
    this.experimentConfig = {
      numtrials: 40,
      // Training phase: Trials 0-19
      // Testing phase: Trials 20-39
      target_jump: Array(40).fill(0).map((_, i) => i < 20 ? 1.0 : 0.0),
      between_blocks: Array(40).fill(0).map((_, i) => i === 19 ? 2.0 : 0.0),
      rotation: Array(40).fill(0.0),
      tgt_angle: Array(40).fill(0).map((_, i) => {
        // Rotate through 4 angles: 45, 135, 225, 315
        const angles = [45, 135, 225, 315];
        return angles[i % 4];
      }),
      tgt_distance: Array(40).fill(80)
    };
    
    // Between-block messages
    this.messages = [
      ["Way to go! Press SPACE BAR to continue."],
      [
        "Wait until the center circle turns green.", 
        "Listen to the sound and rhythms, then move in the direction that recreates them.",
        "Press 'b' when you are ready to proceed.",
      ],
      [
        "Phase 2: Testing Phase", 
        "You'll hear the target sound but the target will be hidden.", 
        "Listen carefully, then try to move in a way that recreates the sound you heard.",
        "Press SPACE BAR to continue.",
      ]
    ];
    
    // Track screen size
    this.prev_screen_size = this.screen_width * this.screen_height;
    
    // Bind methods
    this.update_cursor = this.update_cursor.bind(this);
    this.advance_block = this.advance_block.bind(this);
    this.monitorWindow = this.monitorWindow.bind(this);
    this.setPointerLock = this.setPointerLock.bind(this);
    this.lockChangeAlert = this.lockChangeAlert.bind(this);
  }
  
  // Initialize experiment and UI
  async initialize() {
    console.log("Initializing experiment...");
    
    // Create subject and trials objects
    this.subject = new Subject("test_subject", "25", "other", "right", "mouse", "no", "none", "none");
    this.subjTrials = new Trial(this.experimentID, this.subject.id);
    
    // Set up UI elements
    this.setupUI();
    
    // Initialize audio system
    this.musicBox = new MusicBox(window);
    
    // Set up event listeners
    this.setupEventListeners();
    
    // Start the experiment
    this.start_trial();
  }
  
  // Set up the UI elements
  setupUI() {
    const svgContainer = this.setupPageRender();
    
    // Create circle objects
    this.calibration = new Circle(
      svgContainer,
      this.center,
      Math.round(this.target_dist * 4.5 / 80.0),
      "none",
      "white"
    );
    
    this.target = new Circle(
      svgContainer,
      this.center,
      Math.round(this.target_dist * 4.5 / 80.0),
      "blue",
      "none"
    );
    
    this.cursor = new Circle(
      svgContainer,
      this.center,
      Math.round(this.target_dist * 1.75 * 1.5 / 80.0),
      "white",
      "none"
    );
  }
  
  // Set up the main rendering container and initial messages
  setupPageRender() {
    // Initialize full-screen black background
    document.querySelector("html").style.height = "98%";
    document.querySelector("html").style.width = "100%";
    document.querySelector("html").style.backgroundColor = "black";
    document.querySelector("body").style.height = "98%";
    document.querySelector("body").style.width = "100%";
    document.querySelector("body").style.backgroundColor = "black";
    
    // Hide mouse cursor
    document.querySelector("html").style.cursor = "none";
    document.querySelector("body").style.cursor = "none";
    
    // Create SVG container with D3
    const svgContainer = d3.select("body").append("svg")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("fill", "black")
      .attr("id", "stage")
      .attr("background-color", "black");
    
    // Calculate text size based on screen height
    const line_size = Math.round(this.screen_height / 30);
    const message_size = String(line_size) + "px";
    
    // Add message lines
    svgContainer.append("text")
      .attr("text-anchor", "middle")
      .attr("x", this.center.x)
      .attr("y", this.center.y - line_size)
      .attr("fill", "white")
      .attr("font-family", "sans-serif")
      .attr("font-size", message_size)
      .attr("id", "message-line-1")
      .attr("display", "block")
      .text("Move the white dot to the center.");
    
    svgContainer.append("text")
      .attr("text-anchor", "middle")
      .attr("x", this.center.x)
      .attr("y", this.center.y)
      .attr("fill", "white")
      .attr("font-family", "sans-serif")
      .attr("font-size", message_size)
      .attr("id", "message-line-2")
      .attr("display", "block")
      .text("Wait until the center circle turns green.");
    
    svgContainer.append("text")
      .attr("text-anchor", "middle")
      .attr("x", this.center.x)
      .attr("y", this.center.y + line_size)
      .attr("fill", "white")
      .attr("font-family", "sans-serif")
      .attr("font-size", message_size)
      .attr("id", "message-line-3")
      .attr("display", "block")
      .text("Move to the blue target. Remember the sound.");
    
    svgContainer.append("text")
      .attr("text-anchor", "middle")
      .attr("x", this.center.x)
      .attr("y", this.center.y + line_size * 2)
      .attr("fill", "white")
      .attr("font-family", "sans-serif")
      .attr("font-size", message_size)
      .attr("id", "message-line-4")
      .attr("display", "block")
      .text("Press SPACE BAR when you are ready to proceed.");
    
    // Add trial counter
    const reach_number_point = {
      x: this.center.x + (this.squareSize / 2),
      y: this.squareTop + this.squareSize + line_size
    };
    
    svgContainer.append("text")
      .attr("text-anchor", "end")
      .attr("x", reach_number_point.x)
      .attr("y", reach_number_point.y)
      .attr("fill", "white")
      .attr("font-size", message_size)
      .attr("id", "trialcount")
      .attr("display", "block")
      .text("Reach Number: ? / ?");
    
    // Draw the red square (interactive area)
    svgContainer.append("rect")
      .attr("x", this.squareLeft)
      .attr("y", this.squareTop)
      .attr("width", this.squareSize)
      .attr("height", this.squareSize)
      .attr("fill", "none")
      .attr("stroke", "red")
      .attr("stroke-width", 2)
      .attr("id", "targetSquare")
      .attr("display", "block");
    
    return svgContainer;
  }
  
  // Set up event listeners
  setupEventListeners() {
    // Pointer lock setup
    document.addEventListener("pointerlockchange", this.lockChangeAlert, false);
    document.addEventListener("mozpointerlockchange", this.lockChangeAlert, false);
    window.addEventListener("resize", this.monitorWindow, false);
    document.addEventListener("click", this.setPointerLock, false);
  }
  
  // Monitor changes in pointer lock
  lockChangeAlert() {
    const stage = document.getElementById("stage");
    if (
      document.pointerLockElement === stage ||
      document.mozPointerLockElement === stage
    ) {
      console.log("Pointer lock active");
      document.addEventListener("mousemove", this.update_cursor, false);
      document.addEventListener("keydown", this.advance_block, false);
    } else {
      console.log("Pointer lock inactive");
      document.removeEventListener("mousemove", this.update_cursor, false);
      document.removeEventListener("keydown", this.advance_block, false);
    }
  }
  
  // Set pointer lock on the stage element
  setPointerLock() {
    console.log("Attempting to lock pointer");
    const stage = document.getElementById("stage");
    stage.requestPointerLock = stage.requestPointerLock || stage.mozRequestPointerLock;
    stage.requestPointerLock();
  }
  
  // Monitor window size changes
  monitorWindow(event) {
    const curr_size = window.innerHeight * window.innerWidth;
    if (this.prev_screen_size > curr_size) {
      alert(
        "Please enter full screen and click your mouse to continue the experiment! (Shortcut for Mac users: Command + Control + F. Shortcut for PC users: F11)"
      );
    }
    this.prev_screen_size = curr_size;
  }
  
  // Update cursor position based on mouse movement
  update_cursor(event) {
    // Get mouse movement and update cursor position
    event = event || window.event;
    const cursor_x = this.cursor.point.x + event.movementX;
    const cursor_y = this.cursor.point.y + event.movementY;
    
    // Update cursor position (will handle screen boundaries)
    this.cursor.update(cursor_x, cursor_y);
    
    // Calculate distance between cursor and calibration (center) point
    const distance = Math.sqrt(
      Math.pow(this.calibration.point.x - this.cursor.point.x, 2) +
      Math.pow(this.calibration.point.y - this.cursor.point.y, 2)
    );
    
    // Update hand angle calculation
    this.hand_fb_angle = Math.atan2(
      this.calibration.point.y - this.cursor.point.y,
      this.cursor.point.x - this.calibration.point.x
    ) * (180 / Math.PI);
    
    if (this.hand_fb_angle < 0) {
      this.hand_fb_angle = 360 + this.hand_fb_angle;
    }
    
    // Handle different phases
    switch (this.game_phase) {
      case this.Phase.HOLDING:
        // Move back to search if they move out of the start circle
        if (distance > this.calibration.radius) {
          this.search_phase();
        }
        break;
        
      case this.Phase.SHOW_TARGETS:
        // Start moving once they move out of the start circle
        if (distance > this.calibration.radius) {
          this.moving_phase();
        }
        break;
        
      case this.Phase.SEARCHING:
        // Move to hold phase when they reach the start circle
        if (distance <= this.calibration.radius) {
          this.hold_phase();
        }
        break;
        
      case this.Phase.MOVING:
        // Record cursor position
        this.handPositions.push(new Log(new Date() - this.begin, cursor_x, cursor_y));
        
        // Update sonification if cursor is within red square
        const point = this.cursor.point;
        if (
          point.x >= this.squareLeft &&
          point.x <= this.squareLeft + this.squareSize &&
          point.y >= this.squareTop &&
          point.y <= this.squareTop + this.squareSize
        ) {
          // Update music based on position in square
          this.musicBox.update(
            point.x, 
            point.y, 
            this.squareLeft, 
            this.squareTop, 
            this.squareSize
          );
        } else {
          this.musicBox.pause();
        }
        
      // Calculate distance to target
      // Calculate distance to target 
      const targetDistance = Math.sqrt(
        Math.pow(this.target.point.x - this.cursor.point.x, 2) + 
        Math.pow(this.target.point.y - this.cursor.point.y, 2)
      ); 

      // Check if we're in training phase (Phase 1) or testing phase (Phase 2)
      const isTrainingPhase = this.experimentConfig.target_jump[this.trial] === 1.0;

      // Different trial ending conditions based on phase:
      // - Phase 1 (Training): Only end when cursor is close enough to target
      // - Phase 2 (Testing): End when either reach distance exceeds target_dist OR when close to target
      if ((isTrainingPhase && targetDistance < this.target.radius * 2) || 
          (!isTrainingPhase && (distance > this.target_dist || targetDistance < this.target.radius * 2))) {
        this.musicBox.pause();
        this.fb_phase();
}
        break;
    }
  }
  
  // Handle keyboard input for advancing between blocks
  advance_block(event) {
    // Handle key presses
    const key = event.key.toLowerCase();
    const SPACE_BAR = " ";
    const a = "a";
    const b = "b";
    
    // Get current between-block message
    const bb_mess = this.experimentConfig.between_blocks[this.trial];
    
    // Start first trial immediately
    if (bb_mess === 0 && this.trial === 0) {
      this.search_phase();
      return;
    }
    
    // Handle keys during between-blocks phase
    if (this.game_phase === this.Phase.BETWEEN_BLOCKS) {
      if (bb_mess === 1 && key === b) {
        this.search_phase();
        return;
      }
      
      if (bb_mess === 2 && key === SPACE_BAR) {
        this.search_phase();
        return;
      }
      
      if (key === SPACE_BAR) {
        this.search_phase();
        return;
      }
    }
  }
  
  // Display messages for between-block phases
  displayMessage(idx) {
    const messages = this.messages[idx] || ["Press any key to continue"];
    
    // Update message lines
    for (let i = 0; i < 4; i++) {
      const messageElement = d3.select(`#message-line-${i+1}`);
      if (i < messages.length) {
        messageElement.attr("display", "block").text(messages[i]);
      } else {
        messageElement.attr("display", "none");
      }
    }
  }
  
  // Hide all message lines
  hideMessage() {
    d3.select("#message-line-1").attr("display", "none");
    d3.select("#message-line-2").attr("display", "none");
    d3.select("#message-line-3").attr("display", "none");
    d3.select("#message-line-4").attr("display", "none");
  }
  
  // Phase when searching for the center start circle
  search_phase() {
    // Clear any existing timers
    if (this.hold_timer !== null) {
      clearTimeout(this.hold_timer);
      this.hold_timer = null;
    }
    
    if (this.too_slow_timer !== null) {
      clearTimeout(this.too_slow_timer);
      this.too_slow_timer = null;
    }
    
    // Start timer for search time
    this.begin = new Date();
    
    // Show start circle, hide target
    this.calibration.display(true);
    this.calibration.setFill("none");
    this.calibration.setStroke("white");
    
    if (this.target_display_timer) {
      clearTimeout(this.target_display_timer);
    }
    this.target_display_timer = setTimeout(() => this.target.display(false), 500);
    
    // Show cursor
    this.cursor.display(true);
    
    // Hide messages
    this.hideMessage();
    
    // Update game phase
    this.game_phase = this.Phase.SEARCHING;
  }
  
  // Phase when holding in the start circle
  hold_phase() {
    // Clear target display timer if it exists
    if (this.target_display_timer !== null) {
      clearTimeout(this.target_display_timer);
      this.target_display_timer = null;
      this.target.display(false);
    }
    
    // Fill the start circle to indicate holding
    this.cursor.display(false);
    this.calibration.display(true);
    this.calibration.setFill("white");
    
    // Clear any remaining timers
    if (this.too_slow_timer !== null) {
      clearTimeout(this.too_slow_timer);
      this.too_slow_timer = null;
    }
    
    // Set timer to show targets after hold time
    this.hold_timer = setTimeout(() => this.show_targets(), this.hold_time);
    
    // Update game phase
    this.game_phase = this.Phase.HOLDING;
  }
  
  // Helper function to animate between two points
  animate(update, duration, onfinish) {
    const start = performance.now();
    
    const animateFrame = function(time) {
      let timeFraction = (time - start) / duration;
      if (timeFraction > 1) timeFraction = 1;
      
      update(timeFraction);
      
      if (timeFraction < 1) {
        requestAnimationFrame(animateFrame);
      } else {
        onfinish();
      }
    };
    
    requestAnimationFrame(animateFrame);
  }
  
  // Play sounds along a path from start to end
  play_sounds(start, end, duration, update) {
    const self = this;
    
    // Ensure audio is initialized before starting
    this.musicBox.initializeAudio().then(() => {
      console.log("Audio initialized for sound demo");
      
      // Make sure the music box is playing
      this.musicBox.play(this.audioContext?.currentTime || 0);
      
      function play_sound_along(t) {
        // Linear interpolation between start and end
        const x = start.x + (end.x - start.x) * t;
        const y = start.y + (end.y - start.y) * t;
        
        // Update callback
        update(x, y);
        
        // Play sound if point is within red square
        if (
          x >= self.squareLeft && 
          x <= self.squareLeft + self.squareSize && 
          y >= self.squareTop && 
          y <= self.squareTop + self.squareSize
        ) {
          self.musicBox.update(x, y, self.squareLeft, self.squareTop, self.squareSize);
          console.log("Playing sound at position:", x, y);
        }
      }
      
      // Animate through points on the path
      this.animate((t) => play_sound_along(t), duration, () => {
        // Stop sound when animation completes
        if (this.stop_target_music_timer) {
          clearTimeout(this.stop_target_music_timer);
        }
        console.log("Sound demo complete, pausing music");
        this.musicBox.pause();
      });
      
      // Set a backup timer to stop audio
      this.stop_target_music_timer = setTimeout(() => {
        console.log("Backup timer triggered to stop sound");
        this.musicBox.pause();
      }, duration + 100);
    }).catch(err => {
      console.error("Failed to initialize audio for demo:", err);
    });
  }
  
  // Phase when target is shown and demo sound is played
  show_targets() {
    // Record search time
    this.hideMessage();
    this.search_time = new Date() - this.begin;
    
    // Start timer for reaction time
    this.begin = new Date();
    
    // Get trial configuration
    const jump = this.experimentConfig.target_jump[this.trial];
    const angle = this.experimentConfig.tgt_angle[this.trial];
    const isTrainingPhase = jump === 1.0;
    
    // Calculate target position
    const offset = isTrainingPhase ? this.experimentConfig.rotation[this.trial] : jump;
    const value = angle + offset;
    const rad = value * (Math.PI / 180);
    
    const start = this.calibration.point;
    const x = start.x + this.target_dist * Math.cos(rad);
    const y = start.y - this.target_dist * Math.sin(rad);
    const end = { x, y };
    
    // Update target position
    this.target.update(x, y);
    this.target.setFill("blue");
    
    // In Phase 1 (Training): Show target visually, no pre-movement sound demo
    // In Phase 2 (Testing): Hide target, play sound demo first
    if (isTrainingPhase) {
      // Training phase - show target, no pre-movement sound
      this.target.display(true);
    } else {
      // Testing phase - hide target, play sound demo first
      this.target.display(false);
      
      // For testing phase (Phase 2), we need clear audio demo
      if (jump !== 1.0) {
        // Show a message that sound is playing
        d3.select("#message-line-1").attr("display", "block")
          .text("Listen to the sound pattern...");
        
        // Play sound demonstration with more deliberate sound
        this.play_sounds(start, end, 3000, (x, y) => {
          // No visual updates during sound demonstration
        });
        
        // Hide the message after demo
        setTimeout(() => {
          d3.select("#message-line-1").attr("display", "none");
        }, 3000);
      } else {
        // In training phase, just play the sound when they move
      }
    }
    
    // Turn start circle green after appropriate delay:
    // - Training phase: standard delay
    // - Testing phase: 1 second after sound demo completes
    const greenDelay = isTrainingPhase ? this.green_time : 4000; // 3sec demo + 1sec wait
    this.green_timer = setTimeout(() => {
      this.calibration.setFill("green");
      this.calibration.setStroke("none");
    }, greenDelay);
    
    // Update game phase
    this.game_phase = this.Phase.SHOW_TARGETS;
  }
  
  // Phase when users are moving/reaching to the target
  moving_phase() {
    // Clear target demo timer if it exists
    if (this.stop_target_music_timer !== null) {
      clearTimeout(this.stop_target_music_timer);
      this.stop_target_music_timer = null;
    }
    
    // Clear green circle timer if it exists
    if (this.green_timer !== null) {
      clearTimeout(this.green_timer);
      this.green_timer = null;
    }
    
    // Record reaction time
    this.rt = new Date() - this.begin;
    
    // Start timer for movement time
    this.begin = new Date();
    
    // Always play sound during movement in both phases
    // Initialize audio for movement
    this.musicBox.initializeAudio().then(() => {
      this.musicBox.play(0);
    });
    
    // Hide start circle, show cursor
    this.calibration.display(false);
    this.cursor.display(true);
    
    // Update game phase
    this.game_phase = this.Phase.MOVING;
  }
  
  // Phase after completing the reach
  fb_phase() {
    // Record movement time
    this.mt = new Date() - this.begin;
    let timer = 0;
    
    // Stop sound
    this.musicBox.pause();
    
    // Check if we're in training or testing phase
    const isTrainingPhase = this.experimentConfig.target_jump[this.trial] === 1.0;
    
    // Only show target in training phase
    if (isTrainingPhase) {
      this.target.display(true);
      this.target.setFill("green");
      this.reach_feedback = "good_reach";
    } else {
      // In testing phase, don't show target but still provide feedback message
      // Just a quick successful feedback cue
      d3.select("#message-line-1").attr("display", "block")
        .text("Good job!");
      setTimeout(() => {
        d3.select("#message-line-1").attr("display", "none");
      }, 200);
      
      this.reach_feedback = "good_reach";
    }
    
    // Set timer for next trial
    timer = this.feedback_time;
    setTimeout(() => this.next_trial(), timer);
    
    // Calculate final hand angle
    const hand_fb_x = this.calibration.point.x +
      this.target_dist * Math.cos(this.hand_fb_angle * (Math.PI / 180));
    const hand_fb_y = this.calibration.point.y -
      this.target_dist * Math.sin(this.hand_fb_angle * (Math.PI / 180));
    
    // Show cursor for feedback
    this.cursor.display(true);
    
    // Update game phase
    this.game_phase = this.Phase.FEEDBACK;
  }
  
  // Start the trial
  start_trial() {
    this.subjTrials = new Trial(this.experimentID, this.subject.id);
    
    d3.select("#too_slow_message").attr("display", "none");
    this.calibration.display(false);
    
    // Update trial counter display
    const totalTrials = this.experimentConfig.numtrials;
    d3.select("#trialcount").text(
      "Reach Number: " + (this.trial + 1) + " / " + totalTrials
    );
    
    // Start with search phase
    this.search_phase();
  }
  
  // End the experiment
  end_trial() {
    window.removeEventListener("resize", this.monitorWindow, false);
    document.removeEventListener("click", this.setPointerLock, false);
    document.exitPointerLock();
    this.endGame();
  }
  
  // Process the completed trial and prepare for the next one
  next_trial() {
    // Store trial data
    this.subjTrials.appendTrialBlock(
      this.experimentConfig.tgt_angle[this.trial],
      this.experimentConfig.rotation[this.trial],
      this.hand_fb_angle,
      this.rt,
      this.mt,
      this.search_time,
      this.reach_feedback,
      this.handPositions
    );
    
    // Reset timing variables
    this.rt = 0;
    this.mt = 0;
    this.search_time = 0;
    this.play_sound = true;
    
    // Clear hand positions array
    this.handPositions = [];
    
    // Get message for between blocks
    const bb_mess = this.experimentConfig.between_blocks[this.trial];
    
    // Increment trial counter
    this.trial += 1;
    
    // Update trial counter display
    const totalTrials = this.experimentConfig.numtrials;
    d3.select("#trialcount").text(
      "Reach Number: " + this.trial + " / " + totalTrials
    );
    
    // Check if experiment is complete
    if (this.trial >= this.experimentConfig.numtrials) {
      this.end_trial();
    } 
    // After first trial, show a "Way to go!" message
    else if (this.trial === 1) {
      this.displayMessage(0); // Use the first message: "Way to go! Press SPACE BAR to continue."
      this.game_phase = this.Phase.BETWEEN_BLOCKS;
    }
    // Display between-block message if needed
    else if (bb_mess) {
      this.displayMessage(bb_mess);
      this.game_phase = this.Phase.BETWEEN_BLOCKS;
    } 
    // Otherwise continue to next trial
    else {
      this.search_phase();
    }
  }
  
  // Clean up and end the experiment
  endGame() {
    // Show completion message
    alert("Experiment complete! Thank you for participating.");
    
    // Restore cursor and background
    document.querySelector("html").style.cursor = "auto";
    document.querySelector("body").style.cursor = "auto";
    
    // Save final data
    if (this.subjTrials && this.subjTrials.save) {
      this.subjTrials.save();
    }
    
    if (this.subject && this.subject.save) {
      this.subject.save();
    }
    
    // You can add custom Firebase completion logic here
    
    console.log("Experiment completed!");
  }
}

//#region Firebase Database Classes
// Database class for storing experiment data with Firebase
class Database {
  constructor(table_name) {
    this.table_name = table_name;
  }
  
  save() {
    const firestore = firebase.firestore();
    const collection = firestore.collection(this.table_name);
    
    return collection.doc(this.id).set(this)
      .then(function() {
        console.log(`Saved data to ${this.table_name}`);
        return true;
      })
      .catch(function(err) {
        console.error(`Error saving to ${this.table_name}:`, err);
        throw err;
      });
  }
}

// Subject class for tracking participant information
class Subject extends Database {
  constructor(id, age, sex, handedness, mousetype, returner, ethnicity, race) {
    super("subject");
    this.id = id;
    this.age = age;
    this.sex = sex;
    this.handedness = handedness;
    this.mousetype = mousetype;
    this.returner = returner;
    this.tgt_file = "spatial-rhythm-experiment";
    this.ethnicity = ethnicity;
    this.race = race;
    this.comments = null;
    this.distractions = [];
    this.distracto = null;
  }
  
  isValid() {
    return !(!this.id || !this.age || !this.sex || !this.handedness || !this.mousetype);
  }
}

// Trial class for tracking experiment trials
class Trial extends Database {
  constructor(experimentID, id) {
    super("trial");
    this.id = id;
    this.experimentID = experimentID;
    this.cursor_data = [];
    this.blocks = [];
  }
  
  getBlockNum() {
    return this.blocks.length;
  }
  
  appendTrialBlock(
    target_angle,
    rotation,
    hand_angle,
    rt,
    mt,
    time,
    feedback,
    cursor_data
  ) {
    const lastTrialNum = this.getBlockNum();
    const block = new Block(
      lastTrialNum + 1,
      target_angle,
      rotation,
      hand_angle,
      rt,
      mt,
      time,
      feedback
    );
    
    // Clone cursor data array
    const data = [...cursor_data];
    
    // Add data to trial
    this.cursor_data.push(data);
    this.blocks.push(block);
  }
}

// Block class for individual trial blocks
class Block extends Database {
  constructor(num, target_angle, rotation, hand_angle, rt, mt, time, feedback) {
    super("block");
    
    // Create timestamp
    const d = new Date();
    const current_date = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}.${d.getSeconds()}.${d.getMilliseconds()}`;
    
    this.trialNum = num;
    this.currentDate = current_date;
    this.target_angle = target_angle;
    this.trial_type = "online_fb"; 
    this.rotation = rotation;
    this.hand_fb_angle = hand_angle;
    this.rt = rt;
    this.mt = mt;
    this.search_time = time;
    this.reach_feedback = feedback;
  }
}

// Log class for tracking cursor movement
class Log {
  constructor(timestamp, x, y) {
    this.timestamp = timestamp;
    this.x = x;
    this.y = y;
  }
}
//#endregion

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

  show("container-exp");
  openFullScreen();
  startGame();
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
    tgt_file: "spatial-rhythm-experiment",
    ethnicity: subject.ethnicity,
    race: subject.race,
    comments: subject.comments,
    distractions: subject.distractions,
    distracto: subject.distracto,
  };

  // Save the subject data to Firebase
  const firestore = firebase.firestore();
  const subjectcollection = firestore.collection("Subjects");
  subjectcollection.doc(subject.id).set(subject_data);
  
  show("final-page");
}

// Function used to start running the game
function startGame() {
  // Create and initialize the experiment
  const experiment = new SpatialRhythmExperiment();
  experiment.initialize();
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

  // Save trials data to Firebase
  if (subjTrials) {
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
      // cursor_data: subjTrials.cursor_data, // This can be very large, consider omitting
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

    const firestore = firebase.firestore();
    const trialcollection = firestore.collection("Trials");
    trialcollection.doc(subjTrials.id).set(subjTrial_data);
  }
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

// Initialize when document is ready
document.addEventListener("DOMContentLoaded", function() {
  // Firebase initialization would normally go here
  console.log("Document ready, experiment can be started");
});
