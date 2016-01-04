// CLIENT-SIDE
if (Meteor.isClient) {
  
  Meteor.subscribe("stats", function() {
//    var tm = Stats.findOne({name : "total miles"});
    var TM = 21; // testing Total Miles amount
    Session.set("Total Miles", TM); // testing Total Miles quantity
    var WH = $(window).height();
    Session.set("Null Road Height", Math.max(TOP_OFFSET, WH - BOTTOM_OFFSET - TM * MILE_PX));
//    $('#nullroad').css('height', Math.max(TOP_OFFSET, WH - BOTTOM_OFFSET - TM * MILE_PX));
    var NRH = Math.max(TOP_OFFSET, WH - BOTTOM_OFFSET - TM * MILE_PX), // null road height
        STM = NRH + TM*MILE_PX + BOTTOM_OFFSET - WH;
    window.scroll(0, STM); // scroll to current position
  });
  Meteor.subscribe("achievements");
  
//  totalMiles = Stats.findOne({name : "total miles"})._id;
//  console.log(totalMiles);
  
  Template.body.onRendered(function () {
    Session.set("Sprite Frame", 4);
    
    var resetTimer = null, 
        animationTimer = null;
//        spriteFrame = 4;
    
//    $("#sprite").css("background-image", "url('" + FRAMES[spriteFrame] + "')");
    
    // Reverts Sprite to default frame and cancels animations.
    var clearSpriteFrame = function() {
      clearTimeout(animationTimer);
      animationTimer = null;
      clearTimeout(animationTimer);
      Session.set("Sprite Frame", 4); // Set to default standing
//      $("#sprite").css("background-image", "url('" + FRAMES[4] + "')");
    };
    
    $(document).scroll(function() {
      var VP = verticalPosition(),
          TM = Session.get("Total Miles"),
          WH = $(window).height(),
          NRH = Math.max(TOP_OFFSET, WH - BOTTOM_OFFSET - TM * MILE_PX), // null road height
          STM = NRH + TM*MILE_PX + BOTTOM_OFFSET - WH;
//      console.log("Vertical position: " + VP);
//      console.log("Scrolling total miles: " + STM);
      if (VP >= STM) {
//        console.log(WH - BOTTOM_OFFSET - (VP - STM));
        Session.set("Sprite Position", WH - BOTTOM_OFFSET - (VP - STM));
//        $('#sprite').css('top', WH - BOTTOM_OFFSET - (VP - STM));
      } else {
//        console.log(NRH + (VP / STM)*(WH - NRH - BOTTOM_OFFSET));
        Session.set("Sprite Position", NRH + (VP / STM)*(WH - NRH - BOTTOM_OFFSET));
//        $('#sprite').css('top', NRH + (VP / STM)*(WH - NRH - BOTTOM_OFFSET) + 'px');
      }
      
      if (VP < STM) {
        clearTimeout(resetTimer);
        resetTimer = setTimeout(clearSpriteFrame, 250);
        if (animationTimer == null) {
          var f = Session.get("Sprite Frame");
          Session.set("Sprite Frame", (f+1)%4);
//          spriteFrame = (spriteFrame + 1) % 4;
//          $("#sprite").css("background-image", "url('" + FRAMES[spriteFrame] + "')");
          animationTimer = setTimeout(function() { animationTimer = null; }, 250);
        }
      } else {
        clearSpriteFrame(); // Immediately cancel animation once sprite reaches current point
      }
    });
    
    $(window).resize(function() {
      var WH = $(window).height();
      var TM = Session.get("Total Miles");
      Session.set("Null Road Height", Math.max(TOP_OFFSET, WH - BOTTOM_OFFSET - TM * MILE_PX));
//      $('#nullroad').css('height', Math.max(TOP_OFFSET, WH - BOTTOM_OFFSET - TM * MILE_PX));
    });
  });
  
  Template.body.helpers({
    
    achievements : function() { 
      return Achievements.find({}, {sort : {index : 1}});
    }
    
//    achClass : function(index){
//      if (index % 2 == 0)
//        return "achievement-right";
//      else
//        return "achievement-left";
//    },
//    
//    achPosition : function(unlockDist) {
//      return "top: " + (unlockDist ? unlockDist * MILE_PX : "-5000") + "px;"; // hide in negative margin if not displayable on road
//    }
    
//    nullRoadHeight : function() {
//      return Session.get("Null Road Height");
//    },
//    
//    // Prevents Sprite from passing it's current mileage.
//    spritePosition : function() {
//      return "top: " + Session.get("Sprite Position") + "px;";
//    },
//    
//    // Animation Frame
//    spriteFrame : function() {
//      return "background-image: url('" + FRAMES[Session.get("Sprite Frame")] + "');";
//    }
    
  });
  
  Template.graphics.helpers({
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
      return "top: " + (unlockDist ? unlockDist * MILE_PX - 25 : "-5000") + "px;"; // hide in negative margin if not displayable on road
    },
    
    nullRoadHeight : function() {
      return Session.get("Null Road Height");
//      return "";
    },
    
    // Prevents Sprite from passing it's current mileage.
    spritePosition : function() {
      return "top: " + Session.get("Sprite Position") + "px;";
//      return "";
    },
    
    // Animation Frame
    spriteFrame : function() {
      return "background-image: url('" + FRAMES[Session.get("Sprite Frame")] + "');";
//      return "";
    }
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
