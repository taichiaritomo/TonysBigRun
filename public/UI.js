// HELP SCREEN

$('#help-button').click(function() {
  $(this).css('bottom', '-50px');
  $('#help-close').css('bottom', '10px');
  $('#help-screen').removeClass('hidden');
  $('#version').css('opacity', '0.5');
});

$('#help-close').click(function() {
  $(this).css('bottom', '-50px');
  $('#help-button').css('bottom', '10px');
  $('#help-screen').addClass('hidden');
  $('#version').css('opacity', '0');
});


// LOADING SCREEN

var numDots = 0;
var incrementDots = function() {
  numDots = (numDots % 4) + 1;
  $('#loading-dots').html(Array(numDots).join("."));
};
setInterval(incrementDots, 500);

var messages = [
  "Lacing trainers...",
  "Resisting going back to sleep...",
  "Calibrating Fitbit...",
  "Thinking of Shia LeBouf...",
  "TONY used BLESS UP!",
  "It's super effective!",
  "Obtaining the key to more success...",
  "Pliometrics...",
  "Thinking of more loading messages...",
  "I never thought it'd get this far...",
  "Uh...",
  "<span style='font-family: sans-serif'>( ͡° ͜ʖ ͡°)</span>"
];
var messageIndex = 0;
var incrementMessage = function() {
  if (messageIndex <= messages.length - 1) {
    $('#loading-message').html(messages[messageIndex]);
    messageIndex = messageIndex + 1;
  }
};
setInterval(incrementMessage, 2000);


// TIME-BASED GRADIENTS
var BGs = ["night", "dawn", "day", "dusk"];
var changeSky = function(i) {
  $("#bg").removeClass();
  $("#bg").addClass(BGs[i]);
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
console.log(moment.duration(moment().add(10, "seconds").diff(now)).asMilliseconds());



























