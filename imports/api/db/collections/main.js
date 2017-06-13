export default
class Main extends SecureLayer.SecureCollection {
  constructor(name,Obj) {
    super(name,['desc','title'],{
      transform: (doc) => new Obj(this,doc),
    });
    this.obj = Obj;
    this.setPermissions();

    // this.local = new Mongo.Collection(null,{
    //   connection: null,
    //   transform: (doc) => new Obj(this,doc),
    // })
    // this.find({}).observe({
    //   added: (doc) => {
    //     this.local.insert(doc);
    //   },
    //   changed: (doc) => {
    //     let id = doc._id;
    //     delete doc._id;
    //     this.local.update({_id:id},{$set:{doc}});
    //   },
    //   removed: (doc) => {
    //     this.local.remove({_id:doc._id});
    //   }
    // });
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
