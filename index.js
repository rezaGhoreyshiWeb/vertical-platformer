import Player from "./src/Player.js";
import { c, canvas } from "./src/canvas.js";

canvas.width = 1024;
canvas.height = 576;

const player = new Player({ x: 0, y: 0 });

function animate() {
  window.requestAnimationFrame(animate);

  //   canvas
  c.fillStyle = "white";
  c.fillRect(0, 0, canvas.width, canvas.height);

  //   Player
  player.update();
}

animate();
