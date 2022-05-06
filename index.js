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
    this.radians = 0.75;
    this.openMouthRate = 0.12;
    this.rotation = 0;
  }

  draw() {
    //Agrego .save y .restore para poder manejar la rotación y que solo afecte a esta porción
    //de código y no a todo el canvas
    c.save();
    //Muevo el origen (0,0) del canvas al centro del jugador
    c.translate(this.position.x, this.position.y);
    //Giro al jugador
    c.rotate(this.rotation);
    //Devuelvo el origen a (0,0) del canvas, el punto original
    c.translate(-this.position.x, -this.position.y);
    c.beginPath();
    //Circulo con angulo definido
    c.arc(this.position.x, this.position.y, this.radius, this.radians, Math.PI * 2 - this.radians);
    //Corte para boca
    c.lineTo(this.position.x, this.position.y)
    c.fillStyle = 'yellow';
    c.fill();
    c.closePath();
    c.restore();
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y

    //Acá manejo la apertura de la boca, chequeando el ángulo de apertura
    if (this.radians < 0 || this.radians > 0.75) {
      this.openMouthRate = -this.openMouthRate
    }
    //Asigno ese valor a radians para que al entrar en el if se de el cambio
    this.radians += this.openMouthRate

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


//Bola especial

class PowerUp {
  constructor({position}) {
    this.position = position;
    this.radius = 8;
  }

  draw() {
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = 'white';
    c.fill();
    c.closePath();
  }
}


//Fantasmas

class Ghost {
  static speed = 2;
  constructor({position, velocity, color = 'red'}) {
    this.position = position;
    this.velocity = velocity;
    this.radius = 15;
    this.color = color;
    this.prevCollisions = [];
    this.speed = 2;
    this.scared = false;
  }

  draw() {
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = this.scared ? 'blue' : this.color;
    c.fill();
    c.closePath();
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
  }
}




//****************/
//***VARIABLES***/
//***************/

const pellets = [];

const powerUps = [];

const boundaries = [];

const ghosts = [
  new Ghost({
    position: {
      x: Boundary.width * 4 + Boundary.width/2,
      y: Boundary.height * 5 + Boundary.height/2
    },
    velocity: {
      x: 0,
      y: -Ghost.speed
    },
    color: 'red'
  }),
  new Ghost({
    position: {
      x: Boundary.width * 6 + Boundary.width/2,
      y: Boundary.height * 5 + Boundary.height/2
    },
    velocity: {
      x: Ghost.speed,
      y: 0
    },
    color: 'pink'
  }),
  new Ghost({
    position: {
      x: Boundary.width * 6 + Boundary.width/2,
      y: Boundary.height * 7 + Boundary.height/2
    },
    velocity: {
      x: 0,
      y: Ghost.speed
    },
    color: 'cyan'
  }),
  new Ghost({
    position: {
      x: Boundary.width * 4 + Boundary.width/2,
      y: Boundary.height * 7 + Boundary.height/2
    },
    velocity: {
      x: -Ghost.speed,
      y: 0
    },
    color: 'magenta'
  })
];



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
        case 'p':
        powerUps.push(
          new PowerUp({
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
  //Esta constante hace alusión al gap entre el circulo y el borde
  const padding = Boundary.width / 2 - circle.radius - 1;
  return (
    //Centro del Circle (pacman) - radio = la distancia a un cuadrante
    //Posicion Rectangulo y + height = el lado opuesto del bloque
    //Chequeo colisión superior
    circle.position.y - circle.radius + circle.velocity.y <= rectangle.position.y + rectangle.height + padding
    &&
    //Chequeo colisión derecha
    circle.position.x + circle.radius + circle.velocity.x >= rectangle.position.x - padding
    &&
    //Chequeo colisión inferior
    circle.position.y + circle.radius + circle.velocity.y >= rectangle.position.y - padding
    &&
    //Chequeo colisión izquierda
    circle.position.x - circle.radius + circle.velocity.x <= rectangle.position.x + rectangle.width + padding
  )
}


//********************/
//RENDERIZADO CONTINUO
//*******************/

//Esta variable es para definir si se gana o pierde
let animationId 

function animate() {
    animationId = window.requestAnimationFrame(animate)
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
      for (let i = pellets.length - 1; 0 <= i; i--) {
        const pellet = pellets[i]
        pellet.draw()

      //Chequeo colision circulo con circulo

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
    //***DIBUJO POWERUP ****/
    //**********************/



      //Pruebo con iteración inversa, guardando las bolitas restantes
      //en un array
      for (let i = powerUps.length - 1; 0 <= i; i--) {
        const powerUp = powerUps[i]
        powerUp.draw()

      //Chequeo colision circulo con circulo

      if (Math.hypot(
        powerUp.position.x - player.position.x,
        powerUp.position.y - player.position.y
        ) < powerUp.radius + player.radius) {
          powerUps.splice(i, 1)
          
          //Seteo condición enemigos

          ghosts.forEach(ghost => {
            ghost.scared = true

            setTimeout(() => {
              ghost.scared = false
              //console.log("Enemigos asustados!")
            }, 5000)
          })
        }
      }



    //***************************/
    //*** COLISION ENEMIGOS ****/
    //**************************/
    //CHEQUEO DE COLISION CON JUGADOR PARA CADA ENEMIGO
    //Reciclo código de bolitas
    //La condición de pérdida es colisión y que los enemigos no estén asustados
    for (let i = ghosts.length - 1; 0 <= i; i--) {
      const ghost = ghosts[i]

      if (Math.hypot(
        ghost.position.x - player.position.x,
        ghost.position.y - player.position.y
        ) < ghost.radius + player.radius) 
        {
          //chequeo si los enemigos estan afectados por el powerUp
          if (ghost.scared) {
            ghosts.splice(i, 1)
          } else {
          //Aca uso animationId para cortar el juego
          cancelAnimationFrame(animationId)
          console.log('You lose =(')
          }
        }

    }



  //*******************************/
  //*** CONDICION DE VICTORIA  ****/
  //*******************************/

  if (pellets.length === 0) {
    cancelAnimationFrame(animationId)
    console.log("You win =)!!!!")
  }





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

  //**********************/
  //*** DIBUJO JUGADOR ***/
  //**********************/
  
  player.update()

  //***********************/
  //*** DIBUJO ENEMIGOS ***/
  //***********************/

  ghosts.forEach(ghost => {
    ghost.update()


    // CHEQUEO DE COLISIONES CON PAREDES PARA CADA ENEMIGO
    
    const collisions = [];
    boundaries.forEach(boundary => {
      if (
        !collisions.includes('right') &&
        checkCollisionCircletoRectangle({
          circle: {
            ...ghost,
            velocity: {
              x: ghost.speed,
              y: 0
          }},
          rectangle: boundary
        })
      ) {
        collisions.push('right')
      }

      if (
        !collisions.includes('left') &&
        checkCollisionCircletoRectangle({
          circle: {
            ...ghost,
            velocity: {
              x: -ghost.speed,
              y: 0
          }},
          rectangle: boundary
        })
      ) {
        collisions.push('left')
      }

      if (
        !collisions.includes('up') &&
        checkCollisionCircletoRectangle({
          circle: {
            ...ghost,
            velocity: {
              x: 0,
              y: -ghost.speed
          }},
          rectangle: boundary
        })
      ) {
        collisions.push('up')
      }

      if (
        !collisions.includes('down') &&
        checkCollisionCircletoRectangle({
          circle: {
            ...ghost,
            velocity: {
              x: 0,
              y: ghost.speed
          }},
          rectangle: boundary
        })
      ) {
        collisions.push('down')
      }
    })

    if (collisions.length > ghost.prevCollisions.length) {
      ghost.prevCollisions = collisions;
    }

    if (JSON.stringify(collisions) !== JSON.stringify(ghost.prevCollisions)) {

      //Agrego manualmente las direcciones tentativas en base a la dirección actual

      if (ghost.velocity.x > 0) {
        ghost.prevCollisions.push('right')
      } else if (ghost.velocity.x < 0) {
        ghost.prevCollisions.push('left')
      } else if (ghost.velocity.y < 0) {
        ghost.prevCollisions.push('up')
      } else if (ghost.velocity.y > 0) {
        ghost.prevCollisions.push('down')
      }

      //Creo posibles caminos

      const pathways = ghost.prevCollisions.filter(collision => {
        return !collisions.includes(collision)
      })
      
      //Defino la dirección a tomar en base a los posibles caminos

      const randomPosition = Math.floor(Math.random() * pathways.length);
      const direction = pathways[randomPosition];

      //Cambio la velocidad del enemigo en base al valor que sale

      switch (direction) {
        case 'right':
          ghost.velocity.x = ghost.speed
          ghost.velocity.y = 0
          break;

        case 'left':
          ghost.velocity.x = -ghost.speed
          ghost.velocity.y = 0
          break;

        case 'down':
          ghost.velocity.x = 0
          ghost.velocity.y = ghost.speed
          break;
        
        case 'up':
          ghost.velocity.x = 0
          ghost.velocity.y = -ghost.speed
          break;

      }

      //reseteo el Array porque sino se queda detectando collision constantemente
      //y se laguea
      ghost.prevCollisions = [];

    }
  })

  //Aca manejo la rotación de la animación del jugador

  if (player.velocity.x > 0) {
    player.rotation = 0
  } else if (player.velocity.x < 0) {
    player.rotation = Math.PI
  } else if (player.velocity.y < 0) {
    player.rotation = Math.PI *1.5
  } else if (player.velocity.y > 0) {
    player.rotation = Math.PI / 2
  }



} //ACA TERMINA LA ANIMACION (animate())


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