/************ CONSTANTS AND OTHER RESOURCES FOR USE BY APP ***************/

MILE_PX = 25; // distance in pixels of one mile.
TOP_OFFSET = 150; // distance in pixels of first mile from top of screen
BOTTOM_OFFSET = 100; // distance in pixels of last mile from bottom

DELAY = 50; // deprecated ?

// Animation Frames
FRAMES = ["tony1.png", "tony2.png", "tony3.png", "tony4.png", "tony0.png"];

// Get vertical position of body in scroll.
verticalPosition = function() {
  var vertical_position = 0;
  if (pageYOffset) //usual
    vertical_position = pageYOffset;
  else if (document.documentElement.clientHeight) //ie
    vertical_position = document.documentElement.scrollTop;
  else if (document.body) //ie quirks
    vertical_position = document.body.scrollTop;
  return vertical_position;
};


/**************************** DEMO APP DATA ******************************/

var TM = 46, // Total Miles
    W = 8,
    WM = [0, 5, 3, 6, 8, 7, 8, 7, 2],
    CS = 5;

var ACHIEVEMENTS = [
  {index : 0,  from : "Guy", description : "Ran 30 seconds!",              iconImg : "turd.png",       condition : "30 seconds", condition_short: "30s",  unlocked : true, unlockTime : null, unlockDist : 0.01, hidden : false},
  {index : 1,  from : "Buddy", description : "1st mile!",                    iconImg : "first.png",      condition : "1 mile",     condition_short: "1mi",  unlocked : true, unlockTime : null, unlockDist : 1,    hidden : false},
  {index : 2,  from : "Friend", description : "You've got mail!",             iconImg : "mail.png",       condition : "6 miles",    condition_short: "6mi",  unlocked : true, unlockTime : null, unlockDist : 6,    hidden : false},
  {index : 3,  from : "Dude", description : "Half marathon.",               iconImg : "brolicarm.png",  condition : "13.1 miles", condition_short: "13mi", unlocked : true, unlockTime : null, unlockDist : 13.1, hidden : false},
  {index : 4,  from : "Bae", description : "LoLQueen don't ff@20.", iconImg : "lolqueen.png",   condition : "20.1 miles", condition_short: "20mi", unlocked : true, unlockTime : null, unlockDist : 20.1, hidden : false},
  {index : 5,  from : "Bro", description : "Nice calves.",                 iconImg : "brolicleg.png",  condition : "26.2 miles", condition_short: "26mi", unlocked : true, unlockTime : null, unlockDist : 26.2, hidden : false},
  {index : 6,  from : "Fam", description : "You're a brick now.",          iconImg : "brick.png",      condition : "40 miles",   condition_short: "40mi", unlocked : true, unlockTime : null, unlockDist : 40,   hidden : false},
  {index : 7,  from : null, description : "Absolute.",                    iconImg : "sixpack.png",    condition : "50 miles",   condition_short: "50mi", unlocked : false, unlockTime : null, unlockDist : 50,   hidden : false},
  {index : 8,  from : null, description : "Good bread.",                  iconImg : "bread.png",      condition : "75 miles",   condition_short: "75mi", unlocked : false, unlockTime : null, unlockDist : 75,   hidden : false},
  {index : 9,  from : null, description : "Never not time to fast.",      iconImg : "sonic.png",      condition : "100 miles",  condition_short: "100mi",unlocked : false, unlockTime : null, unlockDist : 100,  hidden : false},
  {index : 10, from : null, description : "Big in Japan.",                iconImg : "fan.png",        condition : "125 miles",  condition_short: "125mi",unlocked : false, unlockTime : null, unlockDist : 125,  hidden : false},
  {index : 11, from : null, description : "What're those!",               iconImg : "shoe.png",       condition : "150 miles",  condition_short: "150mi",unlocked : false, unlockTime : null, unlockDist : 150,  hidden : false},
  {index : 12, from : "Secret Admirer", description : "Heart goes doki doki.",        iconImg : "heart.png",      condition : "5w streak",  condition_short: "5ws",  unlocked : true, unlockTime : null, unlockDist : 44, hidden : false},
  {index : 13, from : null, description : "NICE CALVES.",                 iconImg : "broliccalf.png", condition : "10w streak", condition_short: "10ws", unlocked : false, unlockTime : null, unlockDist : null, hidden : false}
];


/********************** TIME-BASED GRADIENT BACKGROUND *******************/
var BGs = ["dusk2", "dawn", "day", "dusk"];
var changeSky = function(i) {
  $("#background-gradient").removeClass();
  $("#background-gradient").addClass(BGs[i]);
}
changeSky(0);
//var NYC = SunCalc.getTimes(new Date(), 40.7127, -74.0059);
//var sunriseStart = moment(NYC.sunrise).subtract(30, "minutes");
//var sunriseEnd   = moment(NYC.sunrise).add(30, "minutes");
//var sunsetStart  = moment(NYC.sunset).subtract(30, "minutes");
//var sunsetEnd    = moment(NYC.sunset).add(30, "minutes");
//var bgIndex = 0;
//var now = moment();
//if (now.isBefore(sunsetEnd)) {
//  bgIndex = 3;
//  setTimeout(function() {
//    bgIndex = 0;
//    changeSky(bgIndex);
//  }, moment.duration(sunsetEnd.diff(now)).asMilliseconds());
//}
//if (now.isBefore(sunsetStart)) {
//  bgIndex = 2;
//  setTimeout(function() {
//    bgIndex = 3;
//    changeSky(bgIndex);
//  }, moment.duration(sunsetStart.diff(now)).asMilliseconds());
//}
//if (now.isBefore(sunriseEnd)) {
//  bgIndex = 1;
//  setTimeout(function() {
//    bgIndex = 2;
//    changeSky(bgIndex);
//  }, moment.duration(sunriseEnd.diff(now)).asMilliseconds());
//}
//if (now.isBefore(sunriseStart)) {
//  bgIndex = 0;
//  setTimeout(function() {
//    bgIndex = 1;
//    changeSky(bgIndex);
//  }, moment.duration(sunriseStart.diff(now)).asMilliseconds());
//}
//changeSky(bgIndex);


/****************************** LOADING SCREEN ***************************/

//var numDots = 0;
//var incrementDots = function() {
//  numDots = (numDots % 4) + 1;
//  $('#loading-dots').html(Array(numDots).join("."));
//};
//setInterval(incrementDots, 500);
//
//var messages = [
//  "Lacing trainers...",
//  "Resisting going back to sleep...",
//  "Calibrating Fitbit...",
//  "Thinking of Shia LeBouf...",
//  "TONY used BLESS UP!",
//  "It's super effective!",
//  "Obtaining the key to more success...",
//  "Pliometrics...",
//  "Thinking of more loading messages...",
//  "I never thought it'd get this far...",
//  "Uh...",
//  "<span style='font-family: sans-serif'>( ͡° ͜ʖ ͡°)</span>"
//];
//var messageIndex = 0;
//var incrementMessage = function() {
//  if (messageIndex <= messages.length - 1) {
//    $('#loading-message').html(messages[messageIndex]);
//    messageIndex = messageIndex + 1;
//  }
//};
//setInterval(incrementMessage, 2000);


/********************************* PAGE SETUP ********************************/

var WH = $(window).height(),
    WW = $(window).width(),
    NRH = Math.max(TOP_OFFSET, WH - BOTTOM_OFFSET - (TM * MILE_PX)/2), // null road height
    STM = NRH + TM*MILE_PX + BOTTOM_OFFSET - WH;
$("#nullroad").css("height", NRH);

// Stats layout
$("#stats").html(TM + " miles" + "<br>" + CS + "w streak");

// Week scale layout
var l = WM.length;
$("#weekmarkers-content").css("margin-top", (NRH + "px"));
$('#weekmarkers-content').append("<div class='weekmarker' style='margin-top: " + (-12) + "px'>W1</div>");
var uncountedDistance = 0; // skipped weekly mileages because they were too small to display
for (var i = 2; i < l; i++) {
  if (WM[i - 1] < 1) {
    uncountedDistance += WM[i - 1];
  } else {
    $('#weekmarkers-content').append("<div class='weekmarker' style='margin-top: " + ((WM[i - 1] + uncountedDistance)*MILE_PX - 12) + "px'>W" + i + "</div>");
    uncountedDistance = 0;
  }
}

// Road Achievements layout
var RA = _.filter(ACHIEVEMENTS, function(item) { return item.unlockDist; });
var RA = _.sortBy(RA, "unlockDist");
var l = RA.length;
for (var i = 0; i < l; i++) {
  var a = RA[i];
  $("#road").append(
    "<div class='" + (i % 2 == 0 ? "achievement-right" : "achievement-left") +
    "' style='" + "top: " + (a.unlockDist ? a.unlockDist * MILE_PX - 25 : -5000) + "px; " +
    "opacity: " + (a.unlocked ? 1 : 0.5) + "; " +
    "background-image: url(&quot;img/icons/" + a.iconImg + "&quot;);'>" +
    "<span class='road-achievement-condition'>" + a.condition_short + "<br></span>" + 
    "</div>"
  );
}

// Road "here" (current milesage) marker layout
$("#road").append("<div id='here'></div>");
$("#here").css("top", TM*MILE_PX);

// Sidebar Achievements layout
var l = ACHIEVEMENTS.length;
for (var i = 0; i < l; i++) {
  var a = ACHIEVEMENTS[i];
  $("#sidebar ul").append(
    "<li class='" + (a.unlocked ? "unlocked" : "") + "'>" +
      "<img style='float: left; height: 50px; width: 50px;' src='img/icons/" + a.iconImg + "'/>" +
      "<div style='float: left; margin-left: 10px;'>" +
        "<div class='info'>" +
          "<div>" +
            a.description + "<br>" + 
            "<span style='color: #AAAAAA'>" + 
              "Unlock" + (a.unlocked ? "ed" : "") + " at " + a.condition +
              (a.from ? ("<br>From " + a.from) : "") +
            "</span>" +
          "</div>" +
        "</div>" +
      "</div>" +
    "</li>"
  );
}

// Sprite animation
var spriteFrame = 4;

var resetTimer = null, 
    animationTimer = null;

// Reverts Sprite to default frame and cancels animations.
var clearSpriteFrame = function() {
  clearTimeout(animationTimer);
  animationTimer = null;
  clearTimeout(animationTimer);
  spriteFrame = 4; // Set to default standing
  $("#sprite").css("background-image", "url('img/" + FRAMES[spriteFrame] + "')");
};

var lastVP = 0;

// Scroll events, including sprite animation and movement.
$(window).scroll(function() {
  var VP = verticalPosition();
  WH = $(window).height();
  if (VP >= STM || STM == 0) {
    $("#sprite").css("top", (WH - BOTTOM_OFFSET - (VP - STM)) + "px");
  } else {
    $("#sprite").css("top", (NRH + (VP / STM)*(WH - NRH - BOTTOM_OFFSET)) + "px");
  }
  
  if (VP < STM && STM != 0) {
    clearTimeout(resetTimer);
    resetTimer = setTimeout(clearSpriteFrame, 250);
    if (animationTimer == null) {
      if (VP >= lastVP) {
        spriteFrame = (spriteFrame+1)%4;
      } else {
        spriteFrame = (spriteFrame+4-1)%4;
      }
      $("#sprite").css("background-image", "url('img/" + FRAMES[spriteFrame] + "')");
      animationTimer = setTimeout(function() { animationTimer = null; }, 250);
    }
  } else {
    clearSpriteFrame(); // Immediately cancel animation once sprite reaches current point
  }

  // slide week scale correspondingly
  $("#weekmarkers-content").css("margin-top", (-1 * VP + NRH) + "px");

  // slide sky bg by percentage of document traversed
  $("#background-gradient").css("top", ((-VP / ($(document).height() - WH))*40) + "vh");
  
  lastVP = VP;
});


window.scrollTo(0, STM + 0.001); // scroll to current position on load

$(window).resize(function() {
  WH = $(window).height();
  WW = $(window).width();
  NRH = Math.max(TOP_OFFSET, WH - BOTTOM_OFFSET - (TM * MILE_PX)/2),
  STM = NRH + TM*MILE_PX + BOTTOM_OFFSET - WH;
  $("#nullroad").css("height", NRH);
});

// BACKGROUND TWINKLE TWINKLE LITTLE STARS
var stars = [];
var bgHeight = $("#background-gradient").height();
var starIndex = 0;
var twinkleYellow = setInterval(function() {
  if (!stars[starIndex]) {
    stars[starIndex] = $("<img class='star'/>");
    $("#background-gradient").append(stars[starIndex]);
  }
  var starX = Math.random()*WW - 4;
  var starY = Math.random()*1.4*WH - 4;
  var star = stars[starIndex];
  star.attr("src", "");
  star.attr("src", "img/star"+starIndex+".gif");
  star.css({left: starX, top: starY});
  starIndex = (starIndex + 1)%3;
}, 300);

// UNICORN TEXT EFFECT
var step = 4, // colorChage step, use negative value to change direction
    ms   = 10,  // loop every
    $uni = $('.unicorn'),
    txt  = $uni.text(),
    len  = txt.length,
    lev  = 360/len,
    newCont = "",
    itv;

for(var i=0; i<len; i++)newCont += "<span style='color:hsla("+ i*lev +", 100%, 50%, 1)'>"+ txt.charAt(i) +"</span>";

$uni.html(newCont); // Replace with new content
var $ch = $uni.find('span'); // character

function anim(){
  itv = setInterval(function(){
    $ch.each(function(){
      var h = +$(this).attr('style').split(',')[0].split('(')[1]-step % 360;
      $(this).attr({style:"color:hsla("+ h +", 100%, 50%, 1)"});
    });
  }, ms); 
}
function stop(){ clearInterval(itv); }

//$uni.hover(anim,stop);


/******************************** HELP SCREEN ********************************/

$('#help-button').click(function() {
  anim();
  $('#help-button').css('bottom', '-50px');
  $('#help-close').css('bottom', '10px');
  $('#help-screen').removeClass('hidden');
  $('#version').css('opacity', '0.5');
});

$('#help-close, #help-screen').click(function() {
  stop();
  $('#help-close').css('bottom', '-50px');
  $('#help-button').css('bottom', '10px');
  $('#help-screen').addClass('hidden');
  $('#version').css('opacity', '0');
});
