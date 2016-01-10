// CLIENT-SIDE
if (Meteor.isClient) {
  
  Meteor.subscribe("statsDB", function() { // run once stats db is ready
    Session.set("loaded", true);
    var TM = Stats.findOne({name : "total miles"}).value;
//    var TM = 1; // testing Total Miles amount
    Session.set("Total Miles", TM); // testing Total Miles quantity
    var WH = $(window).height();
    Session.set("Null Road Height", Math.max(TOP_OFFSET, WH - BOTTOM_OFFSET - (TM * MILE_PX)/2));
    var NRH = Math.max(TOP_OFFSET, WH - BOTTOM_OFFSET - (TM * MILE_PX)/2), // null road height
        STM = NRH + TM*MILE_PX + BOTTOM_OFFSET - WH;
    console.log("STM=" + STM);
    window.scrollTo(0, STM + 0.001); // scroll to current position +0.001 to avoid scrollsaving
//    window.scrollTo(0, 0);
    // week scale
    weeklyMiles = Stats.findOne({name : "weekly miles"}).value;
    var l = weeklyMiles.length;
    $('#weekmarkers-content').append("<div class='weekmarker' style='margin-top: " + (-12) + "px'>W1</div>");
    var uncountedDistance = 0; // skipped weekly mileages because they were too small to display
    for (var i = 2; i < l; i++) {
      if (weeklyMiles[i - 1] < 1) {
        uncountedDistance += weeklyMiles[i - 1];
      } else {
        $('#weekmarkers-content').append("<div class='weekmarker' style='margin-top: " + ((weeklyMiles[i - 1] + uncountedDistance)*MILE_PX - 12) + "px'>W" + i + "</div>");
        uncountedDistance = 0;
      }
    }
  });
  Meteor.subscribe("achievements");
  
  Template.body.onCreated(function() {
    Session.set("Sprite Frame", 4);
    
    var resetTimer = null, 
        animationTimer = null;
    
    // Reverts Sprite to default frame and cancels animations.
    var clearSpriteFrame = function() {
      clearTimeout(animationTimer);
      animationTimer = null;
      clearTimeout(animationTimer);
      Session.set("Sprite Frame", 4); // Set to default standing
    };
    
    $(window).scroll(function() {
      var VP = verticalPosition(),
          TM = Session.get("Total Miles"),
          WH = $(window).height(),
          NRH = Math.max(TOP_OFFSET, WH - BOTTOM_OFFSET - (TM * MILE_PX)/2), // null road height
          STM = NRH + TM*MILE_PX + BOTTOM_OFFSET - WH;
//      console.log("Vertical position: " + VP);
//      console.log("Scrolling total miles: " + STM);
      if (VP >= STM || STM == 0) {
//        console.log(WH - BOTTOM_OFFSET - (VP - STM));
        Session.set("Sprite Position", WH - BOTTOM_OFFSET - (VP - STM));
      } else {
//        console.log(NRH + (VP / STM)*(WH - NRH - BOTTOM_OFFSET));
        Session.set("Sprite Position", NRH + (VP / STM)*(WH - NRH - BOTTOM_OFFSET));
      }
      
      if (VP < STM && STM != 0) {
        clearTimeout(resetTimer);
        resetTimer = setTimeout(clearSpriteFrame, 250);
        if (animationTimer == null) {
          var f = Session.get("Sprite Frame");
          Session.set("Sprite Frame", (f+1)%4);
          animationTimer = setTimeout(function() { animationTimer = null; }, 250);
        }
      } else {
        clearSpriteFrame(); // Immediately cancel animation once sprite reaches current point
      }
      
      // slide week scale correspondingly
      $("#weekmarkers-content").css("margin-top", (-1 * VP + NRH) + "px");
      
      // slide sky bg by percentage of document traversed
      $("#background-gradient").css("top", ((-VP / ($(document).height() - WH))*40) + "vh");
    });
    
    $(window).resize(function() {
      var WH = $(window).height();
      var TM = Session.get("Total Miles");
      Session.set("Null Road Height", Math.max(TOP_OFFSET, WH - BOTTOM_OFFSET - (TM * MILE_PX)/2));
    });
    
    // TIME-BASED GRADIENTS
    var BGs = ["night", "dawn", "day", "dusk"];
    var changeSky = function(i) {
      Session.set("sky", BGs[i]);
    }
    var NYC = SunCalc.getTimes(new Date(), 40.7127, -74.0059);
    var sunriseStart = moment(NYC.sunrise).subtract(30, "minutes");
    var sunriseEnd   = moment(NYC.sunrise).add(30, "minutes");
    var sunsetStart  = moment(NYC.sunset).subtract(30, "minutes");
    var sunsetEnd    = moment(NYC.sunset).add(30, "minutes");
    var bgIndex = 0;
    var now = moment();
    if (now.isBefore(sunsetEnd)) {
      bgIndex = 3;
      setTimeout(function() {
        bgIndex = 0;
        changeSky(bgIndex);
      }, moment.duration(sunsetEnd.diff(now)).asMilliseconds());
    }
    if (now.isBefore(sunsetStart)) {
      bgIndex = 2;
      setTimeout(function() {
        bgIndex = 3;
        changeSky(bgIndex);
      }, moment.duration(sunsetStart.diff(now)).asMilliseconds());
    }
    if (now.isBefore(sunriseEnd)) {
      bgIndex = 1;
      setTimeout(function() {
        bgIndex = 2;
        changeSky(bgIndex);
      }, moment.duration(sunriseEnd.diff(now)).asMilliseconds());
    }
    if (now.isBefore(sunriseStart)) {
      bgIndex = 0;
      setTimeout(function() {
        bgIndex = 1;
        changeSky(bgIndex);
      }, moment.duration(sunriseStart.diff(now)).asMilliseconds());
    }
    changeSky(bgIndex);
  });
  
  Template.body.helpers({
    sky : function() {
      console.log(Session.get("sky"));
      return Session.get("sky");
    },
    
    loaded : function() {
      return Session.get("loaded");
//      return false;
    },
    
    roadAchievements : function() { 
      return Achievements.find({unlockDist : {$ne : null}}, {sort : {unlockDist : 1}});
    },
    
    achClass : function(index) {
      if (index % 2 == 0)
        return "achievement-right";
      else
        return "achievement-left";
    },
    
    achPosition : function(unlockDist) {
      return "top: " + (unlockDist ? unlockDist * MILE_PX - 25 : -5000) + "px;"; // hide in negative margin if not displayable on road
    },
    
    nullRoadHeight : function() {
      return Session.get("Null Road Height");
    },
    
    // Prevents Sprite from passing it's current mileage.
    spritePosition : function() {
      return "top: " + Session.get("Sprite Position") + "px;";
    },
    
    // Animation Frame
    spriteFrame : function() {
      return "background-image: url('" + FRAMES[Session.get("Sprite Frame")] + "');";
    },
    
    achievements : function() {
      return Achievements.find({}, {sort : {index : 1}});
    }
  });
  
  Template.weekmarker.helpers({
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
