import { sharedLoader } from "../assets/Loader";
import * as PIXI from "pixi.js";
import { Vector2 } from "@aliser/vector2";
import { IDisposable } from "../interfaces/IDisposable";
import { Controllable } from "./Controllable";
import { IBomberFrames } from "../assets/IBomberFrames";

export class Player extends Controllable implements IDisposable {
  private playerFrames: IBomberFrames = {
    front: [],
    left: [],
    right: [],
    back: [],
  };
  private currentFrame: keyof IBomberFrames = "right";

  private app: PIXI.Application;
  private token: PIXI.AnimatedSprite | undefined;

  constructor(app: PIXI.Application) {
    super(5, new Vector2());

    this.app = app;
    this.BindFrameChanges();

    // Load assets
    sharedLoader.load(this.onAssetsLoaded.bind(this));
  }

  public dispose(): void {
    PubSub.unsubscribe("player.keyboard");

    if (this.token !== undefined) {
      this.app.stage.removeChild(this.token);
    }
  }

  private BindFrameChanges() {
    PubSub.subscribe("player.keyboard.ArrowLeft.press", () => {
      this.frameChange("left");
    });
    PubSub.subscribe("player.keyboard.ArrowUp.press", () => {
      this.frameChange("back");
    });
    PubSub.subscribe("player.keyboard.ArrowRight.press", () => {
      this.frameChange("right");
    });
    PubSub.subscribe("player.keyboard.ArrowDown.press", () => {
      this.frameChange("front");
    });
  }

  private gameLoop(delta: number) {
    if (this.token === undefined) {
      console.error("Failed to run game loop, player is not loaded!");
      return;
    }

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
  private frameChange(newFrame: keyof IBomberFrames) {
    if (newFrame == this.currentFrame) {
      return;
    }

    const newToken = new PIXI.AnimatedSprite(this.playerFrames[newFrame]);

    newToken.anchor.set(0.5);
    newToken.animationSpeed = 0.3;
    newToken.play();

    if (this.token !== undefined) {
      newToken.x = this.token.x;
      newToken.y = this.token.y;
      this.app.stage.removeChild(this.token);
    }

    this.app.stage.addChild(newToken);
    this.token = newToken;
    this.currentFrame = newFrame;
  }

  private onAssetsLoaded(
    loader: PIXI.Loader,
    resources: Partial<Record<string, PIXI.LoaderResource>>
  ) {
    this.playerFrames.front =
      resources.bomber_front?.spritesheet?.animations.bomberman_front;
    this.playerFrames.right =
      resources.bomber_right?.spritesheet?.animations.bomberman_right;
    this.playerFrames.back =
      resources.bomber_back?.spritesheet?.animations.bomberman_back;
    this.playerFrames.left =
      resources.bomber_left?.spritesheet?.animations.bomberman_left;

    this.token = new PIXI.AnimatedSprite(this.playerFrames.right);

    this.token.x = 100;
    this.token.y = 150;
    this.token.anchor.set(0.5);
    this.token.animationSpeed = 0.3;
    this.token.play();

    this.app.stage.addChild(this.token);
    this.app.ticker.add((delta) => this.gameLoop(delta));
  }
}
