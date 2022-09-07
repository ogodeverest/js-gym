//INI file
function parseINI(string) {
  // Start with an object to hold the top-level fields
  let result = {};
  let section = result;
  string.split(/\r?\n/).forEach((line) => {
    let match;
    if ((match = line.match(/^(\w+)=(.*)$/))) {
      section[match[1]] = match[2];
    } else if ((match = line.match(/^\[(.*)\]$/))) {
      section = result[match[1]] = {};
    } else if (!/^\s*(;.*)?$/.test(line)) {
      throw new Error("Line '" + line + "' is not valid.");
    }
  });
  return result;
}

console.log(
  parseINI(`
name=Vasilis
[address]
city=Tessaloniki`)
);
// → {name: "Vasilis", address: {city: "Tessaloniki"}}
//looping matches
{
  let input = "A string with 3 numbers in it... 42 and 88.";
  let regEx = /\b\d+\b/g;
  let match;

  while ((match = regEx.exec(input))) {
    console.log("Found " + match[0] + " at: " + match.index);
  }
}

//Last index and sticky
{
  let global = /abc/g;
  const test = "xyz abc";
  console.log(global.exec(test));

  let sticky = /abc/y;
  sticky.lastIndex = 4;
  console.log(sticky.exec(test));
}
//Dynamic regexp
{
  let name = "dea+hl[]rd";
  let text = "This dea+hl[]rd guy is super annoying.";
  let escaped = name.replace(/[\\[.+*?(){|^$]/g, "\\$&");
  let regexp = new RegExp("\\b" + escaped + "\\b", "gi");
  console.log(text.replace(regexp, "_$&_"));
}
//Greed
{
  function stripComments(code) {
    return code.replace(/\/\/.*|\/\*[^]*?\*\//g, "");
  }
  console.log(stripComments("1 /* a */+/* b */ 1"));
  // → 1 + 1
}
//Replace
{
  let stock = "1 lemon, 2 cabbages, and 101 eggs";
  function minusOne(match, amount, unit) {
    amount = Number(amount) - 1;
    if (amount == 1) {
      // only one left, remove the 's'
      unit = unit.slice(0, unit.length - 1);
    } else if (amount == 0) {
      amount = "no";
    }
    return amount + " " + unit;
  }
  console.log(stock.replace(/(\d+) (\w+)/g, minusOne));
  // → no lemon, 1 cabbage, and 100 eggs
}
//Choice patterns

{
  let animalCount = /\b\d+ (pig|cow|chicken)s?\b/;
  console.log(animalCount.test("15 pigs"));
  // → true
  console.log(animalCount.test("15 pigchickens"));
  // → false
}
//Date
{
  function getDate(string) {
    let [_, month, day, year] = /^(\d{1,2})-(\d{1,2})-(\d{4})$/.exec(string);
    return new Date(year, month - 1, day);
  }
}
{
  let notBinary = /[^01]/;
  console.log(notBinary.test("0101010101"));
  console.log(notBinary.test("0101201"));
}
//E1
{
  verify(/ca(r|t)/, ["my car", "bad cats"], ["camper", "high art"]);

  verify(/pr?op/, ["pop culture", "mad props"], ["plop", "prrrop"]);

  verify(
    /ferr[aertiy]{1,3}/,
    ["ferret", "ferry", "ferrari"],
    ["ferrum", "transfer A"]
  );

  verify(
    /ious\b/,
    ["how delicious", "spacious room"],
    ["ruinous", "consciousness"]
  );

  verify(/\s[.,:;]/, ["bad punctuation ."], ["escape the period"]);

  verify(
    /\w{6,}/,
    ["Siebentausenddreihundertzweiundzwanzig"],
    ["no", "three small words"]
  );

  verify(
    /\b[^\We]+\b/i,
    ["red platypus", "wobbling nest"],
    ["earth bed", "learning ape", "BEET"]
  );

  function verify(regexp, yes, no) {
    // Ignore unfinished exercises
    if (regexp.source === "...") return;
    for (let str of yes)
      if (!regexp.test(str)) {
        console.log(`Failure to match '${str}'`);
      }
    for (let str of no)
      if (regexp.test(str)) {
        console.log(`Unexpected match for '${str}'`);
      }
  }
}
//E2
{
  let text = "'I'm the cook,' he said, 'it's my job.'";
  // Change this call.
  console.log(text.replace(/'(([^]*?)[.!?,])'/g, `"$1"`));
  // → "I'm the cook," he said, "it's my job."
  or: console.log(text.replace(/(^|\W)'|'(\W|$)/g, '$1"$2'));
}
//E3
{
  // Fill in this regular expression.
  let number = /^([+-])?(\d+(\.\d*)?|\.\d+)([eE][+-]?\d+)?$/;

  // Tests:
  for (let str of [
    "1",
    "-1",
    "+15",
    "1.55",
    ".5",
    "5.",
    "1.3e2",
    "1E-4",
    "1e+12"
  ]) {
    if (!number.test(str)) {
      console.log(`Failed to match '${str}'`);
    }
  }
  for (let str of ["1a", "+-1", "1.2.3", "1+1", "1e4.5", ".5.", "1f5", "."]) {
    if (number.test(str)) {
      console.log(`Incorrectly accepted '${str}'`);
    }
  }
}
