import roadGraph from "./graph";
import { randomPick } from "./utils";

export default class VillageState {
  constructor(place, parcels, roads = roadGraph) {
    this.place = place;
    this.parcels = parcels;
    this.roads = roads;
  }

  move(destination) {
    if (!this.roads[this.place].includes(destination)) {
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

      return new VillageState(destination, parcels, this.roads);
    }
  }

  static random(parcelCount = 5, roads = roadGraph) {
    const parcels = [];
    for (let i = 0; i < parcelCount; i++) {
      const address = randomPick(Object.keys(roads));
      let place;

      do {
        place = randomPick(Object.keys(roads));
      } while (place === address);

      parcels.push({ place, address });
    }

    return new VillageState("Post Office", parcels, roads);
  }
}
