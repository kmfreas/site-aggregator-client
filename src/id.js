export default {
  ID: null,
  set() {
    this.ID = new Date().valueOf();
  },
  get() {
    return this.ID;
  },
  clear() {
    this.ID = null;
  },
};
