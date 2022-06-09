class OverworldEvent {
  constructor({ map, event}) {
    this.map = map;
    this.event = event;
  }

  textMessage(resolve) {

    if (this.event.faceHero) {
      const obj = this.map.gameObjects[this.event.faceHero];
      obj.direction = utils.oppositeDirection(this.map.gameObjects["hero"].direction);
    }

    const message = new TextMessage({
      text: this.event.text,
      onComplete: () => resolve()
    })
    message.init( document.querySelector(".game-container") )
  }



 
  init() {
    return new Promise(resolve => {
      this[this.event.type](resolve)      
    })
  }

}