/*********************
 * Initialization file for vendor-free frontend app.js
 *********************/
var APP = window.APP || {};
APP.Dev = APP.Dev || {};
APP.Browser = APP.Browser || {};
APP.Plugins = APP.Plugins || {};
APP.Components = APP.Components || {};

// force scroll to top on initial load
window.onbeforeunload = function () {
  window.scrollTo(0, 0);
};

// shorthand operators
var _window = $(window);
var _document = $(document);
var easingSwing = [0.02, 0.01, 0.47, 1]; // default jQuery easing

(function ($, APP) {
  APP.Initilizer = function () {
    var app = {};

    app.init = function () {
      app.initGlobalPlugins();
      app.initPlugins();
      app.initComponents();
    };

    app.destroy = function () {};

    // Global plugins which must be initialized once
    app.initGlobalPlugins = function () {
      APP.Dev.Breakpoint.listenResize();
      APP.Browser().methods.setBodyTags();
      APP.Plugins.LegacySupport.init();
      APP.Plugins.ScrollBlock.listenScroll();
      APP.Plugins.Clicks.init();
    };

    // Plugins which depends on DOM and page content
    app.initPlugins = function () {
      APP.Plugins.Teleport.init();
      APP.Plugins.MicroModal.init();
      APP.Plugins.Sliders.init();
      APP.Plugins.Masks.init();
      APP.Plugins.Choises.init();
      APP.Plugins.TextareaAutoExpand.init();
      APP.Plugins.Validations.init();
      APP.Plugins.LAYOUT.init();
      APP.Plugins.Tabs.init();
      APP.Plugins.Table.init();
      APP.Plugins.Upload.init();
      APP.Plugins.LegacySupport.fixImages();
      APP.Plugins.Ymaps.init();
    };

    // All components from `src/componenets`
    app.initComponents = function () {
      APP.Components.Header.init();
    };

    return app;
  };

  // a.k.a. ready
  $(function () {
    APP.Initilizer().init();
  });

  // $(window).on('load', function () {
  //   $.ready.then(function () {
  //     APP.Initilizer().onLoadTrigger();
  //   });
  // });
})(jQuery, window.APP);
