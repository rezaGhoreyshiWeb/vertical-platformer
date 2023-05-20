import CollisionBlock from "./src/CollisionBlock.js";
import Player from "./src/Player.js";
import Sprite from "./src/Sprite.js";
import { c, canvas } from "./src/canvas.js";
import { floorCollisions2D, platformCollisions2D } from "./src/data.js";

canvas.width = 1024;
canvas.height = 576;

const scaledCanvas = {
  width: canvas.width / 4,
  height: canvas.height / 4,
};

// Collisions Block
const floorCollisionBlocks = [];
floorCollisions2D.forEach((row, y) => {
  row.forEach((symbol, x) => {
    if (symbol === 202) {
      floorCollisionBlocks.push(
        new CollisionBlock({ position: { x: x * 16, y: y * 16 } })
      );
    }
  });
});

const platformCollisionBlocks = [];
platformCollisions2D.forEach((row, y) => {
  row.forEach((symbol, x) => {
    if (symbol === 202) {
      platformCollisionBlocks.push(
        new CollisionBlock({ position: { x: x * 16, y: y * 16 } })
      );
    }
  });
});

const player = new Player({
  position: { x: 100, y: 300 },
  collisionBlocks: floorCollisionBlocks,
  imageSrc: "./assets/warrior/Idle.png",
  frameRate: 8,
  animations: {
    Idle: {
      imageSrc: "./assets/warrior/Idle.png",
      frameRate: 8,
      frameBuffer: 3,
    },
    Run: {
      imageSrc: "./assets/warrior/Run.png",
      frameRate: 8,
      frameBuffer: 5,
    },
    Jump: {
      imageSrc: "./assets/warrior/Jump.png",
      frameRate: 2,
      frameBuffer: 3,
    },
    Fall: {
      imageSrc: "./assets/warrior/Fall.png",
      frameRate: 2,
      frameBuffer: 3,
    },
    FallLeft: {
      imageSrc: "./assets/warrior/FallLeft.png",
      frameRate: 2,
      frameBuffer: 3,
    },
    RunLeft: {
      imageSrc: "./assets/warrior/RunLeft.png",
      frameRate: 8,
      frameBuffer: 5,
    },
    IdleLeft: {
      imageSrc: "./assets/warrior/IdleLeft.png",
      frameRate: 8,
      frameBuffer: 3,
    },
    JumpLeft: {
      imageSrc: "./assets/warrior/JumpLeft.png",
      frameRate: 2,
      frameBuffer: 3,
    },
  },
});

const keys = {
  d: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
};

const background = new Sprite({
  position: { x: 0, y: 0 },
  imageSrc: "./assets/background.png",
});

// main function for starting game
function animate() {
  window.requestAnimationFrame(animate);

  //   canvas
  c.fillStyle = "white";
  c.fillRect(0, 0, canvas.width, canvas.height);

  //   setting the backgroud
  c.save();
  c.scale(4, 4);
  c.translate(0, -background.image.height + scaledCanvas.height);
  background.update();
  //   collision block rendering
  floorCollisionBlocks.forEach((collisionBlock) => {
    collisionBlock.update();
  });

  platformCollisionBlocks.forEach((collisionBlock) => {
    collisionBlock.update();
  });

  //   Player
  player.update();

  //   movement of player
  player.velocity.x = 0;
  if (keys.d.pressed) {
    player.switchSprite("Run");
    player.velocity.x = 2;
    player.lastDirection = "right";
  } else if (keys.a.pressed) {
    player.switchSprite("RunLeft");
    player.velocity.x = -2;
    player.lastDirection = "left";
  } else if (player.velocity.y === 0) {
    if (player.lastDirection === "right") {
      player.switchSprite("Idle");
    } else {
      player.switchSprite("IdleLeft");
    }
  }

  if (player.velocity.y < 0) {
    if (player.lastDirection === "right") {
      player.switchSprite("Jump");
    } else {
      player.switchSprite("JumpLeft");
    }
  } else if (player.velocity.y > 0) {
    if (player.lastDirection === "right") {
      player.switchSprite("Fall");
    } else {
      player.switchSprite("FallLeft");
    }
  }

  c.restore();
}

animate();

// Events For Moving The Player
window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = true;
      break;
    case "a":
      keys.a.pressed = true;
      break;
    case "w":
      player.velocity.y = -8;
      break;
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
  }
});
