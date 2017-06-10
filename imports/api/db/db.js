import DBTracks from './collections/db-tracks.js'

import Track from './obj/track.js'

const plainDBTracks = new DBTracks(Track);

Ground.Collection(Meteor.users);
Ground.Collection(SecureLayer.DBUserKey);
Ground.Collection(SecureLayer.DBGroupsUsers);
export const dbTracks = new  Ground.Collection(plainDBTracks);



TRACKS = plainDBTracks;

if(Meteor.isServer) {
  Meteor.publish('db_tracks', function(userId){
    // console.log(this);
    // console.log(userId,Meteor.userId(),lo);
    return plainDBTracks.find({owner:this.userId});
  });

  // Meteor.methods({
  //   download(q,query) {
  //     console.log(q);
  //     if(query) q.title.$regex = new RegExp('.*'+query+'.*','i');
  //     var collection = plainDBTracks.find(q,{
  //       sort: {created:-1},
  //     }).fetch();
  //     var heading = true; // Optional, defaults to true
  //     var delimiter = ";" // Optional, defaults to ",";
  //     return exportcsv.exportToCSV(collection, heading, delimiter);
  //   }
  // })
}
