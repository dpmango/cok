// import $ from 'jquery';
import svg4everybody from 'svg4everybody';
import picturefill from 'picturefill';
// import viewportUnitsBuggyfill from 'viewport-units-buggyfill';
import objectFitImages from 'object-fit-images/dist/ofi.es-modules.js';
import MicroModal from 'micromodal';
import Swiper, { Navigation, Pagination } from 'swiper';
import validate from 'jquery-validation';
import mask from 'jquery-mask-plugin';
import Choices from 'choices.js';
import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';
import { disablePageScroll, enablePageScroll, clearQueueScrollLocks } from 'scroll-lock';

// expose imports to window to use in app.js
window.svg4everybody = svg4everybody;
window.picturefill = picturefill;
window.objectFitImages = objectFitImages;
// window.viewportUnitsBuggyfill = viewportUnitsBuggyfill;
Swiper.use([Navigation, Pagination]);
window.Swiper = Swiper;
window.MicroModal = MicroModal;
window.validate = validate;
window.mask = mask;
window.Choices = Choices;
window.debounce = debounce;
window.throttle = throttle;
window.disablePageScroll = disablePageScroll;
window.enablePageScroll = enablePageScroll;
window.clearQueueScrollLocks = clearQueueScrollLocks;
