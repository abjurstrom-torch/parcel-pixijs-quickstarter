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

// Prepare frames
const playerFrames: BomberFrames = bomberFrames;

// IMPORTANT: Change this value in order to see the Hot Module Reloading!
const currentFrame: keyof BomberFrames = "right";

export class Player {
  private app: PIXI.Application;
  private token: PIXI.AnimatedSprite;
  private velocity: Vector2;

  constructor(app: PIXI.Application) {
    this.app = app;
    this.velocity = new Vector2();

    // init Pixi loader
    const loader = new PIXI.Loader();

    // Add user player assets
    console.log("Player to load", playerFrames);
    Object.keys(playerFrames).forEach((key) => {
      loader.add(playerFrames[key]);
    });

    const left = new Keyboard("ArrowLeft");
    left.press = () => {
      this.velocity.x = -5;
      this.velocity.y = 0;
    };
    const up = new Keyboard("ArrowUp");
    up.press = () => {
      this.velocity.x = 0;
      this.velocity.y = -5;
    };
    const right = new Keyboard("ArrowRight");
    right.press = () => {
      this.velocity.x = 5;
      this.velocity.y = 0;
    };
    const down = new Keyboard("ArrowDown");
    right.press = () => {
      this.velocity.x = 0;
      this.velocity.y = 5;
    };

    // Load assets
    loader.load(this.onAssetsLoaded.bind(this));
  }

  private gameLoop(delta: number) {
    this.token.x = this.token.x + this.velocity.x * delta;
    this.token.y = this.token.y + this.velocity.y * delta;
  }

  private onAssetsLoaded() {
    this.token = new PIXI.AnimatedSprite(
      playerFrames[currentFrame].map((path) => PIXI.Texture.from(path))
    );

    /*
     * An AnimatedSprite inherits all the properties of a PIXI sprite
     * so you can change its position, its anchor, mask it, etc
     */
    this.token.x = 100;
    this.token.y = 150;
    this.token.anchor.set(0.5);
    this.token.animationSpeed = 0.3;
    this.token.play();

    this.app.stage.addChild(this.token);
    this.app.ticker.add((delta) => this.gameLoop(delta));
  }
}
