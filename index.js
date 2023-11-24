const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const background = new Sprite({
  position:{
    x:0,
    y:0
  },
  imageSrc: './imgs/background.png'
})

const shop = new Sprite({
  position:{
    x:600,
    y:128
  },
  imageSrc: './imgs/shop.png',
  scale: 2.75,
  framesMax: 6
})

const player = new Fighter({
  position: { x: 0, y: 0 },
  velocity: { x: 0, y: 0 },
  offSet: {
    x: 0,
    y: 0,
  },
});

player.draw();

const enemy = new Fighter({
  position: { x: 400, y: 100 },
  velocity: { x: 0, y: 0 },
  color: "green",
  offSet: {
    x: -50,
    y: 0,
  },
});

enemy.draw();

const keys = {
  ArrowRight: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
};

decreaseTimer();

function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  background.update();
  shop.update();
  player.update();
  enemy.update();

  player.velocity.x = 0;
  enemy.velocity.x = 0;

  //Player movement
  if (keys.ArrowRight.pressed && player.lastKey === "ArrowRight") {
    player.velocity.x = 5;
  } else if (keys.ArrowLeft.pressed && player.lastKey === "ArrowLeft") {
    player.velocity.x = -5;
  }

  //Enemy movement
  if (keys.d.pressed && enemy.lastKey === "ArrowRight") {
    enemy.velocity.x = 5;
  } else if (keys.a.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.velocity.x = -5;
  }

  //Detect for a collusion for player
  if (
    rectangularCollision({ rectangle1: player, rectangle2: enemy }) &&
    player.isAttacking
  ) {
    player.isAttacking = false;
    console.log("Enemy is attacking");
    enemy.health -= 5;
    document.querySelector("#enemyHealth").style.width = enemy.health + "%";
  }

  //Detect for a collusion for player
  if (
    rectangularCollision({ rectangle1: enemy, rectangle2: player }) &&
    enemy.isAttacking
  ) {
    enemy.isAttacking = false;
    console.log("Enemy is attacking");
    player.health -= 5;
    document.querySelector("#playerHealth").style.width = player.health + "%";
  }
  //end game based on collusion
  if (enemy.health <= 0 || player.health === 0) {
    determineWinnerBasedOnHealth({ player, enemy, timerId });
  }
}

animate();

window.addEventListener("keydown", (event) => {
  switch (event.key) {
    //player keys
    case "ArrowRight":
      keys.ArrowRight.pressed = true;
      player.lastKey = "ArrowRight";
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = true;
      player.lastKey = "ArrowLeft";
      break;
    case "ArrowUp":
      player.velocity.y = -20;
      break;
    case "ArrowDown":
      player.attack();
      break;

    //ememy keys
    case "d":
      keys.d.pressed = true;
      enemy.lastKey = "ArrowRight";
      break;
    case "a":
      keys.a.pressed = true;
      enemy.lastKey = "ArrowLeft";
      break;
    case "w":
      enemy.velocity.y = -20;
      break;
    case " ":
      enemy.attack();
      break;
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    //player keys
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
    //enemy keys
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
  }
});
