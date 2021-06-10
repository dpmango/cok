//////////
// LAYOUT
//////////
(function (APP) {
  APP.Plugins.LAYOUT = {
    data: {
      stickToWindow: undefined,
      containerAlign: undefined,
      swiperOffset: undefined,
    },
    init: function (fromPjax) {
      this.getData();
      this.applyLayout();
      if (!fromPjax) {
        this.listenResize();
      }
    },
    getData: function () {
      this.data.stickToWindow = $('.js-stick-to-window');
      this.data.containerAlign = $('.js-container-align');
      this.data.swiperOffset = $('.js-swiper-offset');
    },
    getOffset: function (dataProp) {
      let domElement = undefined;
      try {
        domElement = $(dataProp);
        // eslint-disable-next-line no-empty
      } catch (e) {}

      let px = typeof dataProp === 'string';
      return domElement ? domElement : px ? parseInt(px) : px;
    },
    listenResize: function () {
      window.addEventListener('resize', debounce(this.applyLayout.bind(this), 100));
    },
    applyLayout: function (addressedCall) {
      var _this = this;
      function shouldEnvoke(name) {
        if (addressedCall === undefined || typeof addressedCall !== 'string') {
          return true;
        } else {
          return addressedCall === name;
        }
      }

      if (_this.data.stickToWindow && shouldEnvoke('stickToWindow')) {
        [].forEach.call(_this.data.stickToWindow, (el) => {
          var position = el.getAttribute('data-position');
          var stopWatching = el.getAttribute('data-stop')
            ? mediaCondition(el.getAttribute('data-stop'))
            : null;
          var setMarginPx = 0;

          if (stopWatching === null || !stopWatching) {
            // reset from previous resive
            el.style.marginLeft = 0;
            el.style.marginRight = 0;

            // get position of element to window
            var refPosLeft = el.getBoundingClientRect().left;

            // is container keeper
            var keepContainer = el.getAttribute('data-keep-container');
            var offsetRight = el.getAttribute('data-offset-right');

            if (position === 'both' && keepContainer) {
              el.style.paddingLeft = 0;
              el.style.paddingRight = 0;
            }
            // set offset]
            el.style.marginRight = _this.getOffset(offsetRight);

            if (position === 'left') {
              setMarginPx = refPosLeft * -1;
              el.style.marginLeft = `${setMarginPx}px`;

              if (keepContainer) {
                el.style.paddingLeft = `${setMarginPx * -1}px`;
              }
            } else if (position === 'right') {
              const wWidth = window.innerWidth;
              const elWidth = $(el).width();
              const elMarginRight = Math.abs(parseInt(el.style.marginLeft));

              setMarginPx = (wWidth - refPosLeft - (elWidth - elMarginRight)) * -1;
              el.style.marginRight = `${setMarginPx}px`;
              if (keepContainer) {
                el.style.paddingRight = `${setMarginPx * -1}px`;
              }
            } else if (position === 'both') {
              const wWidth = window.innerWidth;
              const elWidth = $(el).width();
              const elMarginRight = Math.abs(parseInt(el.style.marginLeft));

              const setMarginLeft = refPosLeft * -1;
              const setMarginRight = (wWidth - refPosLeft - (elWidth - elMarginRight)) * -1;

              $(el).css({
                'margin-left': `${setMarginLeft}px`,
                'margin-right': `${setMarginRight}px`,
              });

              if (keepContainer) {
                $(el).css({
                  'padding-left': `${setMarginLeft * -1}px`,
                  'padding-right': `${setMarginRight * -1}px`,
                });
              }
            }
          } else {
            el.setAttribute('style', '');
          }
        });
      }

      // container align
      if (_this.data.containerAlign && shouldEnvoke('containerAlign')) {
        [].forEach.call(_this.data.containerAlign, (el) => {
          var stopWatching = el.getAttribute('data-stop')
            ? mediaCondition(el.getAttribute('data-stop'))
            : null;
          var type = el.getAttribute('data-type');
          var position = el.getAttribute('data-position');
          var selector = el.getAttribute('data-selector');

          if (stopWatching === null || !stopWatching) {
            // get reference container (narrow)
            var referenceContainer = el.closest('.container');
            if (!referenceContainer) {
              referenceContainer = document.querySelector('.container');
            }
            if (selector) {
              referenceContainer = $(selector);
            }

            const wWidth = window.innerWidth;
            var refPos = referenceContainer.getBoundingClientRect();
            var containerPad = window.innerWidth < 768 ? 20 : 40;

            if (position === 'right') {
              // reset styles
              el.setAttribute('style', '');

              // calulcations
              var elPos = el.getBoundingClientRect();
              var refPosRight = wWidth - (refPos.left + refPos.width);
              var elPosRight = wWidth - (elPos.left + elPos.width);
              var diff = refPosRight - elPosRight;

              if (type && type === 'padding') {
                el.style.paddingRight = `${diff + containerPad}px`;
              } else {
                el.style.marginRight = `${diff}px`;
              }
            } else {
              if (type && type === 'padding') {
                el.style.paddingLeft = `${refPos.left + containerPad}px`;
              } else if (type && type === 'slider') {
                var slider = el.closest('.swiper-container');
                slider.setAttribute('data-offset-before', refPos.left + containerPad);
                if (slider && slider.swiper) {
                  slider.swiper.params.slidesOffsetBefore = refPos.left + containerPad;
                  APP.Plugins.Sliders.update();
                }
              } else {
                el.style.marginLeft = `${refPos.left}px`;
              }
            }
          } else {
            el.setAttribute('style', '');
          }
        });
      }

      // swiper offset based on grid
      if (_this.data.swiperOffset && shouldEnvoke('swiperOffset')) {
        [].forEach.call(_this.data.swiperOffset, (el) => {
          var stopWatching = el.getAttribute('data-stop')
            ? mediaCondition(el.getAttribute('data-stop'))
            : null;
          var position = el.getAttribute('data-position');
          var selector = el.getAttribute('data-selector');
          var slider = el.closest('.swiper-container');

          if (stopWatching === null || !stopWatching) {
            // get reference container
            var referenceContainer = el.closest('.container');
            if (selector) {
              referenceContainer = $(selector);
            }
            var containerPad = window.innerWidth < 768 ? 20 : 40;

            var refPos = referenceContainer.getBoundingClientRect();
            var percent = el.getAttribute('data-percent');

            // get percent (set in props) relative to reference container
            var offsetPixels = Math.round(
              (refPos.width - containerPad * 2) * (parseFloat(percent) / 100)
            );
            if (position === 'right') {
              slider.setAttribute('data-offset-after', offsetPixels);
              if (slider && slider.swiper) {
                slider.swiper.params.slidesOffsetAfter = offsetPixels;
                APP.Plugins.Sliders.update();
              }
            }
            if (position === 'left') {
              slider.setAttribute('data-offset-before', offsetPixels);
              if (slider && slider.swiper) {
                slider.swiper.params.slidesOffsetBefore = offsetPixels;
                APP.Plugins.Sliders.update();
              }
            }
          } else {
            if (slider && slider.swiper) {
              slider.setAttribute('data-offset-before', null);
              slider.setAttribute('data-offset-after', null);
              slider.swiper.params.slidesOffsetBefore = 0;
              slider.swiper.params.slidesOffsetAfter = 0;
              APP.Plugins.Sliders.update();
            }
          }
        });
      }
    },
  };
})(window.APP);
