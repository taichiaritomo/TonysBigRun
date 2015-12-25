// CLIENT-SIDE
if (Meteor.isClient) {
  
  Meteor.subscribe("stats", function() {
//    var tm = Stats.findOne({name : "total miles"});
    var tm = 10; // testing Total Miles amount
    Session.set("Total Miles", tm); // testing Total Miles quantity
    var h = $(window).height();
    Session.set("Null Road Height", Math.max(TOP_OFFSET, h - BOTTOM_OFFSET - tm * MILE_PX));
  });
  Meteor.subscribe("achievements");
  
//  totalMiles = Stats.findOne({name : "total miles"})._id;
//  console.log(totalMiles);
  
  Template.body.onRendered(function () {
    Session.set("Window Height", $(window).height());
    Session.set("Sprite Frame", 4);
    Session.set("Vertical Position", verticalPosition());
    
    var resetTimer = null, 
        animationTimer = null;
    
    // Reverts Sprite to default frame and cancels animations.
    var clearSpriteFrame = function() {
      clearTimeout(animationTimer);
      animationTimer = null;
      clearTimeout(animationTimer);
      Session.set("Sprite Frame", 4); // Set to default standing
    };
    
    $(document).scroll(function() {
      var y = verticalPosition();
      Session.set("Vertical Position", y);
      var tm = Session.get("Total Miles"),
          nrh = Session.get("Null Road Height"),
          h = Session.get("Window Height"),
          smp = (y / MILE_PX) + (tm > 0 ? (y / (MILE_PX * tm)) : 0); // Sprite mile position
      var c = (tm == 0 ? 0 : (smp / tm)); // fraction of road range
      var rr = Math.min(tm*MILE_PX, h - TOP_OFFSET - BOTTOM_OFFSET); // road range
      if (smp >= tm)
        Session.set("Sprite Position", "bottom: " + (BOTTOM_OFFSET + (smp - tm)*MILE_PX) + "px;");
      else
        Session.set("Sprite Position", "bottom: " + (BOTTOM_OFFSET + (1 - c) * rr) + "px;");
      
      // Animate Sprite at 300ms frame rate
      if (smp < tm) {
        var ss = Math.abs(checkScrollSpeed());
        if (ss > 0) { // ignore scroll speed 0
          clearTimeout(resetTimer);
          resetTimer = setTimeout(clearSpriteFrame, 250);
          if (animationTimer == null) {
            var f = Session.get("Sprite Frame");
            Session.set("Sprite Frame", (f+1)%4);
            animationTimer = setTimeout(function() { animationTimer = null; }, 250);
          }
        }
      } else {
        clearSpriteFrame(); // Immediately cancel animation once sprite reaches current point
      }
    });
    
    $(window).resize(function() {
      var h = $(window).height();
      Session.set("Window Height", h) // unDebounced
      var tm = Session.get("Total Miles");
      Session.set("Null Road Height", Math.max(TOP_OFFSET, h - BOTTOM_OFFSET - tm * MILE_PX));
    });
  });
  
  Template.body.events({
    'click .miles-button': function (event) {
      var total_miles_id = Stats.findOne({name : "total miles"})._id;
      Stats.update(total_miles_id, {$inc : {value : 1}});
      Meteor.call("update");
    }   
  });
  
  
  Template.body.helpers({
    
    achievements : function() { 
      return Achievements.find({}, {sort : {index : 1}});
    },
    
    achClass : function(index){
      if (index % 2 == 0)
        return "achievement-right";
      else
        return "achievement-left";
    },
    
    achPosition : function(unlockDist) {
      return "top: " + (unlockDist ? unlockDist * MILE_PX : "-5000") + "px;"; // hide in negative margin if not displayable on road
    },
    
    nullRoadHeight : function() {
      return Session.get("Null Road Height");
    },
    
    // Prevents Sprite from passing it's current mileage.
    spritePosition : function() {
      return Session.get("Sprite Position");
    },
    
    // Animation Frame
    spriteFrame : function() {
      return "background-image: url('" + FRAMES[Session.get("Sprite Frame")] + "');";
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
