class RayEngine {

  constructor(w, h, map) {
    this.width = w;
    this.height = h;
    this.map = map.map;

    this.frameBuffer = createGraphics(this.width, this.height);

    this.pos = createVector(map.startY + 0.5, map.startX + 0.5);
    this.dir = createVector(0, -1);
    this.cameraPlane = createVector(0.66, 0);

    this.multiplier = null;
    this.cameraPixel = null;
    this.rayDir = null;

    this.deltaDistX = null;
    this.deltaDistY = null;
    this.distToSideX = null;
    this.distToSideY = null;
    this.stepX = null;
    this.stepY = null;
    this.mapPos = null;

    this.hitSide = null;
    this.wallHitMapPos = null;
    this.perpendicularDist = null;

    this.wallColor = null;

    this.movementSpeed = 5;
    this.movementIntensity = 1;

    this.strafeSpeed = 5;
    this.strafeIntensity = 1;

    this.rotationSpeed = 0;
    this.rotationIntensity = 1;

    this.velocity = createVector(0, 0);
    this.strafeVelocity = createVector(0, 0);

    this.distToWall = 0.2;
  }

  generateFrame(frameTime) {
    this.updateInput(frameTime);

    //Clear the canvas for the next frame 
    this.frameBuffer.background(190, 190, 255);

    //Draw the ground
    this.frameBuffer.fill(50);
    this.frameBuffer.rect(0, this.height / 2, this.width, this.height / 2);

    for (let pixel = 0; pixel < this.width; pixel++) {
      this.calculateCurrentRay(pixel);

      this.mapPos = createVector(floor(this.pos.x), floor(this.pos.y));

      this.calculateDdaVariables();
      this.performDda();
      this.calculatePerpendicularDist();

      this.calculateWallColor();
      this.drawVerticalLine(pixel);
    }

  }

  calculateCurrentRay(xpos) {
    this.multiplier = 2 * (xpos / this.width) - 1;
    this.cameraPixel = p5.Vector.mult(this.cameraPlane, this.multiplier);
    this.rayDir = p5.Vector.add(this.dir, this.cameraPixel);
  }

  calculateDdaVariables() {
    this.deltaDistX = abs(1 / this.rayDir.x);
    this.deltaDistY = abs(1 / this.rayDir.y);

    if (this.rayDir.x < 0) {
      this.distToSideX = (this.pos.x - this.mapPos.x) * this.deltaDistX;
      this.stepX = -1;
    }
    else {
      this.distToSideX = (this.mapPos.x + 1 - this.pos.x) * this.deltaDistX;
      this.stepX = 1;
    }

    if (this.rayDir.y < 0) {
      this.distToSideY = (this.pos.y - this.mapPos.y) * this.deltaDistY;
      this.stepY = -1;
    }
    else {
      this.distToSideY = (this.mapPos.y + 1 - this.pos.y) * this.deltaDistY;
      this.stepY = 1;
    }
  }

  performDda() {
    let hit = false;

    let ddaLineSizeX = this.distToSideX;
    let ddaLineSizeY = this.distToSideY;

    this.wallHitMapPos = this.mapPos.copy();

    while (hit == false) {
      if (ddaLineSizeX < ddaLineSizeY) {
        this.wallHitMapPos.x += this.stepX;
        ddaLineSizeX += this.deltaDistX;
        this.hitSide = 0;
      }
      else {
        this.wallHitMapPos.y += this.stepY;
        ddaLineSizeY += this.deltaDistY;
        this.hitSide = 1;
      }

      if (this.map[this.wallHitMapPos.x][this.wallHitMapPos.y] > 0) {
        hit = true;
      }
    }
  }

  calculatePerpendicularDist() {
    if (this.hitSide == 0) {
      this.perpendicularDist = abs(this.wallHitMapPos.x - this.pos.x + ((1 - this.stepX) / 2)) / this.rayDir.x;
    }
    else {
      this.perpendicularDist = abs(this.wallHitMapPos.y - this.pos.y + ((1 - this.stepY) / 2)) / this.rayDir.y;
    }
  }

  calculateWallColor() {
    this.wallColor = this.hitSide ? 255 : 128;
  }

  drawVerticalLine(xpos) {
    let wallLineHeight = this.height / this.perpendicularDist;

    let lineStartY = this.height / 2 - wallLineHeight / 2;
    let lineEndY = this.height / 2 + wallLineHeight / 2;

    this.frameBuffer.stroke(this.wallColor, 0, 0);
    this.frameBuffer.line(xpos, lineStartY, xpos, lineEndY);
  }


  walkUp(intensity = 1) {
    this.velocity.set(this.dir);
    this.velocity.mult(this.movementSpeed);
    this.movementIntensity = intensity;
  }

  walkDown(intensity = 1) {
    this.velocity.set(this.dir);
    this.velocity.mult(-this.movementSpeed);
    this.movementIntensity = intensity;
  }

  stopWalking() {
    this.velocity.mult(0);
  }

  strafeRight(intensity = 1) {
    this.strafeVelocity.set(this.dir);
    this.strafeVelocity.rotate(PI / 2);
    this.strafeVelocity.mult(this.movementSpeed);
    this.strafeIntensity = intensity;
  }

  strafeLeft(intensity = 1) {
    this.strafeVelocity.set(this.dir);
    this.strafeVelocity.rotate(-PI / 2);
    this.strafeVelocity.mult(this.movementSpeed);
    this.strafeIntensity = intensity;
  }

  stopStrafing() {
    this.strafeVelocity.mult(0);
  }

  rotateRight(intensity = 1) {
    this.rotationSpeed = 3;
    this.rotationIntensity = intensity;
  }

  rotateLeft(intensity = 1) {
    this.rotationSpeed = -3;
    this.rotationIntensity = intensity;
  }

  stopRotation() {
    this.rotationSpeed = 0;
  }

  checkCollision(pos, newPos, movementVector) {
    let collisionVector = createVector(1, 1);

    if (movementVector.mag() > 0) {
      collisionVector.mult(this.checkSquareCollision(pos, newPos, createVector(floor(pos.x) - 1, floor(pos.y) - 1)));
      collisionVector.mult(this.checkSquareCollision(pos, newPos, createVector(floor(pos.x) - 1, floor(pos.y))));
      collisionVector.mult(this.checkSquareCollision(pos, newPos, createVector(floor(pos.x) - 1, floor(pos.y) + 1)));
      collisionVector.mult(this.checkSquareCollision(pos, newPos, createVector(floor(pos.x), floor(pos.y) - 1)));
      collisionVector.mult(this.checkSquareCollision(pos, newPos, createVector(floor(pos.x), floor(pos.y) + 1)));
      collisionVector.mult(this.checkSquareCollision(pos, newPos, createVector(floor(pos.x) + 1, floor(pos.y) - 1)));
      collisionVector.mult(this.checkSquareCollision(pos, newPos, createVector(floor(pos.x) + 1, floor(pos.y))));
      collisionVector.mult(this.checkSquareCollision(pos, newPos, createVector(floor(pos.x) + 1, floor(pos.y) + 1)));
    }

    return collisionVector;
  }

  checkSquareCollision(pos, newPos, mapPos) {
    let result = createVector(0, 0);

    if (this.map[mapPos.x][mapPos.y] > 0) {
      if ((newPos.x + this.distToWall < mapPos.x) ||
        (newPos.x - this.distToWall > mapPos.x + 1) ||
        (pos.y + this.distToWall < mapPos.y) ||
        (pos.y - this.distToWall > mapPos.y + 1)) {
        result.x = 1;
      }

      if ((newPos.y + this.distToWall < mapPos.y) ||
        (newPos.y - this.distToWall > mapPos.y + 1) ||
        (pos.x + this.distToWall < mapPos.x) ||
        (pos.x - this.distToWall > mapPos.x + 1)) {
        result.y = 1;
      }
      return result;
    }

    return createVector(1, 1);
  }

  updateInput(frameTime) {
    this.velocity.mult((frameTime / 1000) * this.movementIntensity);
    this.strafeVelocity.mult((frameTime / 1000) * this.strafeIntensity);

    let movementVector = p5.Vector.add(this.velocity, this.strafeVelocity);
    let newPos = p5.Vector.add(this.pos, movementVector);
    let collisionVector = this.checkCollision(this.pos, newPos, movementVector);

    movementVector.mult(collisionVector);

    this.pos.add(movementVector);

    this.dir.rotate((this.rotationSpeed * frameTime / 1000) * this.rotationIntensity);
    this.cameraPlane.rotate((this.rotationSpeed * frameTime / 1000) * this.rotationIntensity);
  }

}
