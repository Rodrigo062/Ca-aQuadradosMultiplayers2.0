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
        offsetX = size*0.1;
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
 
