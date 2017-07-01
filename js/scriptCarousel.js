/*
Afficher un message si le JS n'est pas activé (done)
Appel des données en AJAX (format JSON) https://www.skrzypczyk.fr/slideshow.php (done)

Fonctionnalités :
  Animation de l'affichage des titres et descriptions diff de l'animation des images (not done)
  Rognage des images ou autre solution (done)
  Suivant, précédent, play, pause (done)
  KeyBoard Suivant, précédent, play, pause (done)
  Anti spam-click (done)
  Hover Play pause (done)
  Responsive et BEAU (halfly-done)
  Administrable via une liste de variable en haut de script (done)
  Module de controle : Puces ou vignettes (not done)
*/


$(document).ready(function () {

  var slides = slide();
  var refreshIntervalId;
  var play = true;
  var speed = 1000;
  var sliding = false;

  preloadSlide(slides);

  // slideshow functions referred each to an id that calls each buttons of our slider
  $('#next').click(fonctionNext);
  $('#previous').click(fonctionPrevious);
  $('#playOrStop').click(fonctionPlayStop);

  function slide () {
    let data;
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
  }

  //function to display and load all the pictures, title, description
  function preloadSlide (slides) {
    let slideSize = slides.length * $(this).width();
    slides.forEach(function (element) {
      console.log(element.url);
      $('#slide').append("<div class='element'><img src='" + element.url + "' class='slideshow'><div class='divTitle'>" + element.title + "</div><div class='divDesc'>" + element.desc + "</div></div");
    });
    $('#slide').css('width', slideSize);
  }

  //function to display the next picture of it's actual
  function fonctionNext () {
    // Stop the function if we're already sliding
    if(sliding){
        return false;
    }
    // And now we're sliding
    sliding = true;
    $('#slide').animate(
      { marginLeft: '-700px' },
      speed,
      function () {
        $('#slide .element:last').after($('#slide .element:first'));
        $('#slide').css('margin-left', '0px');
        // Slide over!
        sliding = false;
      }
    );
  }

  //function to display the previous picture of it's actual
  function fonctionPrevious () {
    // Stop the function if we're already sliding
    if(sliding){
        return false;
    }
    // And now we're sliding
    sliding = true;
    $('#slide').animate(
      { marginLeft: '0px' },
      speed,
      function () {
        $('#slide .element:first').before($('#slide .element:last'));
        $('#slide').css('margin-left', '-700px');
        // Slide over!
        sliding = false;
      }
    );
  }

  //this function set a timer that played with the play/pause function of the slider 
  //if the user click on the play button or press on spacebar it'll stop the slider
  function fonctionPlayStop () {
    let action = $('#playOrStop').attr('action');

    if (action === 'play') {
      refreshIntervalId = setInterval(fonctionNext,speed);
      playStop = false;
      $('#playOrStop').attr('action', 'stop');
      $('#playOrStop').attr('src', 'img/pause.png');
    } else {
      clearInterval(refreshIntervalId);
      play = true;
      hover = false;
      $('#playOrStop').attr('action', 'play');
      $('#playOrStop').attr('src', 'img/play.png');
    }
  }

  // Fade in-out function not totally correct 
  /*$('#slide').hover(function () {
      $('#nav').fadeIn('slow');
    }, function () {
        $('#nav').fadeOut('slow');
      }
  );*/

  // Fade in-out of button Play/Stop when Mouse enter or leaves
  $("#slide").hover(function() {
    if (!play && hover) {
      clearInterval(play);
      console.log("in : " + play);
    }
  }, function() {
    if (!play && hover) {
      play = setInterval(fonctionNext, speed);
      console.log("out : " + play);
    } else if (!play && !hover) {
      hover = true;
    }
  });


  //function with keyboard next/previous action with directional touch (<>) 
  //and play/stop action with the space key
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


  //function dots navigations 
  $('ul li').bind('click', function(){

        //var slide = $(this).slide() + 1;

        $(".active").fadeOut(300);

        $("#slide").fadeIn(300);        
        $("#slide").removeClass("active");
        $("#slide").addClass("active");
  });

});
