import DBTracks from './collections/db-tracks.js'
import DBLabel from './collections/db-labels.js'

import Track from './obj/track.js'
import Label from './obj/label.js'

const plainDBTracks = new DBTracks(Track);
const plainDBLabel = new DBLabel(Label);
// const localDBTracks = new Ground.Collection('localTracks', { connection: null });


Ground.Collection(Meteor.users);
Ground.Collection(SecureLayer.DBUserKey);
Ground.Collection(SecureLayer.DBGroupsUsers);
export const dbTracks = new  Ground.Collection(plainDBTracks);
export const dbLabel = new  Ground.Collection(plainDBLabel);
// export const dbLocalTracks = localDBTracks;


TRACKS = plainDBTracks;
LABELS = plainDBLabel;
// LOCALTRACKS = localDBTracks;

if(Meteor.isServer) {
  Meteor.publish('db_tracks', function(userId){
    return plainDBTracks.find({owner:this.userId});
  });
  Meteor.publish('db_label', function(userId){
    return dbLocalTracks.find({owner:this.userId});
  });
}
