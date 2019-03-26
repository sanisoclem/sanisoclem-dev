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
}