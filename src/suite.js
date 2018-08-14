// Copyright 2017 the V8 project authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

const Benchmark = require("../benchmark");
const getTarget = require("./cli-flags-helper").getTarget;

// We need to run deterministically, so we set 'maxTime' to 0, which
// disables the variable iteration count feature of benchmark.js,
// and specify 'minSamples' as 20 to have it collect exactly 20
// samples. We leave the 'initCount' to the default of 1. See
// https://github.com/v8/web-tooling-benchmark/issues/6 for details.
function MyOption() {
  var cycleIndex = 0;
  return {
    maxTime: 0,
    minSamples: 20,
    onStart: function(event) {
      console.log("Start");
    },
    onCycle: function(event) {
      console.log("Cycle", ++cycleIndex, event.target.times.cycle);
    },
    onComplete: function(event) {
      console.log("History", event.target.stats_history);
    }
  };
}

const suite = new Benchmark.Suite();

getTarget().forEach(target => {
  suite.add(
    Object.assign({}, require(`./${target}-benchmark`), new MyOption())
  );
});

module.exports = suite;
