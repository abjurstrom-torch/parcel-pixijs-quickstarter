import { bomberFrames } from "../assets/loader";
import * as PIXI from "pixi.js";
import { Vector2 } from "@aliser/vector2";
import { Keyboard } from "./Keyboard";

interface BomberFrames {
  front: string[];
  back: string[];
  right: string[];
  left: string[];
}

export class Player {
  private readonly SPEED = 5;

  private playerFrames: BomberFrames = bomberFrames;
  private currentFrame: keyof BomberFrames = "right";

  private app: PIXI.Application;
  private token: PIXI.AnimatedSprite;
  private velocity: Vector2;

  private left: Keyboard;
  private right: Keyboard;
  private up: Keyboard;
  private down: Keyboard;

  constructor(app: PIXI.Application) {
    this.app = app;
    this.velocity = new Vector2();

    // init Pixi loader
    const loader = new PIXI.Loader();

    // Add user player assets
    console.log("Player to load", this.playerFrames);
    Object.keys(this.playerFrames).forEach((key) => {
      loader.add(this.playerFrames[key]);
    });

    this.left = new Keyboard("ArrowLeft");
    this.left.press = () => {
      this.velocity.x += -this.SPEED;
      this.frameChange("left");
    };
    this.left.release = () => {
      this.velocity.x += this.SPEED;
    };

    this.up = new Keyboard("ArrowUp");
    this.up.press = () => {
      this.velocity.y += -this.SPEED;
      this.frameChange("back");
    };
    this.up.release = () => {
      this.velocity.y += this.SPEED;
    };

    this.right = new Keyboard("ArrowRight");
    this.right.press = () => {
      this.velocity.x += this.SPEED;
      this.frameChange("right");
    };
    this.right.release = () => {
      this.velocity.x += -this.SPEED;
    };

    this.down = new Keyboard("ArrowDown");
    this.down.press = () => {
      this.velocity.y += this.SPEED;
      this.frameChange("front");
    };
    this.down.release = () => {
      this.velocity.y += -this.SPEED;
    };

    // Load assets
    loader.load(this.onAssetsLoaded.bind(this));
  }

  private gameLoop(delta: number) {
    const normalizedX = this.velocity.x * delta;
    const normalizedY = this.velocity.y * delta;

    this.token.x += normalizedX;
    this.token.y += normalizedY;

    if (this.velocity.mag === 0) {
      this.token.stop();
    } else {
      if (!this.token.playing) {
        this.token.play();
      }
    }
  }

  /**
   * Creates and loads a new sprite at the same location as the current token with a new direction.
   * Replaces and removes old token.
   * If new direction is the same as current direction, nothing happens to avoid object churn where not needed.
   *
   * @param newFrame The token direction to activate.
   */
  private frameChange(newFrame: keyof BomberFrames) {
    if (newFrame == this.currentFrame) {
      return;
    }

    const newToken = new PIXI.AnimatedSprite(
      this.playerFrames[newFrame].map((path) => PIXI.Texture.from(path))
    );

    newToken.anchor.set(0.5);
    newToken.animationSpeed = 0.3;
    newToken.play();

    newToken.x = this.token.x;
    newToken.y = this.token.y;

    this.app.stage.removeChild(this.token);
    this.app.stage.addChild(newToken);
    this.token = newToken;
    this.currentFrame = newFrame;
  }

  private onAssetsLoaded() {
    this.token = new PIXI.AnimatedSprite(
      this.playerFrames[this.currentFrame].map((path) =>
        PIXI.Texture.from(path)
      )
    );

    this.token.x = 100;
    this.token.y = 150;
    this.token.anchor.set(0.5);
    this.token.animationSpeed = 0.3;
    this.token.play();

    this.app.stage.addChild(this.token);
    this.app.ticker.add((delta) => this.gameLoop(delta));
  }
}
