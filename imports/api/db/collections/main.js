export default
class Main extends Mongo.Collection {
  constructor(name,Obj) {
    super(name,{
      transform: (doc) => new Obj(this,doc),
    });
    this.obj = Obj;
    this.setPermissions();
  }
  setPermissions() {
    // console.log(this);
    this.allow({
      insert: function(userId,doc) {
        return true;
      },
      update: function(userId,doc,fields,modifier) {
        return true;
      },
      remove: function(userId,doc) {
        return true;
      },
      fetch: ['owner','users'],
    });
  }

  new(defaults={}) {
    return new this.obj(defaults);
  }
}
