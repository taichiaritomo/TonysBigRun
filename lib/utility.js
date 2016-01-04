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

// Get scroll speed
//checkScrollSpeed = (function(){
//  var lastPos, newPos, timer, delta, 
//      delay = DELAY; // in "ms" (higher means lower fidelity )
//  function clear() {
//    lastPos = null;
//    delta = 0;
//  }
//  clear();
//  return function(){
//    newPos = window.scrollY;
//    if ( lastPos != null ){ // && newPos < maxScroll 
//      delta = newPos -  lastPos;
//    }
//    lastPos = newPos;
//    clearTimeout(timer);
//    timer = setTimeout(clear, delay);
//    return delta;
//  };
//})();
