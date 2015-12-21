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