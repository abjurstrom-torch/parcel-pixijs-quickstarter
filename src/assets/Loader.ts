import * as PIXI from "pixi.js";
import bombermanFront from "./sheets/bomberman-front.json";
import bombermanBack from "./sheets/bomberman-back.json";
import bombermanLeft from "./sheets/bomberman-left.json";
import bombermanRight from "./sheets/bomberman-right.json";
import "./sheets/bomberman-front.png";
import "./sheets/bomberman-back.png";
import "./sheets/bomberman-left.png";
import "./sheets/bomberman-right.png";

const sharedLoader = new PIXI.Loader(); // You can also create your own if you want

sharedLoader
  .add("bomber_front", bombermanFront)
  .add("bomber_back", bombermanBack)
  .add("bomber_left", bombermanLeft)
  .add("bomber_right", bombermanRight);

export { sharedLoader };
