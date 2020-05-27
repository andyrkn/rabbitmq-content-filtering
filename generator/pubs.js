let cities = ['Vancouver', 'Berlin', 'Moscow', 'Tampa', 'Heraklion', 'Nice', 'Edinburgh', 'Paris'];
let cars = ['Toyota', 'BMW', 'Toyota', 'Nissan', 'Daewoo', 'Volkswagen', 'Audi', 'Triumph', 'Tesla'];
let times = [1579896720, 1543622400, 1308614400, 1201910400, 1325376000, 1430611200, 1552089600, 934156800];

let getRand = (max) => Math.floor(Math.random() * max);
let getRandCar = () => cars[getRand(8)];
let getRandCity = () => cities[getRand(8)];
let getRandTime = () => times[getRand(8)];

let getPublication = () => {
  let values = [`(city,${getRandCity()})`,`(car,${getRandCar()})`,`(speed,${getRand(300)})`,`(time,${getRandTime()})`];
  let arrayToReturn = '{';

  for (let i = 0; i < values.length; i++) {
    arrayToReturn = arrayToReturn.concat(`${values[i]},`);
  }

  arrayToReturn = arrayToReturn.replace(/.$/,"}");
  return arrayToReturn;
}

for (let index = 0; index < 10000; index++) {
  console.log(getPublication());
}
