// Simple 2D Human Figure Visualization
const canvas = document.getElementById('scene');
const ctx = canvas.getContext('2d');

// Canvas setup
function setupCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.background = '#808080';
}

// Draw a simple 2D human figure
function drawHuman() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const scale = Math.min(canvas.width, canvas.height) * 0.3;
  
  // Head
  ctx.fillStyle = '#c7d3e0';
  ctx.beginPath();
  ctx.arc(centerX, centerY - scale * 1.5, scale * 0.3, 0, Math.PI * 2);
  ctx.fill();
  
  // Torso
  ctx.fillStyle = '#9bb1c8';
  ctx.fillRect(centerX - scale * 0.2, centerY - scale * 0.8, scale * 0.4, scale * 1.6);
  
  // Left arm
  ctx.fillStyle = '#a7c957';
  ctx.fillRect(centerX - scale * 0.6, centerY - scale * 0.6, scale * 0.15, scale * 1.2);
  
  // Right arm
  ctx.fillStyle = '#a7c957';
  ctx.fillRect(centerX + scale * 0.45, centerY - scale * 0.6, scale * 0.15, scale * 1.2);
  
  // Left leg
  ctx.fillStyle = '#6aa84f';
  ctx.fillRect(centerX - scale * 0.15, centerY + scale * 0.8, scale * 0.15, scale * 1.2);
  
  // Right leg
  ctx.fillStyle = '#6aa84f';
  ctx.fillRect(centerX, centerY + scale * 0.8, scale * 0.15, scale * 1.2);
  
  // Joints (small circles)
  ctx.fillStyle = '#dddddd';
  
  // Shoulders
  ctx.beginPath();
  ctx.arc(centerX - scale * 0.45, centerY - scale * 0.6, scale * 0.08, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(centerX + scale * 0.45, centerY - scale * 0.6, scale * 0.08, 0, Math.PI * 2);
  ctx.fill();
  
  // Hips
  ctx.beginPath();
  ctx.arc(centerX - scale * 0.15, centerY + scale * 0.8, scale * 0.08, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(centerX + scale * 0.15, centerY + scale * 0.8, scale * 0.08, 0, Math.PI * 2);
  ctx.fill();
  
  // Elbows
  ctx.beginPath();
  ctx.arc(centerX - scale * 0.6, centerY + scale * 0.2, scale * 0.06, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(centerX + scale * 0.6, centerY + scale * 0.2, scale * 0.06, 0, Math.PI * 2);
  ctx.fill();
  
  // Knees
  ctx.beginPath();
  ctx.arc(centerX - scale * 0.15, centerY + scale * 1.4, scale * 0.06, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(centerX + scale * 0.15, centerY + scale * 1.4, scale * 0.06, 0, Math.PI * 2);
  ctx.fill();
}

// Handle window resize
function onResize() {
  setupCanvas();
  drawHuman();
}

// Initialize
setupCanvas();
drawHuman();

// Event listeners
window.addEventListener('resize', onResize);

// Remove the reset button functionality since we don't have interactions
const resetBtn = document.getElementById('resetBtn');
if (resetBtn) {
  resetBtn.style.display = 'none';
}

