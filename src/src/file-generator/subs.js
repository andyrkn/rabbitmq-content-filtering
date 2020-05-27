let cities = ['Vancouver', 'Berlin', 'Moscow', 'Tampa', 'Heraklion', 'Nice', 'Edinburgh', 'Paris'];
let cars = ['Toyota', 'BMW', 'Toyota', 'Nissan', 'Daewoo', 'Volkswagen', 'Audi', 'Triumph', 'Tesla'];
let times = [1579896720, 1543622400, 1308614400, 1201910400, 1325376000, 1430611200, 1552089600, 934156800];
let comparisons = ['>', '<', '>=', '<=', '='];

let subscriptions = [];
let getRand = (max) => Math.floor(Math.random() * max);
let getRandCar = () => cars[getRand(8)];
let getRandCity = () => cities[getRand(8)];
let getRandTime = () => times[getRand(8)];
let getRandComparison = () => comparisons[getRand(5)];

let getRandValueArray = () => {
  let values = [`(city,=,${getRandCity()})`,`(car,=,${getRandCar()})`,`(speed,${getRandComparison()},${getRand(300)})`,`(time,=,${getRandTime()})`];

  let toRemove = getRand(3);
  for (let i = 0; i <= toRemove; i++) {
    if (values.length > 1) {
      values.splice(getRand(4), 1);
    }
  }

  let arrayToReturn = '{';
  for (let i = 0; i < values.length; i++) {
    arrayToReturn = arrayToReturn.concat(`${values[i]},`);
  }

  arrayToReturn = arrayToReturn.replace(/.$/,"}");
  return arrayToReturn;
}

for (let index = 0; index < 10000; index++) {
  let subscription = getRandValueArray();
  subscriptions.push(subscription);
}
