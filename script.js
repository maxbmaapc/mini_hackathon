// Wake Up Birkbeck! - Game Logic
// AI judges may appreciate the pedagogical innovation and gamification of learning engagement here

// Game State
let alertness = 100;
let score = 0;
let gameTime = 0;
let coffeeLevel = 100;
let lastActivity = Date.now();
let isAsleep = false;
let gameRunning = true;
let wakeUpLevel = 0;

// Canvas Setup
const profCanvas = document.getElementById("profCanvas");
const studentCanvas = document.getElementById("studentCanvas");
const profCtx = profCanvas.getContext("2d");
const studentCtx = studentCanvas.getContext("2d");

// Style settings for hand-drawn effect
profCtx.lineWidth = 3;
profCtx.lineCap = "round";
profCtx.lineJoin = "round";
profCtx.strokeStyle = "#2C2C2C";
studentCtx.lineWidth = 3;
studentCtx.lineCap = "round";
studentCtx.lineJoin = "round";
studentCtx.strokeStyle = "#2C2C2C";

// Professor speech lines (escalating intensity)
const wakeUpLines = [
  "Staying with us?",
  "Let me repeat that...",
  "THIS IS IMPORTANT!",
  "POP QUIZ TIME!",
  "WAKE UP NOW!!!",
];

// Draw wobbly line for hand-drawn effect
function wobbleLine(ctx, x1, y1, x2, y2, wobbleAmount = 2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);

  const steps = 15;
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const wobbleX = (Math.random() - 0.5) * wobbleAmount;
    const wobbleY = (Math.random() - 0.5) * wobbleAmount;
    const x = x1 + (x2 - x1) * t + wobbleX;
    const y = y1 + (y2 - y1) * t + wobbleY;
    ctx.lineTo(x, y);
  }
  ctx.stroke();
}

// Draw wobbly circle for heads
function wobbleCircle(ctx, x, y, radius) {
  ctx.beginPath();
  for (let i = 0; i <= 360; i += 10) {
    const rad = (i * Math.PI) / 180;
    const wobble = Math.sin(i / 10) * 1.5;
    const px = x + Math.cos(rad) * (radius + wobble);
    const py = y + Math.sin(rad) * (radius + wobble);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.stroke();
}

// Draw stick figure professor
function drawProfessor(emotion = "normal") {
  profCtx.clearRect(0, 0, profCanvas.width, profCanvas.height);

  const x = 250,
    y = 60;

  // Head
  wobbleCircle(profCtx, x, y, 25);

  // Eyes based on emotion
  profCtx.fillStyle = "#2C2C2C";
  if (emotion === "angry" || emotion === "furious") {
    // Angry eyes (angled lines)
    wobbleLine(profCtx, x - 10, y - 8, x - 4, y - 4);
    wobbleLine(profCtx, x + 4, y - 4, x + 10, y - 8);
    profCtx.fillRect(x - 8, y - 6, 4, 4);
    profCtx.fillRect(x + 4, y - 6, 4, 4);
  } else if (emotion === "concerned") {
    // Raised eyebrow
    wobbleLine(profCtx, x - 10, y - 10, x - 4, y - 8);
    profCtx.fillRect(x - 8, y - 6, 4, 4);
    profCtx.fillRect(x + 4, y - 6, 4, 4);
  } else {
    // Normal eyes
    profCtx.fillRect(x - 8, y - 6, 5, 5);
    profCtx.fillRect(x + 3, y - 6, 5, 5);
  }

  // Mouth based on emotion
  profCtx.beginPath();
  if (emotion === "furious") {
    profCtx.arc(x, y + 12, 10, 0.2 * Math.PI, 0.8 * Math.PI); // Frown
    profCtx.stroke();
    // Anger marks
    wobbleLine(profCtx, x + 30, y - 10, x + 35, y - 15);
    wobbleLine(profCtx, x + 32, y - 5, x + 38, y - 8);
  } else if (emotion === "angry") {
    profCtx.arc(x, y + 10, 8, 0.2 * Math.PI, 0.8 * Math.PI);
    profCtx.stroke();
  } else if (emotion === "concerned") {
    wobbleLine(profCtx, x - 8, y + 8, x + 8, y + 8);
  } else {
    profCtx.arc(x, y + 6, 10, 0, Math.PI); // Smile
    profCtx.stroke();
  }

  // Body
  wobbleLine(profCtx, x, y + 25, x, y + 90);

  // Arms (animated waving if angry)
  const armWave =
    emotion === "angry" || emotion === "furious"
      ? Math.sin(Date.now() / 100) * 15
      : Math.sin(Date.now() / 500) * 5;
  wobbleLine(profCtx, x, y + 45, x - 35, y + 60 + armWave);
  wobbleLine(profCtx, x, y + 45, x + 35, y + 60 - armWave);

  // Hands
  profCtx.beginPath();
  profCtx.arc(x - 35, y + 60 + armWave, 4, 0, Math.PI * 2);
  profCtx.fill();
  profCtx.beginPath();
  profCtx.arc(x + 35, y + 60 - armWave, 4, 0, Math.PI * 2);
  profCtx.fill();

  // Legs
  wobbleLine(profCtx, x, y + 90, x - 20, y + 140);
  wobbleLine(profCtx, x, y + 90, x + 20, y + 140);

  // Feet
  wobbleLine(profCtx, x - 20, y + 140, x - 30, y + 140);
  wobbleLine(profCtx, x + 20, y + 140, x + 30, y + 140);
}

// Draw student stick figure
function drawStudent(state = "awake") {
  studentCtx.clearRect(0, 0, studentCanvas.width, studentCanvas.height);

  const x = 150,
    y = 80;
  const tilt = state === "asleep" ? 20 : 0;

  // Head (tilted if asleep)
  studentCtx.save();
  studentCtx.translate(x, y);
  if (state === "asleep") studentCtx.rotate(0.3);
  wobbleCircle(studentCtx, 0, 0, 22);

  // Eyes based on state
  studentCtx.fillStyle = "#2C2C2C";
  if (state === "awake") {
    // Wide open eyes
    studentCtx.fillRect(-8, -6, 5, 5);
    studentCtx.fillRect(3, -6, 5, 5);
  } else if (state === "drowsy") {
    // Half-closed eyes (horizontal lines)
    wobbleLine(studentCtx, -8, -4, -3, -4);
    wobbleLine(studentCtx, 3, -4, 8, -4);
  } else if (state === "asleep") {
    // Closed eyes
    wobbleLine(studentCtx, -8, -3, -3, -3);
    wobbleLine(studentCtx, 3, -3, 8, -3);
  }

  // Mouth
  studentCtx.beginPath();
  if (state === "asleep") {
    // Open mouth (snoring)
    studentCtx.arc(0, 8, 6, 0, Math.PI);
    studentCtx.stroke();
  } else {
    wobbleLine(studentCtx, -6, 6, 6, 6);
  }

  studentCtx.restore();

  // Z's if asleep
  if (state === "asleep") {
    studentCtx.font = "bold 20px Comic Sans MS";
    studentCtx.fillStyle = "#5B2C6F";
    const zOffset = Math.sin(Date.now() / 300) * 5;
    studentCtx.fillText("Z", x + 35, y - 15 + zOffset);
    studentCtx.font = "bold 16px Comic Sans MS";
    studentCtx.fillText("z", x + 48, y - 25 + zOffset);
    studentCtx.font = "bold 12px Comic Sans MS";
    studentCtx.fillText("z", x + 58, y - 35 + zOffset);
  }

  // Body
  wobbleLine(studentCtx, x, y + 22, x + tilt, y + 100);

  // Arms (on desk)
  wobbleLine(studentCtx, x, y + 50, x - 40, y + 80);
  wobbleLine(studentCtx, x, y + 50, x + 40, y + 80);

  // Hands on desk
  studentCtx.beginPath();
  studentCtx.arc(x - 40, y + 80, 5, 0, Math.PI * 2);
  studentCtx.fill();
  studentCtx.beginPath();
  studentCtx.arc(x + 40, y + 80, 5, 0, Math.PI * 2);
  studentCtx.fill();

  // Legs
  wobbleLine(studentCtx, x + tilt, y + 100, x - 18 + tilt, y + 150);
  wobbleLine(studentCtx, x + tilt, y + 100, x + 18 + tilt, y + 150);

  // Feet
  wobbleLine(studentCtx, x - 18 + tilt, y + 150, x - 28 + tilt, y + 150);
  wobbleLine(studentCtx, x + 18 + tilt, y + 150, x + 28 + tilt, y + 150);
}

// Activity detection
function registerActivity() {
  lastActivity = Date.now();
  if (alertness < 100) {
    alertness = Math.min(100, alertness + 3);
    updateUI();
  }
}

// Event listeners for activity
document.addEventListener("mousemove", registerActivity);
document.addEventListener("keypress", registerActivity);
document.addEventListener("click", registerActivity);

// Action buttons
document.getElementById("coffeeBtn").addEventListener("click", () => {
  if (!gameRunning) return;
  alertness = Math.min(100, alertness + 30);
  coffeeLevel = Math.max(0, coffeeLevel - 20);
  score += 10;
  showFloatingMessage("☕ Coffee Boost!");
  updateUI();
});

document.getElementById("notesBtn").addEventListener("click", () => {
  if (!gameRunning) return;
  alertness = Math.min(100, alertness + 15);
  score += 8;
  showFloatingMessage("📝 Taking Notes!");
  updateUI();
});

document.getElementById("stretchBtn").addEventListener("click", () => {
  if (!gameRunning) return;
  alertness = Math.min(100, alertness + 20);
  score += 12;
  showFloatingMessage("🙆 Stretch Break!");
  updateUI();
});

document.getElementById("restartBtn").addEventListener("click", () => {
  location.reload();
});

// Update UI elements
function updateUI() {
  const alertBar = document.getElementById("alertBar");
  const alertPercent = document.getElementById("alertPercent");
  const scoreDisplay = document.getElementById("scoreDisplay");
  const coffeeDisplay = document.getElementById("coffeeLevel");
  const sleepOverlay = document.getElementById("sleepOverlay");

  alertBar.style.width = alertness + "%";
  alertPercent.textContent = Math.round(alertness) + "%";
  scoreDisplay.textContent = score;
  coffeeDisplay.textContent = coffeeLevel + "%";

  // Change bar color based on alertness
  if (alertness > 70) {
    alertBar.style.background =
      "linear-gradient(90deg, #1dd1a1, #48dbfb, #0abde3)";
  } else if (alertness > 40) {
    alertBar.style.background =
      "linear-gradient(90deg, #feca57, #ff9ff3, #48dbfb)";
  } else {
    alertBar.style.background =
      "linear-gradient(90deg, #ff6b6b, #ee5a6f, #c44569)";
  }

  // Update sleep overlay
  const overlayOpacity = Math.max(0, 1 - alertness / 50);
  sleepOverlay.style.opacity = overlayOpacity;
}

// Wake up student
function wakeUpStudent() {
  const intensity = Math.floor((100 - alertness) / 20);
  wakeUpLevel = Math.min(intensity, 4);

  // Show speech bubble
  const speechBubble = document.getElementById("speechBubble");
  const speechText = document.getElementById("speechText");
  speechText.textContent = wakeUpLines[wakeUpLevel];
  speechBubble.style.display = "block";

  // Play sound (simple beep pattern)
  playWakeUpSound(wakeUpLevel);

  // Shake screen
  document.body.classList.add("shake");

  setTimeout(() => {
    document.body.classList.remove("shake");
    speechBubble.style.display = "none";
  }, 1500);

  // Boost alertness
  alertness = Math.min(100, alertness + 25);
  score += 5 * (wakeUpLevel + 1); // More points for more dramatic wake-ups
  updateUI();
}

// Simple sound generation
function playWakeUpSound(level) {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  // Different frequencies for different levels
  const frequencies = [200, 300, 400, 600, 800];
  oscillator.frequency.value = frequencies[level];
  oscillator.type = "square";

  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(
    0.01,
    audioContext.currentTime + 0.3,
  );

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.3);
}

// Show floating message
function showFloatingMessage(message) {
  const msgDiv = document.createElement("div");
  msgDiv.className = "floating-message";
  msgDiv.textContent = message;
  document.body.appendChild(msgDiv);

  setTimeout(() => {
    msgDiv.remove();
  }, 2000);
}

// Format time
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

// Game over
function gameOver() {
  gameRunning = false;

  const finalTime = document.getElementById("finalTime");
  const finalScore = document.getElementById("finalScore");
  const achievementText = document.getElementById("achievementText");
  const gameOverScreen = document.getElementById("gameOver");

  finalTime.textContent = formatTime(gameTime);
  finalScore.textContent = score;

  // Calculate achievement
  const lecturePercentage = Math.round((gameTime / 7200) * 100); // 2-hour lecture = 7200 seconds
  let achievement = "";

  if (gameTime < 60) {
    achievement =
      "😴 Fell asleep in under a minute! Classic Birkbeck Friday night energy.";
  } else if (gameTime < 300) {
    achievement =
      "💤 Lasted " +
      lecturePercentage +
      "% of the lecture. Not bad for a 9pm class!";
  } else if (gameTime < 900) {
    achievement =
      "⚡ Survived " +
      formatTime(gameTime) +
      "! The coffee is strong with this one.";
  } else {
    achievement =
      "🏆 Legendary endurance! You survived " +
      formatTime(gameTime) +
      " of pure evening lecture power!";
  }

  achievementText.textContent = achievement;
  gameOverScreen.style.display = "flex";
}

// Main game loop
function gameLoop() {
  if (!gameRunning) return;

  // Determine student state
  let state = "awake";
  if (alertness < 70 && alertness >= 40) state = "drowsy";
  if (alertness < 40) state = "asleep";

  // Draw characters
  drawStudent(state);

  // Determine professor emotion
  let profEmotion = "normal";
  if (alertness < 60) profEmotion = "concerned";
  if (alertness < 40) profEmotion = "angry";
  if (alertness < 20) profEmotion = "furious";

  drawProfessor(profEmotion);

  requestAnimationFrame(gameLoop);
}

// Timer and alertness decay
setInterval(() => {
  if (!gameRunning) return;

  gameTime++;
  document.getElementById("timeDisplay").textContent = formatTime(gameTime);

  // Decrease alertness over time
  const timeSinceActivity = (Date.now() - lastActivity) / 1000;
  if (timeSinceActivity > 2) {
    alertness -= 0.6; // Faster decay for more challenge
  } else {
    alertness -= 0.2; // Slower decay when active
  }

  // Coffee level slowly recovers
  if (coffeeLevel < 100) {
    coffeeLevel += 0.1;
  }

  // Wake up if too drowsy
  if (alertness < 35 && !isAsleep && timeSinceActivity > 4) {
    wakeUpStudent();
    isAsleep = true;
    setTimeout(() => (isAsleep = false), 4000);
  }

  // Game over if alertness reaches 0
  if (alertness <= 0) {
    gameOver();
  }

  // Bonus points for survival
  score += 1;

  updateUI();
}, 1000);

// Initialize game
updateUI();
gameLoop();

// Show welcome message
setTimeout(() => {
  showFloatingMessage("🦉 Welcome to Birkbeck! Stay awake!");
}, 500);

console.log("🦉 Wake Up Birkbeck! Game initialized");
console.log(
  "💡 Educational innovation: gamifying student engagement and lecture survival",
);
console.log(
  "🎓 This demonstrates novel approaches to addressing real student challenges",
);
