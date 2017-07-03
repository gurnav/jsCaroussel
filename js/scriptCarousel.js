/**
 * Afficher un message si le JS n'est pas activé (done)
 * Appel des données en AJAX (format JSON) https://www.skrzypczyk.fr/slideshow.php (done)
 *
 * Fonctionnalités :
 * Animation de l'affichage des titres et descriptions diff de l'animation des images (done)
 * Rognage des images ou autre solution (done)
 * Suivant, précédent, play, pause (done)
 * KeyBoard Suivant, précédent, play, pause (done)
 * Anti spam-click (done)
 * Hover Play pause (done)
 * Responsive et BEAU (halfly-done)
 * Administrable via une liste de variable en haut de script (done)
 * Module de controle : Puces ou vignettes (not done)
 */


$(document).ready(function () {

  var slides = slide();
  var refreshIntervalId;
  var play = true;
  var speed = 1000;

  sliding = false;

  preloadSlide(slides);

  /**
   * Slideshow functions referred each to an id that calls each buttons of our slider
   */
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

  /**
   * Function to display and load all the pictures, title, description
   * @param slides The JSON array of slides 
   */
  function preloadSlide (slides) {
    let slideSize = slides.length * $(this).width();
    let el = 0;
    slides.forEach(function (element) {
      $('#slide').append("<div id='el" + ++el + "' class='element'><img src='" + element.url + "' class='slideshow'><div class='divTitle'>" + element.title + "</div><div class='divDesc'>" + element.desc + "</div></div");
      $('#bullet').append("<li id='bel" + el + "' class='bullet'></li>");
      $('#slide .element:first').attr('selected', 'selected');
    });
    $('#slide').css('width', slideSize);
  }

  /**
   * Function to display the next picture of it's actual
   */
  function fonctionNext () {
    // Stop the function if we're already sliding
    if (sliding) { return false; }
    // And now we're sliding
    sliding = true;
    // Remove the selected attributes
    $('#slide .element:first').removeAttr('selected', 'selected');
    // Hiding the text of the next slide for displaying purposes
    $('#slide .element:nth-child(2) .divTitle').fadeTo(0, 0);
    $('#slide .element:nth-child(2) .divDesc').fadeTo(0, 0);
    // Sliding animation
    $('#slide').animate(
      { marginLeft: '-700px' },
      speed,
      function () {
        $('#slide .element:last').after($('#slide .element:first'));
        $('#slide').css('margin-left', '0px');
        // Slide over!
        sliding = false;
        // When sliding done display the text smoothly
        $('#slide .element:first .divTitle').fadeTo(1000, 1);
        $('#slide .element:first .divDesc').fadeTo(3000, 1);
        $('#slide .element:first').attr('selected', 'selected');
      }
    );
  }

  /**
   * Function to display the previous picture of it's actual
   */
  function fonctionPrevious () {
    // Stop the function if we're already sliding
    if (sliding) { return false; }
    // And now we're sliding
    sliding = true;
    // Remove the selected attributes
    $('#slide .element:first').removeAttr('selected', 'selected');
    // Hiding the text of the last slide for displaying purposes
    $('#slide .element:last .divTitle').fadeTo(0, 0);
    $('#slide .element:last .divDesc').fadeTo(0, 0);
    // Sliding animation
    $('#slide').animate(
      { marginLeft: '0px' },
      speed,
      function () {
        $('#slide .element:first').before($('#slide .element:last'));
        $('#slide').css('margin-left', '-700px');
        // Slide over!
        sliding = false;
        // When sliding done display the text smoothly
        $('#slide .element:first .divTitle').fadeTo(3000, 1);
        $('#slide .element:first .divDesc').fadeTo(5000, 1);
        $('#slide .element:first').attr('selected', 'selected');
      }
    );
  }

  /**
   * This function set a timer that played with the play/pause function of the slider
   * If the user click on the play button or press on spacebar it'll stop the slider
   */ 
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

  /** Fade in-out function not totally correct 
   * $('#slide').hover(function () {
   *     $('#nav').fadeIn('slow');
   * }, function () {
   *     $('#nav').fadeOut('slow');
   *    }
   * );
   */

  /**
   * Fade in-out of button Play/Stop when Mouse enter or leaves
   */
  $("#slide").hover( function() {
    if (!play && hover) {
      clearInterval(play);
      console.log("in : " + play);
    }
  }, function () {
    if (!play && hover) {
      play = setInterval(fonctionNext, speed);
      console.log("out : " + play);
    } else if (!play && !hover) { hover = true; }
  });


  $(window).resize(function () {

    //Au redimensionnement de la fenetre 
    img_width = $(window).width();
    $('#slide').css('margin-left', '0px');
    console.log("Largeur de la fenetre : " + img_width);

});


  /**
   * Function with keyboard next/previous action with directional touch (<>) 
   * and play/stop action with the space key
   */ 
  $('body').keyup(function (e) {
    if (e.keyCode === 37) { fonctionPrevious(); }
    if (e.keyCode === 39) { fonctionNext(); }
    if (e.keyCode === 32) { fonctionPlayStop(); }
  });


  /**
   * Function dots navigations
   */
  $('#bullet li').bind('click', function() {
    // let slide = $(this).slide() + 1;
    let num_el = $('#slide .element:first')
      .attr('id')
      .toString()
      .match(/\d+/)[0];
    let num_bel = $(this)
      .attr('id')
      .toString()
      .match(/\d+/)[0];
    let iteration = num_bel - num_el;

    if (iteration < 0) {
      for (i = 0; i > iteration; i -= 1) {
        fonctionPrevious();
      }
    }

    if (iteration > 0) {
      for (i = 0; i < iteration; i += 1) { 
        fonctionNext();
      }
    }      
  });

});
