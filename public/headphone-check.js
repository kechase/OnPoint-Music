/**
 * Headphone Check Script
 * 
 * This script implements a standard headphone check procedure based on the Huggins Pitch Test,
 * which can reliably detect if someone is wearing headphones instead of using speakers.
 * 
 * First, a volume calibration step ensures participants have their volume set to an appropriate level.
 * Then the test presents three tones in each trial - two are simple sine waves, and one is a 
 * Huggins Pitch stimulus that is only detectable with headphones due to binaural processing.
 * Participants must identify which tone is different (the Huggins Pitch tone).
 */


class HeadphoneCheck {
  constructor(options = {}) {
    // Default configuration
    this.config = {
      trials: options.trials || 6,
      passingScore: options.passingScore || 6,
      sampleRate: options.sampleRate || 44100,
      toneDuration: options.toneDuration || 1,  // seconds
      fadeTime: options.fadeTime || 0.05,       // seconds
      toneFrequency: options.toneFrequency || 600, // Hz
      pitchShift: options.pitchShift || 40,     // Hz for Huggins Pitch
      waitBetweenTrials: options.waitBetweenTrials || 0.5, // seconds
      volumeLevel: options.volumeLevel || 0.6,  // 0-1 scale
      skipVolumeCheck: options.skipVolumeCheck || false, // whether to skip volume check
      onFinish: options.onFinish || null,
      onFail: options.onFail || null,
      onPass: options.onPass || null
    };
    
    // Audio context setup
    this.audioContext = null;
    this.correctAnswers = 0;
    this.currentTrial = 0;
    this.trialOrder = [];
    
    // UI elements
    this.container = null;
    this.startButton = null;
    this.toneButtons = [];
    this.statusText = null;
    this.volumeCheckComplete = false;
    
    // Bind methods
    this.startTest = this.startTest.bind(this);
    this.createTone = this.createTone.bind(this);
    this.createHugginsPitch = this.createHugginsPitch.bind(this);
    this.playTone = this.playTone.bind(this);
    this.handleToneSelection = this.handleToneSelection.bind(this);
    this.nextTrial = this.nextTrial.bind(this);
    this.finishTest = this.finishTest.bind(this);
    this.checkVolume = this.checkVolume.bind(this);
  }
  
  init() {
    // Create container for the test
    this.container = document.createElement('div');
    this.container.className = 'headphone-check';
    this.container.style.cssText = `
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      font-family: Arial, sans-serif;
      text-align: center;
    `;
    
    if (!this.config.skipVolumeCheck) {
      // Create volume check first
      this.initVolumeCheck();
    } else {
      // Skip directly to headphone check
      this.initHeadphoneCheck();
    }
    
  // Add container to the headphone-check-container instead of document.body
  const containerEl = document.getElementById('headphone-check-container');
  if (containerEl) {
    containerEl.appendChild(this.container);
  } else {
    // Fallback to document.body if container not found
    document.body.appendChild(this.container);
  }
}

  checkAudioCapabilities() {
    // Check if AudioContext is supported
    if (!window.AudioContext && !window.webkitAudioContext) {
      alert("Your browser doesn't support Web Audio API which is required for this test. Please use Chrome.");
      return false;
    }
    
    // Try to detect mono output (though this isn't 100% reliable)
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    if (audioContext.destination.maxChannelCount < 2) {
      alert("Your audio output appears to be mono, but this test requires stereo output headphones. Please check your audio settings.");
      return false;
    }
    
    return true;
  }
  
  initVolumeCheck() {
    // Clear container content
    this.container.innerHTML = '';
    
    // Add volume check instructions
    const instructions = document.createElement('div');
    instructions.innerHTML = `
      <h2>Volume Adjustment</h2>
      <p>First, let's get your volume set to a comfortable level.
      <p>Please put on your headphones and ensure you are in a quiet environment.</p>
      <p>Click the button below to play a calibration tone. Adjust your volume so it's audible and clear. Repeat as necessary until you are satisfied with the level.</p>
    `;
    this.container.appendChild(instructions);
    
    // Variables to store audio nodes
  let oscillator = null;
  let gainNode = null;
  
  // Create audio player controls
  const audioControls = document.createElement('div');
  audioControls.style.cssText = `
    margin: 30px 0;
    display: flex;
    justify-content: center;
    gap: 20px;
  `;
  
  // Create play button
  const playButton = document.createElement('button');
  playButton.textContent = 'Play Tone';
  playButton.style.cssText = `
    padding: 12px 24px;
    font-size: 16px;
    background-color: #03a9f4;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  `;
  
  // Create stop button (initially hidden)
  const stopButton = document.createElement('button');
  stopButton.textContent = 'Stop Tone';
  stopButton.style.cssText = `
    padding: 12px 24px;
    font-size: 16px;
    background-color: #f44336;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    display: none;
  `;
  
  audioControls.appendChild(playButton);
  audioControls.appendChild(stopButton);
  this.container.appendChild(audioControls);
  
  // Continue button
  const continueButton = document.createElement('button');
  continueButton.textContent = 'Continue to Headphone Setup';
  continueButton.style.cssText = `
    padding: 10px 20px;
    font-size: 16px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 20px;
    display: none;
  `;
  
  this.container.appendChild(continueButton);
  
  // Add event listeners for tone control
  playButton.addEventListener('click', () => {
    // Initialize audio context (must be initiated by user gesture)
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)({
        sampleRate: this.config.sampleRate
      });
    }
    
    // Create and start a looping calibration tone
    oscillator = this.audioContext.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.value = this.config.toneFrequency;
    
    gainNode = this.audioContext.createGain();
    gainNode.gain.value = this.config.volumeLevel;
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    oscillator.start();
    
    // Show stop button and hide play button
    playButton.style.display = 'none';
    stopButton.style.display = 'inline-block';
  });
  
  stopButton.addEventListener('click', () => {
    // Stop the oscillator
    if (oscillator) {
      oscillator.stop();
      oscillator.disconnect();
      oscillator = null;
    }
    
    if (gainNode) {
      gainNode.disconnect();
      gainNode = null;
    }
    
    // Update button visibility
    stopButton.style.display = 'none';
    continueButton.style.display = 'inline-block';
  });
  
  continueButton.addEventListener('click', () => {
    this.volumeCheckComplete = true;
    this.initHeadphoneCheck();
  });
}
  
  playCalibrationTone(volume) {
    // Create a x-second calibration tone
    const duration = 5;
    const frequency = this.config.toneFrequency;
    
    // Create an oscillator
    const oscillator = this.audioContext.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    
    // Create a gain node for volume control
    const gainNode = this.audioContext.createGain();
    gainNode.gain.value = volume;
    
    // Apply fade in/out to avoid clicks
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + this.config.fadeTime);
    gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime + duration - this.config.fadeTime);
    gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + duration);
    
    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    // Play and stop
    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + duration);
  }
  
  addPreHeadphoneCheck() {
    // Create container for preliminary test
    const preCheckContainer = document.createElement('div');
    preCheckContainer.style.cssText = `
      margin: 20px 0;
      padding: 15px;
      border: 1px solid #ccc;
      background-color: #f9f9f9;
    `;
    
    preCheckContainer.innerHTML = `
      <h3>Now let's verify stereo setup</h3>
      <p>Click the 'Test' button below and you should hear:</p>
      <ul>
        <li>A clicking sound in your LEFT ear followed by a clicking sound in your RIGHT ear.</li>
      </ul>
      <p>If you hear the sound in both ears or from your speakers, adjust your setup.</p>
      <button id="pre-check-button" style="
        padding: 10px 20px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        margin: 10px 0;
      ">Test Left / Right Audio</button>
    `;
    
    this.container.appendChild(preCheckContainer);
    
    // Add click event listener for the pre-check button
    const preCheckButton = document.getElementById('pre-check-button');
    if (preCheckButton) {
      preCheckButton.addEventListener('click', () => this.runPreCheck());
    }
  }
  
  runPreCheck() {
    // Initialize audio context if not already
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)({
        sampleRate: this.config.sampleRate
      });
    }
    
    // Create buffers for left and right ear tests
    const duration = 0.2; // 200ms
    const bufferSize = this.audioContext.sampleRate * duration;
    const leftBuffer = this.audioContext.createBuffer(2, bufferSize, this.audioContext.sampleRate);
    const rightBuffer = this.audioContext.createBuffer(2, bufferSize, this.audioContext.sampleRate);
    
    // Fill left buffer (left channel only)
    const leftChannel = leftBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      // Simple click sound
      leftChannel[i] = i < bufferSize/10 ? Math.sin(i/10) : 0;
    }
    
    // Fill right buffer (right channel only)
    const rightChannel = rightBuffer.getChannelData(1);
    for (let i = 0; i < bufferSize; i++) {
      // Simple click sound
      rightChannel[i] = i < bufferSize/10 ? Math.sin(i/10) : 0;
    }
    
    // Play sequence
    const playLeftRight = async () => {
      // Play left ear
      const leftSource = this.audioContext.createBufferSource();
      leftSource.buffer = leftBuffer;
      leftSource.connect(this.audioContext.destination);
      leftSource.start();
      
      // Wait for left sound to finish
      await new Promise(resolve => setTimeout(resolve, duration * 1000 + 500));
      
      // Play right ear
      const rightSource = this.audioContext.createBufferSource();
      rightSource.buffer = rightBuffer;
      rightSource.connect(this.audioContext.destination);
      rightSource.start();
    };
    
    playLeftRight();
  }

  initHeadphoneCheck() {
    // Clear container content
    this.container.innerHTML = '';
    
    // Main heading
    const mainHeading = document.createElement('h2');
    mainHeading.textContent = 'Headphone Setup';
    mainHeading.style.marginBottom = '10px';
    this.container.appendChild(mainHeading);
    
    // Step 1: Left/Right Check - styled to match other sections
    const stereoCheckSection = document.createElement('div');
    stereoCheckSection.style.cssText = `
      margin: 20px 0;
      padding: 15px;
      border: 1px solid #ccc;
      background-color: #f9f9f9;
      border-radius: 4px;
    `;
    
    stereoCheckSection.innerHTML = `
      <h3>Step 1: Stereo Check</h3>
        Click the button below to test your stereo setup:
        <p>You should hear a click in your <strong>LEFT</strong> ear, followed by a click in your <strong>RIGHT</strong> ear</p>
      </ul>
      <p>If you can't distinguish the left and right sounds, please check your headphone connection and settings. Retest as many times as you need until you can distingush the sounds.</p>
      <button id="stereo-check-button" style="
        padding: 10px 20px;
        background-color: #2196F3;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        margin: 10px 0;
      ">Test Left/Right Audio</button>
    `;
    
    this.container.appendChild(stereoCheckSection);
    
    // Step 2: Headphone Verification Test
    const verificationSection = document.createElement('div');
    verificationSection.style.cssText = `
      margin: 20px 0;
      padding: 15px;
      border: 1px solid #ccc;
      background-color: #f9f9f9;
      border-radius: 4px;
    `;
    
    verificationSection.innerHTML = `
      <h3>Step 2: Headphone Verification</h3>
      <p>Now, let's verify your headphone setup.</p>
      <p>In this test, you'll hear three tones total: Two identical tones and one different tone. There will be a button for each tone (Tone 1, 2 and 3)</p>
      <p><strong>In each round, click the button that sounds different.</strong></p>      
      <br><p>Click the button below to start the test.</p></br>
    `;
    
    this.container.appendChild(verificationSection);
    
    // Create start button
    this.startButton = document.createElement('button');
    this.startButton.textContent = 'Start Headphone Verification';
    this.startButton.style.cssText = `
      padding: 10px 20px;
      font-size: 16px;
      background-color: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      margin: 20px 0;
      display: block;
      margin-left: auto;
      margin-right: auto;
    `;
    this.startButton.addEventListener('click', this.startTest);
    this.container.appendChild(this.startButton);
    
    // Create tone selection buttons (hidden initially)
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
      display: none;
      justify-content: space-around;
      margin: 30px 0;
    `;
    buttonContainer.id = 'tone-buttons';
    
    for (let i = 1; i <= 3; i++) {
      const button = document.createElement('button');
      button.textContent = `Tone ${i}`;
      button.dataset.tone = i;
      button.style.cssText = `
        padding: 15px 25px;
        font-size: 18px;
        background-color: #2196F3;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      `;
      button.addEventListener('click', this.handleToneSelection);
      buttonContainer.appendChild(button);
      this.toneButtons.push(button);
    }
    
    this.container.appendChild(buttonContainer);
    
    // Status text
    this.statusText = document.createElement('div');
    this.statusText.style.cssText = `
      margin: 20px 0;
      font-size: 16px;
      min-height: 40px;
    `;
    this.container.appendChild(this.statusText);
    
    // Add click event listener for the stereo check button
    setTimeout(() => {
      const stereoCheckButton = document.getElementById('stereo-check-button');
      if (stereoCheckButton) {
        stereoCheckButton.addEventListener('click', () => this.runPreCheck());
      }
    }, 0);
    
    // Randomize trial order
    this.createTrialOrder();
  }
  
  createTrialOrder() {
    // Each trial has a target position (1, 2, or 3)
    this.trialOrder = [];
    for (let i = 0; i < this.config.trials; i++) {
      // Randomly select which of the three tones will be the Huggins Pitch
      const targetPosition = Math.floor(Math.random() * 3) + 1;
      this.trialOrder.push(targetPosition);
    }
  }
  
  startTest() {
    // Initialize audio context (must be initiated by user gesture)
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)({
        sampleRate: this.config.sampleRate
      });
    }
    
    // Hide start button and show tone buttons
    this.startButton.style.display = 'none';
    document.getElementById('tone-buttons').style.display = 'flex';
    
    // Start first trial
    this.currentTrial = 0;
    this.correctAnswers = 0;
    this.nextTrial();
  }
  
  /**
   * Public method to check volume before headphone test
   * @returns {Promise} Resolves when volume check is complete
   */
  checkVolume() {
    return new Promise((resolve) => {
      // Skip if already completed volume check
      if (this.volumeCheckComplete) {
        resolve();
        return;
      }
      
      // Store current container content to restore later
      const originalContent = this.container.innerHTML;
      
      // Initialize volume check UI
      this.initVolumeCheck();
      
      // Set up a mutation observer to detect when volume check is complete
      const observer = new MutationObserver(() => {
        if (this.volumeCheckComplete) {
          observer.disconnect();
          resolve();
        }
      });
      
      observer.observe(this.container, { childList: true, subtree: true });
    });
  }
  
  createTone(frequency, duration) {
    const sampleRate = this.config.sampleRate;
    const numSamples = Math.floor(duration * sampleRate);
    const buffer = this.audioContext.createBuffer(1, numSamples, sampleRate);
    const data = buffer.getChannelData(0);
    
    // Create sine wave
    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate;
      let amplitude = this.config.volumeLevel;
      
      // Apply fade in/out
      if (t < this.config.fadeTime) {
        amplitude *= (t / this.config.fadeTime);
      } else if (t > duration - this.config.fadeTime) {
        amplitude *= (duration - t) / this.config.fadeTime;
      }
      
      data[i] = amplitude * Math.sin(2 * Math.PI * frequency * t);
    }
    
    return buffer;
  }
  
  createHugginsPitch(baseFrequency, pitchShift, duration) {
    const sampleRate = this.config.sampleRate;
    const numSamples = Math.floor(duration * sampleRate);
    
    // Create a stereo buffer (2 channels)
    const buffer = this.audioContext.createBuffer(2, numSamples, sampleRate);
    const leftChannel = buffer.getChannelData(0);
    const rightChannel = buffer.getChannelData(1);
    
    // Create Huggins Pitch stimuli with more distinct phase differences
    // Use 180-degree phase shift for maximum difference
    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate;
      let amplitude = this.config.volumeLevel;
      
      // Apply fade in/out
      if (t < this.config.fadeTime) {
        amplitude *= (t / this.config.fadeTime);
      } else if (t > duration - this.config.fadeTime) {
        amplitude *= (duration - t) / this.config.fadeTime;
      }
      
      // Left channel: standard sine wave
      leftChannel[i] = amplitude * Math.sin(2 * Math.PI * baseFrequency * t);
      
      // Right channel: add phase shift - 180 degrees (Math.PI) out of phase for maximum distinction
      rightChannel[i] = amplitude * Math.sin(2 * Math.PI * (baseFrequency + pitchShift) * t + Math.PI);
    }
    
    return buffer;
  }
  
  async playTone(buffer) {
    return new Promise(resolve => {
      const source = this.audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(this.audioContext.destination);
      source.start();
      source.onended = resolve;
    });
  }
  
  async nextTrial() {
    if (this.currentTrial >= this.config.trials) {
      this.finishTest();
      return;
    }
    
    this.statusText.textContent = `Trial ${this.currentTrial + 1} of ${this.config.trials}`;
    
    // Enable all buttons
    this.toneButtons.forEach(button => {
      button.disabled = false;
      button.style.backgroundColor = '#2196F3';
    });
    
    // Determine which tone is the target (Huggins Pitch)
    const targetPosition = this.trialOrder[this.currentTrial];
    
    // Create the audio buffers
    const standardTone = this.createTone(this.config.toneFrequency, this.config.toneDuration);
    const hugginsTone = this.createHugginsPitch(
      this.config.toneFrequency, 
      this.config.pitchShift, 
      this.config.toneDuration
    );
    
    // Play the tones in sequence with delay between them
    for (let i = 1; i <= 3; i++) {
      // Highlight the current tone button
      this.toneButtons[i-1].style.backgroundColor = '#FF5722';
      
      // Play the appropriate tone
      if (i === targetPosition) {
        await this.playTone(hugginsTone);
      } else {
        await this.playTone(standardTone);
      }
      
      // Reset button color
      this.toneButtons[i-1].style.backgroundColor = '#2196F3';
      
      // Wait between tones
      if (i < 3) {
        await new Promise(resolve => setTimeout(resolve, this.config.waitBetweenTrials * 1000));
      }
    }
  }
  
  handleToneSelection(event) {
    const selectedTone = parseInt(event.target.dataset.tone);
    const correctTone = this.trialOrder[this.currentTrial];
    
    // Disable all buttons during feedback
    this.toneButtons.forEach(button => {
      button.disabled = true;
    });
    
    if (selectedTone === correctTone) {
      this.correctAnswers++;
      this.toneButtons[selectedTone-1].style.backgroundColor = '#4CAF50'; // Green for correct
      this.statusText.textContent = 'Correct!';
    } else {
      this.toneButtons[selectedTone-1].style.backgroundColor = '#F44336'; // Red for incorrect
      this.toneButtons[correctTone-1].style.backgroundColor = '#4CAF50'; // Show the correct one
      this.statusText.textContent = 'Incorrect. The different tone was: ' + correctTone;
    }
    
    // Move to next trial after delay
    this.currentTrial++;
    setTimeout(() => {
      this.nextTrial();
    }, 1500);
  }
  
  finishTest() {
    // Hide tone buttons
    document.getElementById('tone-buttons').style.display = 'none';
    
    // Calculate if participant passed
    const passed = this.correctAnswers == this.config.passingScore;
    
    if (passed) {
      // Call the appropriate callback
      if (this.config.onPass) {
        this.config.onPass(this.correctAnswers);
      }
      
      // We don't need to show any results or continue button here since
      // the onPass callback will handle showing the next page (container-instructions1)
      
      this.statusText.innerHTML = `
        <h3>Headphone Check Passed!</h3>
        <p>You correctly identified ${this.correctAnswers} out of ${this.config.trials} tones.</p>
      `;
    } else {
      // Failed - Show restart button and message
      this.statusText.innerHTML = `
        <h3>Headphone Check Failed</h3>
        <p>You correctly identified ${this.correctAnswers} out of ${this.config.trials} tones.</p>
        <p>Please ensure you are wearing headphones and try again.</p>
      `;
      
      this.startButton.textContent = 'Try Again';
      this.startButton.style.display = 'inline-block';
      
      // Call the onFail callback if provided
      if (this.config.onFail) {
        this.config.onFail(this.correctAnswers);
      }
    }
    
    // Call the onFinish callback if provided
    if (this.config.onFinish) {
      this.config.onFinish({
        passed,
        score: this.correctAnswers,
        total: this.config.trials
      });
    }
  }
}