//Matrix
class Matrix {
  constructor(width, height, element = (x, y) => undefined) {
    this.width = width;
    this.height = height;
    this.content = [];

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        this.content[y * width + x] = element(x, y);
      }
    }
  }

  [Symbol.iterator]() {
    return new MatrixIterator(this);
  }

  get(x, y) {
    return this.content[y * this.width + x];
  }

  set(x, y, value) {
    return (this.content[y * this.width + x] = value);
  }

  toString() {
    let string = "";
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        string += " ";
        string += this.get(x, y);
      }
      string += "\n";
    }
    return string;
  }

  toFlatString() {
    return this.content.toString();
  }
}

class MatrixIterator {
  constructor(matrix) {
    this.matrix = matrix;
    this.x = 0;
    this.y = 0;
  }

  next() {
    if (this.y === this.matrix.height) return { done: true };

    let value = {
      value: this.matrix.get(this.x, this.y),
      x: this.x,
      y: this.y
    };

    this.x++;

    if (this.x === this.matrix.width) {
      this.x = 0;
      this.y++;
    }

    return { value, done: false };
  }
}

class SymetricMatrix extends Matrix {
  constructor(width, height, element = (x, y) => undefined) {
    super(width, height, (x, y) => {
      if (x < y) return element(y, x);
      else return element(x, y);
    });
  }

  set(x, y, value) {
    super.set(x, y, value);
    if (x !== y) {
      super.set(y, x, value);
    }
  }

  static checKSymetry(matrix) {
    for (let y = 0; y < matrix.height; y++) {
      for (let x = 0; x < matrix.width; x++) {
        if (matrix.get(x, y) !== matrix.get(y, x)) return false;
      }
    }

    return true;
  }
}

const normalMatrix = new Matrix(10, 10, (x, y) => `${x}${y}`);
const symetricMatrix = new SymetricMatrix(10, 10, (x, y) => `${x}${y}`);

for (let { x, y, value } of normalMatrix) {
  console.log(x, y, value);
}

console.log(symetricMatrix.toString());
console.log(SymetricMatrix.checKSymetry(symetricMatrix));

// Playing around with instaceof operator
console.log(normalMatrix instanceof Matrix);
console.log(symetricMatrix instanceof Matrix);
console.log(normalMatrix instanceof SymetricMatrix);
console.log(symetricMatrix instanceof SymetricMatrix);

//Temperature
class Temperature {
  constructor(celsius) {
    this.celsius = celsius;
  }

  get fahrenheit() {
    return this.celsius * 1.8 + 32;
  }

  set fahrenheit(value) {
    this.celsius = (value - 32) / 1.8;
  }

  static fromFahrenait(value) {
    return new Temperature((value - 32) / 1.8);
  }
}

const temperature = new Temperature(35);

console.log(temperature.fahrenheit);
console.log(temperature.celsius);

//Vector

class Vec {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  get length() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }

  plus(vec) {
    const x = this.x + vec.x;
    const y = this.y + vec.y;
    return new Vec(x, y);
  }

  minus(vec) {
    const x = this.x - vec.x;
    const y = this.y - vec.y;

    return new Vec(x, y);
  }

  toString() {
    return `[${this.x},${this.y}]`;
  }
}

console.log(new Vec(1, 2).plus(new Vec(2, 3)));
console.log(new Vec(1, 2).minus(new Vec(2, 3)));
console.log(new Vec(3, 4).length);
console.log(new Vec(1, 5).toString());

//Group || Set
class Group {
  constructor() {
    this.content = [];
  }

  has(value) {
    return this.content.includes(value);
  }

  add(value) {
    if (!this.has(value)) this.content.push(value);
  }

  delete(value) {
    this.content = this.content.filter((entry) => entry !== value);
  }

  static from(source) {
    const group = new Group();
    for (let entry of source) {
      group.add(entry);
    }
    return group;
  }

  [Symbol.iterator]() {
    return new GroupIterator(this);
  }
}

class GroupIterator {
  constructor(group) {
    this.current = 0;
    this.group = group;
  }

  next() {
    if (this.current === this.group.content.length) {
      return { done: true };
    }
    let value = this.group.content[this.current];
    this.current++;
    return { value, done: false };
  }
}

let group = Group.from([10, 20]);
console.log(group.has(10));
console.log(group.has(30));
group.add(10);
group.delete(10);
console.log(group.has(10));

for (let value of Group.from(["a", "b", "c"])) {
  console.log(value);
}

// Calling overwritten methods

let map = { one: true, two: true, hasOwnProperty: true };

console.log(Object.prototype.hasOwnProperty.call(map, "one"));
