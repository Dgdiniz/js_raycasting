class InputHandler {
  constructor() {
    this.keys = {};
    
    this.keys["up"] = 0;
    this.keys["down"] = 0;
    this.keys["left"] = 0;
    this.keys["right"] = 0;
    this.keys["rotateright"] = 0;
    this.keys["rotateleft"] = 0;
    this.keys["shoot"] = 0;
  }
  
  checkKeys() {
    this.keys["up"] = keyIsDown(87) ? 1 : 0;
    this.keys["down"] = keyIsDown(83) ? 1 : 0;
    this.keys["left"] = keyIsDown(65) ? 1 : 0;
    this.keys["right"] = keyIsDown(68) ? 1 : 0;
    this.keys["rotateleft"] = keyIsDown(LEFT_ARROW) ? 1 : 0;
    this.keys["rotateright"] = keyIsDown(RIGHT_ARROW) ? 1 : 0;
    this.keys["shoot"] = keyIsDown(32) ? 1 : 0; 
    
    if (movedX != 0) {
      let mouseIntensity = map(movedX, 0, 320, 0, 15);
      
      this.keys["rotateleft"] = (movedX<0) ? -mouseIntensity : 0;
      this.keys["rotateright"] = (movedX>0) ? mouseIntensity : 0;
    }
    
    let gamepad = navigator.getGamepads()[0];
    
    if (gamepad) {
      let pad1_x = gamepad.axes[0];
      let pad1_y = gamepad.axes[1];
      let pad2_x = gamepad.axes[2];
      
      if (pad1_x > 0.3) {
        this.keys["right"] = map(abs(pad1_x), 0.3, 1, 0, 1);
      }
      
      if (pad1_x < -0.3) {
        this.keys["left"] = map(abs(pad1_x), 0.3, 1, 0, 1);
      }
      
      if (pad1_y > 0.3) {
        this.keys["down"] = map(abs(pad1_y), 0.3, 1, 0, 1);
      }
      
      if (pad1_y < -0.3) {
        this.keys["up"] = map(abs(pad1_y), 0.3, 1, 0, 1);
      }
      
      if (pad2_x > 0.3) {
        this.keys["rotateright"] = map(abs(pad2_x), 0.3, 1, 0, 1);
      }
      
      if (pad2_x < -0.3) {
        this.keys["rotateleft"] = map(abs(pad2_x), 0.3, 1, 0, 1);
      }
      
    }
    
  }
  
  isKeyDown(key) {
    return boolean(this.keys[key]);
  }
  
  getKey(key) {
    return this.keys[key];
  }
}