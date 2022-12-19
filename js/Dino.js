import { ModController } from "./ModController.js";
import { Item } from './Item.js';

export class Dino extends Item {
  constructor(element, game, blockName) {
    super(element, game);
    this.modController = new ModController(element, blockName);
  }

  move(dx, dy) {
    if (dx) {
      if (this.setX(this.x + dx)) {
        this.modController?.setMod("animation", dx === 1 ? "goRight" : "goLeft", true);

        return;
      }

      this.modController?.setMod("animation", dx === 1 ? "failRight" : "failLeft", true);

      return;
    }

    if (this.setY(this.y + dy)) {
      this.modController?.setMod("animation", dy === 1 ? "goDown" : "goUp", true);

      return;
    }

    this.modController?.setMod("animation", dy === 1 ? "failDown" : "failUp", true);
  }
}
