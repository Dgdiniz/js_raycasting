let gamemap;
let engine;
let inputHandler;

//Game's resolution (windows size)
const gameWidth = window.innerWidth / 1.6;
const gameHeight = gameWidth / 1.6;

let gameScale = 1;

function setup() {
  createCanvas(gameWidth, gameHeight);
  noStroke();

  pixelDensity(2);
  frameRate(60);

  gamemap = new Map();
  gamemap.createRandomRoomMap(50, 50);
  inputHandler = new InputHandler();
  engine = new RayEngine(gameWidth, gameHeight, gamemap);
}

function draw() {

  scale(gameScale);

  //Clear the canvas for the next frame 
  background(35);

  inputHandler.checkKeys();

  if (inputHandler.isKeyDown("up")) {
    engine.walkUp(inputHandler.getKey("up"));
  }
  else if (inputHandler.isKeyDown("down")) {
    engine.walkDown(inputHandler.getKey("down"));
  }
  else {
    engine.stopWalking();
  }

  if (inputHandler.isKeyDown("left")) {
    engine.strafeLeft(inputHandler.getKey("left"));
  }
  else if (inputHandler.isKeyDown("right")) {
    engine.strafeRight(inputHandler.getKey("right"));
  }
  else {
    engine.stopStrafing();
  }


  if (inputHandler.isKeyDown("rotateright")) {
    engine.rotateRight(inputHandler.getKey("rotateright"));
  }
  else if (inputHandler.isKeyDown("rotateleft")) {
    engine.rotateLeft(inputHandler.getKey("rotateleft"));
  }
  else {
    engine.stopRotation();
  }

  engine.generateFrame(deltaTime);
  image(engine.frameBuffer, 0, 0);
}

function mouseClicked() {
  requestPointerLock();
}

