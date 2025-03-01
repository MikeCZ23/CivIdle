import type { GreatPerson } from "../definitions/GreatPersonDefinitions";
import { TechAge } from "../definitions/TechDefinitions";
import { clamp, forEach, keysOf, shuffle } from "../utilities/Helper";
import { Config } from "./Config";
import type { GameOptions, GreatPeopleChoice } from "./GameState";
import { getGameOptions, getGameState } from "./GameStateLogic";
import { Tick } from "./TickLogic";

////////////////////////////////////////////////
// These two functions needed to be kept in sync manually! If you modify any of them, please also change the
// other one!
export function getGreatPeopleAtReborn(): number {
   return clamp(Math.floor(Math.cbrt(Tick.current.totalValue / 1e6) / 4), 0, Infinity);
}

export function getValueRequiredForGreatPeople(count: number): number {
   return Math.pow(4 * count, 3) * 1e6;
}
////////////////////////////////////////////////

export function getProgressTowardsNextGreatPerson(): number {
   return Tick.current.totalValue / getValueRequiredForGreatPeople(getGreatPeopleAtReborn() + 1);
}

export function getGreatPersonUpgradeCost(targetLevel: number): number {
   return Math.pow(2, targetLevel - 1);
}

export function rollPermanentGreatPeople(amount: number, currentTechAge: TechAge): void {
   const currentTechAgeIdx = Config.TechAge[currentTechAge].idx;
   const pool = keysOf(Config.GreatPerson).filter(
      (p) => Config.TechAge[Config.GreatPerson[p].age].idx <= currentTechAgeIdx + 1,
   );
   let candidates = shuffle([...pool]);
   for (let i = 0; i < amount; i++) {
      const choice: GreatPerson[] = [];
      for (let i = 0; i < 3; i++) {
         if (candidates.length === 0) {
            candidates = shuffle([...pool]);
         }
         choice.push(candidates.pop()!);
      }
      getGameOptions().greatPeopleChoices.push(choice as GreatPeopleChoice);
   }
}

export function makeGreatPeopleFromThisRunPermanent(): void {
   const gs = getGameState();
   const options = getGameOptions();
   forEach(gs.greatPeople, (k, v) => {
      if (options.greatPeople[k]) {
         options.greatPeople[k]!.amount += v;
      } else {
         options.greatPeople[k] = { level: 1, amount: v - 1 };
      }
   });
}

export function upgradeAllPermanentGreatPeople(options: GameOptions): void {
   forEach(options.greatPeople, (greatPerson, inventory) => {
      while (inventory.amount >= getGreatPersonUpgradeCost(inventory.level + 1)) {
         inventory.amount -= getGreatPersonUpgradeCost(inventory.level + 1);
         ++inventory.level;
      }
   });
}
