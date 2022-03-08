export class Keyboard {
  public readonly value: string;

  private _isDown: boolean = false;
  public get isDown(): boolean {
    return this._isDown;
  }
  private set isDown(value: boolean) {
    this._isDown = value;
  }

  private _isUp: boolean = true;
  public get isUp(): boolean {
    return this._isUp;
  }
  private set isUp(value: boolean) {
    this._isUp = value;
  }

  private _press: () => void;
  public get press(): () => void {
    return this._press;
  }
  public set press(value: () => void) {
    if (typeof value !== "function" && value !== undefined) {
      throw new Error("Press handler must be a function or undefined!");
    }
    this._press = value;
  }

  private _release: () => void;
  public get release(): () => void {
    return this._release;
  }
  public set release(value: () => void) {
    if (typeof value !== "function" && value !== undefined) {
      throw new Error("Release handler must be a function or undefined!");
    }
    this._release = value;
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
      if (this.isUp && this.press) {
        this.press();
      }
      this.isDown = true;
      this.isUp = false;
      event.preventDefault();
    }
  }

  private upHandler(event: KeyboardEvent) {
    if (event.key === this.value) {
      if (this.isDown && this.release) {
        this.release();
      }
      this.isDown = false;
      this.isUp = true;
      event.preventDefault();
    }
  }

  public unsubscribe() {
    window.removeEventListener("keydown", this.downHandlerBound);
    window.removeEventListener("keyup", this.upHandlerBound);
  }
}
