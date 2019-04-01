import './src/assets/css/main.scss';
import 'materialize-css';
import './src/assets/js/modernizr.min.js';
import { setup_nav }  from './src/assets/js/nav.js';


// Check that service workers are registered
if ('serviceWorker' in navigator) {
  // Use the window load event to keep the page load performant
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js');
  });
}

// -- jquery nav setup
setup_nav();
