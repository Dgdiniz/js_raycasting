class Map {
  constructor() {
    this.map = [
  [1,1,1,1,1,1,1,1,1,1],
  [1,1,0,0,1,0,0,0,0,1],
  [1,0,0,0,0,0,0,1,0,1],
  [1,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,1],
  [1,1,0,0,0,0,0,0,1,1],
  [1,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,1],
  [1,1,0,0,1,0,0,0,1,1],
  [1,1,1,1,1,1,1,1,1,1],
  ];
  
    this.startX = 5;
    this.startY = 5;
    
  }
  
  createRandomRoomMap(w,h) {
    let mapArray = this.createMapArray(w+2,h+2);
    
    let currentRow = floor(random(1,w));
    let currentColumn = floor(random(1,h));
    let roomWidth = floor(random(3,8));
    let roomHeight = floor(random(3,8));
    
    this.startX = currentColumn;
    this.startY = currentRow;
    
    this.createBlankRetangleinMap(mapArray, currentRow,currentColumn,roomWidth,roomHeight);
    
    for (let i=0; i<10; i++) {
      let oldRow = currentRow;
      let oldColumn = currentColumn;
      
      currentRow = floor(random(1,w));
      currentColumn = floor(random(1,h));
      roomWidth = floor(random(3,10));
      roomHeight = floor(random(3,10));
      
      this.createBlankRetangleinMap(mapArray, currentRow,currentColumn,roomWidth,roomHeight);
      this.createBlankCorridorBetweenPositions(mapArray, oldRow,oldColumn,currentRow,currentColumn)
    }
    
    this.map = mapArray;    
  }
  
  createBlankCorridorBetweenPositions(map, x1,y1,x2,y2) {
    if (x1 > x2) {
      let t1 = x1;
      x1=x2;
      x2=t1;
    }
    
    if (y1 > y2) {
      let t1 = y1;
      y1=y2;
      y2=t1;
    }
    
    let i = x1;
    
    for (i=x1; i<x2; i++) {
      map[i][y1] = 0;
    }
    
    let j = y1;
    
    for (j=y1; j<y2; j++) {
      map[i][j] = 0;
    }
  }
  
  createBlankRetangleinMap(map, x, y, w, h) {
    for (let i=y; i<y+h; i++) {
      if (i>=map.length-1) {
        break;
      }
      
      for (let j=x; j<x+w; j++) {
        if (j >= map[0].length-1) {
          break;
        }
        
        map[j][i] = 0;
      }
    }
  }
  
  createRandomCorridorMap(w, h) {
    let mapArray = this.createMapArray(w+2,h+2);
    
    let numOfCorridors = (w+h)*15;
    let maxCorridorLength = 4;
    
    let currentRow = floor(random(1,w));
    let currentColumn = floor(random(1,h));
    
    let directions = [[-1,0], [1,0], [0,-1], [0,1]];
    let lastDirection = [];
    
    let randomDirection = null;
    
    this.startX = currentColumn;
    this.startY = currentRow;
    
    while (numOfCorridors) {
      do {
        randomDirection = directions[floor(random(4))];
      } while ((randomDirection[0] === lastDirection[0]) &&
               (randomDirection[1] === -lastDirection[1]) ||
               (randomDirection[0] === -lastDirection[0]) &&
               (randomDirection[1] === lastDirection[1]) );
      
      let randomLength = ceil(random(maxCorridorLength));
      let corridorLength = 0;
      
      while (corridorLength < randomLength) {
        if (
          ((currentRow === 1) && (randomDirection[0] === -1)) ||
          ((currentRow === h-1) && (randomDirection[0] === 1)) ||
          ((currentColumn === 1) && (randomDirection[1] === -1)) ||
          ((currentColumn === w-1) && (randomDirection[1] === 1))
        ) {
          break;
        }
        else {
          mapArray[currentRow][currentColumn] = 0;
          currentRow += randomDirection[0];
          currentColumn += randomDirection[1];
          corridorLength++;
        }
      }
      
      
      lastDirection = randomDirection;
      numOfCorridors--;
    }
    
    this.map = mapArray;
  }
  
  createRandomWalkMap(w, h) {
    let mapArray = this.createMapArray(w+2,h+2);
    
    let maxFloors = (w*h)*0.3;
    let numOfFloors = 0;
    
    let currentRow = floor(random(1,w));
    let currentColumn = floor(random(1,h));
    
    let directions = [[-1,0], [1,0], [0,-1], [0,1]];
    let lastDirection = [];
    
    let randomDirection = null;
    
    this.startX = currentColumn;
    this.startY = currentRow;
    
    while (numOfFloors < maxFloors) {
      do {
        randomDirection = directions[floor(random(4))];
      } while ((randomDirection[0] === lastDirection[0]) &&
               (randomDirection[1] === -lastDirection[1]) ||
               (randomDirection[0] === -lastDirection[0]) &&
               (randomDirection[1] === lastDirection[1]) );
      
     
      if (
        ((currentRow === 1) && (randomDirection[0] === -1)) ||
        ((currentRow === h-1) && (randomDirection[0] === 1)) ||
        ((currentColumn === 1) && (randomDirection[1] === -1)) ||
        ((currentColumn === w-1) && (randomDirection[1] === 1))
      ) {
        
      }
      else {
        if (mapArray[currentRow][currentColumn]) {
          numOfFloors++;
        }
        mapArray[currentRow][currentColumn] = 0;
        
        currentRow += randomDirection[0];
        currentColumn += randomDirection[1];
      }
      
      
      lastDirection = randomDirection;
    }
    
    this.map = mapArray;
  }
    
  createMapArray(w, h) {
    let array = [];
    
    for (let i=0; i<w; i++) {
      array.push([]);
      for (let j=0; j<h; j++) {
        array[i].push(1);
      }
    }
    return array;
  }
  
}