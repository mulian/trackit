export default
class AddProperty {
  constructor(value) {
    if(value) this.set(value);
  }
  set(value) {
    this.value = value;
  }
  get() {
    return this.value;
  }
}
