// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
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

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
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
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"app.js":[function(require,module,exports) {
var container = document.getElementById('root');
var ajax = new XMLHttpRequest();
var NEWS_URL = "https://api.hnpwa.com/v0/news/1.json";
var CONTENT_URL = "https://api.hnpwa.com/v0/item/@id.json"; // 마킹 @id

var content = document.createElement('div'); // 여러 함수에 걸쳐 공유되는 자원들을 하나로 묶어 놓는다. 
// 다른 데이터들도 추가될수 있기 때문에

var store = {
  currentPage: 1,
  // 현재 페이지 초기값 1
  maxPage: null
}; // 입력은 인자로 받을 수 있음
// function getData(url) {
//   ajax.open( 'GET', url, false );
//   ajax.send();
// }

function getData(url) {
  ajax.open('GET', url, false);
  ajax.send();
  return JSON.parse(ajax.response);
} // 라우터란 - 중계기 (화면이 여러개가 있다고 하면 A상태 B상태를 상황에 맞게 보여주는 것)
// 글 목록화면의 코드를 함수로 묶어주어야 한다. 
// 목록 화면을 보여주는 함수


function newsFeed() {
  var newsFeed = getData(NEWS_URL); // 데이터를 가져오는 코드

  var newsList = [];
  store.maxPage = Math.round(newsFeed.length / 10);
  console.log(store.maxPage); // 코드의 양은 늘어나더라도 복잡도가 늘어나지 않도록 작업해야 한다.
  // 내용이 복잡해지면 문제발생 ...  배열을 최소화 --> 템플릿 방식 사용 (주조 , 몰딩 생각)
  // UI가 어떤 구조인지 명확하게 알 수 있다. + Marking도 잘 확인 할 수 있음
  // 즉, 복잡도를 줄일 수 있다.

  var template = "\n    <div class=\"container mx-auto pt-10 pb-10\" style=\"background-color: teal\">\n      <h1>Hacker News</h1>\n      <ul> \n          {{__news_feed__}}\n      </ul>\n      <div>\n        <a href =\"#/page/{{__prev_page__}}\">\uC774\uC804 \uD398\uC774\uC9C0</a>\n        <a href =\"#/page/{{__next_page__}}\">\uB2E4\uC74C \uD398\uC774\uC9C0</a>\n      </div>\n    </div>\n  ";

  for (var i = (store.currentPage - 1) * 10; i < store.currentPage * 10; i++) {
    // DOM API 제거실습
    newsList.push("\n      <li>\n        <a href=\"#/show/".concat(newsFeed[i].id, "\"> \n          ").concat(newsFeed[i].title, " (").concat(newsFeed[i].comments_count, ") \n        <a>\n      </li>\n    "));
  }

  template = template.replace('{{__news_feed__}}', newsList.join(''));
  template = template.replace('{{__prev_page__}}', store.currentPage > 1 ? store.currentPage - 1 : 1);
  template = template.replace('{{__next_page__}}', store.currentPage + 1);
  container.innerHTML = template;
} // 뉴스 상세 부르는 함수


function newsDetail() {
  // 해시값이 변경될 경우에 함수 호출
  var id = location.hash.substring(7);
  var newsContent = getData(CONTENT_URL.replace('@id', id));
  var title = document.createElement('h1'); // content.appendChild(title); // 추가하는 코드만 있다.
  // title.innerHTML = newsContent.title; 
  // 내용화면으로 진입 시 목록화면을 지워주는 코드
  // 목록화면을 지우고 새로운 화면(제목 + 콘텐츠 + 목록으로 버튼) UI를 그린다.
  // 사용자는 새로운 화면으로 진입했다고 느낄 것

  container.innerHTML = "\n    <h1>".concat(newsContent.title, "</h1>\n    <div>\n      <a href=\"#/page/").concat(store.currentPage, "\">\uBAA9\uB85D\uC73C\uB85C</a>\n    </div>\n  "); // 기존 내용이 전부 제거, div#root 하위요소에 '' 빈 내용 삽입
} // 라우터 - 화면이 전환되어야 할 때를 판단
// 기존에 hashchange를 통해 화면 전환 트리거를 사용했음
// 해시가 바뀌면 무조건 글 내용을 보는 것이다 (지금까지는)
// 해시가 바뀔때마다 router함수가 호출되도록 변경


function router() {
  // 시작하자마자 게시글을 한번 보여주어야 한다.
  // 실제로 화면을 전화하는 것이 목적
  var routePath = location.hash; // 초기 hash값이 없으면 newsFeed 함수를 호출하고
  // '#' 만 들어있을 경우에는 빈값을 반환함

  if (routePath === '') {
    // 목록화면에서 넘어갈때 현재 currentPage값을 사용
    newsFeed();
  } else if (routePath.indexOf('#/page/') >= 0) {
    // hash값이 존재한다면 newsDetail함수를 호출
    store.currentPage = Number(routePath.substring(7));
    console.log(routePath.substring(7)); // 페이지네이션
    // store.currentPage = 2; // 하드코딩

    newsFeed();
  } else {
    newsDetail();
  }
} // 글 내용 화면 - 함수로 구성됨
// 이벤트 핸들러함수가 묶여 있을 경우 밖으로 빼낼 방법이 없다..? (무슨 뜻. 익명함수로 되어있으면 부를 방법이 없다.)


window.addEventListener('hashchange', router);
router(); // 초기에 router 함수를 호출
},{}],"../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "55568" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
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

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
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
}
},{}]},{},["../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","app.js"], null)
//# sourceMappingURL=/app.c328ef1a.js.map