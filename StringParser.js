class StringParser {
  regexMathOperation = /(?=[-+*\/])/;

  mathOperators = ["+", "-", "*", "/"];

  getListOfStrings = (string) => {
    return string.split(this.regexMathOperation).map((v) => v.trim());
  };

  run = (strings, objectValues) => {
    const parsed = strings.map((string) => {
      const parsed = this.getVal(string, objectValues);
      console.log("PARSED ", parsed);
      return parsed;
    });
    return parsed.map((obj) => {
      const [condition, truthy, falsy] = Object.values(obj)[0];
      const res =
        condition === objectValues[Object.keys(obj)[0]] ? truthy : falsy;
      return { [Object.keys(obj)[0]]: res };
    });
  };

  getVal = (string, objectValues) => {
    const regExp = /\(([^)]+)\)/;
    const matches = regExp.exec(string);

    let modValue = 0;

    if (matches[1].includes("if")) {
      const modString = matches[1] + ")";

      const matches2 = regExp.exec(modString);

      const variable = matches2[1].trim().split("===")[0].trim();
      const values = matches2[1].trim().split("===")[1];

      const [condition, truthy, falsy] = values
        .split(",")
        .map((val) => parseFloat(val));

      modValue = objectValues[variable] === condition ? truthy : falsy;
    }
    const variable = matches[1].trim().split("===")[0].trim();
    const values = matches[1].trim().split("===")[1];

    return {
      [variable]: values.split(",").map((v) => {
        return isNaN(parseFloat(v)) ? modValue : parseFloat(v);
      }),
    };
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

const sampleString = `if (var_1 === 2, 0, if (var_2 === 4, 15, 0)) + if (var_2 === 3, 5, 0) - if (var_4 === 2, 0, 5)`;
const sampleObj = { var_1: 1, var_2: 4, var_3: 3, var_4: 5 };

console.log(parser.main(sampleString, sampleObj));
