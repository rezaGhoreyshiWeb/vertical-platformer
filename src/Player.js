import Sprite from "./Sprite.js";
import { c, canvas } from "./canvas.js";
import { collision, platformCollision } from "./collision.js";

const gravity = 0.1;

export default class Player extends Sprite {
  constructor({
    position,
    collisionBlocks,
    platformCollisionBlocks,
    imageSrc,
    frameRate,
    scale = 0.5,
    animations,
  }) {
    super({ imageSrc, frameRate, scale });
    this.position = position;
    this.velocity = {
      x: 0,
      y: 1,
    };

    this.collisionBlocks = collisionBlocks;
    this.platformCollisionBlocks = platformCollisionBlocks;
    this.hitbox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      width: 10,
      height: 10,
    };

    this.animations = animations;
    this.lastDirection = "";

    for (const key in this.animations) {
      const image = new Image();
      image.src = this.animations[key].imageSrc;
      this.animations[key].image = image;
    }

    this.camerabox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },

      width: 200,
      height: 80,
    };
  }

  switchSprite(key) {
    if (this.image === this.animations[key].image || !this.loaded) {
      return;
    }
    this.currentFrame = 0;
    this.image = this.animations[key].image;
    this.frameBuffer = this.animations[key].frameBuffer;
    this.frameRate = this.animations[key].frameRate;
  }

  updateCamerabox() {
    this.camerabox = {
      position: {
        x: this.position.x - 50,
        y: this.position.y,
      },
      width: 200,
      height: 80,
    };
  }

  checkForHorizontalCanvasCollision() {
    if (
      this.hitbox.position.x + this.hitbox.width + this.velocity.x >= 576 ||
      this.hitbox.position.x + this.velocity.x <= 0
    ) {
      this.velocity.x = 0;
    }
  }

  shouldPanCameraToTheLeft(camera) {
    const cameraboxRightSide = this.camerabox.position.x + this.camerabox.width;
    const scaledDownCanvasWidth = canvas.width / 4;

    if (cameraboxRightSide >= 567) return;

    if (
      cameraboxRightSide >=
      scaledDownCanvasWidth + Math.abs(camera.position.x)
    ) {
      camera.position.x -= this.velocity.x;
    }
  }

  shouldPanCameraToTheRight(camera) {
    if (this.camerabox.position.x <= 0) return;

    if (this.camerabox.position.x <= Math.abs(camera.position.x)) {
      camera.position.x -= this.velocity.x;
    }
  }
  shouldPanCameraToTheDown(camera) {
    if (this.camerabox.position.y + this.velocity.y <= 0) return;

    if (this.camerabox.position.y <= Math.abs(camera.position.y)) {
      camera.position.y -= this.velocity.y;
    }
  }
  shouldPanCameraToTheUp(camera) {
    if (
      this.camerabox.position.y + this.camerabox.height + this.velocity.y >=
      432
    ) {
      return;
    }

    const scaledCanvasHeight = canvas.height / 4;

    if (
      this.camerabox.position.y + this.camerabox.height >=
      Math.abs(camera.position.y) + scaledCanvasHeight
    ) {
      camera.position.y -= this.velocity.y;
    }
  }

  update() {
    this.updateFrames();
    this.updateHitBox();
    this.updateCamerabox();
   

    this.draw();
    this.position.x += this.velocity.x;
    this.checkForHorizontalCollisions();
    this.updateHitBox();
    this.applyGravity();
    this.updateHitBox();
    this.checkForVerticalCollisions();
  }

  updateHitBox() {
    this.hitbox = {
      position: {
        x: this.position.x + 35,
        y: this.position.y + 26,
      },
      width: 14,
      height: 27,
    };
  }
  checkForHorizontalCollisions() {
    for (let i = 0; i < this.collisionBlocks.length; i++) {
      const collisionBlock = this.collisionBlocks[i];
      if (
        collision({
          object1: this.hitbox,
          object2: collisionBlock,
        })
      ) {
        if (this.velocity.x > 0) {
          this.velocity.x = 0;
          const offset =
            this.hitbox.position.x - this.position.x + this.hitbox.width;
          this.position.x = collisionBlock.position.x - offset - 0.01;
          break;
        }

        if (this.velocity.x < 0) {
          this.velocity.x = 0;
          const offset = this.hitbox.position.x - this.position.x;
          this.position.x =
            collisionBlock.position.x + collisionBlock.width - offset + 0.01;
          break;
        }
      }
    }
  }
  applyGravity() {
    this.velocity.y += gravity;
    this.position.y += this.velocity.y;
  }
  checkForVerticalCollisions() {
    for (let i = 0; i < this.collisionBlocks.length; i++) {
      const collisionBlock = this.collisionBlocks[i];
      if (
        collision({
          object1: this.hitbox,
          object2: collisionBlock,
        })
      ) {
        if (this.velocity.y > 0) {
          this.velocity.y = 0;

          const offset =
            this.hitbox.position.y - this.position.y + this.hitbox.height;

          this.position.y = collisionBlock.position.y - offset - 0.01;
          break;
        }

        if (this.velocity.y < 0) {
          this.velocity.y = 0;
          const offset = this.hitbox.position.y - this.position.y;
          this.position.y =
            collisionBlock.position.y + collisionBlock.height - offset + 0.01;
          break;
        }
      }
    }

    // Platform collision blocks
    for (let i = 0; i < this.platformCollisionBlocks.length; i++) {
      const platformCollisionBlock = this.platformCollisionBlocks[i];
      if (
        platformCollision({
          object1: this.hitbox,
          object2: platformCollisionBlock,
        })
      ) {
        if (this.velocity.y > 0) {
          this.velocity.y = 0;

          const offset =
            this.hitbox.position.y - this.position.y + this.hitbox.height;

          this.position.y = platformCollisionBlock.position.y - offset - 0.01;
          break;
        }

        // comment this if statement to warrior pass from bottom of pltcollision on it
        if (this.velocity.y < 0) {
          this.velocity.y = 0;
          const offset = this.hitbox.position.y - this.position.y;
          this.position.y =
            platformCollisionBlock.position.y +
            platformCollisionBlock.height -
            offset +
            0.01;
          break;
        }
      }
    }
  }
}
