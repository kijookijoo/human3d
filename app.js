// Simple 2D Human Figure Visualization
const canvas = document.getElementById('scene');
const ctx = canvas.getContext('2d');

// Canvas setup
function setupCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.background = '#2c3e50';
}

// Draw a simple 2D human figure
function drawHuman() {
  // Fill background
  ctx.fillStyle = '#2c3e50';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const scale = Math.min(canvas.width, canvas.height) * 0.2;
  
  // Head - Circle
  ctx.fillStyle = '#f39c12';
  ctx.beginPath();
  ctx.arc(centerX, centerY - scale * 2, scale * 0.4, 0, Math.PI * 2);
  ctx.fill();
  
  // Torso - Rectangle
  ctx.fillStyle = '#3498db';
  ctx.fillRect(centerX - scale * 0.3, centerY - scale * 0.5, scale * 0.6, scale * 1.5);
  
  // Left arm - Rectangle
  ctx.fillStyle = '#e74c3c';
  ctx.fillRect(centerX - scale * 0.8, centerY - scale * 0.3, scale * 0.2, scale * 1.0);
  
  // Right arm - Rectangle
  ctx.fillStyle = '#e74c3c';
  ctx.fillRect(centerX + scale * 0.6, centerY - scale * 0.3, scale * 0.2, scale * 1.0);
  
  // Left leg - Rectangle
  ctx.fillStyle = '#27ae60';
  ctx.fillRect(centerX - scale * 0.2, centerY + scale * 1.0, scale * 0.2, scale * 1.2);
  
  // Right leg - Rectangle
  ctx.fillStyle = '#27ae60';
  ctx.fillRect(centerX, centerY + scale * 1.0, scale * 0.2, scale * 1.2);
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

