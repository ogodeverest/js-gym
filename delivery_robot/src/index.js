//Bot

const roads = [
  "Alice's House-Bob's House",
  "Alice's House-Cabin",
  "Alice's House-Post Office",
  "Bob's House-Town Hall",
  "Daria's House-Ernie's House",
  "Daria's House-Town Hall",
  "Ernie's House-Grete's House",
  "Grete's House-Farm",
  "Grete's House-Shop",
  "Marketplace-Farm",
  "Marketplace-Post Office",
  "Marketplace-Shop",
  "Marketplace-Town Hall",
  "Shop-Town Hall"
];

function buildGraph(edges) {
  let graph = Object.create(null);
  function addEdge(from, to) {
    if (graph[from] == null) {
      graph[from] = [to];
    } else {
      graph[from].push(to);
    }
  }
  for (let [from, to] of edges.map((r) => r.split("-"))) {
    addEdge(from, to);
    addEdge(to, from);
  }
  return graph;
}

const roadGraph = buildGraph(roads);
console.log(roadGraph);

class VillageState {
  constructor(place, parcels) {
    this.place = place;
    this.parcels = parcels;
  }

  move(destination) {
    if (!roadGraph[this.place].includes(destination)) {
      return this; //old state;
    } else {
      const parcels = this.parcels
        .map((parcel) => {
          if (parcel.place !== this.place) return parcel;
          return {
            place: destination,
            address: parcel.address
          };
        })
        .filter((parcel) => parcel.place !== parcel.address);

      return new VillageState(destination, parcels);
    }
  }

  static random(parcelCount = 5) {
    const parcels = [];
    for (let i = 0; i < parcelCount; i++) {
      const address = randomPick(Object.keys(roadGraph));
      let place;

      do {
        place = randomPick(Object.keys(roadGraph));
      } while (place === address);

      parcels.push({ place, address });
    }

    return new VillageState("Post Office", parcels);
  }
}

let first = new VillageState("Post Office", [
  { place: "Post Office", address: "Alice's House" }
]);

let next = first.move("Alice's House");

console.log("Next place : ", next.place);
console.log("Next parcels : ", next.parcels);

console.log("First place :", first.place);
console.log("First parcels :", first.parcels);

// Immutable Objects

let object = Object.freeze({ value: 3 });

function runRobot(state, robot, memory) {
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

function randomPick(array) {
  const choice = Math.floor(Math.random() * array.length);
  return array[choice];
}

function randomRobot(state) {
  return { direction: randomPick(roadGraph[state.place]) };
}

runRobot(VillageState.random(5), randomRobot);

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

function routeRobot(state, memory) {
  if (memory.length == 0) {
    memory = mailRoute;
  }
  return { direction: memory[0], memory: memory.slice(1) };
}

runRobot(VillageState.random(), routeRobot, []);

function findRoute(graph, from, to) {
  let work = [{ at: from, route: [] }];
  for (let i = 0; i < work.length; i++) {
    const { at, route } = work[i];
    for (let place of graph[at]) {
      if (to === place) return route.concat(place);
      if (!work.some((w) => w.at === place)) {
        work.push({
          at: place,
          route: route.concat(place)
        });
      }
    }
  }
}

console.log(findRoute(roadGraph, "Alice's House", "Farm"));

function goalOrientedRobot({ place, parcels }, route) {
  if (route.length === 0) {
    const parcel = parcels[0];
    if (place !== parcel.place) {
      route = findRoute(roadGraph, place, parcel.place);
    } else {
      route = findRoute(roadGraph, place, parcel.address);
    }
  }

  return { direction: route[0], memory: route.slice(1) };
}

runRobot(VillageState.random(), goalOrientedRobot, []);

function generateTasks() {
  const tasks = [];
  for (let i = 0; i < 100; i++) {
    tasks.push(VillageState.random());
  }
  return tasks;
}

function avarageSteps(robot, memory) {
  const tasks = generateTasks();

  function count(task) {
    let steps = 0;
    while (task.parcels.length !== 0) {
      const action = robot(task, memory);
      task = task.move(action.direction);
      memory = action.memory;
      steps++;
    }
    return steps;
  }

  const total = tasks.map((task) => count(task)).reduce((a, b) => a + b, 0);

  return total / tasks.length;
}

function compareRobots(robot1, memory1, robot2, memory2) {
  console.log("Robot 1:", avarageSteps(robot1, memory1));
  console.log("Robot 2:", avarageSteps(robot2, memory2));
}

compareRobots(routeRobot, [], goalOrientedRobot, []);

function findNearestRoute(place, parcels) {
  const routes = parcels.map((parcel) => {
    if (parcel.place !== place) {
      return { route: findRoute(roadGraph, place, parcel.place), pickUp: true };
    } else {
      return {
        route: findRoute(roadGraph, place, parcel.address),
        pickUp: false
      };
    }
  });
  function score({ route, pickUp }) {
    return (pickUp ? 0.5 : 0) - route.length;
  }

  return routes.reduce((a, b) => (score(a) > score(b) ? a : b)).route;
}

function enhancedGoalOrientedRobot({ place, parcels }, route) {
  //Get the nearest parcel
  if (route.length === 0) {
    route = findNearestRoute(place, parcels);
  }

  return { direction: route[0], memory: route.slice(1) };
}
compareRobots(enhancedGoalOrientedRobot, [], goalOrientedRobot, []);

//Presistent Group

class PGroupIterable {
  constructor(pGroup) {
    this.pGroup = pGroup;
    this.currentIndex = 0;
  }

  next() {
    let value = this.pGroup.content[this.currentIndex];

    if (this.currentIndex === this.pGroup.content.length) {
      return { done: true, value };
    }

    this.currentIndex++;
    return { done: false, value };
  }
}

class PGroup {
  constructor(content = []) {
    this.content = content;
  }

  add(value) {
    if (this.has(value)) return this;
    return new PGroup(this.content.concat(value));
  }

  delete(value) {
    if (!this.has(value)) return this;
    return new PGroup(this.content.filter((entry) => entry !== value));
  }

  has(value) {
    return this.content.includes(value);
  }

  [Symbol.iterator]() {
    return new PGroupIterable(this);
  }
}

PGroup.empty = new PGroup();

let a = PGroup.empty.add("a");
let ab = a.add("b");
let multiple = ab.add("c");
let b = ab.delete("a");

for (let value of multiple) {
  console.log(value);
}
console.log(b.has("b"));
// → true
console.log(a.has("b"));
// → false
console.log(b.has("a"));
// → false
