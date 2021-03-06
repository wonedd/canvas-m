class TextMessage {
  constructor({ text, onComplete }) {
    this.text = text;
    this.onComplete = onComplete;
    this.element = null;
  }

  createElement() {
    //Create the element
    this.element = document.createElement("div");
    this.element.classList.add("TextMessage");

    this.element.innerHTML = (`
      <p class="TextMessage_p">${this.text}</p>
      <button class="TextMessage_button">PRESS ENTER</button>
    `)

    this.element.querySelector("button").addEventListener("click", () => {
     window.OverworldMaps.Beach.lowerSrc = "./assets/beachLower.png"
     console.log(window.OverworldMaps.Beach.lowerSrc)
     new OverworldMap(window.OverworldMaps.Beach)

      this.done();
    });

    this.actionListener = new KeyPressListener("Enter", () => {
      this.actionListener.unbind();
      this.done();
    })
    
  }

  done() {
    this.element.remove();
    this.onComplete();
  }

  init(container) {
    this.createElement();
    container.appendChild(this.element)
  }

}