export function setup_nav()  {

  document.addEventListener('DOMContentLoaded', function() {
    const nav = document.querySelector('.nav-main');

    const snav = document.querySelectorAll('.sidenav');
    const snav_instances = M.Sidenav.init(snav, {
      edge:'right',
      draggable: 'true'
    });

    const sspy = document.querySelectorAll('.scrollspy');
    const sspy_instances = M.ScrollSpy.init(sspy, {
      scrollOffset: 20,
      getActiveElement: function(id) {
        const target = document.getElementById(id);
        nav.style.backgroundColor = window.getComputedStyle(target,null).getPropertyValue('background-color');

        return 'a[href="#' + id + '"]';
      }
    });
  });


  // // TODO: publish message to rust, represent collapse in rust state
  // $(window).scroll(() => {
  //   if ($(".navbar").offset().top > 50) {
  //       $(".navbar-fixed-top").addClass("top-nav-collapse");
  //   } else {
  //       $(".navbar-fixed-top").removeClass("top-nav-collapse");
  //   }
  // });

  // // TODO: remove, will be handled in rust
  // $(()=> {
  //   const nav = $('.navbar-collapse');
  //   const toggle = $('navbar-toggle');
  //   $('.page-scroll a').bind('click', function(event) {
  //       const $anchor = $(this);
  //       $('html, body').stop().animate({
  //           scrollTop: $($anchor.attr('href')).offset().top
  //       }, 1000, 'easeInOutExpo');

  //       // -- hack because .data-toggle is lame
  //       nav.removeClass('in').addClass('collapse').css('height','1px');
  //       toggle.addClass('collapsed');
  //       event.preventDefault();
  //   });
  // });
}