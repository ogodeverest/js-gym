
//Form a triangle
for (let row = "#"; row.length < 8; row += "#") console.log(row);

//Fizbuzz

for (let i = 1; i <= 100; i++) {
  let string = "";
  if (!(i % 5)) string += "Fizz";
  if (!(i % 3)) string += "Buzz";

  console.log(string || i);
}

//Checkboard

const size = 12;
let checkBoard = "";

for (let i = 0; i < size; i++) {
  for (let j = 0; j < size; j++) {
    checkBoard += (i + j) % 2 === 0 ? " " : "#";
  }
  checkBoard += "\n";
}
console.log(checkBoard);
