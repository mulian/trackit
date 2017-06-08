import DBTracks from './collections/db-tracks.js'

import Track from './obj/track.js'

const plainDBTracks = new DBTracks(Track);

export const dbTracks = new  Ground.Collection(plainDBTracks);

TRACKS = plainDBTracks;

if(Meteor.isServer) {
  Meteor.publish('db_tracks', function(userId){
    // console.log(this);
    // console.log(userId,Meteor.userId(),lo);
    return plainDBTracks.find({owner:this.userId});
  });
}
