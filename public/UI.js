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