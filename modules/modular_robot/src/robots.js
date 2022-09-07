import { randomPick } from "./utils";
import { find_path } from "dijkstrajs";
const mailRoute = [
  "Alice's House",
  "Cabin",
  "Alice's House",
  "Bob's House",
  "Town Hall",
  "Daria's House",
  "Ernie's House",
  "Grete's House",
  "Shop",
  "Grete's House",
  "Farm",
  "Marketplace",
  "Post Office"
];

export function routeRobot(state, memory) {
  if (memory.length == 0) {
    memory = mailRoute;
  }
  return { direction: memory[0], memory: memory.slice(1) };
}

export function randomRobot(state) {
  return { direction: randomPick(state.roads[state.place]) };
}

function findRoute(graph, from, to) {
  let wGraph = {};
  for (let node of Object.keys(graph)) {
    let edges = (wGraph[node] = {});
    for (let dest of graph[node]) {
      edges[dest] = 1;
    }
  }

  return find_path(wGraph, from, to);
}

export function goalOrientedRobot({ place, parcels, roads }, route) {
  if (route.length === 0) {
    const parcel = parcels[0];
    if (place !== parcel.place) {
      route = findRoute(roads, place, parcel.place);
    } else {
      route = findRoute(roads, place, parcel.address);
    }
  }

  return { direction: route[0], memory: route.slice(1) };
}

export function runRobot(state, robot, memory) {
  for (let turn = 0; ; turn++) {
    if (state.parcels.length === 0) {
      console.log(`Done in ${turn} turns`);
      break;
    }
    const action = robot(state, memory);
    state = state.move(action.direction);
    memory = action.memory;
    console.log(`Moved to : ${action.direction};`);
  }
}
