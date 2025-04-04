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
const fileContent = {
  "numtrials": 100, "trialnum": {"0": 1, "1": 2, "2": 3, "3": 4, "4": 5, "5": 6, "6": 7, "7": 8, "8": 9, "9": 10, "10": 11, "11": 12, "12": 13, "13": 14, "14": 15, "15": 16, "16": 17, "17": 18, "18": 19, "19": 20, "20": 21, "21": 22, "22": 23, "23": 24, "24": 25, "25": 26, "26": 27, "27": 28, "28": 29, "29": 30, "30": 31, "31": 32, "32": 33, "33": 34, "34": 35, "35": 36, "36": 37, "37": 38, "38": 39, "39": 40, "40": 41, "41": 42, "42": 43, "43": 44, "44": 45, "45": 46, "46": 47, "47": 48, "48": 49, "49": 50, "50": 51, "51": 52, "52": 53, "53": 54, "54": 55, "55": 56, "56": 57, "57": 58, "58": 59, "59": 60, "60": 61, "61": 62, "62": 63, "63": 64, "64": 65, "65": 66, "66": 67, "67": 68, "68": 69, "69": 70, "70": 71, "71": 72, "72": 73, "73": 74, "74": 75, "75": 76, "76": 77, "77": 78, "78": 79, "79": 80, "80": 81, "81": 82, "82": 83, "83": 84, "84": 85, "85": 86, "86": 87, "87": 88, "88": 89, "89": 90, "90": 91, "91": 92, "92": 93, "93": 94, "94": 95, "95": 96, "96": 97, "97": 98, "98": 99, "99": 100,
  },
  "aiming_landmarks": {"0": 0, "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0, "8": 0, "9": 0, "10": 0, "11": 0, "12": 0, "13": 0, "14": 0, "15": 0, "16": 0, "17": 0, "18": 0, "19": 0, "20": 0, "21": 0, "22": 0, "23": 0, "24": 0, "25": 0, "26": 0, "27": 0, "28": 0, "29": 0, "30": 0, "31": 0, "32": 0, "33": 0, "34": 0, "35": 0, "36": 0, "37": 0, "38": 0, "39": 0, "40": 0, "41": 0, "42": 0, "43": 0, "44": 0, "45": 0, "46": 0, "47": 0, "48": 0, "49": 0, "50": 0, "51": 0, "52": 0, "53": 0, "54": 0, "55": 0, "56": 0, "57": 0, "58": 0, "59": 0, "60": 0, "61": 0, "62": 0, "63": 0, "64": 0, "65": 0, "66": 0, "67": 0, "68": 0, "69": 0, "70": 0, "71": 0, "72": 0, "73": 0, "74": 0, "75": 0, "76": 0, "77": 0, "78": 0, "79": 0, "80": 0, "81": 0, "82": 0, "83": 0, "84": 0, "85": 0, "86": 0, "87": 0, "88": 0, "89": 0, "90": 0, "91": 0, "92": 0, "93": 0, "94": 0, "95": 0, "96": 0, "97": 0, "98": 0, "99": 0,
  },
  "online_fb": {"0": 1, "1": 1, "2": 1, "3": 1, "4": 1, "5": 1, "6": 1, "7": 1, "8": 1, "9": 1, "10": 1, "11": 1, "12": 1, "13": 1, "14": 1, "15": 1, "16": 1, "17": 1, "18": 1, "19": 1, "20": 1, "21": 1, "22": 1, "23": 1, "24": 1, "25": 1, "26": 1, "27": 1, "28": 1, "29": 1, "30": 1, "31": 1, "32": 1, "33": 1, "34": 1, "35": 1, "36": 1, "37": 1, "38": 1, "39": 1, "40": 1, "41": 1, "42": 1, "43": 1, "44": 1, "45": 1, "46": 1, "47": 1, "48": 1, "49": 1, "50": 1, "51": 1, "52": 1, "53": 1, "54": 1, "55": 1, "56": 1, "57": 1, "58": 1, "59": 1, "60": 1, "61": 1, "62": 1, "63": 1, "64": 1, "65": 1, "66": 1, "67": 1, "68": 1, "69": 1, "70": 1, "71": 1, "72": 1, "73": 1, "74": 1, "75": 1, "76": 1, "77": 1, "78": 1, "79": 1, "80": 1, "81": 1, "82": 1, "83": 1, "84": 1, "85": 1, "86": 1, "87": 1, "88": 1, "89": 1, "90": 1, "91": 1, "92": 1, "93": 1, "94": 1, "95": 1, "96": 1, "97": 1, "98": 1, "99": 1,
  },
  "endpoint_feedback": {"0": 1, "1": 1, "2": 1, "3": 1, "4": 1, "5": 1, "6": 1, "7": 1, "8": 1, "9": 1, "10": 1, "11": 1, "12": 1, "13": 1, "14": 1, "15": 1, "16": 1, "17": 1, "18": 1, "19": 1, "20": 1, "21": 1, "22": 1, "23": 1, "24": 1, "25": 1, "26": 1, "27": 1, "28": 1, "29": 1, "30": 1, "31": 1, "32": 1, "33": 1, "34": 1, "35": 1, "36": 1, "37": 1, "38": 1, "39": 1, "40": 1, "41": 1, "42": 1, "43": 1, "44": 1, "45": 1, "46": 1, "47": 1, "48": 1, "49": 1, "50": 1, "51": 1, "52": 1, "53": 1, "54": 1, "55": 1, "56": 1, "57": 1, "58": 1, "59": 1, "60": 1, "61": 1, "62": 1, "63": 1, "64": 1, "65": 1, "66": 1, "67": 1, "68": 1, "69": 1, "70": 1, "71": 1, "72": 1, "73": 1, "74": 1, "75": 1, "76": 1, "77": 1, "78": 1, "79": 1, "80": 1, "81": 1, "82": 1, "83": 1, "84": 1, "85": 1, "86": 1, "87": 1, "88": 1, "89": 1, "90": 1, "91": 1, "92": 1, "93": 1, "94": 1, "95": 1, "96": 1, "97": 1, "98": 1, "99": 1,
  },
  "rotation": {"0": 0.0, "1": 0.0, "2": 0.0, "3": 0.0, "4": 0.0, "5": 0.0, "6": 0.0, "7": 0.0, "8": 0.0, "9": 0.0, "10": 0.0, "11": 0.0, "12": 0.0, "13": 0.0, "14": 0.0, "15": 0.0, "16": 0.0, "17": 0.0, "18": 0.0, "19": 0.0, "20": 0.0, "21": 0.0, "22": 0.0, "23": 0.0, "24": 0.0, "25": 0.0, "26": 0.0, "27": 0.0, "28": 0.0, "29": 0.0, "30": 0.0, "31": 0.0, "32": 0.0, "33": 0.0, "34": 0.0, "35": 0.0, "36": 0.0, "37": 0.0, "38": 0.0, "39": 0.0, "40": 0.0, "41": 0.0, "42": 0.0, "43": 0.0, "44": 0.0, "45": 0.0, "46": 0.0, "47": 0.0, "48": 0.0, "49": 0.0, "50": 0.0, "51": 0.0, "52": 0.0, "53": 0.0, "54": 0.0, "55": 0.0, "56": 0.0, "57": 0.0, "58": 0.0, "59": 0.0, "60": 0.0, "61": 0.0, "62": 0.0, "63": 0.0, "64": 0.0, "65": 0.0, "66": 0.0, "67": 0.0, "68": 0.0, "69": 0.0, "70": 0.0, "71": 0.0, "72": 0.0, "73": 0.0, "74": 0.0, "75": 0.0, "76": 0.0, "77": 0.0, "78": 0.0, "79": 0.0, "80": 0.0, "81": 0.0, "82": 0.0, "83": 0.0, "84": 0.0, "85": 0.0, "86": 0.0, "87": 0.0, "88": 0.0, "89": 0.0, "90": 0.0, "91": 0.0, "92": 0.0, "93": 0.0, "94": 0.0, "95": 0.0, "96": 0.0, "97": 0.0, "98": 0.0, "99": 0.0,
  },
  "clamped_fb": {"0": 0.0, "1": 0.0, "2": 0.0, "3": 0.0, "4": 0.0, "5": 0.0, "6": 0.0, "7": 0.0, "8": 0.0, "9": 0.0, "10": 0.0, "11": 0.0, "12": 0.0, "13": 0.0, "14": 0.0, "15": 0.0, "16": 0.0, "17": 0.0, "18": 0.0, "19": 0.0, "20": 0.0, "21": 0.0, "22": 0.0, "23": 0.0, "24": 0.0, "25": 0.0, "26": 0.0, "27": 0.0, "28": 0.0, "29": 0.0, "30": 0.0, "31": 0.0, "32": 0.0, "33": 0.0, "34": 0.0, "35": 0.0, "36": 0.0, "37": 0.0, "38": 0.0, "39": 0.0, "40": 0.0, "41": 0.0, "42": 0.0, "43": 0.0, "44": 0.0, "45": 0.0, "46": 0.0, "47": 0.0, "48": 0.0, "49": 0.0, "50": 0.0, "51": 0.0, "52": 0.0, "53": 0.0, "54": 0.0, "55": 0.0, "56": 0.0, "57": 0.0, "58": 0.0, "59": 0.0, "60": 0.0, "61": 0.0, "62": 0.0, "63": 0.0, "64": 0.0, "65": 0.0, "66": 0.0, "67": 0.0, "68": 0.0, "69": 0.0, "70": 0.0, "71": 0.0, "72": 0.0, "73": 0.0, "74": 0.0, "75": 0.0, "76": 0.0, "77": 0.0, "78": 0.0, "79": 0.0, "80": 0.0, "81": 0.0, "82": 0.0, "83": 0.0, "84": 0.0, "85": 0.0, "86": 0.0, "87": 0.0, "88": 0.0, "89": 0.0, "90": 0.0, "91": 0.0, "92": 0.0, "93": 0.0, "94": 0.0, "95": 0.0, "96": 0.0, "97": 0.0, "98": 0.0, "99": 0.0,
  },
  "tgt_angle": {"0": 45, "1": 135, "2": 225, "3": 315, "4": 45, "5": 135, "6": 225, "7": 315, "8": 45, "9": 135, "10": 225, "11": 315, "12": 45, "13": 135, "14": 225, "15": 315, "16": 45, "17": 135, "18": 225, "19": 315, "20": 45, "21": 45, "22": 45, "23": 45, "24": 45, "25": 45, "26": 45, "27": 45, "28": 45, "29": 45, "30": 45, "31": 45, "32": 45, "33": 45, "34": 45, "35": 45, "36": 45, "37": 45, "38": 45, "39": 45, "40": 135, "41": 135, "42": 135, "43": 135, "44": 135, "45": 135, "46": 135, "47": 135, "48": 135, "49": 135, "50": 135, "51": 135, "52": 135, "53": 135, "54": 135, "55": 135, "56": 135, "57": 135, "58": 135, "59": 135, "60": 225, "61": 225, "62": 225, "63": 225, "64": 225, "65": 225, "66": 225, "67": 225, "68": 225, "69": 225, "70": 225, "71": 225, "72": 225, "73": 225, "74": 225, "75": 225, "76": 225, "77": 225, "78": 225, "79": 225, "80": 315, "81": 315, "82": 315, "83": 315, "84": 315, "85": 315, "86": 315, "87": 315, "88": 315, "89": 315, "90": 315, "91": 315, "92": 315, "93": 315, "94": 315, "95": 315, "96": 315, "97": 315, "98": 315, "99": 315,
  },
  "tgt_distance": {"0": 80, "1": 80, "2": 80, "3": 80, "4": 80, "5": 80, "6": 80, "7": 80, "8": 80, "9": 80, "10": 80, "11": 80, "12": 80, "13": 80, "14": 80, "15": 80, "16": 80, "17": 80, "18": 80, "19": 80, "20": 80, "21": 80, "22": 80, "23": 80, "24": 80, "25": 80, "26": 80, "27": 80, "28": 80, "29": 80, "30": 80, "31": 80, "32": 80, "33": 80, "34": 80, "35": 80, "36": 80, "37": 80, "38": 80, "39": 80, "40": 80, "41": 80, "42": 80, "43": 80, "44": 80, "45": 80, "46": 80, "47": 80, "48": 80, "49": 80, "50": 80, "51": 80, "52": 80, "53": 80, "54": 80, "55": 80, "56": 80, "57": 80, "58": 80, "59": 80, "60": 80, "61": 80, "62": 80, "63": 80, "64": 80, "65": 80, "66": 80, "67": 80, "68": 80, "69": 80, "70": 80, "71": 80, "72": 80, "73": 80, "74": 80, "75": 80, "76": 80, "77": 80, "78": 80, "79": 80, "80": 80, "81": 80, "82": 80, "83": 80, "84": 80, "85": 80, "86": 80, "87": 80, "88": 80, "89": 80, "90": 80, "91": 80, "92": 80, "93": 80, "94": 80, "95": 80, "96": 80, "97": 80, "98": 80, "99": 80, 
  },
  "between_blocks": {"0": 0.0, "1": 0.0, "2": 0.0, "3": 0.0, "4": 0.0, "5": 0.0, "6": 0.0, "7": 0.0, "8": 0.0, "9": 0.0, "10": 0.0, "11": 0.0, "12": 0.0, "13": 0.0, "14": 0.0, "15": 0.0, "16": 0.0, "17": 0.0, "18": 0.0, "19": 2.0, "20": 0.0, "21": 0.0, "22": 0.0, "23": 0.0, "24": 0.0, "25": 0.0, "26": 0.0, "27": 0.0, "28": 0.0, "29": 0.0, "30": 0.0, "31": 0.0, "32": 0.0, "33": 0.0, "34": 0.0, "35": 0.0, "36": 0.0, "37": 0.0, "38": 0.0, "39": 0.0, "40": 0.0, "41": 0.0, "42": 0.0, "43": 0.0, "44": 0.0, "45": 0.0, "46": 0.0, "47": 0.0, "48": 0.0, "49": 0.0, "50": 0.0, "51": 0.0, "52": 0.0, "53": 0.0, "54": 0.0, "55": 0.0, "56": 0.0, "57": 0.0, "58": 0.0, "59": 0.0, "60": 0.0, "61": 0.0, "62": 0.0, "63": 0.0, "64": 0.0, "65": 0.0, "66": 0.0, "67": 0.0, "68": 0.0, "69": 0.0, "70": 0.0, "71": 0.0, "72": 0.0, "73": 0.0, "74": 0.0, "75": 0.0, "76": 0.0, "77": 0.0, "78": 0.0, "79": 0.0, "80": 0.0, "81": 0.0, "82": 0.0, "83": 0.0, "84": 0.0, "85": 0.0, "86": 0.0, "87": 0.0, "88": 0.0, "89": 0.0, "90": 0.0, "91": 0.0, "92": 0.0, "93": 0.0, "94": 0.0, "95": 0.0, "96": 0.0, "97": 0.0, "98": 0.0, "99": 0.0,
  // #19 2.0 will be the number to trigger the chance of phase message to TESTING PHASE
  },
  "target_jump": {"0": 1.0, "1": 1.0, "2": 1.0, "3": 1.0, "4": 1.0, "5": 1.0, "6": 1.0, "7": 1.0, "8": 1.0, "9": 1.0, "10": 1.0, "11": 1.0, "12": 1.0, "13": 1.0, "14": 1.0, "15": 1.0, "16": 1.0, "17": 1.0, "18": 1.0, "19": 1.0, "20": 0.0, "21": 0.0, "22": 0.0, "23": 0.0, "24": 0.0, "25": 0.0, "26": 0.0, "27": 0.0, "28": 0.0, "29": 0.0, "30": 0.0, "31": 0.0, "32": 0.0, "33": 0.0, "34": 0.0, "35": 0.0, "36": 0.0, "37": 0.0, "38": 0.0, "39": 0.0, "40": 0.0, "41": 0.0, "42": 0.0, "43": 0.0, "44": 0.0, "45": 0.0, "46": 0.0, "47": 0.0, "48": 0.0, "49": 0.0, "50": 0.0, "51": 0.0, "52": 0.0, "53": 0.0, "54": 0.0, "55": 0.0, "56": 0.0, "57": 0.0, "58": 0.0, "59": 0.0, "60": 0.0, "61": 0.0, "62": 0.0, "63": 0.0, "64": 0.0, "65": 0.0, "66": 0.0, "67": 0.0, "68": 0.0, "69": 0.0, "70": 0.0, "71": 0.0, "72": 0.0, "73": 0.0, "74": 0.0, "75": 0.0, "76": 0.0, "77": 0.0, "78": 0.0, "79": 0.0, "80": 0.0, "81": 0.0, "82": 0.0, "83": 0.0, "84": 0.0, "85": 0.0, "86": 0.0, "87": 0.0, "88": 0.0, "89": 0.0, "90": 0.0, "91": 0.0, "92": 0.0, "93": 0.0, "94": 0.0, "95": 0.0, "96": 0.0, "97": 0.0, "98": 0.0, "99": 0.0}};

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
  constructor(id, age, sex, handedness, mousetype, returner, ethnicity, race, musicTraining, languageCount, musicInstrument, musicPractice) {
    super("subject");
      this.id = id,
      this.age = age,
      this.sex = sex,
      this.handedness = handedness,
      this.mousetype = mousetype,
      this.returner = returner,
      this.musicTraining = musicTraining, 
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
           this.musicTraining !== "" && this.musicInstrument !== "" && this.musicPractice !== "" && this.languageCount !== "";
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

// Function used on html side of code.
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
        return window.show("container-instructions1");
      } else {
        alert("Please check all three consent boxes to proceed.");
        return false;
      }
    };
  }
});

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
    musicTraining: subject.musicTraining,  
    languageCount: subject.languageCount, 
    musicInstrument: subject.musicInstrument,
    musicPractice: subject.musicPractice, 
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
  // Get form data using jQuery
  const values = $("#infoform").serializeArray();
  
  // Map the form values (adjust indices as needed based on your form)
  const identification = getFormValue(values, "id");
  const age = getFormValue(values, "age");
  const sex = getFormValue(values, "gender");
  const handedness = getFormValue(values, "hand");
  const mousetype = getFormValue(values, "mousetype");
  const musicTraining = getFormValue(values, "music_training");
  const musicInstrument = getFormValue(values, "music_instrument");
  const musicPractice = getFormValue(values, "music_practice");
  const languageCount = getFormValue(values, "language_count");
  const returner = getFormValue(values, "repeater");
  const ethnicity = getFormValue(values, "ethnic");
  const race = getFormValue(values, "race");

  // Basic validation
  if (!identification || !age || !sex || !handedness || !mousetype || 
      !musicTraining || !languageCount || !returner || !musicInstrument || !musicPractice) {
    alert("Please fill out all required information!");
    return false;
  }
  
  // Age validation
  if (parseInt(age) < 18 || parseInt(age) > 99) {
    alert("Please enter a valid age between 18 and 99.");
    return false;
  }
  
  // Trackpad validation
  if (mousetype !== 'trackpad') {
    alert("This experiment requires using a trackpad. Please switch to a trackpad to continue.");
    return false;
  }

  // Create subject with all fields
  subject = new Subject(
    identification,
    age,
    sex,
    handedness,
    mousetype,
    returner,
    ethnicity,
    race,
    musicTraining,  
    languageCount,
    musicInstrument,
    musicPractice  
  );
  
  // Add the new properties to the subject object
  subject.musicTraining = musicTraining;
  subject.languageCount = languageCount;
  subject.musicInstrument = musicInstrument;
  subject.musicPractice = musicPractice;

  // Continue with experiment
  show("container-exp");
  
  // Only enter full screen if not disabled
  if (!disableFullScreen) {
    openFullScreen();
  }
  console.log("Starting game with subject data:", subject);  
  startGame();
  
  return false; // Prevent form submission
}

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

function validateConsent() {
  const consentAge = document.getElementById('consent-age');
  const consentRead = document.getElementById('consent-read');
  const consentParticipate = document.getElementById('consent-participate');
  
  if (consentAge.checked && consentRead.checked && consentParticipate.checked) {
    return show('container-instructions1');
  } else {
    alert("Please check all three consent boxes to proceed.");
    return false;
  }
}

// Make the function globally accessible
window.validateConsent = validateConsent;

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
    
    // Create a comprehensive record of all trial data
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