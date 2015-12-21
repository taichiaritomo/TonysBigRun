// CLIENT-SIDE
if (Meteor.isClient) {
  
  Meteor.subscribe("stats");
  Meteor.subscribe("achievements");
  
//  totalMiles = Stats.findOne({name : "total miles"})._id;
//  console.log(totalMiles);
  
  Template.body.onRendered(function () {
//    var tm = Stats.findOne({name : "total miles"});
    
//    var calculateNullRoad = function() {
//      var h = $(window).height();
//      Session.set("NullRoad Height");
//    }
    Session.set("Window Height", $(window).height());
    
    $(document).scroll(function() {
      var vertical_position = verticalPosition();
      console.log("Vertical Position: " + vertical_position);
//      console.log(tm);
      var tm = Stats.findOne({name : "total miles"}).value;
      Session.set("Sprite Mile Position", (vertical_position / MILE_PX) + (vertical_position / (MILE_PX * tm)));
      console.log("Sprite mile position " + Session.get("Sprite Mile Position"));
    });
    
    $(window).resize(function() {
      Session.set("Window Height", $(window).height()) // unDebounced
    });
  });
  
  Template.body.events({
    'click .miles-button': function (event) {
      var total_miles_id = Stats.findOne({name : "total miles"})._id;
      Stats.update(total_miles_id, {$inc : {value : 1}});
      Meteor.call("update");
    }
    
    // Add achievement
//    'submit .new-achievement' : function (event) {
//      event.preventDefault(); // Prevent default browser form submit
//      var name = event.target.name.value; // Get value from form element
//      Achievements.insert({
//        name : name,
//        createdAt : new Date() // current time
//      });
//      event.target.name.value = ""; // clear form
//    }
    
    // Complete achievement
//    'click .toggle-checked' : function (event) {
//      Achievements.update(this._id, {
//        $set : {checked : !this.checked}
//      });
//    },
    
    // Delete achievement
//    'click .delete' : function (event) {
//      Achievements.remove(this._id);
//    }
    
  });
  
  
  Template.body.helpers({
    
    achievements : function() { 
      return Achievements.find({}, {sort : {index : 1}});
    },
    
    nullroadheight : function() {
      var temp = Stats.findOne({name : "total miles"});
      var tm = 0;
      if (temp) {
        tm = temp.value;
//        tm = 0; // 0-mile testing
      }
      return Math.max(40, Session.get("Window Height") - LAST_MILE_OFFSET - tm * MILE_PX);
    }
    
  });
  
  
  Template.stats.events({   
    
  });
  
  
  Template.stats.helpers({
    totalMiles : function () {
      return Stats.findOne({name : "total miles"}); //reactive
    },
    week : function () {
      return Stats.findOne({name : "week"});
    },
    currentStreak : function() {
      return Stats.findOne({name : "current streak"});
    },
    plural : function(n) {
      return (n == 1 ? "" : "s");
    }
  });
}
