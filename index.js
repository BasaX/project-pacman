const canvas = document.getElementById('canvas');
const c = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


// CREACION DE CLASES


class Boundary {
  static width = 40;
  static height = 40;
  
  constructor ({position}) {
    this.position = position;
    this.width = 40;
    this.height = 40;
  }

  draw() {
    c.fillStyle = 'blue';
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}



class Player {
  constructor({position, velocity}) {
    this.position = position;
    this.velocity = velocity;
    this.radius = 15;
  }

  draw() {
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = 'yellow';
    c.fill();
    c.closePath();
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
  }
}




const boundaries = [];


const player = new Player({
  position: {
    x: Boundary.width + Boundary.width/2,
    y: Boundary.height + Boundary.height/2
  },
  velocity: {
    x: 0,
    y: 0
  }
})


const keys = {
  w: {
    pressed: false
  },
  a: {
    pressed: false
  },
  s: {
    pressed: false
  },
  d: {
    pressed: false
  }
}


let lastKeyPressed = '';


//DEFINO MAPA


const mapa = [
  ['-','-','-','-','-','-','-','-','-'],
  ['-',' ',' ',' ',' ',' ',' ',' ','-'],
  ['-',' ','-','-',' ','-','-',' ','-'],
  ['-',' ',' ',' ',' ',' ',' ',' ','-'],
  ['-',' ','-','-',' ','-','-',' ','-'],
  ['-',' ',' ',' ',' ',' ',' ',' ','-'],
  ['-','-','-','-','-','-','-','-','-'],
];



mapa.forEach((row, i) => {
  row.forEach((symbol, j) => {
    //console.log(symbol);
    switch (symbol) {
      case '-':
        boundaries.push(new Boundary({
          position: {
            x: Boundary.width * j,
            y: Boundary.height * i
          }
        }))
        break;
        }
  })
})




//RENDERIZADO CONTINUO

function animate() {
  window.requestAnimationFrame(animate)
  //DIBUJO MAPA
  c.clearRect(0, 0, canvas.width, canvas.height)
  boundaries.forEach((boundary) => {
    boundary.draw()

    //CHEQUEO DE COLISIONES!
    //Centro del pacman - radio da la distancia a un cuadrante
    //Posicion bloque y + height da el lado opuesto del bloque
    if (
      //Chequeo colisión superior
      player.position.y - player.radius + player.velocity.y <= boundary.position.y + boundary.height
      &&
      //Chequeo colisión derecha
      player.position.x + player.radius + player.velocity.x >= boundary.position.x
      &&
      //Chequeo colisión inferior
      player.position.y + player.radius + player.velocity.y >= boundary.position.y
      &&
      //Chequeo colisión izquierda
      player.position.x - player.radius + player.velocity.x <= boundary.position.x + boundary.width
      ) {
      //console.log('Colisioooon')
      player.velocity.x = 0
      player.velocity.y = 0
    }
  })

  player.update()


  if (keys.w.pressed && lastKeyPressed === 'w') {
    player.velocity.y = -5
  } else if (keys.a.pressed && lastKeyPressed === 'a') {
    player.velocity.x = -5
  } else if (keys.s.pressed && lastKeyPressed === 's') {
    player.velocity.y = 5
  } else if (keys.d.pressed && lastKeyPressed === 'd') {
    player.velocity.x = 5
  }

}



//CHEQUEAR TECLAS

window.addEventListener('keydown', (event) => {
  const { key } = event;
  switch (key) {
    case 'w':
        keys.w.pressed = true
        lastKeyPressed = 'w'
      break;
    case 'a':
        keys.a.pressed = true
        lastKeyPressed = 'a'
      break;
    case 's':
        keys.s.pressed = true
        lastKeyPressed = 's'
      break;
    case 'd':
        keys.d.pressed = true
        lastKeyPressed = 'd'
      break;
  }
})

window.addEventListener('keyup', (event) => {
  const { key } = event;
  switch (key) {
    case 'w':
        keys.w.pressed = false
      break;
    case 'a':
        keys.a.pressed = false        
      break;
    case 's':
        keys.s.pressed = false
      break;
    case 'd':
        keys.d.pressed = false
      break;
  }
})


animate();