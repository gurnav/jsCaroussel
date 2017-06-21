$(document).ready(function () {

  /*function slide () {
    $.ajax({
      type: 'POST',
      url: "https://www.skrzypczyk.fr/slideshow.php",
      dataType: 'json',
      async: false,
      error: function (msg, string) {
        alert('Error : ' + string);
      },
      success: function (reponse) {
        data = reponse;
      }
    });
    return data;
  }*/

  var canClick = true;
  var refreshIntervalId;
  var canPlay = true;
  var watchHover = false;

  $.getJSON("https://www.skrzypczyk.fr/slideshow.php", function (data) {
    var nbImages = 0;
    $.each(data, function(key, value) {
      $("#slide_next").append("<img src=\""+ value["url"] +"\" data-nb=\""+ nbImages + "\" data-desc=\""+ value["desc"] +"\" data-title=\""+ value["title"] +"\">");
      nbImages++;
    });
    
    displayTitle();

    $("#slide_next").css("width", nbImages*800);

  });

  function fonctionNext () {
    $('.description').css({
        textShadow: "0 0 #fff"
      });
    if (canClick) {
      removeTitle();
      canClick = false;
      $('#slide_next').animate(
        { marginLeft: '-800px' },
        1000, function () {
          var first = $("img:first");
          $('#slide_next img:last-child').after(first);
          $('#slide_next').css('margin-left', '0px');
          canClick = true;
          displayTitle();
        });
    }
  }

  $("#next").click(fonctionNext);

  function fonctionPrevious () {
    $('.description').css({
        textShadow: "0 0 #fff"
      });
    if (canClick) {
      removeTitle();
      canClick = false;
      var last = $("img:last");
      $('#slide_next img:first-child').before(last);
      $('#slide_next').css('margin-left', '-800px');
      $('#slide_next').animate({
       marginLeft: '0px' },
        1000, function() {
        canClick = true;
        displayTitle();
      });
    }
  }

  $('#previous').click(fonctionPrevious);

  $('#playOrStop').click(fonctionPlayStop);

  function fonctionPlayStop () {
    //let action = $('#playOrStop').attr('action');

    if (action == true) {
      refreshIntervalId = setInterval(fonctionNext,2000);
      canPlay = false;
      $('#playOrStop').attr('action', 'stop');
      $('#playOrStop').attr('src', 'img/pause.png');
    } else {
      clearInterval(refreshIntervalId);
      canPlay = true;
      watchHover = false;
      $('#playOrStop').attr('action', 'play');
      $('#playOrStop').attr('src', 'img/play.png');
    }
  }

  $('body').keyup(function (e) {
    if (e.keyCode === 37) {
      fonctionPrevious();
    }

    if (e.keyCode === 39) {
      fonctionNext();
    }

    if (e.keyCode === 32) {
      fonctionPlayStop();
    }

  });

  /*$('#slide').hover(function () {
      $('#nav').fadeIn('slow');
    }, function () {
        $('#nav').fadeOut('slow');
      }
  );*/

  $("#slide").hover(function() {  // Mouse enters
    if (!canPlay && watchHover) {
      clearInterval(play);
      console.log("in : " + play);
    }
  }, function() {           // Mouse leaves
    if (!canPlay && watchHover) {
      play = setInterval(fonctionNext, 2000);
      console.log("out : " + play);
    } else if (!canPlay && !watchHover) {
      watchHover = true;
    }
  });

  function displayTitle() {
    $('.title').text($("#slide_next img:first").attr("data-title"));
    $('.desc').text($("#slide_next img:first").attr("data-desc"));
    
    $('.description').animate({
      marginTop: "-=150"
    }, "fast", function() {
      $('.description').css({
        textShadow: "3px 2px rgba(0,0,0,0.5)"
      });
      $('.navigator').css({
        color: "#eee"
      });
    });
  }

  function removeTitle() {
    $('.title').text($("#slide_next img:first").attr("data-title"));
    $('.desc').text($("#slide_next img:first").attr("data-desc"));
    $('.description').css({
        textShadow: "0 0 #fff"
      });
    $('.description').animate({
      marginTop: "+=150"
    }, "fast", function() {
      $('.description').css({
        textShadow: "0 0 #fff"
      });
      $('.navigator').css({
        color: "transparent"
      });
    });
  }
});
