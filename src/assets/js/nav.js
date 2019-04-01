const M = window.M;

export function setup_nav()  {

    document.addEventListener('DOMContentLoaded', function() {
        const nav = document.querySelector('.nav-main');

        const snav = document.querySelectorAll('.sidenav');
        M.Sidenav.init(snav, {
            edge:'right',
            draggable: 'true'
        });

        const sspy = document.querySelectorAll('.scrollspy');
        M.ScrollSpy.init(sspy, {
            scrollOffset: 20,
            getActiveElement: function(id) {
                const target = document.getElementById(id);
                nav.style.backgroundColor = window.getComputedStyle(target,null).getPropertyValue('background-color');

                return 'a[href="#' + id + '"]';
            }
        });
    });
}