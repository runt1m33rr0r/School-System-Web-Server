const BaseData = require('../../base/base.data');

class TimeslotData extends BaseData {
  constructor(db, models) {
    super(db);

    const { Timeslot } = models;
    this.Timeslot = Timeslot;
  }

  createTimeslots(timeslotArray) {
    if (!Array.isArray(timeslotArray)) {
      return Promise.reject(new Error('Невалидни данни!'));
    }

    const timeslotModels = [];
    const checks = [];

    /* eslint no-restricted-syntax: 0 */
    for (const timeslot of timeslotArray) {
      const {
        fromHour, fromMinute, toHour, toMinute, day,
      } = timeslot;
      const check = this.collection
        .findOne({
          fromHour,
          fromMinute,
          toHour,
          toMinute,
          day,
        })
        .then((result) => {
          if (result) {
            return Promise.reject(new Error('Такива предмети вече съществуват!'));
          }

          timeslotModels.push(new this.Timeslot(fromHour, fromMinute, toHour, toMinute, day));
        });
      checks.push(check);
    }

    return Promise.all(checks).then(() => this.createManyEntries(timeslotModels));
  }
}

module.exports = TimeslotData;
