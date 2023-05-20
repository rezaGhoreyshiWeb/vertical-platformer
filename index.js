import Player from "./src/Player.js";
import { c, canvas } from "./src/canvas.js";

canvas.width = 1024;
canvas.height = 576;

const player = new Player({ x: 0, y: 0 });

const keys = {
  d: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
};

function animate() {
  window.requestAnimationFrame(animate);

  //   canvas
  c.fillStyle = "white";
  c.fillRect(0, 0, canvas.width, canvas.height);

  //   Player
  player.update();

  //   movement of player
  player.velocity.x = 0;
  if (keys.d.pressed) {
    player.velocity.x = 5;
  } else if (keys.a.pressed) {
    player.velocity.x = -5;
  }
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
      player.velocity.y = -20;
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
