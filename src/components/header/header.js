//////////
// HEADER
//////////
(function ($, APP) {
  APP.Components.Header = {
    data: {
      classes: {
        fixedClass: 'is-fixed',
        visibleClass: 'is-fixed-visible',
        bodyFixedVisible: 'is-header-fixed-visible',
      },
      cursor: {
        x: 0,
        y: 0,
        target: undefined,
      },
      header: {
        container: undefined,
        bottomPoint: undefined,
      },
    },
    init: function (fromPjax) {
      if (!fromPjax) {
        this.getHeaderParams();
        this.eventListeners();
        this.listenScroll();
        this.listenResize();
      }

      this.closeMobileMenu();
      this.closeMegaMenu();
    },
    getHeaderParams: function () {
      var $header = $('.header');
      var headerOffsetTop = 0;
      var headerHeight = $header.outerHeight() + headerOffsetTop;

      this.data.header = {
        container: $header,
        bottomPoint: headerHeight,
      };
    },
    closeMobileMenu: function () {
      $('.js-hamburger').removeClass('is-active');
      $('.mobile-navi').removeClass('is-active');

      APP.Plugins.ScrollBlock.enableScroll();
    },
    closeMegaMenu: function (withScrollBlock) {
      if ($('.js-megamenu.is-active').length === 0) return;

      if (withScrollBlock) {
        if (APP.Browser().data.isMobile) {
          APP.Plugins.ScrollBlock.enableScroll();
        }
      }
      $('.js-megamenu-trigger a').removeClass('is-active');
      $('.js-megamenu').removeClass('is-active');
    },
    closeMegaMenuByTarget: function ($target) {
      var _this = this;
      var isNotScroller = $target.closest('.megamenu__scroller').length === 0;
      var isNotHeaderMenu = $target.closest('.header__menu').length === 0;
      var isNotHeaderSearch = $target.closest('.header__search').length === 0;

      if (isNotScroller && isNotHeaderMenu && isNotHeaderSearch) {
        _this.closeMegaMenu(true);
      }
    },
    openMegaMenu: function (e, selector) {
      var _this = this;
      var $curLink, targetId;
      if (selector) {
        $curLink = null;
        targetId = selector;
      } else {
        $curLink = $(this);
        targetId = $curLink.data('for');
      }
      var $targetMenu = $('.js-megamenu[data-id="' + targetId + '"]');

      APP.Components.Header.clickOrHoverTimeoutRouter(e, function () {
        APP.Components.Header.closeMegaMenu();

        if ($targetMenu.length > 0) {
          if ($curLink) $curLink.addClass('is-active');
          $targetMenu.addClass('is-active');
          $targetMenu.find('.megamenu__scroller').animate({ scrollTop: 0 }, 'fast');
          if (APP.Browser().data.isMobile) {
            // APP.Dev.LogOnScreen.showLog('disabling megamenu scroll');
            APP.Plugins.ScrollBlock.disableScroll();
          }
        }
      });
    },
    eventListeners: function () {
      var _this = this;

      _document.on('click', '.js-hamburger', function () {
        $(this).toggleClass('is-active');
        $('.mobile-navi').toggleClass('is-active');

        if ($(this).is('.is-active')) {
          APP.Plugins.ScrollBlock.disableScroll();
        } else {
          APP.Plugins.ScrollBlock.enableScroll();
        }
      });

      // megamenu
      _document.on('click mouseenter', '.js-megamenu-trigger a', _this.openMegaMenu);
      _document.on('mouseleave', '.js-megamenu-trigger a', function () {
        clearTimeout(APP.Components.Header.data.timer);
      });

      _document
        // close of hovering outside menu
        .on(
          'mouseleave',
          '.megamenu__scroller',
          debounce(
            function () {
              if (!APP.Browser().data.isMobile) {
                var $target = $(_this.data.cursor.target);
                _this.closeMegaMenuByTarget($target);
              }
            },
            150,
            { leading: false, trailing: true }
          )
        )
        // close on hovering outside menu (up on desktop)
        .on(
          'mouseleave',
          '.header__menu',
          debounce(
            function () {
              if (!APP.Browser().data.isMobile) {
                var $target = $(_this.data.cursor.target);
                _this.closeMegaMenuByTarget($target);
              }
            },
            150,
            { leading: false, trailing: true }
          )
        )
        // close on both desktop/mobile by clicking outside
        .on('click', function (e) {
          var $target = $(e.target);
          _this.closeMegaMenuByTarget($target);
        });

      // header search
      _document.on('click', '.header__search', function (e) {
        _this.openMegaMenu(e, 'search');
      });
      // .on('focus', '.js-header-search input', function (e) {
      //   _this.openMegaMenu(e, 'search');
      // })
      // .on('blur', '.js-header-search input', function () {
      //   _this.closeMegaMenu();
      // })
      // .on('input', '.js-header-search input', debounce(this.headerSeachTyped.bind(this), 250))
      // .on('submit', '.js-header-search', function (e) {
      //   e.preventDefault();
      //   _this.headerSeachSubmited();
      // });
    },
    listenScroll: function () {
      _window.on('scroll', this.scrollHeader.bind(this));
      _window.on('scroll', debounce(this.scrollHeaderDebouce.bind(this), 1250, { trailing: true }));
    },
    listenResize: function () {
      _window.on('resize', debounce(this.getHeaderParams.bind(this), 100));
    },
    listenCursor: function () {
      document.onmousemove = function (e) {
        APP.Components.Header.data.cursor = {
          x: e.pageX,
          y: e.pageY,
          target: e.target,
        };
      };
    },
    makeHeaderVisible: function () {
      this.data.header.container.addClass(this.data.classes.visibleClass);
      $('body').addClass(this.data.classes.bodyFixedVisible);
      this.data.header.isFixedVisible = true;
    },
    makeHeaderHidden: function () {
      this.data.header.container.removeClass(this.data.classes.visibleClass);
      $('body').removeClass(this.data.classes.bodyFixedVisible);
      this.data.header.isFixedVisible = false;
    },
    scrollHeaderDebouce: function () {
      // always show header after user stop scrolling
      if (this.data.header.container !== undefined) {
        this.makeHeaderVisible();
      }
    },
    scrollHeader: function () {
      if (this.data.header.container !== undefined) {
        var fixedClass = 'is-fixed';
        var visibleClass = 'is-fixed-visible';

        // get scroll params from blocker function
        var scroll = APP.Plugins.ScrollBlock.getData();

        if (scroll.blocked) return;

        if (scroll.y > this.data.header.bottomPoint) {
          this.data.header.container.addClass(fixedClass);

          if (scroll.y > this.data.header.bottomPoint * 2 && scroll.direction === 'up') {
            this.makeHeaderVisible();
          } else {
            this.makeHeaderHidden();
          }
        } else {
          // emulate position absolute by giving negative transform on initial scroll
          var normalized = Math.floor(normalize(scroll.y, this.data.header.bottomPoint, 0, 0, 100));
          var reverseNormalized = (100 - normalized) * -1;
          reverseNormalized = reverseNormalized * 1; // a bit faster transition

          this.data.header.container.css({
            transform: 'translate3d(0,' + reverseNormalized + '%,0)',
          });

          this.data.header.container.removeClass(fixedClass);
        }
      }
    },
    clickOrHoverTimeoutRouter: function (event, callback) {
      // router click / enter for mobile
      var eventType = event.type;
      var isMobile = APP.Browser().data.isMobile;
      var isMouse = eventType === 'mouseenter' || eventType === 'mouseover';

      // for mouse hovers and not mobile devices
      if (isMouse && !isMobile) {
        // 150ms pause if hover till going further
        APP.Components.Header.data.timer = setTimeout(callback, 150);
      } else {
        callback();
      }
    },
    headerSeachTyped: function (e) {
      var $input = $('.js-header-search input');
      var inputVal = $input.val().trim();

      this.openMegaMenu(e, 'search');
    },
    headerSeachSubmited: function () {
      var $form = $('.js-header-search');
      var searchQuery = $form.find('input').val().trim();
      if (searchQuery.length > 2) {
        window.location.pathname = `/search.html?query=${searchQuery}`;
        // window.location.search = `?query=${searchQuery}`;
      }
    },
  };
})(jQuery, window.APP);
