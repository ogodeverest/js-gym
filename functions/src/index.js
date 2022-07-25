//

function findSolution(target) {
  function find(current, history) {
    if (current === target) {
      return history;
    } else if (current > target) {
      return null;
    } else {
      return find(current + 5, `(${history} + 5)`) ||
             find(current * 3, `(${history} * 3)`);
    }
  }
  return find(1, "1");
}

console.log(findSolution(24));

function isEven(number){
  number = Math.abs(number);
  if(number === 0){
   return true;
  }else if(number === 1){
    return false;
  }else{
   return isEven(number -2); 
  }
}

console.log(isEven(50));
console.log(isEven(75));
console.log(isEven(-4));

// Your code here.

function countBs(string){
  return countChar(string,"B");
}

function countChar(string,char){
  let counter = 0;
  for(let i=0; i < string.length ;i++){
   if(string[i] === char) counter ++;
  }
  return counter;
}

console.log(countBs("BBC"));
// → 2
console.log(countChar("kakkerlak", "k"));
// → 4