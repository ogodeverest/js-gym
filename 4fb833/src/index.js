import VillageState from "./village-state";
import { randomRobot, routeRobot, goalOrientedRobot, runRobot } from "./robots";

// runRobot(VillageState.random(5), randomRobot);

// runRobot(VillageState.random(), routeRobot, []);

runRobot(VillageState.random(), goalOrientedRobot, []);
