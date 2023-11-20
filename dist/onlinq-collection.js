/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@ungap/custom-elements/index.js":
/*!******************************************************!*\
  !*** ./node_modules/@ungap/custom-elements/index.js ***!
  \******************************************************/
/***/ (() => {

/*! (c) Andrea Giammarchi @webreflection ISC */
(function () {
  'use strict';

  var attributesObserver = (function (whenDefined, MutationObserver) {
    var attributeChanged = function attributeChanged(records) {
      for (var i = 0, length = records.length; i < length; i++) dispatch(records[i]);
    };
    var dispatch = function dispatch(_ref) {
      var target = _ref.target,
        attributeName = _ref.attributeName,
        oldValue = _ref.oldValue;
      target.attributeChangedCallback(attributeName, oldValue, target.getAttribute(attributeName));
    };
    return function (target, is) {
      var attributeFilter = target.constructor.observedAttributes;
      if (attributeFilter) {
        whenDefined(is).then(function () {
          new MutationObserver(attributeChanged).observe(target, {
            attributes: true,
            attributeOldValue: true,
            attributeFilter: attributeFilter
          });
          for (var i = 0, length = attributeFilter.length; i < length; i++) {
            if (target.hasAttribute(attributeFilter[i])) dispatch({
              target: target,
              attributeName: attributeFilter[i],
              oldValue: null
            });
          }
        });
      }
      return target;
    };
  });

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }
  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
    return arr2;
  }
  function _createForOfIteratorHelper(o, allowArrayLike) {
    var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
    if (!it) {
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it) o = it;
        var i = 0;
        var F = function () {};
        return {
          s: F,
          n: function () {
            if (i >= o.length) return {
              done: true
            };
            return {
              done: false,
              value: o[i++]
            };
          },
          e: function (e) {
            throw e;
          },
          f: F
        };
      }
      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    var normalCompletion = true,
      didErr = false,
      err;
    return {
      s: function () {
        it = it.call(o);
      },
      n: function () {
        var step = it.next();
        normalCompletion = step.done;
        return step;
      },
      e: function (e) {
        didErr = true;
        err = e;
      },
      f: function () {
        try {
          if (!normalCompletion && it.return != null) it.return();
        } finally {
          if (didErr) throw err;
        }
      }
    };
  }

  /*! (c) Andrea Giammarchi - ISC */
  var TRUE = true,
    FALSE = false,
    QSA$1 = 'querySelectorAll';

  /**
   * Start observing a generic document or root element.
   * @param {(node:Element, connected:boolean) => void} callback triggered per each dis/connected element
   * @param {Document|Element} [root=document] by default, the global document to observe
   * @param {Function} [MO=MutationObserver] by default, the global MutationObserver
   * @param {string[]} [query=['*']] the selectors to use within nodes
   * @returns {MutationObserver}
   */
  var notify = function notify(callback) {
    var root = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;
    var MO = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : MutationObserver;
    var query = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : ['*'];
    var loop = function loop(nodes, selectors, added, removed, connected, pass) {
      var _iterator = _createForOfIteratorHelper(nodes),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var node = _step.value;
          if (pass || QSA$1 in node) {
            if (connected) {
              if (!added.has(node)) {
                added.add(node);
                removed["delete"](node);
                callback(node, connected);
              }
            } else if (!removed.has(node)) {
              removed.add(node);
              added["delete"](node);
              callback(node, connected);
            }
            if (!pass) loop(node[QSA$1](selectors), selectors, added, removed, connected, TRUE);
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    };
    var mo = new MO(function (records) {
      if (query.length) {
        var selectors = query.join(',');
        var added = new Set(),
          removed = new Set();
        var _iterator2 = _createForOfIteratorHelper(records),
          _step2;
        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var _step2$value = _step2.value,
              addedNodes = _step2$value.addedNodes,
              removedNodes = _step2$value.removedNodes;
            loop(removedNodes, selectors, added, removed, FALSE, FALSE);
            loop(addedNodes, selectors, added, removed, TRUE, FALSE);
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
      }
    });
    var observe = mo.observe;
    (mo.observe = function (node) {
      return observe.call(mo, node, {
        subtree: TRUE,
        childList: TRUE
      });
    })(root);
    return mo;
  };

  var QSA = 'querySelectorAll';
  var _self$1 = self,
    document$2 = _self$1.document,
    Element$1 = _self$1.Element,
    MutationObserver$2 = _self$1.MutationObserver,
    Set$2 = _self$1.Set,
    WeakMap$1 = _self$1.WeakMap;
  var elements = function elements(element) {
    return QSA in element;
  };
  var filter = [].filter;
  var qsaObserver = (function (options) {
    var live = new WeakMap$1();
    var drop = function drop(elements) {
      for (var i = 0, length = elements.length; i < length; i++) live["delete"](elements[i]);
    };
    var flush = function flush() {
      var records = observer.takeRecords();
      for (var i = 0, length = records.length; i < length; i++) {
        parse(filter.call(records[i].removedNodes, elements), false);
        parse(filter.call(records[i].addedNodes, elements), true);
      }
    };
    var matches = function matches(element) {
      return element.matches || element.webkitMatchesSelector || element.msMatchesSelector;
    };
    var notifier = function notifier(element, connected) {
      var selectors;
      if (connected) {
        for (var q, m = matches(element), i = 0, length = query.length; i < length; i++) {
          if (m.call(element, q = query[i])) {
            if (!live.has(element)) live.set(element, new Set$2());
            selectors = live.get(element);
            if (!selectors.has(q)) {
              selectors.add(q);
              options.handle(element, connected, q);
            }
          }
        }
      } else if (live.has(element)) {
        selectors = live.get(element);
        live["delete"](element);
        selectors.forEach(function (q) {
          options.handle(element, connected, q);
        });
      }
    };
    var parse = function parse(elements) {
      var connected = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      for (var i = 0, length = elements.length; i < length; i++) notifier(elements[i], connected);
    };
    var query = options.query;
    var root = options.root || document$2;
    var observer = notify(notifier, root, MutationObserver$2, query);
    var attachShadow = Element$1.prototype.attachShadow;
    if (attachShadow) Element$1.prototype.attachShadow = function (init) {
      var shadowRoot = attachShadow.call(this, init);
      observer.observe(shadowRoot);
      return shadowRoot;
    };
    if (query.length) parse(root[QSA](query));
    return {
      drop: drop,
      flush: flush,
      observer: observer,
      parse: parse
    };
  });

  var _self = self,
    document$1 = _self.document,
    Map = _self.Map,
    MutationObserver$1 = _self.MutationObserver,
    Object$1 = _self.Object,
    Set$1 = _self.Set,
    WeakMap = _self.WeakMap,
    Element = _self.Element,
    HTMLElement = _self.HTMLElement,
    Node = _self.Node,
    Error = _self.Error,
    TypeError$1 = _self.TypeError,
    Reflect = _self.Reflect;
  var defineProperty = Object$1.defineProperty,
    keys = Object$1.keys,
    getOwnPropertyNames = Object$1.getOwnPropertyNames,
    setPrototypeOf = Object$1.setPrototypeOf;
  var legacy = !self.customElements;
  var expando = function expando(element) {
    var key = keys(element);
    var value = [];
    var ignore = new Set$1();
    var length = key.length;
    for (var i = 0; i < length; i++) {
      value[i] = element[key[i]];
      try {
        delete element[key[i]];
      } catch (SafariTP) {
        ignore.add(i);
      }
    }
    return function () {
      for (var _i = 0; _i < length; _i++) ignore.has(_i) || (element[key[_i]] = value[_i]);
    };
  };
  if (legacy) {
    var HTMLBuiltIn = function HTMLBuiltIn() {
      var constructor = this.constructor;
      if (!classes.has(constructor)) throw new TypeError$1('Illegal constructor');
      var is = classes.get(constructor);
      if (override) return augment(override, is);
      var element = createElement.call(document$1, is);
      return augment(setPrototypeOf(element, constructor.prototype), is);
    };
    var createElement = document$1.createElement;
    var classes = new Map();
    var defined = new Map();
    var prototypes = new Map();
    var registry = new Map();
    var query = [];
    var handle = function handle(element, connected, selector) {
      var proto = prototypes.get(selector);
      if (connected && !proto.isPrototypeOf(element)) {
        var redefine = expando(element);
        override = setPrototypeOf(element, proto);
        try {
          new proto.constructor();
        } finally {
          override = null;
          redefine();
        }
      }
      var method = "".concat(connected ? '' : 'dis', "connectedCallback");
      if (method in proto) element[method]();
    };
    var _qsaObserver = qsaObserver({
        query: query,
        handle: handle
      }),
      parse = _qsaObserver.parse;
    var override = null;
    var whenDefined = function whenDefined(name) {
      if (!defined.has(name)) {
        var _,
          $ = new Promise(function ($) {
            _ = $;
          });
        defined.set(name, {
          $: $,
          _: _
        });
      }
      return defined.get(name).$;
    };
    var augment = attributesObserver(whenDefined, MutationObserver$1);
    self.customElements = {
      define: function define(is, Class) {
        if (registry.has(is)) throw new Error("the name \"".concat(is, "\" has already been used with this registry"));
        classes.set(Class, is);
        prototypes.set(is, Class.prototype);
        registry.set(is, Class);
        query.push(is);
        whenDefined(is).then(function () {
          parse(document$1.querySelectorAll(is));
        });
        defined.get(is)._(Class);
      },
      get: function get(is) {
        return registry.get(is);
      },
      whenDefined: whenDefined
    };
    defineProperty(HTMLBuiltIn.prototype = HTMLElement.prototype, 'constructor', {
      value: HTMLBuiltIn
    });
    self.HTMLElement = HTMLBuiltIn;
    document$1.createElement = function (name, options) {
      var is = options && options.is;
      var Class = is ? registry.get(is) : registry.get(name);
      return Class ? new Class() : createElement.call(document$1, name);
    };
    // in case ShadowDOM is used through a polyfill, to avoid issues
    // with builtin extends within shadow roots
    if (!('isConnected' in Node.prototype)) defineProperty(Node.prototype, 'isConnected', {
      configurable: true,
      get: function get() {
        return !(this.ownerDocument.compareDocumentPosition(this) & this.DOCUMENT_POSITION_DISCONNECTED);
      }
    });
  } else {
    legacy = !self.customElements.get('extends-br');
    if (legacy) {
      try {
        var BR = function BR() {
          return self.Reflect.construct(HTMLBRElement, [], BR);
        };
        BR.prototype = HTMLLIElement.prototype;
        var is = 'extends-br';
        self.customElements.define('extends-br', BR, {
          'extends': 'br'
        });
        legacy = document$1.createElement('br', {
          is: is
        }).outerHTML.indexOf(is) < 0;
        var _self$customElements = self.customElements,
          get = _self$customElements.get,
          _whenDefined = _self$customElements.whenDefined;
        self.customElements.whenDefined = function (is) {
          var _this = this;
          return _whenDefined.call(this, is).then(function (Class) {
            return Class || get.call(_this, is);
          });
        };
      } catch (o_O) {}
    }
  }
  if (legacy) {
    var _parseShadow = function _parseShadow(element) {
      var root = shadowRoots.get(element);
      _parse(root.querySelectorAll(this), element.isConnected);
    };
    var customElements = self.customElements;
    var _createElement = document$1.createElement;
    var define = customElements.define,
      _get = customElements.get,
      upgrade = customElements.upgrade;
    var _ref = Reflect || {
        construct: function construct(HTMLElement) {
          return HTMLElement.call(this);
        }
      },
      construct = _ref.construct;
    var shadowRoots = new WeakMap();
    var shadows = new Set$1();
    var _classes = new Map();
    var _defined = new Map();
    var _prototypes = new Map();
    var _registry = new Map();
    var shadowed = [];
    var _query = [];
    var getCE = function getCE(is) {
      return _registry.get(is) || _get.call(customElements, is);
    };
    var _handle = function _handle(element, connected, selector) {
      var proto = _prototypes.get(selector);
      if (connected && !proto.isPrototypeOf(element)) {
        var redefine = expando(element);
        _override = setPrototypeOf(element, proto);
        try {
          new proto.constructor();
        } finally {
          _override = null;
          redefine();
        }
      }
      var method = "".concat(connected ? '' : 'dis', "connectedCallback");
      if (method in proto) element[method]();
    };
    var _qsaObserver2 = qsaObserver({
        query: _query,
        handle: _handle
      }),
      _parse = _qsaObserver2.parse;
    var _qsaObserver3 = qsaObserver({
        query: shadowed,
        handle: function handle(element, connected) {
          if (shadowRoots.has(element)) {
            if (connected) shadows.add(element);else shadows["delete"](element);
            if (_query.length) _parseShadow.call(_query, element);
          }
        }
      }),
      parseShadowed = _qsaObserver3.parse;
    // qsaObserver also patches attachShadow
    // be sure this runs *after* that
    var attachShadow = Element.prototype.attachShadow;
    if (attachShadow) Element.prototype.attachShadow = function (init) {
      var root = attachShadow.call(this, init);
      shadowRoots.set(this, root);
      return root;
    };
    var _whenDefined2 = function _whenDefined2(name) {
      if (!_defined.has(name)) {
        var _,
          $ = new Promise(function ($) {
            _ = $;
          });
        _defined.set(name, {
          $: $,
          _: _
        });
      }
      return _defined.get(name).$;
    };
    var _augment = attributesObserver(_whenDefined2, MutationObserver$1);
    var _override = null;
    getOwnPropertyNames(self).filter(function (k) {
      return /^HTML.*Element$/.test(k);
    }).forEach(function (k) {
      var HTMLElement = self[k];
      function HTMLBuiltIn() {
        var constructor = this.constructor;
        if (!_classes.has(constructor)) throw new TypeError$1('Illegal constructor');
        var _classes$get = _classes.get(constructor),
          is = _classes$get.is,
          tag = _classes$get.tag;
        if (is) {
          if (_override) return _augment(_override, is);
          var element = _createElement.call(document$1, tag);
          element.setAttribute('is', is);
          return _augment(setPrototypeOf(element, constructor.prototype), is);
        } else return construct.call(this, HTMLElement, [], constructor);
      }

      defineProperty(HTMLBuiltIn.prototype = HTMLElement.prototype, 'constructor', {
        value: HTMLBuiltIn
      });
      defineProperty(self, k, {
        value: HTMLBuiltIn
      });
    });
    document$1.createElement = function (name, options) {
      var is = options && options.is;
      if (is) {
        var Class = _registry.get(is);
        if (Class && _classes.get(Class).tag === name) return new Class();
      }
      var element = _createElement.call(document$1, name);
      if (is) element.setAttribute('is', is);
      return element;
    };
    customElements.get = getCE;
    customElements.whenDefined = _whenDefined2;
    customElements.upgrade = function (element) {
      var is = element.getAttribute('is');
      if (is) {
        var _constructor = _registry.get(is);
        if (_constructor) {
          _augment(setPrototypeOf(element, _constructor.prototype), is);
          // apparently unnecessary because this is handled by qsa observer
          // if (element.isConnected && element.connectedCallback)
          //   element.connectedCallback();
          return;
        }
      }
      upgrade.call(customElements, element);
    };
    customElements.define = function (is, Class, options) {
      if (getCE(is)) throw new Error("'".concat(is, "' has already been defined as a custom element"));
      var selector;
      var tag = options && options["extends"];
      _classes.set(Class, tag ? {
        is: is,
        tag: tag
      } : {
        is: '',
        tag: is
      });
      if (tag) {
        selector = "".concat(tag, "[is=\"").concat(is, "\"]");
        _prototypes.set(selector, Class.prototype);
        _registry.set(is, Class);
        _query.push(selector);
      } else {
        define.apply(customElements, arguments);
        shadowed.push(selector = is);
      }
      _whenDefined2(is).then(function () {
        if (tag) {
          _parse(document$1.querySelectorAll(selector));
          shadows.forEach(_parseShadow, [selector]);
        } else parseShadowed(document$1.querySelectorAll(selector));
      });
      _defined.get(is)._(Class);
    };
  }

})();


/***/ }),

/***/ "./src/element-utilities.js":
/*!**********************************!*\
  !*** ./src/element-utilities.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   attributeStateTransformers: () => (/* binding */ attributeStateTransformers),
/* harmony export */   attributeValueTransformers: () => (/* binding */ attributeValueTransformers),
/* harmony export */   disableButton: () => (/* binding */ disableButton),
/* harmony export */   enableButton: () => (/* binding */ enableButton),
/* harmony export */   replaceAttributeData: () => (/* binding */ replaceAttributeData)
/* harmony export */ });
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var attributeValueTransformers = {
  bool: function bool(value) {
    return value !== null;
  },
  number: function number(value) {
    return +value;
  },
  string: function string(value) {
    return value !== null && value !== void 0 ? value : null;
  }
};
var attributeStateTransformers = {
  bool: function bool(element, attribute, value) {
    if (value) {
      element.setAttribute(attribute, attribute);
    } else {
      element.removeAttribute(attribute);
    }
  },
  number: function number(element, attribute, value) {
    element.setAttribute(attribute, value);
  },
  string: function string(element, attribute, value) {
    if (value) {
      element.setAttribute(attribute, value);
    } else {
      element.removeAttribute(attribute);
    }
  }
};
function enableButton(button) {
  button.removeAttribute('disabled');
  button.classList.remove('disabled');
}
function disableButton(button) {
  button.setAttribute('disabled', 'disabled');
  button.classList.add('disabled');
}
function replaceAttributeData(elements, toReplace, replaceWith) {
  elements.forEach(function (element) {
    _toConsumableArray(element.attributes).map(function (attribute) {
      if (attribute.value.includes(toReplace)) {
        attribute.value = attribute.value.replace(toReplace, replaceWith);
      }
    });
    if (element.tagName === 'TEMPLATE') {
      replaceAttributeData(element.content.querySelectorAll('*'), toReplace, replaceWith);
    }
  });
}

/***/ }),

/***/ "./src/elements/add-button.js":
/*!************************************!*\
  !*** ./src/elements/add-button.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   OnlinqFormCollectionAddButtonElement: () => (/* binding */ OnlinqFormCollectionAddButtonElement)
/* harmony export */ });
/* harmony import */ var _collection_button__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./collection-button */ "./src/elements/collection-button.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var OnlinqFormCollectionAddButtonElement = /*#__PURE__*/function (_OnlinqFormCollection) {
  _inherits(OnlinqFormCollectionAddButtonElement, _OnlinqFormCollection);
  var _super = _createSuper(OnlinqFormCollectionAddButtonElement);
  function OnlinqFormCollectionAddButtonElement() {
    var _this;
    _classCallCheck(this, OnlinqFormCollectionAddButtonElement);
    var clickCallback = function clickCallback() {
      if (_this.collection) {
        _this.collection.addEntry();
      }
    };
    return _this = _super.call(this, clickCallback);
  }
  return _createClass(OnlinqFormCollectionAddButtonElement);
}(_collection_button__WEBPACK_IMPORTED_MODULE_0__.OnlinqFormCollectionButtonElement);
customElements.define('onlinq-collection-add', OnlinqFormCollectionAddButtonElement, {
  "extends": 'button'
});

/***/ }),

/***/ "./src/elements/collection-button.js":
/*!*******************************************!*\
  !*** ./src/elements/collection-button.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   OnlinqFormCollectionButtonElement: () => (/* binding */ OnlinqFormCollectionButtonElement)
/* harmony export */ });
/* harmony import */ var _element_utilities__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../element-utilities */ "./src/element-utilities.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }
function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct.bind(); } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _isNativeFunction(fn) { try { return Function.toString.call(fn).indexOf("[native code]") !== -1; } catch (e) { return typeof fn === "function"; } }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _classPrivateFieldInitSpec(obj, privateMap, value) { _checkPrivateRedeclaration(obj, privateMap); privateMap.set(obj, value); }
function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }
function _classPrivateFieldGet(receiver, privateMap) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get"); return _classApplyDescriptorGet(receiver, descriptor); }
function _classApplyDescriptorGet(receiver, descriptor) { if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }
function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set"); _classApplyDescriptorSet(receiver, descriptor, value); return value; }
function _classExtractFieldDescriptor(receiver, privateMap, action) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to " + action + " private field on non-instance"); } return privateMap.get(receiver); }
function _classApplyDescriptorSet(receiver, descriptor, value) { if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } }

var _clickCallback = /*#__PURE__*/new WeakMap();
var _collection = /*#__PURE__*/new WeakMap();
var _observer = /*#__PURE__*/new WeakMap();
var _mutationCallback = /*#__PURE__*/new WeakMap();
var OnlinqFormCollectionButtonElement = /*#__PURE__*/function (_HTMLButtonElement) {
  _inherits(OnlinqFormCollectionButtonElement, _HTMLButtonElement);
  var _super = _createSuper(OnlinqFormCollectionButtonElement);
  function OnlinqFormCollectionButtonElement(clickCallback) {
    var _this;
    _classCallCheck(this, OnlinqFormCollectionButtonElement);
    _this = _super.call(this);
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _clickCallback, {
      writable: true,
      value: null
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _collection, {
      writable: true,
      value: null
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _observer, {
      writable: true,
      value: null
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _mutationCallback, {
      writable: true,
      value: function value(records) {
        var _iterator = _createForOfIteratorHelper(records),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var record = _step.value;
            if ('data-collection' === record.attributeName) {
              _this.collectionName = _this.getAttribute('data-collection');
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }
    });
    _classPrivateFieldSet(_assertThisInitialized(_this), _clickCallback, clickCallback);
    return _this;
  }
  _createClass(OnlinqFormCollectionButtonElement, [{
    key: "connectedCallback",
    value: function connectedCallback() {
      var _this$getAttribute;
      this.collectionName = (_this$getAttribute = this.getAttribute('data-collection')) !== null && _this$getAttribute !== void 0 ? _this$getAttribute : null;
      _classPrivateFieldSet(this, _observer, new MutationObserver(_classPrivateFieldGet(this, _mutationCallback)));
      _classPrivateFieldGet(this, _observer).observe(this, {
        attributes: true
      });
      this.addEventListener('click', _classPrivateFieldGet(this, _clickCallback));
    }
  }, {
    key: "disconnectedCallback",
    value: function disconnectedCallback() {
      _classPrivateFieldGet(this, _observer).disconnect();
      this.removeEventListener('click', _classPrivateFieldGet(this, _clickCallback));
    }
  }, {
    key: "collection",
    get: function get() {
      return _classPrivateFieldGet(this, _collection);
    },
    set: function set(collection) {
      _classPrivateFieldSet(this, _collection, collection);
      if (!_classPrivateFieldGet(this, _collection)) {
        var _this$getRootNode$hos;
        var host = (_this$getRootNode$hos = this.getRootNode().host) !== null && _this$getRootNode$hos !== void 0 ? _this$getRootNode$hos : null;
        if (host && host.nodeName === 'ONLINQ-COLLECTION') {
          _classPrivateFieldSet(this, _collection, host);
        } else {
          console.error('A collection button was created without a matching collection.');
        }
      }
      var value = _element_utilities__WEBPACK_IMPORTED_MODULE_0__.attributeValueTransformers.string(this.collectionName);
      var isFresh = value === this.getAttribute('data-collection');
      if (!isFresh) {
        _element_utilities__WEBPACK_IMPORTED_MODULE_0__.attributeStateTransformers.string(this, 'data-collection', this.collectionName);
      }
    }
  }, {
    key: "collectionName",
    get: function get() {
      var _classPrivateFieldGet2;
      return (_classPrivateFieldGet2 = _classPrivateFieldGet(this, _collection)) === null || _classPrivateFieldGet2 === void 0 ? void 0 : _classPrivateFieldGet2.name;
    },
    set: function set(collectionName) {
      this.collection = collectionName ? document.querySelector("onlinq-collection[name=\"".concat(collectionName, "\"]")) : this.closest('onlinq-collection');
    }
  }]);
  return OnlinqFormCollectionButtonElement;
}( /*#__PURE__*/_wrapNativeSuper(HTMLButtonElement));

/***/ }),

/***/ "./src/elements/collection-entry-button.js":
/*!*************************************************!*\
  !*** ./src/elements/collection-entry-button.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   OnlinqFormCollectionEntryButtonElement: () => (/* binding */ OnlinqFormCollectionEntryButtonElement)
/* harmony export */ });
/* harmony import */ var _element_utilities__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../element-utilities */ "./src/element-utilities.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }
function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct.bind(); } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _isNativeFunction(fn) { try { return Function.toString.call(fn).indexOf("[native code]") !== -1; } catch (e) { return typeof fn === "function"; } }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _classPrivateFieldInitSpec(obj, privateMap, value) { _checkPrivateRedeclaration(obj, privateMap); privateMap.set(obj, value); }
function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }
function _classPrivateFieldGet(receiver, privateMap) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get"); return _classApplyDescriptorGet(receiver, descriptor); }
function _classApplyDescriptorGet(receiver, descriptor) { if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }
function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set"); _classApplyDescriptorSet(receiver, descriptor, value); return value; }
function _classExtractFieldDescriptor(receiver, privateMap, action) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to " + action + " private field on non-instance"); } return privateMap.get(receiver); }
function _classApplyDescriptorSet(receiver, descriptor, value) { if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } }

var _clickCallback = /*#__PURE__*/new WeakMap();
var _collectionEntry = /*#__PURE__*/new WeakMap();
var _observer = /*#__PURE__*/new WeakMap();
var _mutationCallback = /*#__PURE__*/new WeakMap();
var OnlinqFormCollectionEntryButtonElement = /*#__PURE__*/function (_HTMLButtonElement) {
  _inherits(OnlinqFormCollectionEntryButtonElement, _HTMLButtonElement);
  var _super = _createSuper(OnlinqFormCollectionEntryButtonElement);
  function OnlinqFormCollectionEntryButtonElement(clickCallback) {
    var _this;
    _classCallCheck(this, OnlinqFormCollectionEntryButtonElement);
    _this = _super.call(this);
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _clickCallback, {
      writable: true,
      value: null
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _collectionEntry, {
      writable: true,
      value: null
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _observer, {
      writable: true,
      value: null
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _mutationCallback, {
      writable: true,
      value: function value(records) {
        var _iterator = _createForOfIteratorHelper(records),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var record = _step.value;
            if ('data-collection' === record.attributeName) {
              _this.collectionName = _this.getAttribute('data-collection');
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }
    });
    _classPrivateFieldSet(_assertThisInitialized(_this), _clickCallback, clickCallback);
    return _this;
  }
  _createClass(OnlinqFormCollectionEntryButtonElement, [{
    key: "connectedCallback",
    value: function connectedCallback() {
      var _this$getAttribute;
      this.collectionName = (_this$getAttribute = this.getAttribute('data-collection')) !== null && _this$getAttribute !== void 0 ? _this$getAttribute : null;
      _classPrivateFieldSet(this, _observer, new MutationObserver(_classPrivateFieldGet(this, _mutationCallback)));
      _classPrivateFieldGet(this, _observer).observe(this, {
        attributes: true
      });
      this.addEventListener('click', _classPrivateFieldGet(this, _clickCallback));
    }
  }, {
    key: "disconnectedCallback",
    value: function disconnectedCallback() {
      _classPrivateFieldGet(this, _observer).disconnect();
      this.removeEventListener('click', _classPrivateFieldGet(this, _clickCallback));
    }
  }, {
    key: "collection",
    get: function get() {
      var _this$collectionEntry;
      return (_this$collectionEntry = this.collectionEntry) === null || _this$collectionEntry === void 0 ? void 0 : _this$collectionEntry.collection;
    }
  }, {
    key: "collectionEntry",
    get: function get() {
      return _classPrivateFieldGet(this, _collectionEntry);
    },
    set: function set(collectionEntry) {
      _classPrivateFieldSet(this, _collectionEntry, collectionEntry);
      if (!_classPrivateFieldGet(this, _collectionEntry) && this.isConnected) {
        var _this$getRootNode$hos;
        var host = (_this$getRootNode$hos = this.getRootNode().host) !== null && _this$getRootNode$hos !== void 0 ? _this$getRootNode$hos : null;
        if (host && host.nodeName === 'ONLINQ-COLLECTION-ENTRY') {
          _classPrivateFieldSet(this, _collectionEntry, host);
        } else {
          console.error('A collection entry button was created without a matching collection entry.');
        }
      }
      var value = _element_utilities__WEBPACK_IMPORTED_MODULE_0__.attributeValueTransformers.string(this.collectionName);
      var isFresh = value === this.getAttribute('data-collection');
      if (!isFresh) {
        _element_utilities__WEBPACK_IMPORTED_MODULE_0__.attributeStateTransformers.string(this, 'data-collection', this.collectionName);
      }
    }
  }, {
    key: "collectionName",
    get: function get() {
      var _this$collection;
      return (_this$collection = this.collection) === null || _this$collection === void 0 ? void 0 : _this$collection.collectionName;
    },
    set: function set(collectionName) {
      this.collectionEntry = collectionName ? this.closest("onlinq-collection[name=\"".concat(collectionName, "\"] > onlinq-collection-entry")) : this.closest('onlinq-collection-entry');
    }
  }]);
  return OnlinqFormCollectionEntryButtonElement;
}( /*#__PURE__*/_wrapNativeSuper(HTMLButtonElement));

/***/ }),

/***/ "./src/elements/collection-entry.js":
/*!******************************************!*\
  !*** ./src/elements/collection-entry.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   OnlinqFormCollectionEntryElement: () => (/* binding */ OnlinqFormCollectionEntryElement)
/* harmony export */ });
/* harmony import */ var _element_utilities__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../element-utilities */ "./src/element-utilities.js");
/* harmony import */ var _collection_entry_html__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./collection-entry.html */ "./src/elements/collection-entry.html");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var _class;
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }
function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct.bind(); } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _isNativeFunction(fn) { try { return Function.toString.call(fn).indexOf("[native code]") !== -1; } catch (e) { return typeof fn === "function"; } }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _classPrivateMethodInitSpec(obj, privateSet) { _checkPrivateRedeclaration(obj, privateSet); privateSet.add(obj); }
function _classPrivateFieldInitSpec(obj, privateMap, value) { _checkPrivateRedeclaration(obj, privateMap); privateMap.set(obj, value); }
function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set"); _classApplyDescriptorSet(receiver, descriptor, value); return value; }
function _classApplyDescriptorSet(receiver, descriptor, value) { if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } }
function _classPrivateFieldGet(receiver, privateMap) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get"); return _classApplyDescriptorGet(receiver, descriptor); }
function _classExtractFieldDescriptor(receiver, privateMap, action) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to " + action + " private field on non-instance"); } return privateMap.get(receiver); }
function _classApplyDescriptorGet(receiver, descriptor) { if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }
function _classPrivateMethodGet(receiver, privateSet, fn) { if (!privateSet.has(receiver)) { throw new TypeError("attempted to get private field on non-instance"); } return fn; }


var _actions = /*#__PURE__*/new WeakMap();
var _collection = /*#__PURE__*/new WeakMap();
var _index = /*#__PURE__*/new WeakMap();
var _actionsContainer = /*#__PURE__*/new WeakMap();
var _deleteContainer = /*#__PURE__*/new WeakMap();
var _labelContainers = /*#__PURE__*/new WeakMap();
var _moveContainer = /*#__PURE__*/new WeakMap();
var _observer = /*#__PURE__*/new WeakMap();
var _connectCollection = /*#__PURE__*/new WeakSet();
var _disconnectCollection = /*#__PURE__*/new WeakSet();
var _isPartOfEntry = /*#__PURE__*/new WeakSet();
var _renderShadowDom = /*#__PURE__*/new WeakSet();
var _mapLabels = /*#__PURE__*/new WeakSet();
var _updateActionsContainer = /*#__PURE__*/new WeakSet();
var _updateAttribute = /*#__PURE__*/new WeakSet();
var _updateDeleteContainer = /*#__PURE__*/new WeakSet();
var _updateMoveContainers = /*#__PURE__*/new WeakSet();
var _updateLabels = /*#__PURE__*/new WeakSet();
var _collectionDeletePolicyChangedListener = /*#__PURE__*/new WeakMap();
var _collectionMovePolicyChangedListener = /*#__PURE__*/new WeakMap();
var _mutationCallback = /*#__PURE__*/new WeakMap();
var OnlinqFormCollectionEntryElement = /*#__PURE__*/function (_HTMLElement) {
  _inherits(OnlinqFormCollectionEntryElement, _HTMLElement);
  var _super = _createSuper(OnlinqFormCollectionEntryElement);
  function OnlinqFormCollectionEntryElement() {
    var _this;
    _classCallCheck(this, OnlinqFormCollectionEntryElement);
    _this = _super.call(this);
    _classPrivateMethodInitSpec(_assertThisInitialized(_this), _updateLabels);
    _classPrivateMethodInitSpec(_assertThisInitialized(_this), _updateMoveContainers);
    _classPrivateMethodInitSpec(_assertThisInitialized(_this), _updateDeleteContainer);
    _classPrivateMethodInitSpec(_assertThisInitialized(_this), _updateAttribute);
    _classPrivateMethodInitSpec(_assertThisInitialized(_this), _updateActionsContainer);
    _classPrivateMethodInitSpec(_assertThisInitialized(_this), _mapLabels);
    _classPrivateMethodInitSpec(_assertThisInitialized(_this), _renderShadowDom);
    _classPrivateMethodInitSpec(_assertThisInitialized(_this), _isPartOfEntry);
    _classPrivateMethodInitSpec(_assertThisInitialized(_this), _disconnectCollection);
    _classPrivateMethodInitSpec(_assertThisInitialized(_this), _connectCollection);
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _actions, {
      writable: true,
      value: false
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _collection, {
      writable: true,
      value: null
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _index, {
      writable: true,
      value: null
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _actionsContainer, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _deleteContainer, {
      writable: true,
      value: null
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _labelContainers, {
      writable: true,
      value: []
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _moveContainer, {
      writable: true,
      value: null
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _observer, {
      writable: true,
      value: null
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _collectionDeletePolicyChangedListener, {
      writable: true,
      value: function value() {
        _classPrivateMethodGet(_assertThisInitialized(_this), _updateDeleteContainer, _updateDeleteContainer2).call(_assertThisInitialized(_this));
      }
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _collectionMovePolicyChangedListener, {
      writable: true,
      value: function value() {
        _classPrivateMethodGet(_assertThisInitialized(_this), _updateMoveContainers, _updateMoveContainers2).call(_assertThisInitialized(_this));
      }
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _mutationCallback, {
      writable: true,
      value: function value(records) {
        var _iterator = _createForOfIteratorHelper(records),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var record = _step.value;
            var _iterator2 = _createForOfIteratorHelper(record.addedNodes),
              _step2;
            try {
              for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                var _node = _step2.value;
                if (!(_node instanceof HTMLElement) || !_classPrivateMethodGet(_assertThisInitialized(_this), _isPartOfEntry, _isPartOfEntry2).call(_assertThisInitialized(_this), _node)) {
                  continue;
                }
                if (_node.hasAttribute('data-collection-label')) {
                  _classPrivateMethodGet(_assertThisInitialized(_this), _mapLabels, _mapLabels2).call(_assertThisInitialized(_this));
                }
              }
            } catch (err) {
              _iterator2.e(err);
            } finally {
              _iterator2.f();
            }
            for (var node in record.removedNodes) {
              if (_classPrivateFieldGet(_assertThisInitialized(_this), _labelContainers).includes(node)) {
                _classPrivateMethodGet(_assertThisInitialized(_this), _mapLabels, _mapLabels2).call(_assertThisInitialized(_this));
              }
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }
    });
    _this.attachShadow({
      mode: 'open'
    });
    return _this;
  }
  _createClass(OnlinqFormCollectionEntryElement, [{
    key: "connectedCallback",
    value: function connectedCallback() {
      var _this$getAttribute, _classPrivateFieldGet2, _this$getAttribute2;
      _classPrivateMethodGet(this, _renderShadowDom, _renderShadowDom2).call(this);

      // Update attributes if properties were changed before connecting the element to the DOM
      this.actions = this.hasAttribute('actions') || _classPrivateFieldGet(this, _actions);
      this.collectionName = (_this$getAttribute = this.getAttribute('collection')) !== null && _this$getAttribute !== void 0 ? _this$getAttribute : (_classPrivateFieldGet2 = _classPrivateFieldGet(this, _collection)) === null || _classPrivateFieldGet2 === void 0 ? void 0 : _classPrivateFieldGet2.name;
      this.index = (_this$getAttribute2 = this.getAttribute('collection-index')) !== null && _this$getAttribute2 !== void 0 ? _this$getAttribute2 : _classPrivateFieldGet(this, _index);
      if (_classPrivateFieldGet(this, _collection)) {
        _classPrivateMethodGet(this, _connectCollection, _connectCollection2).call(this, _classPrivateFieldGet(this, _collection));
      } else {
        console.error('A collection entry was created without a matching collection.');
      }
      _classPrivateMethodGet(this, _mapLabels, _mapLabels2).call(this);

      // Observe changes to DOM
      _classPrivateFieldSet(this, _observer, new MutationObserver(_classPrivateFieldGet(this, _mutationCallback)));
      _classPrivateFieldGet(this, _observer).observe(this, {
        childList: true,
        subtree: true
      });
      _classPrivateMethodGet(this, _updateActionsContainer, _updateActionsContainer2).call(this);
      _classPrivateMethodGet(this, _updateDeleteContainer, _updateDeleteContainer2).call(this);
      _classPrivateMethodGet(this, _updateMoveContainers, _updateMoveContainers2).call(this);
      _classPrivateMethodGet(this, _updateLabels, _updateLabels2).call(this);
    }
  }, {
    key: "disconnectedCallback",
    value: function disconnectedCallback() {
      _classPrivateFieldGet(this, _observer).disconnect();
      if (_classPrivateFieldGet(this, _collection)) {
        _classPrivateMethodGet(this, _disconnectCollection, _disconnectCollection2).call(this, _classPrivateFieldGet(this, _collection));
      }
    }
  }, {
    key: "attributeChangedCallback",
    value: function attributeChangedCallback(name, oldValue, newValue) {
      var behaviour = OnlinqFormCollectionEntryElement.observedAttributeBehaviours[name];
      var transformer = _element_utilities__WEBPACK_IMPORTED_MODULE_0__.attributeValueTransformers[behaviour.type];
      var value = transformer(newValue);
      var isFresh = value === this[behaviour.property];
      if (!isFresh) {
        this[behaviour.property] = value;
      }
    }
  }, {
    key: "actions",
    get: function get() {
      return _classPrivateFieldGet(this, _actions);
    },
    set: function set(actions) {
      var changed = _classPrivateFieldGet(this, _actions) !== actions;
      _classPrivateFieldSet(this, _actions, actions);
      _classPrivateMethodGet(this, _updateAttribute, _updateAttribute2).call(this, 'actions');
      if (changed) {
        _classPrivateMethodGet(this, _updateActionsContainer, _updateActionsContainer2).call(this);
      }
    }
  }, {
    key: "collection",
    get: function get() {
      return _classPrivateFieldGet(this, _collection);
    },
    set: function set(collection) {
      if (_classPrivateFieldGet(this, _collection) && _classPrivateFieldGet(this, _collection) !== collection) {
        _classPrivateMethodGet(this, _disconnectCollection, _disconnectCollection2).call(this, _classPrivateFieldGet(this, _collection));
      }
      _classPrivateFieldSet(this, _collection, collection);
      if (collection && _classPrivateFieldGet(this, _collection) !== collection) {
        _classPrivateMethodGet(this, _connectCollection, _connectCollection2).call(this, collection);
      }
      _classPrivateMethodGet(this, _updateAttribute, _updateAttribute2).call(this, 'collection');
    }
  }, {
    key: "collectionName",
    get: function get() {
      var _classPrivateFieldGet3, _classPrivateFieldGet4, _classPrivateFieldGet5;
      // Check both the property and DOM attribute since the property might not be initialized
      return (_classPrivateFieldGet3 = (_classPrivateFieldGet4 = _classPrivateFieldGet(this, _collection)) === null || _classPrivateFieldGet4 === void 0 ? void 0 : _classPrivateFieldGet4.name) !== null && _classPrivateFieldGet3 !== void 0 ? _classPrivateFieldGet3 : (_classPrivateFieldGet5 = _classPrivateFieldGet(this, _collection)) === null || _classPrivateFieldGet5 === void 0 ? void 0 : _classPrivateFieldGet5.getAttribute('name');
    },
    set: function set(collectionName) {
      this.collection = collectionName ? this.closest("onlinq-collection[name=\"".concat(collectionName, "\"]")) : this.closest('onlinq-collection');
    }
  }, {
    key: "index",
    get: function get() {
      return _classPrivateFieldGet(this, _index);
    },
    set: function set(nextIndex) {
      var _classPrivateFieldGet7, _classPrivateFieldGet8, _classPrivateFieldGet9;
      if (!nextIndex && 0 !== nextIndex) {
        return;
      }
      if (typeof nextIndex !== 'string') {
        nextIndex = nextIndex.toString();
      }
      var previousIndex = _classPrivateFieldGet(this, _index);
      if (nextIndex === previousIndex) {
        return;
      }
      _classPrivateFieldSet(this, _index, nextIndex);
      if (!_classPrivateFieldGet(this, _collection)) {
        return;
      } else if (!previousIndex) {
        var _classPrivateFieldGet6;
        previousIndex = (_classPrivateFieldGet6 = _classPrivateFieldGet(this, _collection)) === null || _classPrivateFieldGet6 === void 0 ? void 0 : _classPrivateFieldGet6.prototypeName;
      }
      _classPrivateMethodGet(this, _updateLabels, _updateLabels2).call(this);
      _classPrivateMethodGet(this, _updateAttribute, _updateAttribute2).call(this, 'collection-index');
      if (!_classPrivateFieldGet(this, _index)) {
        return;
      }
      var collectionId = (_classPrivateFieldGet7 = _classPrivateFieldGet(this, _collection)) === null || _classPrivateFieldGet7 === void 0 ? void 0 : _classPrivateFieldGet7.getAttribute('id');
      var collectionPrefix = ((_classPrivateFieldGet8 = _classPrivateFieldGet(this, _collection)) === null || _classPrivateFieldGet8 === void 0 ? void 0 : _classPrivateFieldGet8.prefix) || ((_classPrivateFieldGet9 = _classPrivateFieldGet(this, _collection)) === null || _classPrivateFieldGet9 === void 0 ? void 0 : _classPrivateFieldGet9.name);
      if (collectionId) {
        (0,_element_utilities__WEBPACK_IMPORTED_MODULE_0__.replaceAttributeData)(this.querySelectorAll('*'), "".concat(collectionId, "_").concat(previousIndex), "".concat(collectionId, "_").concat(nextIndex));
      }
      if (collectionPrefix) {
        (0,_element_utilities__WEBPACK_IMPORTED_MODULE_0__.replaceAttributeData)(this.querySelectorAll('*'), "".concat(collectionPrefix, "[").concat(previousIndex, "]"), "".concat(collectionPrefix, "[").concat(nextIndex, "]"));
      }
    }
  }, {
    key: "deleteEntry",
    value: function deleteEntry() {
      var _classPrivateFieldGet10;
      (_classPrivateFieldGet10 = _classPrivateFieldGet(this, _collection)) === null || _classPrivateFieldGet10 === void 0 || _classPrivateFieldGet10.deleteEntry(this);
    }
  }, {
    key: "moveDown",
    value: function moveDown() {
      var _classPrivateFieldGet11;
      (_classPrivateFieldGet11 = _classPrivateFieldGet(this, _collection)) === null || _classPrivateFieldGet11 === void 0 || _classPrivateFieldGet11.moveEntry(this, +this.index + 1);
    }
  }, {
    key: "moveUp",
    value: function moveUp() {
      var _classPrivateFieldGet12;
      (_classPrivateFieldGet12 = _classPrivateFieldGet(this, _collection)) === null || _classPrivateFieldGet12 === void 0 || _classPrivateFieldGet12.moveEntry(this, +this.index - 1);
    }
  }], [{
    key: "observedAttributes",
    get: function get() {
      return ['actions', 'collection', 'collection-index'];
    }
  }]);
  return OnlinqFormCollectionEntryElement;
}( /*#__PURE__*/_wrapNativeSuper(HTMLElement));
_class = OnlinqFormCollectionEntryElement;
function _connectCollection2(collection) {
  _classPrivateMethodGet(this, _updateDeleteContainer, _updateDeleteContainer2).call(this);
  _classPrivateMethodGet(this, _updateMoveContainers, _updateMoveContainers2).call(this);
  collection.addEventListener('deletePolicyChanged', _classPrivateFieldGet(this, _collectionDeletePolicyChangedListener));
  collection.addEventListener('movePolicyChanged', _classPrivateFieldGet(this, _collectionMovePolicyChangedListener));
}
function _disconnectCollection2(collection) {
  _classPrivateMethodGet(this, _updateDeleteContainer, _updateDeleteContainer2).call(this);
  _classPrivateMethodGet(this, _updateMoveContainers, _updateMoveContainers2).call(this);
  collection.removeEventListener('deletePolicyChanged', _classPrivateFieldGet(this, _collectionDeletePolicyChangedListener));
  collection.removeEventListener('movePolicyChanged', _classPrivateFieldGet(this, _collectionMovePolicyChangedListener));
}
function _isPartOfEntry2(element) {
  var _element$getAttribute;
  var elementCollectionName = (_element$getAttribute = element.getAttribute('collection')) !== null && _element$getAttribute !== void 0 ? _element$getAttribute : element.getAttribute('data-collection');
  return this.collectionName && elementCollectionName === this.collectionName || !elementCollectionName && element.closest('onlinq-collection-entry') === this;
}
function _renderShadowDom2() {
  this.shadowRoot.innerHTML = _collection_entry_html__WEBPACK_IMPORTED_MODULE_1__["default"];
  _classPrivateFieldSet(this, _actionsContainer, this.shadowRoot.querySelector('[data-actions-container]'));
  _classPrivateFieldSet(this, _deleteContainer, this.shadowRoot.querySelector('[data-delete-container]'));
  _classPrivateFieldSet(this, _moveContainer, this.shadowRoot.querySelector('[data-move-container]'));
}
function _mapLabels2() {
  var _this2 = this;
  _classPrivateFieldSet(this, _labelContainers, []);
  var index = 0;
  this.querySelectorAll(':scope [data-collection-label]').forEach(function (labelContainer) {
    if (_classPrivateMethodGet(_this2, _isPartOfEntry, _isPartOfEntry2).call(_this2, labelContainer)) {
      _classPrivateFieldGet(_this2, _labelContainers).push(labelContainer);
      index++;
    }
  });
  console.log(this);
}
function _updateActionsContainer2() {
  if (_classPrivateFieldGet(this, _actionsContainer)) {
    if (_classPrivateFieldGet(this, _actions)) {
      _classPrivateFieldGet(this, _actionsContainer).style.display = 'block';
    } else {
      _classPrivateFieldGet(this, _actionsContainer).style.display = 'none';
    }
  }
}
function _updateAttribute2(attributeName) {
  var behaviour = _class.observedAttributeBehaviours[attributeName];
  var transformer = _element_utilities__WEBPACK_IMPORTED_MODULE_0__.attributeStateTransformers[behaviour.type];
  transformer(this, attributeName, this[behaviour.property]);
}
function _updateDeleteContainer2() {
  if (_classPrivateFieldGet(this, _deleteContainer)) {
    var _this$collection$allo, _this$collection;
    if ((_this$collection$allo = (_this$collection = this.collection) === null || _this$collection === void 0 ? void 0 : _this$collection.allowDelete) !== null && _this$collection$allo !== void 0 ? _this$collection$allo : true) {
      _classPrivateFieldGet(this, _deleteContainer).style.removeProperty('display');
    } else {
      _classPrivateFieldGet(this, _deleteContainer).style.display = 'none';
    }
  }
}
function _updateMoveContainers2() {
  if (_classPrivateFieldGet(this, _moveContainer)) {
    var _this$collection$allo2, _this$collection2;
    if ((_this$collection$allo2 = (_this$collection2 = this.collection) === null || _this$collection2 === void 0 ? void 0 : _this$collection2.allowMove) !== null && _this$collection$allo2 !== void 0 ? _this$collection$allo2 : true) {
      _classPrivateFieldGet(this, _moveContainer).style.removeProperty('display');
    } else {
      _classPrivateFieldGet(this, _moveContainer).style.display = 'none';
    }
  }
}
function _updateLabels2() {
  var _this3 = this;
  _classPrivateFieldGet(this, _labelContainers).forEach(function (container) {
    var format = container.dataset.collectionLabel || 'index';
    if (format === 'index0') {
      container.innerHTML = _classPrivateFieldGet(_this3, _index);
    } else {
      container.innerHTML = +_classPrivateFieldGet(_this3, _index) + 1;
    }
  });
}
_defineProperty(OnlinqFormCollectionEntryElement, "observedAttributeBehaviours", {
  'actions': {
    type: 'bool',
    property: 'actions'
  },
  'collection': {
    type: 'string',
    property: 'collectionName'
  },
  'collection-index': {
    type: 'string',
    property: 'index'
  }
});
customElements.define('onlinq-collection-entry', OnlinqFormCollectionEntryElement);

/***/ }),

/***/ "./src/elements/collection.js":
/*!************************************!*\
  !*** ./src/elements/collection.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   OnlinqFormCollectionElement: () => (/* binding */ OnlinqFormCollectionElement)
/* harmony export */ });
/* harmony import */ var _element_utilities__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../element-utilities */ "./src/element-utilities.js");
/* harmony import */ var _collection_html__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./collection.html */ "./src/elements/collection.html");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var _class;
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }
function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct.bind(); } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _isNativeFunction(fn) { try { return Function.toString.call(fn).indexOf("[native code]") !== -1; } catch (e) { return typeof fn === "function"; } }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _classPrivateMethodInitSpec(obj, privateSet) { _checkPrivateRedeclaration(obj, privateSet); privateSet.add(obj); }
function _classPrivateFieldInitSpec(obj, privateMap, value) { _checkPrivateRedeclaration(obj, privateMap); privateMap.set(obj, value); }
function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set"); _classApplyDescriptorSet(receiver, descriptor, value); return value; }
function _classApplyDescriptorSet(receiver, descriptor, value) { if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } }
function _classPrivateFieldGet(receiver, privateMap) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get"); return _classApplyDescriptorGet(receiver, descriptor); }
function _classExtractFieldDescriptor(receiver, privateMap, action) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to " + action + " private field on non-instance"); } return privateMap.get(receiver); }
function _classApplyDescriptorGet(receiver, descriptor) { if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }
function _classPrivateMethodGet(receiver, privateSet, fn) { if (!privateSet.has(receiver)) { throw new TypeError("attempted to get private field on non-instance"); } return fn; }


var _actionList = /*#__PURE__*/new WeakMap();
var _actions = /*#__PURE__*/new WeakMap();
var _max = /*#__PURE__*/new WeakMap();
var _min = /*#__PURE__*/new WeakMap();
var _name = /*#__PURE__*/new WeakMap();
var _prefix = /*#__PURE__*/new WeakMap();
var _prototypeActions = /*#__PURE__*/new WeakMap();
var _prototypeName = /*#__PURE__*/new WeakMap();
var _allowAdd = /*#__PURE__*/new WeakMap();
var _allowDelete = /*#__PURE__*/new WeakMap();
var _allowMove = /*#__PURE__*/new WeakMap();
var _entries = /*#__PURE__*/new WeakMap();
var _nextIndex = /*#__PURE__*/new WeakMap();
var _actionsContainer = /*#__PURE__*/new WeakMap();
var _addContainer = /*#__PURE__*/new WeakMap();
var _collectionContainer = /*#__PURE__*/new WeakMap();
var _placeholderContainer = /*#__PURE__*/new WeakMap();
var _prototypeTemplate = /*#__PURE__*/new WeakMap();
var _observer = /*#__PURE__*/new WeakMap();
var _connectEntry = /*#__PURE__*/new WeakSet();
var _createPrototype = /*#__PURE__*/new WeakSet();
var _disconnectEntry = /*#__PURE__*/new WeakSet();
var _isPartOfCollection = /*#__PURE__*/new WeakSet();
var _mapEntries = /*#__PURE__*/new WeakSet();
var _matchEntry = /*#__PURE__*/new WeakSet();
var _renderShadowDom = /*#__PURE__*/new WeakSet();
var _toggleAdd = /*#__PURE__*/new WeakSet();
var _toggleDelete = /*#__PURE__*/new WeakSet();
var _toggleMove = /*#__PURE__*/new WeakSet();
var _updateActionsContainer = /*#__PURE__*/new WeakSet();
var _updateAddContainer = /*#__PURE__*/new WeakSet();
var _updateAttribute = /*#__PURE__*/new WeakSet();
var _updateContentContainers = /*#__PURE__*/new WeakSet();
var _mutationCallback = /*#__PURE__*/new WeakMap();
var OnlinqFormCollectionElement = /*#__PURE__*/function (_HTMLElement) {
  _inherits(OnlinqFormCollectionElement, _HTMLElement);
  var _super = _createSuper(OnlinqFormCollectionElement);
  function OnlinqFormCollectionElement() {
    var _this;
    _classCallCheck(this, OnlinqFormCollectionElement);
    _this = _super.call(this);
    _classPrivateMethodInitSpec(_assertThisInitialized(_this), _updateContentContainers);
    _classPrivateMethodInitSpec(_assertThisInitialized(_this), _updateAttribute);
    _classPrivateMethodInitSpec(_assertThisInitialized(_this), _updateAddContainer);
    _classPrivateMethodInitSpec(_assertThisInitialized(_this), _updateActionsContainer);
    _classPrivateMethodInitSpec(_assertThisInitialized(_this), _toggleMove);
    _classPrivateMethodInitSpec(_assertThisInitialized(_this), _toggleDelete);
    _classPrivateMethodInitSpec(_assertThisInitialized(_this), _toggleAdd);
    _classPrivateMethodInitSpec(_assertThisInitialized(_this), _renderShadowDom);
    _classPrivateMethodInitSpec(_assertThisInitialized(_this), _matchEntry);
    _classPrivateMethodInitSpec(_assertThisInitialized(_this), _mapEntries);
    _classPrivateMethodInitSpec(_assertThisInitialized(_this), _isPartOfCollection);
    _classPrivateMethodInitSpec(_assertThisInitialized(_this), _disconnectEntry);
    _classPrivateMethodInitSpec(_assertThisInitialized(_this), _createPrototype);
    _classPrivateMethodInitSpec(_assertThisInitialized(_this), _connectEntry);
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _actionList, {
      writable: true,
      value: null
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _actions, {
      writable: true,
      value: false
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _max, {
      writable: true,
      value: 0
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _min, {
      writable: true,
      value: 0
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _name, {
      writable: true,
      value: null
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _prefix, {
      writable: true,
      value: null
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _prototypeActions, {
      writable: true,
      value: false
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _prototypeName, {
      writable: true,
      value: '__name__'
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _allowAdd, {
      writable: true,
      value: true
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _allowDelete, {
      writable: true,
      value: true
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _allowMove, {
      writable: true,
      value: true
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _entries, {
      writable: true,
      value: []
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _nextIndex, {
      writable: true,
      value: 0
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _actionsContainer, {
      writable: true,
      value: null
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _addContainer, {
      writable: true,
      value: null
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _collectionContainer, {
      writable: true,
      value: null
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _placeholderContainer, {
      writable: true,
      value: null
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _prototypeTemplate, {
      writable: true,
      value: null
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _observer, {
      writable: true,
      value: null
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _mutationCallback, {
      writable: true,
      value: function value(records) {
        var _iterator = _createForOfIteratorHelper(records),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var record = _step.value;
            var _iterator2 = _createForOfIteratorHelper(record.addedNodes),
              _step2;
            try {
              for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                var node = _step2.value;
                if (!(node instanceof HTMLElement) || !_classPrivateMethodGet(_assertThisInitialized(_this), _isPartOfCollection, _isPartOfCollection2).call(_assertThisInitialized(_this), node)) {
                  continue;
                }
                if (record.target === _assertThisInitialized(_this) && node.tagName === 'ONLINQ-COLLECTION-ENTRY') {
                  _classPrivateMethodGet(_assertThisInitialized(_this), _connectEntry, _connectEntry2).call(_assertThisInitialized(_this), node);
                }
                if (node.hasAttribute('data-collection-prototype')) {
                  _classPrivateFieldSet(_assertThisInitialized(_this), _prototypeTemplate, node);
                }
              }
            } catch (err) {
              _iterator2.e(err);
            } finally {
              _iterator2.f();
            }
            var _iterator3 = _createForOfIteratorHelper(record.removedNodes),
              _step3;
            try {
              for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
                var _node = _step3.value;
                if (_classPrivateFieldGet(_assertThisInitialized(_this), _entries).includes(_node)) {
                  _classPrivateMethodGet(_assertThisInitialized(_this), _disconnectEntry, _disconnectEntry2).call(_assertThisInitialized(_this), _node);
                }
                if (_node === _classPrivateFieldGet(_assertThisInitialized(_this), _prototypeTemplate)) {
                  _classPrivateFieldSet(_assertThisInitialized(_this), _prototypeTemplate, null);
                }
              }
            } catch (err) {
              _iterator3.e(err);
            } finally {
              _iterator3.f();
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }
    });
    _this.attachShadow({
      mode: 'open'
    });
    return _this;
  }
  _createClass(OnlinqFormCollectionElement, [{
    key: "connectedCallback",
    value: function connectedCallback() {
      var _this$getAttribute,
        _this$getAttribute2,
        _this$getAttribute3,
        _this$getAttribute4,
        _this2 = this;
      // Render the Shadow DOM
      _classPrivateMethodGet(this, _renderShadowDom, _renderShadowDom2).call(this);

      // Update attributes if properties were changed before connecting the element to the DOM
      this.actionList = (_this$getAttribute = this.getAttribute('actionlist')) !== null && _this$getAttribute !== void 0 ? _this$getAttribute : _classPrivateFieldGet(this, _actionList);
      this.actions = this.hasAttribute('actions') || _classPrivateFieldGet(this, _actions);
      this.max = this.hasAttribute('max') ? +this.getAttribute('max') : _classPrivateFieldGet(this, _max);
      this.min = this.hasAttribute('min') ? +this.getAttribute('min') : _classPrivateFieldGet(this, _min);
      this.name = (_this$getAttribute2 = this.getAttribute('name')) !== null && _this$getAttribute2 !== void 0 ? _this$getAttribute2 : _classPrivateFieldGet(this, _name);
      this.prefix = (_this$getAttribute3 = this.getAttribute('prefix')) !== null && _this$getAttribute3 !== void 0 ? _this$getAttribute3 : _classPrivateFieldGet(this, _prefix);
      this.prototypeActions = this.hasAttribute('prototype-actions') || _classPrivateFieldGet(this, _prototypeActions);
      this.prototypeName = (_this$getAttribute4 = this.getAttribute('prototype-name')) !== null && _this$getAttribute4 !== void 0 ? _this$getAttribute4 : _classPrivateFieldGet(this, _prototypeName);

      // Observe changes to DOM
      _classPrivateFieldSet(this, _observer, new MutationObserver(_classPrivateFieldGet(this, _mutationCallback)));
      _classPrivateFieldGet(this, _observer).observe(this, {
        childList: true,
        subtree: true
      });

      // Map existing entries
      _classPrivateMethodGet(this, _mapEntries, _mapEntries2).call(this);

      // Find initial prototype template
      if (!_classPrivateFieldGet(this, _prototypeTemplate)) {
        var _Array$from$filter$sh;
        this.prototypeTemplate = (_Array$from$filter$sh = Array.from(this.querySelectorAll('[data-collection-prototype]')).filter(function (template) {
          return _classPrivateMethodGet(_this2, _isPartOfCollection, _isPartOfCollection2).call(_this2, template);
        }).shift()) !== null && _Array$from$filter$sh !== void 0 ? _Array$from$filter$sh : null;
      }

      // Update the Shadow DOM
      _classPrivateMethodGet(this, _updateActionsContainer, _updateActionsContainer2).call(this);
      _classPrivateMethodGet(this, _updateContentContainers, _updateContentContainers2).call(this);
    }
  }, {
    key: "disconnectedCallback",
    value: function disconnectedCallback() {
      _classPrivateFieldGet(this, _observer).disconnect();
    }
  }, {
    key: "attributeChangedCallback",
    value: function attributeChangedCallback(name, oldValue, newValue) {
      var behaviour = OnlinqFormCollectionElement.observedAttributeBehaviours[name];
      var transformer = _element_utilities__WEBPACK_IMPORTED_MODULE_0__.attributeValueTransformers[behaviour.type];
      var value = transformer(newValue);
      var isFresh = value === this[behaviour.property];
      if (!isFresh) {
        this[behaviour.property] = value;
      }
    }
  }, {
    key: "actionList",
    get: function get() {
      return _classPrivateFieldGet(this, _actionList);
    },
    set: function set(actionList) {
      var _actionList2;
      actionList = (_actionList2 = actionList) === null || _actionList2 === void 0 ? void 0 : _actionList2.toLowerCase();
      var changed = _classPrivateFieldGet(this, _actionList) !== actionList;
      _classPrivateFieldSet(this, _actionList, actionList);
      _classPrivateMethodGet(this, _updateAttribute, _updateAttribute2).call(this, 'actionlist');
      if (changed) {
        var actions = actionList ? actionList.split(/\W/) : ['all'];
        var all = actions.includes('all');
        _classPrivateMethodGet(this, _toggleAdd, _toggleAdd2).call(this, all || actions.includes('add'));
        _classPrivateMethodGet(this, _toggleDelete, _toggleDelete2).call(this, all || actions.includes('delete'));
        _classPrivateMethodGet(this, _toggleMove, _toggleMove2).call(this, all || actions.includes('move'));
      }
    }
  }, {
    key: "actions",
    get: function get() {
      return _classPrivateFieldGet(this, _actions);
    },
    set: function set(actions) {
      var changed = _classPrivateFieldGet(this, _actions) !== actions;
      _classPrivateFieldSet(this, _actions, actions);
      _classPrivateMethodGet(this, _updateAttribute, _updateAttribute2).call(this, 'actions');
      if (changed) {
        _classPrivateMethodGet(this, _updateActionsContainer, _updateActionsContainer2).call(this);
      }
    }
  }, {
    key: "allowAdd",
    get: function get() {
      return _classPrivateFieldGet(this, _allowAdd);
    }
  }, {
    key: "allowDelete",
    get: function get() {
      return _classPrivateFieldGet(this, _allowDelete);
    }
  }, {
    key: "allowMove",
    get: function get() {
      return _classPrivateFieldGet(this, _allowMove);
    }
  }, {
    key: "entries",
    get: function get() {
      return _classPrivateFieldGet(this, _entries);
    }
  }, {
    key: "max",
    get: function get() {
      return _classPrivateFieldGet(this, _max);
    },
    set: function set(max) {
      var changed = _classPrivateFieldGet(this, _max) !== max;
      _classPrivateFieldSet(this, _max, max);
      _classPrivateMethodGet(this, _updateAttribute, _updateAttribute2).call(this, 'max');
      if (changed) {
        this.dispatchEvent(new CustomEvent('maxEntriesChanged'));
      }
    }
  }, {
    key: "min",
    get: function get() {
      return _classPrivateFieldGet(this, _min);
    },
    set: function set(min) {
      var changed = _classPrivateFieldGet(this, _min) !== min;
      _classPrivateFieldSet(this, _min, min);
      _classPrivateMethodGet(this, _updateAttribute, _updateAttribute2).call(this, 'min');
      if (changed) {
        this.dispatchEvent(new CustomEvent('minEntriesChanged'));
      }
    }
  }, {
    key: "name",
    get: function get() {
      return _classPrivateFieldGet(this, _name);
    },
    set: function set(name) {
      _classPrivateFieldSet(this, _name, name);
      _classPrivateMethodGet(this, _updateAttribute, _updateAttribute2).call(this, 'name');
    }
  }, {
    key: "nextIndex",
    get: function get() {
      return _classPrivateFieldGet(this, _nextIndex);
    }
  }, {
    key: "prefix",
    get: function get() {
      return _classPrivateFieldGet(this, _prefix);
    },
    set: function set(prefix) {
      _classPrivateFieldSet(this, _prefix, prefix);
      _classPrivateMethodGet(this, _updateAttribute, _updateAttribute2).call(this, 'prefix');
    }
  }, {
    key: "prototypeActions",
    get: function get() {
      return _classPrivateFieldGet(this, _prototypeActions);
    },
    set: function set(prototypeActions) {
      _classPrivateFieldSet(this, _prototypeActions, prototypeActions);
      _classPrivateMethodGet(this, _updateAttribute, _updateAttribute2).call(this, 'prototype-actions');
    }
  }, {
    key: "prototypeName",
    get: function get() {
      return _classPrivateFieldGet(this, _prototypeName);
    },
    set: function set(prototypeName) {
      _classPrivateFieldSet(this, _prototypeName, prototypeName);
      _classPrivateMethodGet(this, _updateAttribute, _updateAttribute2).call(this, 'prototype-name');
    }
  }, {
    key: "prototypeTemplate",
    get: function get() {
      return _classPrivateFieldGet(this, _prototypeTemplate);
    },
    set: function set(template) {
      _classPrivateFieldSet(this, _prototypeTemplate, template);
    }
  }, {
    key: "entry",
    value: function entry(index) {
      index = index.toString();
      return _classPrivateFieldGet(this, _entries).find(function (entry) {
        return entry.index === index;
      });
    }
  }, {
    key: "addEntry",
    value: function addEntry() {
      if (!_classPrivateFieldGet(this, _allowAdd)) {
        console.error('Unable to create a new entry because adding entries has been disabled on this collection.');
        return null;
      }
      if (!_classPrivateFieldGet(this, _prototypeTemplate)) {
        console.error('Unable to create a new entry because there is no prototype entry template present.');
        return null;
      }
      if (_classPrivateFieldGet(this, _max) !== 0 && _classPrivateFieldGet(this, _entries).length >= _classPrivateFieldGet(this, _max)) {
        console.error('Unable to create a new entry because the maximum amount of entries has been reached.');
        return null;
      }
      var entry = document.createElement('onlinq-collection-entry');
      entry.appendChild(_classPrivateMethodGet(this, _createPrototype, _createPrototype2).call(this));
      entry.collection = this;
      entry.actions = _classPrivateFieldGet(this, _prototypeActions);
      this.appendChild(entry);
      _classPrivateMethodGet(this, _connectEntry, _connectEntry2).call(this, entry);
      return entry;
    }
  }, {
    key: "deleteEntry",
    value: function deleteEntry(entry) {
      if (!_classPrivateFieldGet(this, _allowDelete)) {
        console.error('Unable to delete an entry because deleting entries has been disabled on this collection.');
        return;
      }
      if (_classPrivateFieldGet(this, _min) !== 0 && _classPrivateFieldGet(this, _entries).length <= _classPrivateFieldGet(this, _min)) {
        console.error('Unable to delete an entry because the minimum amount of entries has been reached.');
        return;
      }
      entry = _classPrivateMethodGet(this, _matchEntry, _matchEntry2).call(this, entry);
      if (!entry) {
        return;
      }
      this.dispatchEvent(new CustomEvent('beforeEntryRemoved', {
        detail: {
          entry: entry
        }
      }));
      entry.remove();
    }
  }, {
    key: "moveEntry",
    value: function moveEntry(entry, targetEntry) {
      if (!_classPrivateFieldGet(this, _allowMove)) {
        console.error('Unable to move an entry because moving entries has been disabled on this collection.');
        return;
      }
      entry = _classPrivateMethodGet(this, _matchEntry, _matchEntry2).call(this, entry);
      targetEntry = _classPrivateMethodGet(this, _matchEntry, _matchEntry2).call(this, targetEntry);
      if (!entry || !targetEntry) {
        return;
      }
      if (+entry.index > +targetEntry.index) {
        this.insertBefore(entry, targetEntry);
      } else {
        targetEntry.after(entry);
      }
    }
  }, {
    key: "swapEntry",
    value: function swapEntry(entry, targetEntry) {
      if (!_classPrivateFieldGet(this, _allowMove)) {
        console.error('Unable to swap an entry because moving entries has been disabled on this collection.');
        return;
      }
      entry = _classPrivateMethodGet(this, _matchEntry, _matchEntry2).call(this, entry);
      targetEntry = _classPrivateMethodGet(this, _matchEntry, _matchEntry2).call(this, targetEntry);
      if (!entry || !targetEntry) {
        return;
      }
      var entryPlaceholder = document.createElement('div');
      this.insertBefore(entryPlaceholder, entry);
      this.insertBefore(entry, targetEntry);
      this.insertBefore(targetEntry, entryPlaceholder);
      entryPlaceholder.remove();
    }
  }], [{
    key: "observedAttributes",
    get: function get() {
      return ['actions', 'actionlist', 'max', 'min', 'name', 'prefix', 'prototype-actions', 'prototype-name'];
    }
  }]);
  return OnlinqFormCollectionElement;
}( /*#__PURE__*/_wrapNativeSuper(HTMLElement));
_class = OnlinqFormCollectionElement;
function _connectEntry2(entry) {
  _classPrivateMethodGet(this, _mapEntries, _mapEntries2).call(this);
  this.dispatchEvent(new CustomEvent('entryAdded', {
    detail: {
      entry: entry
    }
  }));
  _classPrivateMethodGet(this, _updateContentContainers, _updateContentContainers2).call(this);
}
function _createPrototype2() {
  var _classPrivateFieldGet2, _classPrivateFieldGet3;
  return (_classPrivateFieldGet2 = (_classPrivateFieldGet3 = _classPrivateFieldGet(this, _prototypeTemplate)) === null || _classPrivateFieldGet3 === void 0 ? void 0 : _classPrivateFieldGet3.content.cloneNode(true)) !== null && _classPrivateFieldGet2 !== void 0 ? _classPrivateFieldGet2 : false;
}
function _disconnectEntry2(entry) {
  _classPrivateMethodGet(this, _mapEntries, _mapEntries2).call(this);
  this.dispatchEvent(new CustomEvent('entryRemoved', {
    detail: {
      entry: entry
    }
  }));
  _classPrivateMethodGet(this, _updateContentContainers, _updateContentContainers2).call(this);
}
function _isPartOfCollection2(element) {
  var _element$getAttribute;
  var collectionName = (_element$getAttribute = element.getAttribute('collection')) !== null && _element$getAttribute !== void 0 ? _element$getAttribute : element.getAttribute('data-collection');
  return collectionName === this.name || !collectionName && element.closest('onlinq-collection') === this;
}
function _mapEntries2() {
  var _this3 = this;
  _classPrivateFieldSet(this, _entries, []);
  var index = 0;
  this.querySelectorAll(':scope > onlinq-collection-entry').forEach(function (entry) {
    if (!entry.hasAttribute('collection-index') || +entry.getAttribute('collection-index') !== index) {
      entry.setAttribute('collection-index', index.toString());
    }
    _classPrivateFieldGet(_this3, _entries).push(entry);
    index++;
  });
  _classPrivateFieldSet(this, _nextIndex, index);
}
function _matchEntry2(value) {
  if (value instanceof HTMLElement && value.tagName === 'ONLINQ-COLLECTION-ENTRY') {
    if (value.collection === this) {
      return value;
    }
    console.error('Invalid collection element, it\'s not part of this collection.');
  } else {
    var entry = this.entry(value);
    if (entry) {
      return entry;
    }
    console.error('Invalid entry index: ' + value);
  }
  return null;
}
function _renderShadowDom2() {
  this.shadowRoot.innerHTML = _collection_html__WEBPACK_IMPORTED_MODULE_1__["default"];
  _classPrivateFieldSet(this, _actionsContainer, this.shadowRoot.querySelector('[data-actions-container]'));
  _classPrivateFieldSet(this, _addContainer, this.shadowRoot.querySelector('[data-add-container]'));
  _classPrivateFieldSet(this, _collectionContainer, this.shadowRoot.querySelector('[data-collection-container]'));
  _classPrivateFieldSet(this, _placeholderContainer, this.shadowRoot.querySelector('[data-placeholder-container]'));
}
function _toggleAdd2(allowAdd) {
  var changed = _classPrivateFieldGet(this, _allowAdd) !== allowAdd;
  _classPrivateFieldSet(this, _allowAdd, allowAdd);
  if (changed) {
    _classPrivateMethodGet(this, _updateAddContainer, _updateAddContainer2).call(this);
    this.dispatchEvent(new CustomEvent('addPolicyChanged'));
  }
}
function _toggleDelete2(allowDelete) {
  var changed = _classPrivateFieldGet(this, _allowDelete) !== allowDelete;
  _classPrivateFieldSet(this, _allowDelete, allowDelete);
  if (changed) {
    this.dispatchEvent(new CustomEvent('deletePolicyChanged'));
  }
}
function _toggleMove2(allowMove) {
  var changed = _classPrivateFieldGet(this, _allowMove) !== allowMove;
  _classPrivateFieldSet(this, _allowMove, allowMove);
  if (changed) {
    this.dispatchEvent(new CustomEvent('movePolicyChanged'));
  }
}
function _updateActionsContainer2() {
  if (_classPrivateFieldGet(this, _actionsContainer)) {
    if (_classPrivateFieldGet(this, _actions)) {
      _classPrivateFieldGet(this, _actionsContainer).style.display = 'block';
    } else {
      _classPrivateFieldGet(this, _actionsContainer).style.display = 'none';
    }
  }
}
function _updateAddContainer2() {
  if (_classPrivateFieldGet(this, _addContainer)) {
    if (_classPrivateFieldGet(this, _allowAdd)) {
      _classPrivateFieldGet(this, _addContainer).style.removeProperty('display');
    } else {
      _classPrivateFieldGet(this, _addContainer).style.display = 'none';
    }
  }
}
function _updateAttribute2(attributeName) {
  var _this$getAttribute5;
  var behaviour = _class.observedAttributeBehaviours[attributeName];
  var stateTransformer = _element_utilities__WEBPACK_IMPORTED_MODULE_0__.attributeStateTransformers[behaviour.type];
  var valueTransformer = _element_utilities__WEBPACK_IMPORTED_MODULE_0__.attributeValueTransformers[behaviour.type];
  var attributeValue = valueTransformer((_this$getAttribute5 = this.getAttribute(attributeName)) !== null && _this$getAttribute5 !== void 0 ? _this$getAttribute5 : null);
  if (attributeValue !== this[behaviour.property] && !(null === attributeValue && this[behaviour.property] === behaviour.defaultValue)) {
    stateTransformer(this, attributeName, this[behaviour.property]);
  }
}
function _updateContentContainers2() {
  var entryCount = _classPrivateFieldGet(this, _entries).length;
  if (entryCount) {
    _classPrivateFieldGet(this, _collectionContainer).style.display = 'block';
    _classPrivateFieldGet(this, _placeholderContainer).style.display = 'none';
  } else {
    _classPrivateFieldGet(this, _collectionContainer).style.display = 'none';
    _classPrivateFieldGet(this, _placeholderContainer).style.display = 'block';
  }
}
_defineProperty(OnlinqFormCollectionElement, "observedAttributeBehaviours", {
  'actionlist': {
    type: 'string',
    property: 'actionList'
  },
  'actions': {
    type: 'bool',
    property: 'actions'
  },
  'max': {
    type: 'number',
    property: 'max',
    defaultValue: 0
  },
  'min': {
    type: 'number',
    property: 'min',
    defaultValue: 0
  },
  'name': {
    type: 'string',
    property: 'name'
  },
  'prefix': {
    type: 'string',
    property: 'prefix'
  },
  'prototype-actions': {
    type: 'bool',
    property: 'prototypeActions'
  },
  'prototype-name': {
    type: 'string',
    property: 'prototypeName',
    defaultValue: '__name__'
  }
});
customElements.define('onlinq-collection', OnlinqFormCollectionElement);

/***/ }),

/***/ "./src/elements/delete-button.js":
/*!***************************************!*\
  !*** ./src/elements/delete-button.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   OnlinqFormCollectionDeleteButtonElement: () => (/* binding */ OnlinqFormCollectionDeleteButtonElement)
/* harmony export */ });
/* harmony import */ var _collection_entry_button__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./collection-entry-button */ "./src/elements/collection-entry-button.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var OnlinqFormCollectionDeleteButtonElement = /*#__PURE__*/function (_OnlinqFormCollection) {
  _inherits(OnlinqFormCollectionDeleteButtonElement, _OnlinqFormCollection);
  var _super = _createSuper(OnlinqFormCollectionDeleteButtonElement);
  function OnlinqFormCollectionDeleteButtonElement() {
    var _this;
    _classCallCheck(this, OnlinqFormCollectionDeleteButtonElement);
    var clickCallback = function clickCallback() {
      if (_this.collectionEntry) {
        _this.collectionEntry.deleteEntry();
      }
    };
    return _this = _super.call(this, clickCallback);
  }
  return _createClass(OnlinqFormCollectionDeleteButtonElement);
}(_collection_entry_button__WEBPACK_IMPORTED_MODULE_0__.OnlinqFormCollectionEntryButtonElement);
customElements.define('onlinq-collection-delete', OnlinqFormCollectionDeleteButtonElement, {
  "extends": 'button'
});

/***/ }),

/***/ "./src/elements/move-down-button.js":
/*!******************************************!*\
  !*** ./src/elements/move-down-button.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   OnlinqFormCollectionMoveDownButtonElement: () => (/* binding */ OnlinqFormCollectionMoveDownButtonElement)
/* harmony export */ });
/* harmony import */ var _collection_entry_button__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./collection-entry-button */ "./src/elements/collection-entry-button.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var OnlinqFormCollectionMoveDownButtonElement = /*#__PURE__*/function (_OnlinqFormCollection) {
  _inherits(OnlinqFormCollectionMoveDownButtonElement, _OnlinqFormCollection);
  var _super = _createSuper(OnlinqFormCollectionMoveDownButtonElement);
  function OnlinqFormCollectionMoveDownButtonElement() {
    var _this;
    _classCallCheck(this, OnlinqFormCollectionMoveDownButtonElement);
    var clickCallback = function clickCallback() {
      if (_this.collectionEntry) {
        _this.collectionEntry.moveDown();
      }
    };
    return _this = _super.call(this, clickCallback);
  }
  return _createClass(OnlinqFormCollectionMoveDownButtonElement);
}(_collection_entry_button__WEBPACK_IMPORTED_MODULE_0__.OnlinqFormCollectionEntryButtonElement);
customElements.define('onlinq-collection-move-down', OnlinqFormCollectionMoveDownButtonElement, {
  "extends": 'button'
});

/***/ }),

/***/ "./src/elements/move-up-button.js":
/*!****************************************!*\
  !*** ./src/elements/move-up-button.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   OnlinqFormCollectionMoveUpButtonElement: () => (/* binding */ OnlinqFormCollectionMoveUpButtonElement)
/* harmony export */ });
/* harmony import */ var _collection_entry_button__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./collection-entry-button */ "./src/elements/collection-entry-button.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var OnlinqFormCollectionMoveUpButtonElement = /*#__PURE__*/function (_OnlinqFormCollection) {
  _inherits(OnlinqFormCollectionMoveUpButtonElement, _OnlinqFormCollection);
  var _super = _createSuper(OnlinqFormCollectionMoveUpButtonElement);
  function OnlinqFormCollectionMoveUpButtonElement() {
    var _this;
    _classCallCheck(this, OnlinqFormCollectionMoveUpButtonElement);
    var clickCallback = function clickCallback() {
      if (_this.collectionEntry) {
        _this.collectionEntry.moveUp();
      }
    };
    return _this = _super.call(this, clickCallback);
  }
  return _createClass(OnlinqFormCollectionMoveUpButtonElement);
}(_collection_entry_button__WEBPACK_IMPORTED_MODULE_0__.OnlinqFormCollectionEntryButtonElement);
customElements.define('onlinq-collection-move-up', OnlinqFormCollectionMoveUpButtonElement, {
  "extends": 'button'
});

/***/ }),

/***/ "./src/stylesheets/inline.css":
/*!************************************!*\
  !*** ./src/stylesheets/inline.css ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/elements/collection-entry.html":
/*!********************************************!*\
  !*** ./src/elements/collection-entry.html ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<style>\n  :host {\n    --collection-entry-display: block;\n    --collection-entry-justify-content: flex-start;\n    --collection-entry-align-items: flex-start;\n    --collection-entry-contents-margin: 0 0 1rem;\n    --collection-entry-contents-flex-grow: 1;\n    --collection-entry-actions-margin: 0 0 1rem;\n    --collection-entry-actions-flex-grow: 0;\n\n    display: var(--collection-entry-display);\n    justify-content: var(--collection-entry-justify-content);\n    align-items: var(--collection-entry-align-items);\n  }\n\n  .contents {\n    flex-grow: var(--collection-entry-contents-flex-grow);\n    margin: var(--collection-entry-contents-margin);\n  }\n\n  .actions {\n    flex-grow: var(--collection-entry-actions-flex-grow);\n    margin: var(--collection-entry-actions-margin);\n  }\n</style>\n\n<div class=\"contents\">\n  <slot></slot>\n</div>\n<div class=\"actions\" data-actions-container>\n  <slot name=\"actions\">\n    <span data-move-container>\n      <slot name=\"move-up\">\n        <button is=\"onlinq-collection-move-up\">Move up</button>\n      </slot>\n      <slot name=\"move-down\">\n        <button is=\"onlinq-collection-move-down\">Move down</button>\n      </slot>\n    </span>\n    <span data-delete-container>\n      <slot name=\"delete\">\n        <button is=\"onlinq-collection-delete\">Delete</button>\n      </slot>\n    </span>\n  </slot>\n</div>\n");

/***/ }),

/***/ "./src/elements/collection.html":
/*!**************************************!*\
  !*** ./src/elements/collection.html ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<style type=\"text/css\">\n  :host {\n    --collection-display: block;\n    --collection-justify-content: flex-start;\n    --collection-align-items: flex-start;\n    --collection-contents-margin: 0 0 1rem;\n    --collection-contents-flex-grow: 1;\n    --collection-actions-margin: 0 0 1rem;\n    --collection-actions-flex-grow: 0;\n\n    display: var(--collection-display);\n    justify-content: var(--collection-justify-content);\n    align-items: var(--collection-align-items);\n  }\n\n  .contents {\n    flex-grow: var(--collection-contents-flex-grow);\n    margin: var(--collection-contents-margin);\n  }\n\n  .actions {\n    flex-grow: var(--collection-actions-flex-grow);\n    margin: var(--collection-actions-margin);\n  }\n\n  [data-collection-container] {\n    display: none;\n  }\n</style>\n\n<div class=\"contents\" data-collection-container>\n  <slot></slot>\n</div>\n<div class=\"contents\" data-placeholder-container>\n  <slot name=\"placeholder\">\n    <span>No entries</span>\n  </slot>\n</div>\n<div class=\"actions\" data-actions-container>\n  <slot name=\"actions\">\n    <span data-add-container>\n      <slot name=\"add\">\n        <button is=\"onlinq-collection-add\">Add</button>\n      </slot>\n    </span>\n  </slot>\n</div>\n");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   OnlinqFormCollectionAddButtonElement: () => (/* reexport safe */ _elements_add_button__WEBPACK_IMPORTED_MODULE_4__.OnlinqFormCollectionAddButtonElement),
/* harmony export */   OnlinqFormCollectionButtonElement: () => (/* reexport safe */ _elements_collection_button__WEBPACK_IMPORTED_MODULE_3__.OnlinqFormCollectionButtonElement),
/* harmony export */   OnlinqFormCollectionDeleteButtonElement: () => (/* reexport safe */ _elements_delete_button__WEBPACK_IMPORTED_MODULE_6__.OnlinqFormCollectionDeleteButtonElement),
/* harmony export */   OnlinqFormCollectionElement: () => (/* reexport safe */ _elements_collection__WEBPACK_IMPORTED_MODULE_1__.OnlinqFormCollectionElement),
/* harmony export */   OnlinqFormCollectionEntryButtonElement: () => (/* reexport safe */ _elements_collection_entry_button__WEBPACK_IMPORTED_MODULE_5__.OnlinqFormCollectionEntryButtonElement),
/* harmony export */   OnlinqFormCollectionEntryElement: () => (/* reexport safe */ _elements_collection_entry__WEBPACK_IMPORTED_MODULE_2__.OnlinqFormCollectionEntryElement),
/* harmony export */   OnlinqFormCollectionMoveDownButtonElement: () => (/* reexport safe */ _elements_move_down_button__WEBPACK_IMPORTED_MODULE_7__.OnlinqFormCollectionMoveDownButtonElement),
/* harmony export */   OnlinqFormCollectionMoveUpButtonElement: () => (/* reexport safe */ _elements_move_up_button__WEBPACK_IMPORTED_MODULE_8__.OnlinqFormCollectionMoveUpButtonElement)
/* harmony export */ });
/* harmony import */ var _ungap_custom_elements__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @ungap/custom-elements */ "./node_modules/@ungap/custom-elements/index.js");
/* harmony import */ var _ungap_custom_elements__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_ungap_custom_elements__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _elements_collection__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./elements/collection */ "./src/elements/collection.js");
/* harmony import */ var _elements_collection_entry__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./elements/collection-entry */ "./src/elements/collection-entry.js");
/* harmony import */ var _elements_collection_button__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./elements/collection-button */ "./src/elements/collection-button.js");
/* harmony import */ var _elements_add_button__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./elements/add-button */ "./src/elements/add-button.js");
/* harmony import */ var _elements_collection_entry_button__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./elements/collection-entry-button */ "./src/elements/collection-entry-button.js");
/* harmony import */ var _elements_delete_button__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./elements/delete-button */ "./src/elements/delete-button.js");
/* harmony import */ var _elements_move_down_button__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./elements/move-down-button */ "./src/elements/move-down-button.js");
/* harmony import */ var _elements_move_up_button__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./elements/move-up-button */ "./src/elements/move-up-button.js");
/* harmony import */ var _stylesheets_inline_css__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./stylesheets/inline.css */ "./src/stylesheets/inline.css");










})();

/******/ })()
;