class StringParser {
  regexMathOperation = /(?=[-+*\/])/;

  mathOperators = ["+", "-", "*", "/"];

  getListOfStrings = (string) => {
    return string.split(this.regexMathOperation).map((v) => v.trim());
  };

  run = (strings, objectValues) => {
    const parsed = strings.map((string) => {
      const parsed = this.getVal(string);
      return parsed;
    });
    return parsed.map((obj) => {
      const [condition, truthy, falsy] = Object.values(obj)[0];
      const res =
        condition === objectValues[Object.keys(obj)[0]] ? truthy : falsy;
      return { [Object.keys(obj)[0]]: res };
    });
  };

  getVal = (string) => {
    const regExp = /\(([^)]+)\)/;
    const matches = regExp.exec(string);
    const variable = matches[1].trim().split("===")[0].trim();
    const values = matches[1].trim().split("===")[1];

    return { [variable]: values.split(",").map((v) => parseFloat(v)) };
  };

  main = (string, objectValues) => {
    const strings = this.getListOfStrings(string);

    const operators = [];

    const cleanedStrings = strings.map((string) => {
      let newString;
      for (let i = 0; i < this.mathOperators.length; i++) {
        if (string.includes(this.mathOperators[i])) {
          operators.push(this.mathOperators[i]);
          newString = string.replace(this.mathOperators[i], "").trim();
        } else {
          newString = string;
        }
      }
      return newString;
    });

    const resultingArr = this.run(cleanedStrings, objectValues).map(
      (res) => Object.values(res)[0]
    );

    const evaluationArray = [...resultingArr]
      .map((e, i) => (i < resultingArr.length - 1 ? [e, operators[i]] : [e]))
      .reduce((a, b) => a.concat(b));

    return eval(evaluationArray.map((v) => String(v)).join(""));
  };
}

const parser = new StringParser();

const sampleString = `if (var_x === 3, 2, 0) + if (var_y === 4, 6, 8) - if (var_z === 3, 6, 8)`;
const sampleObj = { var_x: 3, var_y: 3, var_z: 4 };

console.log(parser.main(sampleString, sampleObj));
