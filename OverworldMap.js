class OverworldMap {
  constructor(config) {
    this.gameObjects = config.gameObjects;
    this.walls = config.walls || {};

    this.lowerImage = new Image();
    this.lowerImage.src = config.lowerSrc;

    this.upperImage = new Image();
    this.upperImage.src = config.upperSrc;

    this.isCutscenePlaying = false;
  }

  drawLowerImage(ctx, cameraPerson) {
    ctx.drawImage(
      this.lowerImage, 
      utils.withGrid(10.5) - cameraPerson.x, 
      utils.withGrid(6) - cameraPerson.y
      )
  }

  drawUpperImage(ctx, cameraPerson) {
    ctx.drawImage(
      this.upperImage, 
      utils.withGrid(18.2) - cameraPerson.x, 
      utils.withGrid(7.7) - cameraPerson.y
    )
  } 

  isSpaceTaken(currentX, currentY, direction) {
    const {x,y} = utils.nextPosition(currentX, currentY, direction);
    return this.walls[`${x},${y}`] || false;
  }

  mountObjects() {
    Object.keys(this.gameObjects).forEach(key => {

      let object = this.gameObjects[key];
      object.id = key;

      //TODO: determine if this object should actually mount
      object.mount(this);

    })
  }
  async startCutscene(events) {
    this.isCutscenePlaying = true;

    for (let i=0; i<events.length; i++) {
      const eventHandler = new OverworldEvent({
        event: events[i],
        map: this,
      })
      await eventHandler.init();
    }

    this.isCutscenePlaying = false;

    //Reset NPCs to do their idle behavior
    Object.values(this.gameObjects).forEach(object => object.doBehaviorEvent(this))
  }

  

  addWall(x,y) {
    this.walls[`${x},${y}`] = true;
  }
  removeWall(x,y) {
    delete this.walls[`${x},${y}`]
  }
  moveWall(wasX, wasY, direction) {
    this.removeWall(wasX, wasY);
    const {x,y} = utils.nextPosition(wasX, wasY, direction);
    this.addWall(x,y);
  }

}



window.OverworldMaps = {
  StartRoom: {
    lowerSrc: "./assets/lowerStartRoom.png",
    upperSrc: "./assets/upperStartRoom.png",
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(5),
        y: utils.withGrid(6),
      }),
    
    },
    
    walls: {
    
     
      [utils.asGridCoord(1,10)] : true,
      [utils.asGridCoord(2,10)] : true,
      [utils.asGridCoord(3,10)] : true,
      [utils.asGridCoord(4,10)] : true,
      [utils.asGridCoord(5,10)] : true,
      [utils.asGridCoord(6,10)] : true,
      [utils.asGridCoord(7,10)] : true,
      [utils.asGridCoord(8,10)] : true,
      [utils.asGridCoord(9,10)] : true,
      [utils.asGridCoord(10,10)] : true,
      [utils.asGridCoord(11,10)] : true,
      [utils.asGridCoord(12,10)] : true,
      [utils.asGridCoord(13,10)] : true,

      [utils.asGridCoord(0,3)] : true,
      [utils.asGridCoord(1,3)] : true,
      [utils.asGridCoord(2,3)] : true,
      [utils.asGridCoord(3,3)] : true,
      [utils.asGridCoord(4,3)] : true,
      [utils.asGridCoord(5,3)] : true,
      [utils.asGridCoord(6,3)] : true,
      [utils.asGridCoord(7,3)] : true,
      [utils.asGridCoord(8,3)] : true,
      [utils.asGridCoord(9,3)] : true,
      [utils.asGridCoord(10,3)] : true,
      [utils.asGridCoord(11,3)] : true,
      [utils.asGridCoord(12,3)] : true,
      [utils.asGridCoord(13,3)] : true,

      [utils.asGridCoord(14,5)] : true,
      [utils.asGridCoord(14,6)] : true,
      [utils.asGridCoord(14,7)] : true,
      [utils.asGridCoord(14,8)] : true,
      [utils.asGridCoord(14,9)] : true,

     
      [utils.asGridCoord(-1,5)] : true,
      [utils.asGridCoord(-1,6)] : true,
      [utils.asGridCoord(-1,7)] : true,
      [utils.asGridCoord(-1,8)] : true,
      [utils.asGridCoord(-1,9)] : true,

     
      
      [utils.asGridCoord(0,4)] : true,
      [utils.asGridCoord(3,0)] : true,
      [utils.asGridCoord(3,4)] : true,
      [utils.asGridCoord(4,4)] : true,
      [utils.asGridCoord(9,5)] : true,
      [utils.asGridCoord(9,4)] : true,
      [utils.asGridCoord(13,4)] : true,
      [utils.asGridCoord(12,4)] : true,
      
    },
  },
  Beach: {
    lowerSrc: "./assets/beachLower.png",
    upperSrc:"",
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(9),
        y: utils.withGrid(6),
      }),
      },
      walls:{}
    },
  
  }
