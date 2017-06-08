// import {dbTimeline,dbProfile,dbComments,dbMedia,dbGroups,dbFriends} from '../db.js'
import AddProperty from './add-property.js'
var notWatchAttr = ['_id','_','_new','groupUsers','groupAdmins','groupId'];
let saveTimer = 100;
export default
class MainObj {
  constructor(collection,doc) {
    this.collection = this.setCollection(collection);
    console.log(doc);
    if(doc) this.setDoc(doc);
  }
  setCollection(collection) {
    return function() { return collection };
  }

  setDoc(doc) {

    if(doc._id && Meteor.isClient) {
      // console.log("setDoc:",doc);
      this._ = {};
      this._new = {};
      for(attrName in doc) {
        this.addDocProperty(attrName,doc[attrName]);
      }
      // console.log("now:",this);
    } else {
      _.extend(this,doc);
    }
  }
  addDocProperty(propertyName, value) {
    if(!_.contains(notWatchAttr,propertyName) && Meteor.isClient) {
      if(value instanceof AddProperty) {
        Object.defineProperty(this, propertyName, {
          get: () => {
            return value.get();
          },
          set: (newValue) => {
            value.set(newValue);
          },
        });
      } else {
        this._[propertyName] = value;
        Object.defineProperty(this, propertyName, {
          get: () => {
            return this._[propertyName];
          },
          set: (newValue) => {
            if(this._[propertyName]!= newValue) {
              // console.log("set: "+newValue);
              this._new[propertyName] = newValue;
              this.save();
            }
          },
        });
      }
    } else {
      this[propertyName] = value;
      // this
    }
  }
  addProperty(name) {
    if(!this[name])
      this.addDocProperty(name,undefined);
  }

  _save() {
    // console.log("save..?",this._new);
    if(_.size(this._new)>0 && this._id) {
      // console.log("save...",this._new);
      // console.log(this);
      this.collection().update({_id:this._id},{
        $set: _.extend(this._new,{
          updated: new Date(),
        }),
      });
      this.setDoc(this._new);
      this._new = {};
    }
  }
  save() {
    // console.log("save?");
    // this._save();
    if(this.saveTimeout) clearTimeout(this.saveTimeout);
    this.saveTimeout = setTimeout(() => {
      // console.log("lets save!");
      this._save();
    },saveTimer);
  }

  _insert(force,cb) {
    if(force instanceof Function) cb = force;
    if(force || !_.contains(this,'_id'))
      return this.collection().insert(_.extend(this,{
        updated: new Date(),
        created: new Date(),
        owner: Meteor.userId(),
      }),cb);
    return this;
  }
  insert(force,cb) {
    return this._insert(force,cb);
  }

  update(attribute,value,cb) { //if you need a callback
    return this._update(attribute,cb);
  }
  _update(attribute,value,cb) {
    let obj = {};
    obj[attribute] = value;
    this.collection().update({_id:this._id},{$set: obj},cb);
    return this;
  }
  remove(cb,confirmMsg) {
    return this._remove(cb,confirmMsg);
  }
  _remove(cb,confirmMsg=false) {
    if(this._id && (!confirmMsg || confirm(confirmMsg)))
      this.collection().remove({_id:this._id},cb);
    return this;
  }

  get(id) {
    return this.collection()._get(id);
  }
  getOwner() {
    return dbProfile.get(this.owner);
  }
  isMeOwner() {
    return this.owner==Meteor.userId();
  }
}
