import * as PIXI from "pixi.js";
import { Player } from "../classes/Player";
import "../assets/sheets/nature-tiles.json";

let player: Player;

export class GameApp {
  private app: PIXI.Application;

  constructor(parent: HTMLElement, width: number, height: number) {
    this.app = new PIXI.Application({
      width,
      height,
      backgroundColor: 0x000000,
    });

    if (parent.lastElementChild === null) {
      throw Error("Failed to start.  Parent last element child is null.");
    }

    parent.replaceChild(this.app.view, parent.lastElementChild); // Hack for parcel HMR

    player = new Player(this.app);

    const loader = new PIXI.Loader();
    loader.add("/assets/sheets/nature-tiles.json").load((data) => {
      console.log(data);
    });
  }
}
