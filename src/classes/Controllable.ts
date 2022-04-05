import { Vector2 } from "@aliser/vector2";
import { Keyboard } from "./Keyboard";

export abstract class Controllable {
  private up!: Keyboard;
  private right!: Keyboard;
  private down!: Keyboard;
  private left!: Keyboard;

  private acceleration: number;

  private _velocity: Vector2;
  public get velocity(): Vector2 {
    return this._velocity;
  }

  public constructor(acceleration: number, velocity: Vector2) {
    this.acceleration = acceleration;
    this._velocity = velocity;

    this.BindArrowKeys();
  }

  private BindArrowKeys() {
    this.left = new Keyboard("ArrowLeft");
    PubSub.subscribe("player.keyboard.ArrowLeft.press", () => {
      this.velocity.x += -this.acceleration;
    });
    PubSub.subscribe("player.keyboard.ArrowLeft.release", () => {
      this.velocity.x += this.acceleration;
    });

    this.up = new Keyboard("ArrowUp");
    PubSub.subscribe("player.keyboard.ArrowUp.press", () => {
      this.velocity.y += -this.acceleration;
    });
    PubSub.subscribe("player.keyboard.ArrowUp.release", () => {
      this.velocity.y += this.acceleration;
    });

    this.right = new Keyboard("ArrowRight");
    PubSub.subscribe("player.keyboard.ArrowRight.press", () => {
      this.velocity.x += this.acceleration;
    });
    PubSub.subscribe("player.keyboard.ArrowRight.release", () => {
      this.velocity.x += -this.acceleration;
    });

    this.down = new Keyboard("ArrowDown");
    PubSub.subscribe("player.keyboard.ArrowDown.press", () => {
      this.velocity.y += this.acceleration;
    });
    PubSub.subscribe("player.keyboard.ArrowDown.release", () => {
      this.velocity.y += -this.acceleration;
    });
  }
}
