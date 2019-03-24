import inlineSVG from 'inline-svg';

// -- other stuff, using ambient imported jquery (needed by bootstrap)
// -- todo: remove bootstrap
export function setup_nav()  {
  // TODO: publish message to rust, represent collapse in rust state
  $(window).scroll(() => {
    if ($(".navbar").offset().top > 50) {
        $(".navbar-fixed-top").addClass("top-nav-collapse");
    } else {
        $(".navbar-fixed-top").removeClass("top-nav-collapse");
    }
  });

  // TODO: remove, will be handled in rust
  $(()=> {
    const nav = $('.navbar-collapse');
    const toggle = $('navbar-toggle');
    $('.page-scroll a').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1000, 'easeInOutExpo');

        // -- hack because .data-toggle is lame
        nav.removeClass('in').addClass('collapse').css('height','1px');
        toggle.addClass('collapsed');
        event.preventDefault();
    });
  });

  // -- svg styles not working!!
  inlineSVG.init({
    svgSelector: 'img.svg-inline', // the class attached to all images that should be inlined
    initClass: 'js-inlinesvg', // class added to <html>
  }, function () {
  });
}