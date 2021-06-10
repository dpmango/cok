//////////
// SLIDERS
//////////
(function ($, APP) {
  APP.Plugins.Sliders = {
    data: {
      swipers: {
        heroSlider: undefined,
      },
      responsiveSwipers: {
        backstageSwiper: {
          instances: [],
          enableOn: 768,
        },
      },
    },
    init: function (fromPjax) {
      if (!fromPjax) {
        this.initSwipers();
        this.initSwiperDataTree();
        this.initResponsiveSwipers();
      }
      this.listenResize();
    },
    utils: {
      // builder helpers
      buildProps: function (name, options, $dom) {
        const defaultProps = {
          watchOverflow: true,
          setWrapperSize: false,
          slidesPerView: 'auto',
          normalizeSlideIndex: true,
          slideToClickedSlide: true,
          touchEventsTarget: 'wrapper',
          threshold: 10,
        };

        // optional props
        let oProps = {};
        if (options && options.pagination) {
          oProps = {
            pagination: {
              el: `.swiper-${name}-pagination`,
              type: 'bullets',
              clickable: true,
            },
          };
        }

        if (options && options.navigation) {
          oProps = {
            ...oProps,
            navigation: {
              nextEl: `.swiper-${name}-next`,
              prevEl: `.swiper-${name}-prev`,
            },
          };
        }

        // build props from data-
        let domProps = {};
        const dataBefore = $dom.data('offset-before');
        const dataAfter = $dom.data('offset-after');
        if (dataBefore) {
          domProps = {
            slidesOffsetBefore: dataBefore,
          };
        }
        if (dataAfter) {
          domProps = {
            ...domProps,
            slidesOffsetAfter: dataAfter,
          };
        }

        return {
          ...defaultProps,
          ...oProps,
          ...domProps,
        };
      },
      buildSwiper: function (name, eProps, options) {
        const $page = $('.page').last();
        const $dom = $page.find(`.js-swiper-${name}`);

        if ($dom.length === 0) return;

        let props = APP.Plugins.Sliders.utils.buildProps(name, options, $dom);
        let swiper = new Swiper(`.js-swiper-${name}:not(.swiper-container-initialized)`, {
          ...props,
          ...eProps,
        });
        return swiper;
      },
    },
    update: function (selector) {
      var $swiper;
      // if selector passed - update only with selector
      if (selector) {
        $swiper = $(`${selector}.swiper-container-initialized`);
      } else {
        $swiper = $('.swiper-container-initialized');
      }

      if ($swiper.length > 0) {
        $swiper.each(function (i, swiper) {
          $(swiper)[0].swiper.update();
        });
      }
    },
    listenResize: function () {
      _window.on('resize', debounce(this.initResponsiveSwipers.bind(this), 200));
    },
    initSwipers: function () {
      var _this = this;

      // HeroSlider
      this.data.swipers.heroSlider = _this.utils.buildSwiper(
        'hero',
        {
          loop: true,
          spaceBetween: 0,
          slidesPerView: 1,
        },
        {}
      );
    },
    initSwiperDataTree: function () {
      var backstageSwiper = '.js-swiper-backstage';
      if ($(backstageSwiper).length > 0) {
        this.initSwiperTree(backstageSwiper, 'backstageSwiper');
      }
    },
    initResponsiveSwipers: function () {
      var backstageSwiper = '.js-swiper-backstage';
      if ($(backstageSwiper).length > 0) {
        this.responsiveSwiperConstructor(backstageSwiper, 'backstageSwiper', {
          watchOverflow: true,
          setWrapperSize: false,
          spaceBetween: 0,
          slidesPerView: 'auto',
          freeMode: true,
          // centeredSlides: true,
          freeModeSticky: false,
          on: {
            reachEnd: function (swiper) {
              if (!APP.Components.Backstage.data.isFetching) {
                APP.Components.Backstage.getNewBackstageItems();
                swiper.setTranslate(0);
              }
            },
          },
        });
      }
    },
    initSwiperTree: function (selector, name) {
      var _this = this;
      _this.data.responsiveSwipers[name].instances = [];
      $(selector).each(function (i, sw) {
        _this.data.responsiveSwipers[name].instances.push(undefined);
      });
    },
    responsiveSwiperConstructor: function (selector, objName, options) {
      var dataObj = this.data.responsiveSwipers[objName];

      $(selector).each(function (idx, element) {
        if (window.innerWidth <= dataObj.enableOn) {
          if (dataObj.instances[idx] === undefined) {
            dataObj.instances[idx] = new Swiper(element, options);
          }
        } else {
          if (dataObj.instances[idx] !== undefined) {
            dataObj.instances[idx].destroy(true, true);
            dataObj.instances[idx] = undefined;
          }
        }
      });

      this.data.responsiveSwipers[objName] = dataObj;
    },

    destroy: function () {
      // ... code ...
    },
  };
})(jQuery, window.APP);
