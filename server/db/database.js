const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

// Ensure directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

class JsonDB {
  constructor(collectionName) {
    this.filePath = path.join(DATA_DIR, `${collectionName}.json`);
    this.collectionName = collectionName;
    if (!fs.existsSync(this.filePath)) {
      this.writeAtomic([]);
    }
  }

  read() {
    try {
      if (!fs.existsSync(this.filePath)) {
        return [];
      }
      const raw = fs.readFileSync(this.filePath, 'utf-8');
      return JSON.parse(raw || '[]');
    } catch (err) {
      console.error(`Error reading ${this.collectionName}:`, err);
      return [];
    }
  }

  writeAtomic(data) {
    const tempPath = `${this.filePath}.${Date.now()}.tmp`;
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempPath, this.filePath);
  }

  find(predicate) {
    const all = this.read();
    if (!predicate) return all;
    return all.filter(predicate);
  }

  findOne(predicate) {
    const all = this.read();
    return all.find(predicate) || null;
  }

  findById(id) {
    return this.findOne(item => String(item.id) === String(id));
  }

  insert(item) {
    const all = this.read();
    const newItem = {
      ...item,
      id: item.id || `cc_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      createdAt: item.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    all.push(newItem);
    this.writeAtomic(all);
    return newItem;
  }

  update(id, updates) {
    const all = this.read();
    const index = all.findIndex(item => String(item.id) === String(id));
    if (index === -1) return null;
    all[index] = {
      ...all[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.writeAtomic(all);
    return all[index];
  }

  delete(id) {
    const all = this.read();
    const filtered = all.filter(item => String(item.id) !== String(id));
    if (filtered.length !== all.length) {
      this.writeAtomic(filtered);
      return true;
    }
    return false;
  }
}

module.exports = {
  usersDB: new JsonDB('users'),
  opportunitiesDB: new JsonDB('opportunities'),
  applicationsDB: new JsonDB('applications'),
  ticketsDB: new JsonDB('tickets'),
  servicesDB: new JsonDB('services'),
  eventsDB: new JsonDB('events'),
  announcementsDB: new JsonDB('announcements')
};
