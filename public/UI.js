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



























