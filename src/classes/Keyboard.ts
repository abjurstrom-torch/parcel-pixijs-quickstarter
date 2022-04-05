import * as PubSub from "pubsub-js";

export class Keyboard {
  public readonly value: string;

  private _isDown: boolean = false;
  public get isDown(): boolean {
    return this._isDown;
  }

  private _isUp: boolean = true;
  public get isUp(): boolean {
    return this._isUp;
  }

  private downHandlerBound: (event: KeyboardEvent) => void;
  private upHandlerBound: (event: KeyboardEvent) => void;

  constructor(value: string) {
    this.value = value;

    this.downHandlerBound = this.downHandler.bind(this);
    this.upHandlerBound = this.upHandler.bind(this);

    window.addEventListener("keydown", this.downHandlerBound, false);
    window.addEventListener("keyup", this.upHandlerBound, false);
  }

  private downHandler(event: KeyboardEvent) {
    if (event.key === this.value) {
      if (this.isUp) {
        PubSub.publish(`player.keyboard.${this.value}.press`);
      }
      this._isDown = true;
      this._isUp = false;
      event.preventDefault();
    }
  }

  private upHandler(event: KeyboardEvent) {
    if (event.key === this.value) {
      if (this.isDown) {
        PubSub.publish(`player.keyboard.${this.value}.release`);
      }
      this._isDown = false;
      this._isUp = true;
      event.preventDefault();
    }
  }

  public unsubscribe() {
    window.removeEventListener("keydown", this.downHandlerBound);
    window.removeEventListener("keyup", this.upHandlerBound);
  }
}
