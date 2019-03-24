extern crate cfg_if;
extern crate wasm_bindgen;
extern crate url;

use cfg_if::cfg_if;
use wasm_bindgen::prelude::*;


#[wasm_bindgen]
pub fn render() {
    set_panic_hook();
    
    // TODO
}

pub enum Todo {
  Todo1,
  CompositeTodo (Box<Todo>, Box<Todo>)
}


// define a set_panic_hook function, 
// if feature not activated, then it won't do anything
cfg_if! {
    if #[cfg(feature = "console_error_panic_hook")] {
        extern crate console_error_panic_hook;
        pub use console_error_panic_hook::set_once as set_panic_hook;
    } else {
        #[inline]
        pub fn set_panic_hook() {}
    }
}

cfg_if! {
    // When the `wee_alloc` feature is enabled, use `wee_alloc` as the global allocator.
    if #[cfg(feature = "wee_alloc")] {
        extern crate wee_alloc;
        #[global_allocator]
        static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;
    }
}

