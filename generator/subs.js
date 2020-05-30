const fs = require('fs');

let cities = ['Vancouver', 'Berlin', 'Moscow', 'Tampa', 'Heraklion', 'Nice', 'Edinburgh', 'Paris'];
let cars = ['Toyota', 'BMW', 'Toyota', 'Nissan', 'Daewoo', 'Volkswagen', 'Audi', 'Triumph', 'Tesla'];
let times = [1579896720, 1543622400, 1308614400, 1201910400, 1325376000, 1430611200, 1552089600, 934156800];
let comparisons = ['>', '<', '>=', '<=', '!=', '='];

let getRand = (max) => Math.floor(Math.random() * max);
let getRandCar = () => cars[getRand(8)];
let getRandCity = () => cities[getRand(8)];
let getRandTime = () => times[getRand(8)];
let getRandComparison = () => comparisons[getRand(6)];
const getDeletedIndex = (rand, wArray) => {
  if (rand < 1 - wArray[0] - wArray[1] - wArray[2]) {
    return 3;
  }
  if (rand < 1 - wArray[0] - wArray[1]) {
    return 2;
  }
  if (rand < 1 - wArray[0]) {
    return 1;
  }
  return 0;
}

let getSubscription = (x, wArray) => {

  for (let index = 0; index < x; index++) {
    let values = [`(city,=,${getRandCity()})`,`(car,=,${getRandCar()})`,`(speed,${getRandComparison()},${getRand(300)})`,`(time,=,${getRandTime()})`];

    let toRemove = getRand(3);
    for (let i = 0; i <= toRemove; i++) {
      const rand = Math.random();
      if (values.length > 1) {
        values.splice(getDeletedIndex(rand, wArray), 1);
      }
    }

    let arrayToReturn = '"{';
    for (let i = 0; i < values.length; i++) {
      arrayToReturn = arrayToReturn.concat(`${values[i]},`);
    }

    arrayToReturn = arrayToReturn.replace(/.$/,"}\",");
    console.log(arrayToReturn);
  }

}

getSubscription(1000, [0.7, 0.1, 0.10, 0.10]);
