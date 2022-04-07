import { Vector2 } from "@aliser/vector2";
import { Keyboard } from "./Keyboard";

export abstract class Controllable {
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
    PubSub.subscribe("player.keyboard.ArrowLeft.press", () => {
      this.velocity.x += -this.acceleration;
    });
    PubSub.subscribe("player.keyboard.ArrowLeft.release", () => {
      this.velocity.x += this.acceleration;
    });

    PubSub.subscribe("player.keyboard.ArrowUp.press", () => {
      this.velocity.y += -this.acceleration;
    });
    PubSub.subscribe("player.keyboard.ArrowUp.release", () => {
      this.velocity.y += this.acceleration;
    });

    PubSub.subscribe("player.keyboard.ArrowRight.press", () => {
      this.velocity.x += this.acceleration;
    });
    PubSub.subscribe("player.keyboard.ArrowRight.release", () => {
      this.velocity.x += -this.acceleration;
    });

    PubSub.subscribe("player.keyboard.ArrowDown.press", () => {
      this.velocity.y += this.acceleration;
    });
    PubSub.subscribe("player.keyboard.ArrowDown.release", () => {
      this.velocity.y += -this.acceleration;
    });
  }
}
