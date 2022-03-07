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

  constructor(value: string) {
    this.value = value;

    window.addEventListener("keydown", this.downHandler, false);
    window.addEventListener("keyup", this.upHandler, false);
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
    window.removeEventListener("keydown", this.downHandler);
    window.removeEventListener("keyup", this.upHandler);
  }
}
