<script>
  const canvas = document.getElementById('scene');
  const ctx = canvas.getContext('2d');

  function setupCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.background = '#2c3e50';
  }

  function drawHuman() {
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const scale = Math.min(canvas.width, canvas.height) * 0.2;

    ctx.fillStyle = '#f39c12';
    ctx.beginPath();
    ctx.arc(centerX, centerY - scale * 2, scale * 0.4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#3498db';
    ctx.fillRect(centerX - scale * 0.3, centerY - scale * 0.5, scale * 0.6, scale * 1.5);

    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(centerX - scale * 0.8, centerY - scale * 0.3, scale * 0.2, scale * 1.0);
    ctx.fillRect(centerX + scale * 0.6, centerY - scale * 0.3, scale * 0.2, scale * 1.0);

    ctx.fillStyle = '#27ae60';
    ctx.fillRect(centerX - scale * 0.2, centerY + scale * 1.0, scale * 0.2, scale * 1.2);
    ctx.fillRect(centerX, centerY + scale * 1.0, scale * 0.2, scale * 1.2);
  }

  function onResize() {
    setupCanvas();
    drawHuman();
  }

  setupCanvas();
  drawHuman();
  window.addEventListener('resize', onResize);
</script>
