const canvas = document.getElementById('canvas');
const c = canvas.getContext('2d');
const scoreCounter = document.getElementById('scoreCounter');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//*********************/
// CREACION DE CLASES  /
//*********************/
//Bordes

class Boundary {
  static width = 40;
  static height = 40;
  
  constructor ({position, image}) {
    this.position = position;
    this.width = 40;
    this.height = 40;
    this.image = image;
  }

  draw() {
    //Dibujo cuadrados azules
    //c.fillStyle = 'blue';
    //c.fillRect(this.position.x, this.position.y, this.width, this.height);

    //Dibujo con la imagen cargada
    c.drawImage(this.image, this.position.x, this.position.y)
  }
}


//Pacman

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



//Bolitas

class Pellet {
  constructor({position}) {
    this.position = position;
    this.radius = 3;
  }

  draw() {
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = 'white';
    c.fill();
    c.closePath();
  }
}


//****************/
//***VARIABLES***/
//***************/

const pellets = [];
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
let score = 0;


//DEFINO MAPA

const mapa = [
  ['1', '-', '-', '-', '-', '-', '-', '-', '-', '-', '2'],
  ['|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|'],
  ['|', '.', 'b', '.', '[', '7', ']', '.', 'b', '.', '|'],
  ['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|'],
  ['|', '.', '[', ']', '.', '.', '.', '[', ']', '.', '|'],
  ['|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|'],
  ['|', '.', 'b', '.', '[', '+', ']', '.', 'b', '.', '|'],
  ['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|'],
  ['|', '.', '[', ']', '.', '.', '.', '[', ']', '.', '|'],
  ['|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|'],
  ['|', '.', 'b', '.', '[', '5', ']', '.', 'b', '.', '|'],
  ['|', '.', '.', '.', '.', '.', '.', '.', '.', 'p', '|'],
  ['4', '-', '-', '-', '-', '-', '-', '-', '-', '-', '3']
]



function createImage(src) {
  const image = new Image()
  image.src = src
  return image
}




mapa.forEach((row, i) => {
  row.forEach((symbol, j) => {
    switch (symbol) {
      case '-':
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i
            },
            image: createImage('./img/assets/map/pipeHorizontal.png')
          })
        )
        break
      case '|':
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i
            },
            image: createImage('./img/assets/map/pipeVertical.png')
          })
        )
        break
      case '1':
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i
            },
            image: createImage('./img/assets/map/pipeCorner1.png')
          })
        )
        break
      case '2':
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i
            },
            image: createImage('./img/assets/map/pipeCorner2.png')
          })
        )
        break
      case '3':
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i
            },
            image: createImage('./img/assets/map/pipeCorner3.png')
          })
        )
        break
      case '4':
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i
            },
            image: createImage('./img/assets/map/pipeCorner4.png')
          })
        )
        break
      case 'b':
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i
            },
            image: createImage('./img/assets/map/block.png')
          })
        )
        break
      case '[':
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height
            },
            image: createImage('./img/assets/map/capLeft.png')
          })
        )
        break
      case ']':
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height
            },
            image: createImage('./img/assets/map/capRight.png')
          })
        )
        break
      case '_':
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height
            },
            image: createImage('./img/assets/map/capBottom.png')
          })
        )
        break
      case '^':
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height
            },
            image: createImage('./img/assets/map/capTop.png')
          })
        )
        break
      case '+':
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height
            },
            image: createImage('./img/assets/map/pipeCross.png')
          })
        )
        break
      case '5':
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height
            },
            color: 'blue',
            image: createImage('./img/assets/map/pipeConnectorTop.png')
          })
        )
        break
      case '6':
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height
            },
            color: 'blue',
            image: createImage('./img/assets/map/pipeConnectorRight.png')
          })
        )
        break
      case '7':
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height
            },
            color: 'blue',
            image: createImage('./img/assets/map/pipeConnectorBottom.png')
          })
        )
        break
      case '8':
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height
            },
            image: createImage('./img/assets/map/pipeConnectorLeft.png')
          })
        )
        break
        case '.':
        pellets.push(
          new Pellet({
            position: {
              x: j * Boundary.width + Boundary.width/2,
              y: i * Boundary.height + Boundary.height/2
            }
          })
        )
        break
      }
    })
  })






function checkCollisionCircletoRectangle( {circle, rectangle} ) {
  return (
    //Centro del Circle (pacman) - radio = la distancia a un cuadrante
    //Posicion Rectangulo y + height = el lado opuesto del bloque
    //Chequeo colisión superior
    circle.position.y - circle.radius + circle.velocity.y <= rectangle.position.y + rectangle.height
    &&
    //Chequeo colisión derecha
    circle.position.x + circle.radius + circle.velocity.x >= rectangle.position.x
    &&
    //Chequeo colisión inferior
    circle.position.y + circle.radius + circle.velocity.y >= rectangle.position.y
    &&
    //Chequeo colisión izquierda
    circle.position.x - circle.radius + circle.velocity.x <= rectangle.position.x + rectangle.width
  )
}


//********************/
//RENDERIZADO CONTINUO
//*******************/

function animate() {
    window.requestAnimationFrame(animate)
    c.clearRect(0, 0, canvas.width, canvas.height)

    //CHEQUEO DE TECLAS PRESIONADAS
    //Tengo que chequear la colisión también para evitar atascamientos si
    //el jugador mantiene la tecla para cambiar de dirección

    if (keys.w.pressed && lastKeyPressed === 'w') {
      //El chequeo de abajo tengo que hacerlo en todos los bloques porque nose
      //donde está el jugador exactamente
      for (let i = 0; i < boundaries.length; i++) {
        //Si presiona para arriba y encuentra una colisión debería detenerse
        //caso contrario avanzar
        const boundary = boundaries[i];
        if (
          checkCollisionCircletoRectangle({
            circle: {
              ...player,
              velocity: {
                x: 0,
                y: -5
            }},
            rectangle: boundary
          })
        ) {
          player.velocity.y = 0
          break
        } else {
          player.velocity.y = -5
        }
      } 
    } else if (keys.a.pressed && lastKeyPressed === 'a') {
      for (let i = 0; i < boundaries.length; i++) {
        //Si presiona para la izquierda y encuentra una colisión debería detenerse
        //caso contrario avanzar
        const boundary = boundaries[i];
        if (
          checkCollisionCircletoRectangle({
            circle: {
              ...player,
              velocity: {
                x: -5,
                y: 0
            }},
            rectangle: boundary
          })
        ) {
          player.velocity.x = 0
          break
        } else {
          player.velocity.x = -5
        }
      } 
    } else if (keys.s.pressed && lastKeyPressed === 's') {
      for (let i = 0; i < boundaries.length; i++) {
        //Si presiona para abajo y encuentra una colisión debería detenerse
        //caso contrario avanzar
        const boundary = boundaries[i];
        if (
          checkCollisionCircletoRectangle({
            circle: {
              ...player,
              velocity: {
                x: 0,
                y: 5
            }},
            rectangle: boundary
          })
        ) {
          player.velocity.y = 0
          break
        } else {
          player.velocity.y = 5
        }
      } 
    } else if (keys.d.pressed && lastKeyPressed === 'd') {
      for (let i = 0; i < boundaries.length; i++) {
        //Si presiona para la derecha y encuentra una colisión debería detenerse
        //caso contrario avanzar
        const boundary = boundaries[i];
        if (
          checkCollisionCircletoRectangle({
            circle: {
              ...player,
              velocity: {
                x: 5,
                y: 0
            }},
            rectangle: boundary
          })
        ) {
          player.velocity.x = 0
          break
        } else {
          player.velocity.x = 5
        }
      } 
    }


    
    //**********************/
    //***DIBUJO BOLITAS****/
    //**********************/



      //Pruebo con iteración inversa, guardando las bolitas restantes
      //en un array
      for (let i = pellets.length - 1; 0 < i; i--) {
        const pellet = pellets[i]
        pellet.draw()
      if (Math.hypot(
        pellet.position.x - player.position.x,
        pellet.position.y - player.position.y
        ) < pellet.radius + player.radius) {
          pellets.splice(i, 1)
          score += 10;
          scoreCounter.innerHTML = score;
        }
      }

      //Pauso esto para hacerlo de otra forma y evitar el lagueo
      //CHEQUEO DE COLISION CON BOLITAS
      //Uso el metodo hypot() para sacar la distancia entre el centro
      //del pacman y el centro de la bolita, tanto en el eje x como el y
      /*
      pellets.forEach((pellet, i) => {
        pellet.draw()
      if (Math.hypot(
        pellet.position.x - player.position.x,
        pellet.position.y - player.position.y
        ) < pellet.radius + player.radius) {
          pellets.splice(i, 1)
        }
      })*/


  //**********************/
  //***  DIBUJO MAPA  ****/
  //**********************/
      

    boundaries.forEach((boundary) => {
    boundary.draw()

    //CHEQUEO DE COLISIONES!
    
    if (
        checkCollisionCircletoRectangle({
          circle: player,
          rectangle: boundary
        })
      ) {
      //console.log('Colisioooon')
      player.velocity.x = 0
      player.velocity.y = 0
    }
  })

  player.update()
}


//**********************/
//** CHEQUEO TECLAS ****/
//**********************/

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