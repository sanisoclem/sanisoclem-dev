import './src/assets/css/main.styl';
import { setup_nav }  from './src/assets/js/nav.js';


// A dependency graph that contains any wasm must all be imported
// asynchronously. This `bootstrap.js` file does the single async import, so
// that no one else needs to worry about it again.
import("./src/assets/js/index.js")
  .catch(e => console.error("Error importing `index.js`:", e));


// -- jquery nav setup
setup_nav();
