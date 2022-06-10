class OverworldMap {
  constructor(config) {
    this.overworld = null;
    this.gameObjects = config.gameObjects;
    this.cutsceneSpaces = config.cutsceneSpaces || {};
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

    Object.values(this.gameObjects).forEach(object => object.doBehaviorEvent(this))
  }

  checkForActionCutscene() {
    const hero = this.gameObjects["hero"];
    const nextCoords = utils.nextPosition(hero.x, hero.y, hero.direction);
    const match = Object.values(this.gameObjects).find(object => {
      return `${object.x},${object.y}` === `${nextCoords.x},${nextCoords.y}`
    });
    if (!this.isCutscenePlaying && match && match.talking.length) {
      this.startCutscene(match.talking[0].events)
    }
   
  }

  checkForFootstepCutscene() {
    const hero = this.gameObjects["hero"];
    const match = this.cutsceneSpaces[ `${hero.x},${hero.y}` ];
   
    if (!this.isCutscenePlaying && match) {
      this.startCutscene( match[0].events )
    }
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
        x: utils.withGrid(6),
        y: utils.withGrid(5),
      }),
    
    },
    
    walls: {
  
      [utils.asGridCoord(0,10)] : true,
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
    cutsceneSpaces: {
      [utils.asGridCoord(5,10)]: [
        {
          events: [
           
            { who: "hero", type: "walk",  direction: "down" },
            { who: "hero", type: "stand",  direction: "left" },
           
          ]
        }
      ],
      [utils.asGridCoord(10,9)]: [
        {
          events: [
            { type: "changeMap", map: "Beach" }
          ]
        }
      ]
    }
  
  },
  Beach: {
    lowerSrc: "./assets/beachLower.png",
    upperSrc:"",
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(1),   //1,10
        y: utils.withGrid(8),
      }),
      },
      walls:{

        [utils.asGridCoord(19,23)] : true,
        [utils.asGridCoord(18,23)] : true,
        [utils.asGridCoord(17,23)] : true,
        [utils.asGridCoord(16,23)] : true,
        [utils.asGridCoord(15,23)] : true,
        [utils.asGridCoord(14,23)] : true,
        [utils.asGridCoord(13,23)] : true,
        [utils.asGridCoord(12,23)] : true,
        [utils.asGridCoord(11,23)] : true,
        [utils.asGridCoord(10,23)] : true,
        [utils.asGridCoord(9,23)] : true,

        [utils.asGridCoord(18,12)] : true,
        
        [utils.asGridCoord(8,23)] : true,
        [utils.asGridCoord(7,23)] : true,
        [utils.asGridCoord(6,23)] : true,
        [utils.asGridCoord(5,23)] : true,
        [utils.asGridCoord(4,23)] : true,
        [utils.asGridCoord(3,23)] : true,
        [utils.asGridCoord(2,23)] : true,
        [utils.asGridCoord(1,23)] : true,
        [utils.asGridCoord(0,23)] : true,
        [utils.asGridCoord(-1,23)] : true,
        
        [utils.asGridCoord(-1,23)] : true,
        [utils.asGridCoord(-1,22)] : true,
        [utils.asGridCoord(-1,21)] : true,
        [utils.asGridCoord(-1,20)] : true,
        [utils.asGridCoord(-1,19)] : true,
        [utils.asGridCoord(-1,18)] : true,
        [utils.asGridCoord(-1,17)] : true,
        [utils.asGridCoord(-1,16)] : true,
        [utils.asGridCoord(-1,15)] : true,
      

        [utils.asGridCoord(-1,8)] : true,
        [utils.asGridCoord(-1,9)] : true,
        [utils.asGridCoord(-1,10)] : true,
        [utils.asGridCoord(-1,11)] : true,
        [utils.asGridCoord(-1,12)] : true,
        [utils.asGridCoord(-1,13)] : true,
        [utils.asGridCoord(-1,14)] : true,
        [utils.asGridCoord(-1,7)] : true,

        [utils.asGridCoord(0,7)] : true,
        [utils.asGridCoord(1,7)] : true,
        [utils.asGridCoord(2,7)] : true,
        [utils.asGridCoord(3,7)] : true,
        [utils.asGridCoord(4,7)] : true,
        [utils.asGridCoord(5,7)] : true,
        [utils.asGridCoord(6,7)] : true,
        
     
        [utils.asGridCoord(9,11)] : true,
        [utils.asGridCoord(8,12)] : true,
        [utils.asGridCoord(6,8)] : true,
        [utils.asGridCoord(6,7)] : true,
        [utils.asGridCoord(6,6)] : true,
        [utils.asGridCoord(6,5)] : true,
        [utils.asGridCoord(6,4)] : true,

        [utils.asGridCoord(7,3)] : true,
        [utils.asGridCoord(8,3)] : true,
        [utils.asGridCoord(9,3)] : true,
        [utils.asGridCoord(10,3)] : true,
        [utils.asGridCoord(11,3)] : true,
        [utils.asGridCoord(12,3)] : true,
        [utils.asGridCoord(13,3)] : true,
        [utils.asGridCoord(14,3)] : true,
        [utils.asGridCoord(15,3)] : true,
        [utils.asGridCoord(16,3)] : true,
        [utils.asGridCoord(17,3)] : true,
        [utils.asGridCoord(18,3)] : true,
        
        [utils.asGridCoord(-1,15)] : true,
        [utils.asGridCoord(0,15)] : true,
        [utils.asGridCoord(10,10)] : true,
        [utils.asGridCoord(10,10)] : true,
        [utils.asGridCoord(1,15)] : true,
        [utils.asGridCoord(2,15)] : true,
        [utils.asGridCoord(16,9)] : true,
        [utils.asGridCoord(15,9)] : true,
        
        
        
       
        [utils.asGridCoord(4,12)] : true,
        [utils.asGridCoord(4,11)] : true,
        [utils.asGridCoord(5,11)] : true,
        [utils.asGridCoord(6,11)] : true,

        [utils.asGridCoord(5,12)] : true,
        [utils.asGridCoord(10,9)] : true,
        [utils.asGridCoord(10,11)] : true,
        
        [utils.asGridCoord(9,9)] : true,
        [utils.asGridCoord(11,9)] : true,

        [utils.asGridCoord(12,10)] : true,
        [utils.asGridCoord(13,10)] : true,
        [utils.asGridCoord(14,10)] : true,
        [utils.asGridCoord(15,10)] : true,

        [utils.asGridCoord(19,3)] : true,
        [utils.asGridCoord(19,4)] : true,
        [utils.asGridCoord(19,5)] : true,
        [utils.asGridCoord(19,6)] : true,
        [utils.asGridCoord(19,7)] : true,
        [utils.asGridCoord(19,8)] : true,
        [utils.asGridCoord(19,9)] : true,
        [utils.asGridCoord(19,10)] : true,
        [utils.asGridCoord(19,11)] : true,
        [utils.asGridCoord(19,12)] : true,
        [utils.asGridCoord(19,13)] : true,
        [utils.asGridCoord(19,14)] : true,
        [utils.asGridCoord(19,15)] : true,
        [utils.asGridCoord(19,16)] : true,
        [utils.asGridCoord(19,17)] : true,
        [utils.asGridCoord(19,18)] : true,
        [utils.asGridCoord(19,19)] : true,
        [utils.asGridCoord(19,20)] : true,
        [utils.asGridCoord(19,21)] : true,
        [utils.asGridCoord(19,22)] : true,
      


       
      },
      cutsceneSpaces: {
        [utils.asGridCoord(1,9)]: [
          {
            events: [
            
              { type: "textMessage",  text: "O que você pensa que está acontecendo?" },
            
            ]
          }
        ],
    },
  }
  }
