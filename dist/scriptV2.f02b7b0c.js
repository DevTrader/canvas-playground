// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"utility/canvasState.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Test =
/*#__PURE__*/
function () {
  function Test(data) {
    _classCallCheck(this, Test);

    console.log(data);
    this.data = data;
    this.test = this.test.bind(this);
  }

  _createClass(Test, [{
    key: "test",
    value: function test() {
      alert(this.data);
    }
  }]);

  return Test;
}();

var _default = {
  initSmartContainerCanvas:
  /*#__PURE__*/
  function () {
    function CanvasState(canvas, width, height) {
      _classCallCheck(this, CanvasState);

      //Setup
      this.canvas = canvas;
      this.canvas.width = width;
      this.canvas.height = height;
      this.ctx = canvas.getContext("2d"); //State

      this.valid = false;
      this.shapes = [];
      this.dragging = false;
      this.selection = null;
      this.dragoffx = 0;
      this.dragoffy = 0;
      this.wasAnchorHit = false;
      this.draggingResizer = null;
      this.resizerRadius = 8;
      this.anchorId = null; //Backup of self reference

      var self = this; //binding (no class properties on parcel)

      this.getMouse = this.getMouse.bind(this);
      this.draw = this.draw.bind(this);
      this.addShape = this.addShape.bind(this);
      this.clear = this.clear.bind(this);
      this.drawSingleAnchor = this.drawSingleAnchor.bind(this);
      this.anchorHitIdentifier = this.anchorHitIdentifier.bind(this);
      this.avoidNegative = this.avoidNegative.bind(this); //Prevents user from accidentally selecting ("highlighting") elements with mouse.

      this.canvas.addEventListener("selectstart", function (e) {
        e.preventDefault();
      });
      this.canvas.addEventListener("mousedown", function (e) {
        //lost reference of this example
        //gets mouse position
        var mouse = self.getMouse(e);
        var mx = mouse.x;
        var my = mouse.y;
        var shapes = self.shapes;
        var l = shapes.length; //Loop through created elements (shapes) and check if they are in the mouse position.

        for (var i = l - 1; i >= 0; i--) {
          console.log("[SCREENER]", shapes[i].x + shapes[i].w >= mx); //If the mouse pos is within the element x position + its width AND element y position + its height, it is selected, prioritizes the one on "top" (last added element)
          //Added 8 in order to extend hit area to anchor points

          if (shapes[i].x - 8 <= mx && shapes[i].x + 8 + shapes[i].w >= mx && shapes[i].y - 8 <= my && shapes[i].y + 8 + shapes[i].h >= my) {
            //Set state accordingly
            var mySel = shapes[i];
            console.log("[SELECTED]", mySel); // alert(JSON.stringify(mySel))
            //Create smooth dragging

            self.dragoffx = mx - mySel.x;
            self.dragoffy = my - mySel.y;
            self.dragging = true;
            self.selection = mySel;
            self.valid = false;
            var anchorHit = self.anchorHitIdentifier(mx, my);

            if (anchorHit > -1) {
              self.wasAnchorHit = true;
              self.anchorId = anchorHit;
            } else {
              self.wasAnchorHit = false;
            }

            console.log('ANCHOR', anchorHit);
            return;
          }
        } //Detect anchor hit

        /**
         * Where does the anchor start and end?
         * 
         */


        if (self.selection && self.wasAnchorHit) {
          //may not be necessary
          self.dragging = true;
        } //Deselect old selected object;


        if (self.selection && !self.wasAnchorHit) {
          self.selection = null;
          self.valid = false;
        }
      }, true);
      this.canvas.addEventListener("mousemove", function (e) {
        //Shape drag
        if (self.dragging && !self.wasAnchorHit) {
          var mouse = self.getMouse(e); //Drag elementfrom where it was clicked;

          console.log("[DRAGGING]", self.dragoffx);
          self.selection.x = mouse.x - self.dragoffx;
          self.selection.y = mouse.y - self.dragoffy;
          self.valid = false;
        } //Anchor drag handler

        /**
         * TO DO: HANDLE THE CONDITIONALS MORE GRACEFULLY, should position lock? Try getting their width bellow 0 from both sides
         */


        if (self.dragging && self.wasAnchorHit) {
          var _mouse = self.getMouse(e);

          self.valid = false;

          switch (self.anchorId) {
            case 0:
              //top-left
              self.selection.w = self.selection.x + self.selection.w - _mouse.x < 0 ? 1 : self.selection.x + self.selection.w - _mouse.x;
              self.selection.h = self.selection.y + self.selection.h - _mouse.y < 0 ? 1 : self.selection.y + self.selection.h - _mouse.y;
              self.selection.x = _mouse.x;
              self.selection.y = _mouse.y;
              console.log('[SELF SELECT]', self.dragoffx, _mouse.x, self.selection);
              break;

            case 1:
              //top-right
              self.selection.w = _mouse.x - self.selection.x < 0 ? 1 : _mouse.x - self.selection.x;
              self.selection.h = self.selection.y + self.selection.h - _mouse.y < 0 ? 1 : self.selection.y + self.selection.h - _mouse.y;
              self.selection.y = _mouse.y;
              break;

            case 2:
              //bottom-right
              self.selection.w = _mouse.x - self.selection.x < 0 ? 1 : _mouse.x - self.selection.x;
              self.selection.h = _mouse.y - self.selection.y < 0 ? 1 : _mouse.y - self.selection.y;
              break;

            case 3:
              //bottom-left
              self.selection.h = _mouse.y - self.selection.y < 0 ? 1 : _mouse.y - self.selection.y;
              self.selection.w = self.selection.x + self.selection.w - _mouse.x < 0 ? 1 : self.selection.x + self.selection.w - _mouse.x;
              self.selection.x = _mouse.x;
              break;
          }
        }
      }, true);
      this.canvas.addEventListener("mouseup", function (e) {
        self.dragging = false;
        self.wasAnchorHit = false;
      }, true); //Selection options and draw frequency (30ms)
      //SELECTION OPTIONS ARE NOT ADDED YET

      this.selectionColor = "#CC0000";
      this.selectionWidth = 2;
      this.interval = 17;
      setInterval(this.draw, this.interval);
    }

    _createClass(CanvasState, [{
      key: "draw",
      value: function draw() {
        // if our state is invalid, redraw and validate!
        if (!this.valid) {
          var ctx = this.canvas.getContext("2d");
          var shapes = this.shapes;
          this.clear(); // draw all shapes

          var l = shapes.length;

          for (var i = 0; i < l; i++) {
            var shape = shapes[i]; // We can skip the drawing of elements that have moved off the screen:

            if (shape.x > this.width || shape.y > this.height || shape.x + shape.w < 0 || shape.y + shape.h < 0) continue;
            shapes[i].draw(ctx);
          } // draw selection
          // right now this is just a stroke along the edge of the selected Shape


          if (this.selection != null) {
            ctx.strokeStyle = this.selectionColor;
            ctx.lineWidth = this.selectionWidth;
            var mySel = this.selection; //Draw selection border

            ctx.strokeRect(mySel.x, mySel.y, mySel.w, mySel.h); //DRAW ANCHORS (NEED HIT DETECTION)

            this.drawSingleAnchor(mySel.x, mySel.y);
            this.drawSingleAnchor(mySel.x + mySel.w, mySel.y);
            this.drawSingleAnchor(mySel.x + mySel.w, mySel.y + mySel.h);
            this.drawSingleAnchor(mySel.x, mySel.y + mySel.h);
          } // ** Add stuff you want drawn on top all the time here **


          this.valid = true;
        }
      }
    }, {
      key: "getMouse",
      value: function getMouse(e) {
        var element = this.canvas,
            offsetX = 0,
            offsetY = 0,
            mx,
            my; // Compute the total offset

        if (element.offsetParent !== undefined) {
          do {
            offsetX += element.offsetLeft;
            offsetY += element.offsetTop;
          } while (element = element.offsetParent);
        } // Add padding and border style widths to offset
        // Also add the offsets in case there's a position:fixed bar
        // offsetX += this.stylePaddingLeft + this.styleBorderLeft + this.htmlLeft;
        // offsetY += this.stylePaddingTop + this.styleBorderTop + this.htmlTop;


        mx = e.pageX - offsetX;
        my = e.pageY - offsetY;
        console.log("[MOUSE STUFF]", {
          x: mx,
          y: my
        }); // We return a simple javascript object (a hash) with x and y defined

        return {
          x: mx,
          y: my
        };
      }
    }, {
      key: "drawSingleAnchor",
      value: function drawSingleAnchor(x, y) {
        var ctx = this.canvas.getContext("2d");
        var pi2 = Math.PI * 2;
        ctx.beginPath();
        ctx.arc(x, y, this.resizerRadius, 0, pi2, false);
        ctx.closePath();
        ctx.fillStyle = '#000';
        ctx.fill(); // ctx.fillStyle = '#000';
        // ctx.fillRect(x, y, 15, 15, 0, 0, false);
      }
    }, {
      key: "anchorHitIdentifier",
      value: function anchorHitIdentifier(x, y) {
        var mySel = this.selection;
        var rr = this.resizerRadius * this.resizerRadius;
        var dx, dy; // top-left

        dx = x - mySel.x;
        dy = y - mySel.y;

        if (dx * dx + dy * dy <= rr) {
          return 0;
        } // top-right


        dx = x - (mySel.x + mySel.w);
        dy = y - mySel.y;

        if (dx * dx + dy * dy <= rr) {
          return 1;
        } // bottom-right


        dx = x - (mySel.x + mySel.w);
        dy = y - (mySel.y + mySel.h);

        if (dx * dx + dy * dy <= rr) {
          return 2;
        } // bottom-left


        dx = x - mySel.x;
        dy = y - (mySel.y + mySel.h);

        if (dx * dx + dy * dy <= rr) {
          return 3;
        }

        return -1;
      }
    }, {
      key: "addShape",
      value: function addShape(shape) {
        this.shapes.push(shape);
        console.log(this.shapes);
      } //this avoids ghosting, but it needs to change.
      //it needs to clear the "old frames"

    }, {
      key: "clear",
      value: function clear() {
        var ctx = this.canvas.getContext("2d"); //When should this be cleared?

        ctx.clearRect(0, 0, this.canvas.width, this.canvas.width); // this.canvas.width = window.innerWidth;
        // this.canvas.height = window.innerHeight;
      }
    }, {
      key: "avoidNegative",
      value: function avoidNegative() {
        if (self.selection.w <= 0) {
          self.selection.w = 10;
        }

        if (self.selection.h <= 0) {
          self.selection.h = 10;
        }
      }
    }]);

    return CanvasState;
  }(),
  rectShape:
  /*#__PURE__*/
  function () {
    function Shape(x, y, w, h, fill) {
      _classCallCheck(this, Shape);

      this.x = x || 0;
      this.y = y || 0;
      this.w = w || 0;
      this.h = h || 0;
      this.fill = fill || "#000";
      this.draw = this.draw.bind(this);
    }

    _createClass(Shape, [{
      key: "draw",
      value: function draw(ctx) {
        ctx.fillStyle = this.fill;
        ctx.fillRect(this.x, this.y, this.w, this.h);
      }
    }]);

    return Shape;
  }()
};
exports.default = _default;
},{}],"scriptV2.js":[function(require,module,exports) {
"use strict";

var _canvasState = _interopRequireDefault(require("./utility/canvasState"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Objective: 
 *   1-Refactor script.js into stateful canvas pattern.
 *   2-Get selection and anchors working properly
 *   3-Initiate react structure (or utility functions)
 */
var targetCanvas = document.getElementById("canvas");
var myCanvas = new _canvasState.default.initSmartContainerCanvas(targetCanvas, 1500, 900);
console.log('active'); // const test = new canvasState.Test('DATA');

myCanvas.addShape(new _canvasState.default.rectShape(530, 700, 240, 160, 'green'));
myCanvas.addShape(new _canvasState.default.rectShape(240, 40, 60, 50));
myCanvas.addShape(new _canvasState.default.rectShape(880, 150, 160, 130, 'rgba(127, 255, 212, .5)'));
myCanvas.addShape(new _canvasState.default.rectShape(280, 10, 13, 400, 'red'));
console.log('[STAGE]', stage);
},{"./utility/canvasState":"utility/canvasState.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "54051" + '/');

  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","scriptV2.js"], null)
//# sourceMappingURL=/scriptV2.f02b7b0c.map