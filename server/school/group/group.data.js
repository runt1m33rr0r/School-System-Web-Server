const BaseData = require('../../base/base.data');

class GroupData extends BaseData {
  async createGroup(name, subjects) {
    if (await this.getGroupByName(name)) {
      throw new Error('Вече има такава група!');
    }

    const { Group } = this.models;
    const groupModel = new Group(name, subjects);
    return this.createEntry(groupModel);
  }

  async updateGroupSubjects(groupName, subjects) {
    if (
      !groupName ||
      typeof groupName !== 'string' ||
      groupName.length < 1 ||
      !Array.isArray(subjects)
    ) {
      throw new Error('Невалидна група или предмети!');
    }

    for (const subject of subjects) {
      if (typeof subject !== 'string' || subject.length < 3) {
        throw new Error('Невалиден предмет!');
      }
    }

    return this.collection.findOneAndUpdate(
      {
        name: groupName,
      },
      {
        $set: {
          subjects,
        },
      },
    );
  }

  async createGroups(groupsArray) {
    const groupModels = [];
    const checks = [];
    const { Group } = this.models;

    for (const group of groupsArray) {
      const { subjects, name } = group;

      groupModels.push(new Group(name, subjects));
      checks.push(this.getGroupByName(name));
    }

    if ((await Promise.all(checks)).some(val => val)) {
      throw new Error('Вече има такава група!');
    }
    return this.createManyEntries(groupModels);
  }

  async getGroupByName(name) {
    if (!name) {
      throw new Error('Невалидно име на група!');
    }

    return this.collection.findOne({ name });
  }

  async getGroupsByNames(names) {
    if (!names || !Array.isArray(names)) {
      throw new Error('Невалидни имена на групи!');
    }

    const validGroupNames = [];
    const groupPromises = [];

    names.forEach((name) => {
      const promise = this.getGroupByName(name).then((result) => {
        if (result) {
          validGroupNames.push(result.name);
        }
      });
      groupPromises.push(promise);
    });

    await Promise.all(groupPromises);
    return validGroupNames;
  }
}

module.exports = GroupData;
