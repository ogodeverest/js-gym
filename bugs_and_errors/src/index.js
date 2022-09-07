function test(label, body) {
  if (!body()) console.log(`Failed: ${label}`);
}

test("convert Latin text to uppercase", () => {
  return "hello".toUpperCase() === "HELLO";
});
test("convert Greek text to uppercase", () => {
  return "Χαίρετε".toUpperCase() === "ΧΑΊΡΕΤΕ";
});
test("don't convert case-less characters", () => {
  return "مرحبا".toUpperCase() === "مرحبا";
});

function numberToString(number, base) {
  let result = "",
    sign = "";

  if (number < 0) {
    sign = "-";
    number = -number;
  }

  do {
    result = String(number % base) + result;
    number = Math.floor(number / base);
  } while (number > 0);

  return sign + result;
}

console.log(numberToString(13, 2));

class InputError extends Error {}

function promptDirection(question) {
  let direction = prompt(question);
  if (direction.toLowerCase() === "right") return "R";
  if (direction.toLowerCase() === "left") return "L";

  throw new InputError("Unknown Direction : " + direction);
}

function look() {
  if (promptDirection("Input next direction") === "L") {
    return "a house";
  } else {
    return "a bear";
  }
}

try {
  //console.log("You see : " + look());
} catch (error) {
  console.log("Something went wrong: ", error);
}

const accounts = {
  a: 100,
  b: 0,
  c: 200
};

function getAccount() {
  const accountName = prompt("Enter account name:");
  if (!accounts.hasOwnProperty(accountName)) {
    throw new Error(`Account name: ${accountName} not found`);
  }
  return accountName;
}

function transfer(from, ammount) {
  if (accounts[from] < ammount)
    throw new Error("Not enough credit to finish the transaction!");
  let progress = 0;

  try {
    accounts[from] -= ammount;
    progress = 1;
    accounts[getAccount()] += ammount;
    progress = 2;
  } catch (error) {
    alert(error.message);
  } finally {
    if (progress === 1) {
      accounts[from] += ammount;
    }
    alert(JSON.stringify(accounts));
  }
}

try {
  //  transfer("a",100);
} catch (error) {
  alert(error.message);
}

for (;;) {
  try {
    let direction = promptDirection("Give a direction:");
    alert("You choose : " + direction);
    break;
  } catch (error) {
    if (error instanceof InputError) {
      alert(error.message);
    } else {
      throw error;
    }
  }
}

class ArrayParameterError extends Error{}

function firstElement(array){
  if(array.length === 0){
    throw new ArrayParameterError("Called on an empty arrray []");
  }
  return array[0];
}


try{
 console.log(firstElement([]));
}catch(error){
   if(error instanceof ArrayParameterError){
    console.log(error.message);
   }
}


///Retry

class MultiplicatorUnitFailure extends Error {}

function primitiveMultiply(a, b) {
  if (Math.random() < 0.2) {
    return a * b;
  } else {
    throw new MultiplicatorUnitFailure("Klunk");
  }
}

function reliableMultiply(a, b) {
  try{
   return primitiveMultiply(a,b);
  }catch(error){
   if(error instanceof MultiplicatorUnitFailure) return reliableMultiply(a,b)
   else throw error
  }  
}

console.log(reliableMultiply(8, 8));

const box = {
  locked: true,
  unlock() { this.locked = false; },
  lock() { this.locked = true;  },
  _content: [],
  get content() {
    if (this.locked) throw new Error("Locked!");
    return this._content;
  }
};

function withBoxUnlocked(body) {
  // Your code here.
  const {locked} = box;
  if(!locked) return body();
  
  box.unlock();
  try{
  	return body();
  }finally{
    box.lock();
  }
}

withBoxUnlocked(function() {
  box.content.push("gold piece");
});

try {
  withBoxUnlocked(function() {
    throw new Error("Pirates on the horizon! Abort!");
  });
} catch (e) {
  console.log("Error raised: " + e);
}
console.log(box.locked);
// → true
