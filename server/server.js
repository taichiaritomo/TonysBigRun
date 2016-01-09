// SERVER-SIDE
Meteor.publish("statsDB", function() {
  return Stats.find(); // make visible all stats
});

Meteor.publish("achievements", function() {
  return Achievements.find({hidden : false}); // return only unhidden achievements with "from" for only unlocked.
});

// Sets achievement to unlocked and assigns an unlock time.
var unlock = function(achievement_condition, name, unlockDist) {
  Achievements.update({$and : [{condition : achievement_condition}, {unlocked : false}]},
               {$set : {from : name, unlocked : true, unlockTime : moment().format("YYYY-MM-DD")}});
  if (!Achievements.findOne({condition : achievement_condition}).unlockDist)
    Achievements.update({condition : achievement_condition}, {$set : {unlockDist : unlockDist}});
};

var update = function() {
  // FITBIT API SYNC
  var last_update = moment(Stats.findOne({name : "last update"}).value);
  // var duration = moment.duration(moment().diff(last_update));
  // console.log("Last update " + duration.asSeconds() + " seconds ago");
  console.log("Updating database ...");

  var updateActivities = function(access_token) {
    // loops as long as the last update was the day before yesterday or earlier.
    // if this condition is met then an update for every day up to yesterday will be attempted.
    var user_id = Authorization.findOne({name : "user id"}).value;
//    var user_id = "3XP9MQ";
    while (moment(last_update).isBefore(moment().subtract(1, 'days'), 'day')) {
      var this_update = moment(last_update).add(1, 'days');
      var result; // initialize HTTP request storage variable

      try {
        result = HTTP.call("GET", "https://api.fitbit.com/1/user/" + user_id + "/activities/date/" + this_update.format("YYYY-MM-DD") +".json", {headers : {"Authorization" : "Bearer " + access_token, "Accept-Language" : "en_US"}, timeout : 1000});
      } 
      catch (error) {
        console.log("Error, failed to retrieve Daily Activity Summary for " + this_update.format("YYYY-MM-DD") + ". Cancelling all further updates until next attempt.");
        console.log(error);
        return; // don't try the rest of the updates, or else we risk skipping an update.
      }

      if (result) { // if request was successful
        var runDistance;
        var day_of_the_week = Stats.findOne({name : "day of the week"}).value,
            week            = Stats.findOne({name : "week"}).value,
            weekly_miles    = Stats.findOne({name : "weekly miles"}).value,
            weekly_quota    = Stats.findOne({name : "weekly quota"}).value,
            current_streak  = Stats.findOne({name : "current streak"}).value;
        day_of_the_week = day_of_the_week + 1;
        if (day_of_the_week == 7) { // Start new week
          // Streak processing for previous week
          if (weekly_miles[week] >= weekly_quota) { // Quota met
            current_streak = current_streak + 1;
            weekly_quota = Math.min(weekly_quota + 1, 10);
          } else { // Quota not met
            current_streak = 0;
            weekly_quota = 6;
          }
          day_of_the_week = 0; // Reset to Monday
          week = week + 1; // start new week
          console.log("WEEK " + week);
          weekly_miles[week] = 0; // initialize mileage entry for new week
        }
        var todaysRun = _.find(result.data.summary.distances, function(d) {return d.activity == "Run"}); // find distance entry for running activities
        if (todaysRun) { // if running activity exists for this day
          runDistance = todaysRun.distance;
          console.log("Running distance for date " + this_update.format("YYYY-MM-DD") + ": " + runDistance + ", This week so far: " + weekly_miles[week]);
          // process todaysRun!
          weekly_miles[week] = weekly_miles[week] + runDistance; // add run distance to this week
          Stats.update({name : "total miles"},  {$inc : {value : runDistance}}); // add run distance to total miles
        } else {
          console.log("No running activity recorded for " + this_update.format("YYYY-MM-DD"));
        }
        // Update collection
        Stats.update({name : "day of the week"}, {$set : {value : day_of_the_week}});
        Stats.update({name : "week"},            {$set : {value : week}});
        Stats.update({name : "weekly miles"}, {$set : {value : weekly_miles}});
        Stats.update({name : "weekly quota"},    {$set : {value : weekly_quota}});
        Stats.update({name : "current streak"},  {$set : {value : current_streak}});
        // Successful update
        last_update = this_update;
        Stats.update({name : "last update"}, {$set : {value : last_update.format("YYYY-MM-DD")}});
        var current_streak = Stats.findOne({name : "current streak"}).value;
        if (current_streak > Stats.findOne({name : "longest streak"}).value)
          Stats.update({name : "longest streak"}, {$set : {value : current_streak}});
      }
    }
    // UPDATE SUMMARY
    console.log("\nUpdate complete.");
    console.log("Details: ");
    console.log("Total miles: "    + Stats.findOne({name : "total miles"}).value);
    console.log("Week: "           + Stats.findOne({name : "week"}).value);
    console.log("Weekly miles: "   + Stats.findOne({name : "weekly miles"}).value);
    console.log("Weekly quota: "   + Stats.findOne({name : "weekly quota"}).value);
    console.log("Current streak: " + Stats.findOne({name : "current streak"}).value);
    console.log("Longest streak: " + Stats.findOne({name : "longest streak"}).value);
  }

  /***************************** API AUTHORIZATION PROCEDURES ************************/
  var access_token;
  var authorization_code = Authorization.findOne({name : "authorization code"}).value;
  var refresh_token = Authorization.findOne({name : "refresh token"}).value;
  // NO REFRESH TOKEN. NEED NEW AUTHORIZATION
  if (refresh_token == "") {
    if (authorization_code == "") { // No authorization code available
      // SEND EMAIL TO TAICHIARITOMO@GMAIL.COM NOTIFYING THAT REAUTHORIZATION IS REQUIRED FOR UPDATES
      console.log("New authorization code required! Use Authorization.html to generate a new code, update the authorization code document in the Authorization Collection, and update server within 10 minutes.");
      return;
    }
    else { // Authorization code available! Send new Access Token Request
      HTTP.call("POST", "https://api.fitbit.com/oauth2/token", { headers : { "Authorization" : "Basic MjI5WEdLOmQyMWNmODNjYzk3NmQ3OTBkZTg3YzBiNzg4NWM4NWZm", "Content-Type" : "application/x-www-form-urlencoded" }, content : "grant_type=authorization_code&client_id=229XGK&code=" + authorization_code },
        function (error, result) {
          if (!error) { // save tokens
            console.log(result);
            access_token = result.data.access_token;
            refresh_token = result.data.refresh_token;
            Authorization.update({name : "refresh token"}, {$set : {value : refresh_token}});
            Authorization.update({name : "authorization code"}, {$set : {value : ""}}); // reset authorization code
            console.log("\nNEW ACCESS TOKEN SUCCESS");
            console.log("Access token: " + access_token);
            console.log("Refresh token: " + refresh_token);
            console.log("Refresh token from database: " + Authorization.findOne({name : "refresh token"}).value);

            updateActivities(access_token); // UPDATE ACTIVITIES
          } else {
            console.log("\nNEW ACCESS TOKEN ERROR. Authorization code reset.");
            Authorization.update({name : "authorization code"}, {$set : {value : ""}});
            console.log(error);
          }
      });
    }
  }
  // REFRESH TOKEN AVAILABLE
  else { // Send Refresh Token Request to obtain a new Access Token and Refresh Token
    HTTP.call("POST", "https://api.fitbit.com/oauth2/token", { headers : { "Authorization" : "Basic MjI5WEdLOmQyMWNmODNjYzk3NmQ3OTBkZTg3YzBiNzg4NWM4NWZm", "Content-Type" : "application/x-www-form-urlencoded" }, content : "grant_type=refresh_token&refresh_token=" + refresh_token },
    function (error, result) {
      if (!error) {
        access_token = result.data.access_token;
        refresh_token = result.data.refresh_token;
        Authorization.update({name : "refresh token"}, {$set : {value : refresh_token}});
        console.log("\nREFRESH TOKEN SUCCESS");

        updateActivities(access_token); // UPDATE ACTIVITIES
      } else {
        console.log("\nREFRESH TOKEN ERROR. Resetting Refresh Token");
        Authorization.update({name : "refresh token"}, {$set : {value : ""}});
        console.log(error);
      }
    });
  }

  /**************************** UNLOCK ACHIEVEMENTS **************************/
  var tm = Stats.findOne({name : "total miles"}).value;
  var ls = Stats.findOne({name : "longest streak"}).value;

  // UNLOCK CONDITION CODES
  if (tm >= 1)    unlock("1 mile",    "Teddy");
  if (tm >= 6)    unlock("6 miles",    "Vaibhav");
  if (tm >= 13.1) unlock("13.1 miles", "Name4");
  if (tm >= 20.1) unlock("20.1 miles",   "Name5");
  if (tm >= 26.2) unlock("26.2 miles", "Name6");
  if (tm >= 40)   unlock("40 miles",   "Name7");
  if (tm >= 50)   unlock("50 miles",   "Name8");
  if (tm >= 70)   unlock("70 miles", "Name8");
  if (ls >= 5)  unlock("5w streak", "Name9", tm);
  if (ls >= 10) unlock("10w streak", "Name10", tm);
}

Meteor.startup(function () {
  console.log("Running server startup...");
  // Initialize Stats
  if (Stats.find().count() === 0) {
    console.log("Initializing Stats database");
    Stats.insert({name : "total miles",     value : 0,            type : "miles"});
    Stats.insert({name : "week",            value : 0,            type : "weeks"});
    Stats.insert({name : "weekly miles",    value : [0, 6, 7, 0, 0, 1, 8],       type : "array of miles"}); // production is [0,0]
    Stats.insert({name : "weekly quota",    value : 6,            type : "miles"});
    Stats.insert({name : "current streak",  value : 0,            type : "weeks"});
    Stats.insert({name : "longest streak",  value : 0,            type : "weeks"});
    Stats.insert({name : "day of the week", value : 0,            type : "integer"}); // 0 = Monday ... 6 = Sunday
    Stats.insert({name : "last update",     value : "2015-12-28", type : "date"});
  }
  // Initialize Achievements
  if (Achievements.find().count() === 0) {
    console.log("Initializing Achievements database");
    // For streak achievements, leave unlockDist : null and set when unlocked.
    Achievements.insert({index : 0, from : null, description : "1st mile!",                    iconImg : "first.png",     condition : "1 mile",     condition_short: "1mi",  unlocked : false, unlockTime : null, unlockDist : 1,    hidden : false});
    Achievements.insert({index : 1, from : null, description : "You've got mail!",             iconImg : "mail.png",      condition : "6 miles",    condition_short: "6mi",  unlocked : false, unlockTime : null, unlockDist : 6,    hidden : false});
    Achievements.insert({index : 2, from : null, description : "Half marathon.",               iconImg : "brolicarm.png", condition : "13.1 miles", condition_short: "13mi", unlocked : false, unlockTime : null, unlockDist : 13.1, hidden : false});
    Achievements.insert({index : 3, from : null, description : "The LoL Queen don't ff @ 20.", iconImg : "lolqueen.png",  condition : "20.1 miles", condition_short: "20mi", unlocked : false, unlockTime : null, unlockDist : 20.1, hidden : false});
    Achievements.insert({index : 4, from : null, description : "Nice calves.",                 iconImg : "brolicleg.png", condition : "26.2 miles", condition_short: "26mi", unlocked : false, unlockTime : null, unlockDist : 26.2, hidden : false});
    Achievements.insert({index : 5, from : null, description : "You're a brick now.",          iconImg : "brick.png",     condition : "40 miles",   condition_short: "40mi", unlocked : false, unlockTime : null, unlockDist : 40,   hidden : false});
    Achievements.insert({index : 6, from : null, description : "Absolute.",                    iconImg : "sixpack.png",   condition : "50 miles",   condition_short: "50mi", unlocked : false, unlockTime : null, unlockDist : 50,   hidden : false});
    Achievements.insert({index : 7, from : null, description : "Good bread.",                  iconImg : "bread.png",     condition : "70 miles",   condition_short: "70mi", unlocked : false, unlockTime : null, unlockDist : 70,   hidden : false});
    Achievements.insert({index : 8, from : null, description : "Heart goes doki doki.",        iconImg : "heart.png",     condition : "5w streak",  condition_short: "5ws",  unlocked : false, unlockTime : null, unlockDist : null, hidden : false});
    Achievements.insert({index : 9, from : null, description : "NICE CALVES.",                 iconImg : "broliccalf.png",condition : "10w streak", condition_short: "10ws", unlocked : false, unlockTime : null, unlockDist : null, hidden : false});
  }
  // Initialize Authorization
  if (Authorization.find().count() === 0) {
    console.log("Initializing Authorization Data");
    Authorization.insert({name : "authorization code", value : ""});
    Authorization.insert({name : "refresh token", value : ""});
    Authorization.insert({name : "user id", value : "3XP9MQ"});
  }
  // Update is only called during Startup because Heroku process restarts it periodically.
  var last_update = moment(Stats.findOne({name : "last update"}).value);
  var duration = moment.duration(moment().diff(last_update));
  console.log("Last update: " + last_update + ". " + duration.asDays() + " days ago.");
  if (duration.asDays() > 2) {
    update();
  }
//  Meteor.setInterval(function() {
//    var last_update = moment(Stats.findOne({name : "last update"}).value);
//    var duration = moment.duration(moment().diff(last_update));
//    console.log("Last update: " + last_update + ". " + duration.asDays() + " days ago.");
//    if (duration.asDays() > 2) {
//      update();
//    }
//  }, 60000);
});