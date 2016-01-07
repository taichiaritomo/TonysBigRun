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

var numDots = 0;
var incrementDots = function() {
  numDots = (numDots % 4) + 1;
  $('#loading-dots').html(Array(numDots).join("."));
};
setInterval(incrementDots, 500);


var messages = [
  "Calibrating Fitbit...",
  "Thinking of Shia LeBouf...",
  "Pliometrics...",
  "Blessing up...",
  "Looking for more loading messages..."
];
var messageIndex = 0;
var incrementMessage = function() {
  if (messageIndex <= messages.length - 1) {
    $('#loading-message').html(messages[messageIndex]);
    messageIndex = messageIndex + 1;
  }
};
setInterval(incrementMessage, 2000);

//var tonyIndex = 0;
//var incrementTonyImage = function() {
//  tonyIndex = (tonyIndex + 1) % 4;
//  $('#loading-tony').css("background-image", "url('" + FRAMES[tonyIndex] + "')");
//};
//setInterval(incrementTonyImage, 250);