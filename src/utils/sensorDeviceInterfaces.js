//  SENSORS:

export const temperatureSensor = {
  value: function value(status) {
    let value = parseFloat('' + status[1] + '.' + status[0]);
    value = value.toFixed(1);
    return value;
  },
  units: '°',
  unitsLong: '°C',
  minimum: -20,
  maximum: 50,
  step: 1,
  enableMinimumThreshold: true
}

export const illuminationSensor = {
  value: function value(status) {
    return parseInt(status[1]);
  },
  units: '%',
  unitsLong: '%',
  minimum: 0,
  maximum: 100,
  step: 5
}

export const humiditySensor = {
  value: function value(status) {
    return parseInt(status[1]);
  },
  units: '%',
  unitsLong: '%',
  minimum: 0,
  maximum: 100,
  step: 5
}

export const motionSensor = {
  value: function value(status) {
    return parseInt(status[1]);
  },
  units: '%',
  unitsLong: '%',
  minimum: 0,
  maximum: 100,
  step: 5
}

export const CO2Sensor = {
  value: function value(status) {
    return parseInt(status[1]) * 100 + Math.round( 100 * (parseInt(status[0]) / 255) );
  },
  units: 'ppm',
  unitsLong: 'ppm',
  minimum: 800,
  maximum: 1500,
  step: 50
}

export const leakSensor = {
  value: function value(status) {
    return parseInt(status[0]);
  },
  units: '',
  unitsLong: '',
  // hideValue: true
}

export const doorSensor = {
  value: function value(status) {
    return parseInt(status[0]);
  },
  units: '',
  unitsLong: '',
  // hideValue: true
}





export default {
  'temperature-sensor': temperatureSensor,
  'illumination-sensor': illuminationSensor,
  'humidity-sensor': humiditySensor,
  'motion-sensor': motionSensor,
  'co2-sensor': CO2Sensor,
  'leak-sensor': leakSensor,
  'door-sensor': doorSensor,
}