(() => {
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');

  const WIDTH = canvas.width;
  const HEIGHT = canvas.height;
  const PLAYER_SIZE = 30;
  const ITEM_SIZE = 20;
  const GAME_TIME = 60;

  let arenaBgColor = '#111';
  let arenaShape = 'rect';

  // Desenha acessório na cabeça do jogador, ajustando posição
  function drawAccessory(type, x, y, size) {
    ctx.save();
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `${size}px serif`;
    let symbol = '';
    let offsetX = 0, offsetY = 0;
    switch(type){
      case 'hat': 
        symbol = '🎩'; 
        offsetY = -size*0.8;
        break;
      case 'glasses': 
        symbol = '🕶️'; 
        offsetY = -size*0.2;
        offsetX = size*0.05;
        break;
      case 'crown': 
        symbol = '👑'; 
        offsetY = -size*0.8;
        break;
      case 'skull':
        symbol = '💀';
        offsetY = -size*0.8;
        break;
      default: 
        symbol = '';
    }
    if(symbol) ctx.fillText(symbol, x + offsetX, y + offsetY);
    ctx.restore();
  }

  const players = [
    {
      x: 50,
      y: HEIGHT/2 - PLAYER_SIZE/2,
      color: '#2196F3',
      up: false, down: false, left: false, right: false,
      score: 0,
      controls: {up: 'KeyW', down: 'KeyS', left: 'KeyA', right: 'KeyD'},
      name: 'Jogador 1',
      accessory: 'none',
      speed: 180,
    },
    {
      x: WIDTH - 80,
      y: HEIGHT/2 - PLAYER_SIZE/2,
      color: '#f44336',
      up: false, down: false, left: false, right: false,
      score: 0,
      controls: {up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight'},
      name: 'Jogador 2',
      accessory: 'none',
      speed: 180,
    }
  ];

  let items = [];
  const maxItems = 5;

  let timer = GAME_TIME;
  let intervalId = null;
  let lastTime = 0;

  // Gerar item em posição aleatória dentro da arena (respeitando formato)
  function randomPosition() {
    let x, y;
    while(true) {
      x = Math.random() * (WIDTH - ITEM_SIZE*2) + ITEM_SIZE;
      y = Math.random() * (HEIGHT - ITEM_SIZE*2) + ITEM_SIZE;

      if(arenaShape === 'circle') {
        // centro do círculo e raio
        const cx = WIDTH/2;
        const cy = HEIGHT/2;
        const r = Math.min(WIDTH, HEIGHT)/2 - ITEM_SIZE;
        const dist = Math.sqrt((x-cx)**2 + (y-cy)**2);
        if(dist <= r) break;
      } else {
        break;
      }
    }
    return {x, y};
  }

  function spawnItems() {
    while(items.length < maxItems){
      const pos = randomPosition();
      items.push(pos);
    }
  }

  function drawArena() {
    ctx.fillStyle = arenaBgColor;
    ctx.clearRect(0,0, WIDTH, HEIGHT);
    if(arenaShape === 'rect'){
      ctx.fillRect(0,0, WIDTH, HEIGHT);
    } else if(arenaShape === 'rounded'){
      const r = 40;
      ctx.beginPath();
      ctx.moveTo(r,0);
      ctx.lineTo(WIDTH - r, 0);
      ctx.quadraticCurveTo(WIDTH,0, WIDTH,r);
      ctx.lineTo(WIDTH, HEIGHT - r);
      ctx.quadraticCurveTo(WIDTH, HEIGHT, WIDTH - r, HEIGHT);
      ctx.lineTo(r, HEIGHT);
      ctx.quadraticCurveTo(0, HEIGHT, 0, HEIGHT - r);
      ctx.lineTo(0, r);
      ctx.quadraticCurveTo(0,0, r, 0);
      ctx.fill();
    } else if(arenaShape === 'circle') {
      ctx.beginPath();
      ctx.arc(WIDTH/2, HEIGHT/2, Math.min(WIDTH, HEIGHT)/2, 0, Math.PI*2);
      ctx.fill();
    }
  }

  function drawPlayer(p) {
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.rect(p.x, p.y, PLAYER_SIZE, PLAYER_SIZE);
    ctx.fill();

    // Cabeça
    ctx.fillStyle = '#fff';
    const headX = p.x + PLAYER_SIZE/2;
    const headY = p.y + PLAYER_SIZE*0.3;
    ctx.beginPath();
    ctx.arc(headX, headY, PLAYER_SIZE/3, 0, Math.PI*2);
    ctx.fillStyle = p.color;
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.stroke();

    // Acessório no lugar certo
    drawAccessory(p.accessory, headX, headY - PLAYER_SIZE/5, PLAYER_SIZE/2);

    // Nome do jogador acima da cabeça, na cor do boneco
    ctx.fillStyle = p.color;
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(p.name, headX, p.y - 10);
  }

  function drawItem(item) {
    ctx.fillStyle = '#ffeb3b';
    ctx.fillRect(item.x, item.y, ITEM_SIZE, ITEM_SIZE);
  }

  function checkCollision(a, b, sizeA, sizeB) {
    return !(a.x > b.x + sizeB || a.x + sizeA < b.x || a.y > b.y + sizeB || a.y + sizeA < b.y);
  }

  function update(dt) {
    players.forEach(p => {
      let dx = 0, dy = 0;
      if(p.up) dy -= p.speed * dt;
      if(p.down) dy += p.speed * dt;
      if(p.left) dx -= p.speed * dt;
      if(p.right) dx += p.speed * dt;

      p.x = Math.min(WIDTH - PLAYER_SIZE, Math.max(0, p.x + dx));
      p.y = Math.min(HEIGHT - PLAYER_SIZE, Math.max(0, p.y + dy));
    });

    // Colisões com itens
    items = items.filter(item => {
      let eaten = false;
      players.forEach(p => {
        if(checkCollision(p, item, PLAYER_SIZE, ITEM_SIZE)){
          p.score++;
          updateScoreboard();
          eaten = true;
        }
      });
      return !eaten;
    });

    spawnItems();
  }

  function draw() {
    drawArena();

    items.forEach(drawItem);

    players.forEach(drawPlayer);
  }

  function updateScoreboard(){
    document.getElementById('score1').textContent = players[0].score;
    document.getElementById('score2').textContent = players[1].score;
  }

  function gameLoop(timestamp=0) {
    if(!lastTime) lastTime = timestamp;
    const dt = (timestamp - lastTime)/1000;
    lastTime = timestamp;

    update(dt);
    draw();

    if(timer > 0){
      requestAnimationFrame(gameLoop);
    }
  }

  function startTimer(){
    timer = GAME_TIME;
    document.getElementById('timer').textContent = `Tempo: ${timer}`;
    const timerInterval = setInterval(() => {
      timer--;
      document.getElementById('timer').textContent = `Tempo: ${timer}`;
      if(timer <= 0){
        clearInterval(timerInterval);
        endGame();
      }
    }, 1000);
  }

  function endGame(){
    canvas.style.display = 'none';
    document.getElementById('scoreboard').style.display = 'none';
    document.getElementById('timer').style.display = 'none';

    const winnerEl = document.getElementById('winner');
    if(players[0].score > players[1].score){
      winnerEl.textContent = `🏆 ${players[0].name} venceu!`;
      winnerEl.style.color = players[0].color;
    } else if(players[1].score > players[0].score){
      winnerEl.textContent = `🏆 ${players[1].name} venceu!`;
      winnerEl.style.color = players[1].color;
    } else {
      winnerEl.textContent = 'Empate!';
      winnerEl.style.color = '#eee';
    }
    document.getElementById('restartBtn').style.display = 'inline-block';
  }

  function resetGame(){
    players.forEach(p => {
      p.score = 0;
      p.x = p === players[0] ? 50 : WIDTH - 80;
      p.y = HEIGHT/2 - PLAYER_SIZE/2;
      p.up = p.down = p.left = p.right = false;
    });
    items = [];
    lastTime = 0;
    updateScoreboard();
    document.getElementById('winner').textContent = '';
    document.getElementById('restartBtn').style.display = 'none';
    document.getElementById('menu').style.display = 'block';
  }

  // Configura opções de cores para os jogadores e seleção
  const colors = ['#2196F3', '#f44336', '#4caf50', '#ff9800', '#9c27b0'];
  const colors1 = document.getElementById('colors1');
  const colors2 = document.getElementById('colors2');

  function createColorOptions(container, playerIndex) {
    colors.forEach(c => {
      const div = document.createElement('div');
      div.classList.add('color-option');
      div.style.backgroundColor = c;
      div.dataset.color = c;
      div.addEventListener('click', () => {
        // Se a cor já estiver selecionada no outro jogador, desabilitar
        if(players[1 - playerIndex].color === c) return;

        players[playerIndex].color = c;
        updateColorSelections();
      });
      container.appendChild(div);
    });
  }

  function updateColorSelections(){
    [colors1, colors2].forEach((container, i) => {
      [...container.children].forEach(div => {
        div.classList.remove('selected');
        div.classList.remove('disabled');
        if(div.dataset.color === players[i].color) div.classList.add('selected');
        else if(div.dataset.color === players[1 - i].color) div.classList.add('disabled');
      });
    });
  }

  createColorOptions(colors1, 0);
  createColorOptions(colors2, 1);
  updateColorSelections();

  // Acessórios
  const accs1 = document.getElementById('accs1');
  const accs2 = document.getElementById('accs2');

  function setupAccessorySelection(container, playerIndex) {
    [...container.children].forEach(span => {
      span.addEventListener('click', () => {
        players[playerIndex].accessory = span.dataset.acc;
        updateAccessorySelection();
      });
    });
  }
  function updateAccessorySelection() {
    [accs1, accs2].forEach((container, i) => {
      [...container.children].forEach(span => {
        span.classList.remove('selected');
        if(players[i].accessory === span.dataset.acc) {
          span.classList.add('selected');
        }
      });
    });
  }

  setupAccessorySelection(accs1, 0);
  setupAccessorySelection(accs2, 1);
  updateAccessorySelection();

  // Nomes dos jogadores no input
  const name1Input = document.getElementById('name1');
  const name2Input = document.getElementById('name2');

  name1Input.addEventListener('input', () => {
    players[0].name = name1Input.value.trim() || 'Jogador 1';
  });
  name2Input.addEventListener('input', () => {
    players[1].name = name2Input.value.trim() || 'Jogador 2';
  });

  // Arena configurações
  const arenaBgSelect = document.getElementById('arena-bgcolor');
  const arenaShapeSelect = document.getElementById('arena-shape');

  arenaBgSelect.addEventListener('change', () => {
    arenaBgColor = arenaBgSelect.value;
  });
  arenaShapeSelect.addEventListener('change', () => {
    arenaShape = arenaShapeSelect.value;
  });

  // Botão iniciar
  const startBtn = document.getElementById('startBtn');
  const restartBtn = document.getElementById('restartBtn');

  startBtn.addEventListener('click', () => {
    if(!players[0].name) players[0].name = 'Jogador 1';
    if(!players[1].name) players[1].name = 'Jogador 2';

    document.getElementById('player1-name').textContent = players[0].name;
    document.getElementById('player1-name').style.color = players[0].color;
    document.getElementById('player2-name').textContent = players[1].name;
    document.getElementById('player2-name').style.color = players[1].color;

    document.getElementById('menu').style.display = 'none';
    canvas.style.display = 'block';
    document.getElementById('scoreboard').style.display = 'flex';
    document.getElementById('timer').style.display = 'block';

    resetGame();
    startTimer();
    requestAnimationFrame(gameLoop);

    canvas.focus();
  });

  restartBtn.addEventListener('click', () => {
    resetGame();
    document.getElementById('menu').style.display = 'block';
  });

  // Controles teclado
  window.addEventListener('keydown', e => {
    players.forEach(p => {
      if(e.code === p.controls.up) p.up = true;
      if(e.code === p.controls.down) p.down = true;
      if(e.code === p.controls.left) p.left = true;
      if(e.code === p.controls.right) p.right = true;
    });
  });

  window.addEventListener('keyup', e => {
    players.forEach(p => {
      if(e.code === p.controls.up) p.up = false;
      if(e.code === p.controls.down) p.down = false;
      if(e.code === p.controls.left) p.left = false;
      if(e.code === p.controls.right) p.right = false;
    });
  });
})();
