//! Test suite for the Web and headless browsers.

#![cfg(target_arch = "wasm32")]

#[macro_use]
extern crate galvanic_assert;
extern crate wasm_bindgen_test;
extern crate sanisoclem_dev;

use galvanic_assert::matchers::*;
use wasm_bindgen_test::*;
use sanisoclem_dev::*;

wasm_bindgen_test_configure!(run_in_browser);

#[wasm_bindgen_test]
pub fn test_todo() {
  let var = Todo::Todo1;
  assert_that!(&var, is_variant!(Todo::Todo1));
}