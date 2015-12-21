// SERVER-SIDE
Meteor.publish("stats", function() {
  return Stats.find(); // make visible all stats
});

Meteor.publish("achievements", function() {
  return Achievements.find({hidden : false}); // return only unhidden achievements with "from" for only unlocked.
});


// Sets achievement to unlocked and assigns an unlock time.
var unlock = function(achievement_description, name) {
  Achievements.update({$and : [{description : achievement_description}, {unlocked : false}]},
               {$set : {from : name, unlocked : true, unlockTime : moment()}});
};

Meteor.methods({
  // Function called to update database.
  update : function() {
    // FITBIT API SYNC
    var last_update = Stats.findOne({name : "last update"}).value;
    var duration = moment.duration(moment().diff(last_update));
//      var hours = duration.asHours();
    console.log("Last update " + duration.asSeconds() + " seconds ago");
    console.log("Updating database ... ");
//      if (hours >= 6) {
//      }

//      HTTP.call("GET", "https://api.fitbit.com/1/user/3WSGTY/activities/list/afterDate/[base-date]/sort/asc/limit/100.json",
//          {headers: {some: "json", stuff: 1}},
//          function (error, result) {
//            if (!error) {
//              console.log(result);
//            } else {
//              console.log(error);
//            }
//          });

    /*
    // GET all activities since last_update
    // Initiate temporary variables
    var total_miles = Stats.findOne({name : "total miles"}).value,
        week = Stats.findOne({name : "week"}).value,
        week_start = MOMENT function to find Monday midnight before last_update,
        weekly_miles = Stats.findOne({name : "weekly miles"}).value[week],
        weekly_quota = Stats.findOne({name : "weekly quota"}).value,
        current_streak = Stats.findOne({name : "current streak"}).value,
        longest_streak = Stats.findOne({name : "longest streak"}).value,
        activity_time = null;
    for (var activity in activities) {
      if (activity.type != "Running") continue; // skip non-running activity

      var distance = activity.distance; // make sure to convert to miles
      activity_time = activity.time;
      var time_since_week_start = (activity_time - week_start).roundDownDays()

      // If this activity is more than a week after the last one...
      if (time_since_week_start > 7 days) {

        // First, store miles from the previous week
        Stats.update({name : "weekly miles"}, {[week] = weekly_miles});

        // If the previous week was mile-full
        if (weekly_miles >= weekly_quota) {
          current_streak = current_streak + 1;
          longest_streak = Math.max(current_streak, longest_streak);
          // Update weekly quota.
          weekly_quota = weekly_quota + (weekly_quota < 10 ? 1 : 0);
        }
        else { // reset streak
          current_streak = 0; 
        }

        // Start new week
        week = week + time_since_week_start.inWeeks() // (rounded down)
        week_start = activity.time.beginning_of_week;
        weekly_miles = distance; 
      }
      // If this activity is within a week of the last one...
      else {
        weekly_miles = weekly_miles + distance; // add new miles
      }
    }
    // Update changes to database.
    var now = moment();
    var this_week = week + now - 
    Stats.update({name : "week"}, {$inc {week : 
    */
    // Count miles in week intervals. To simplify for everyone, weeks reset on Monday.
    // Update longest streak as we go. Evaluate streaks by quota.
    var total_miles = Stats.findOne({name : "total miles"}).value;
    console.log("Total miles: " + total_miles);
    // UNLOCK CONDITION CODES (only update if it still has not been unlocked)
    if (total_miles >= 1)    unlock("1st mile!",            "Name1");
    if (total_miles >= 6)    unlock("Ran 6 miles.",         "Name2");
    if (total_miles >= 13)   unlock("Ran 13 miles.",        "Name3");
    if (total_miles >= 13.1) unlock("Half marathon!",       "Name4");
    if (total_miles >= 21)   unlock("Ran 21 miles.",        "Name5");
    if (total_miles >= 26.2) unlock("Basically a marathon.", "Name6");
    if (total_miles >= 40)   unlock("Ran 40 miles.",        "Name7");
    // Update last update time
    Stats.update({name : "last update"}, {$set : {value : moment()}});
    // When AJAX is added, use this instead, so that all activities after the last activity are loaded?
    // Stats.update({name : "last update"}, {$set : {value : activity_time() + 1 second}});
  }
});

Meteor.startup(function () {
  // Initialize Stats
  if (Stats.find().count() === 0) {
    console.log("Initializing Stats database");
    Stats.insert({name : "total miles",    value : 0,    type : "miles"});
    Stats.insert({name : "week",           value : 1,    type : "weeks"});
    Stats.insert({name : "weekly miles",   value : [0],  type : "array of miles"});
    Stats.insert({name : "weekly quota",   value : 6,    type : "miles"});
    Stats.insert({name : "current streak", value : 0,    type : "weeks"});
    Stats.insert({name : "longest streak", value : 0,    type : "weeks"});
    Stats.insert({name : "last update",    value : null, type : "date"});
  }
  // Initialize Achievements
  if (Achievements.find().count() === 0) {
    console.log("Initializing Achievements database");
    // For streak achievements, leave unlockDist : null and set when unlocked.
    Achievements.insert({index : 0, from : null, description : "1st mile!",             condition : "1mi",    unlocked : false, unlockTime : null, unlockDist : 1,    hidden : false});
    Achievements.insert({index : 1, from : null, description : "Ran 6 miles.",          condition : "6mi",    unlocked : false, unlockTime : null, unlockDist : 6,    hidden : false});
    Achievements.insert({index : 2, from : null, description : "Ran 13 miles.",         condition : "13mi",   unlocked : false, unlockTime : null, unlockDist : 13,   hidden : false});
    Achievements.insert({index : 3, from : null, description : "Half marathon!",        condition : "13.1mi", unlocked : false, unlockTime : null, unlockDist : 13.1, hidden : false});
    Achievements.insert({index : 4, from : null, description : "Ran 21 miles.",         condition : "21mi",   unlocked : false, unlockTime : null, unlockDist : 21,   hidden : false});
    Achievements.insert({index : 5, from : null, description : "Basically a marathon.", condition : "26.2mi", unlocked : false, unlockTime : null, unlockDist : 26.2, hidden : false});
    Achievements.insert({index : 6, from : null, description : "Ran 40 miles.",         condition : "40mi",   unlocked : false, unlockTime : null, unlockDist : 40,   hidden : false});
  }
  // Update
  Meteor.call("update");
});