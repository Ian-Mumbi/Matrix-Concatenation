const multiArray = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

const generate = (ma) => {
  const concatArr = [];
  for (let i = 0; i < ma.length; i++) {
    for (let j = 0; j < ma[i].length; j++) {
      if (ma[i + 1]) {
        ma[i + 1].forEach((otherArrNum) => {
          concatArr.push(String(ma[i][j]) + " " + String(otherArrNum));
        });
      }
    }
  }
  return concatArr;
};

console.log(generate(multiArray));
