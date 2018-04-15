const { ObjectID } = require('mongodb');

class BaseData {
  constructor(db, models) {
    this.db = db;
    this.models = models;
    this.collectionName = `${this.constructor.name.replace('Data', '')}Collection`;
    this.collection = this.db.collection(this.collectionName);
  }

  async clean() {
    return this.collection.deleteMany({});
  }

  async createEntry(entry) {
    if (!entry) {
      return Promise.reject(new Error('Невалидни данни!'));
    }

    return this.collection.insertOne(entry).then(() => entry);
  }

  async createManyEntries(entries) {
    if (!Array.isArray(entries) || entries.length < 1) {
      return Promise.reject(new Error('Невалидни данни!'));
    }

    return this.collection.insertMany(entries).then(() => entries);
  }

  async deleteOne(criteria) {
    return this.collection.remove(criteria, { justOne: true });
  }

  async deleteMany(criteria) {
    return this.collection.remove(criteria, { justOne: false });
  }

  async getByID(id) {
    if (!ObjectID.isValid(id)) {
      return Promise.reject(new Error('Невалидно id!'));
    }

    return this.collection.findOne({
      _id: new ObjectID(id),
    });
  }

  async getCount() {
    return this.collection.count();
  }

  async getAll() {
    return this.collection.find().toArray();
  }

  async getFirst() {
    return this.collection.findOne({});
  }

  async getAllPropVals(propName) {
    return this.getAll().then((items) => {
      const vals = [];
      items.forEach((item) => {
        vals.push(item[propName]);
      });
      return Promise.resolve(vals);
    });
  }
}

module.exports = BaseData;
