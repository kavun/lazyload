/*
 *  updated to:
 *      - use jquery events with custom namespaces
 *      - use jquery to select images, instead of custom document.querySelectorAll for IE7
 *      - expose public methods
 *      - be able to update image imagecache after an ajax call and skip images already in the imagecache
 *      - expose configuration options
 *  
 *  adapted from:
 *      Lazy Load Images without jQuery
 *      http://ezyz.github.com/Lazy-Load-Images-without-jQuery/
 *      
 *      (c) 2012 Mike Pulaski. http://www.mikepulaski.com
 *      Modified and maintained by Yifei Zhang. http://yifei.co
 */

(function (window, document, $, undefined) {

  var imagecache = [];

  function _addObservers () {
    $(window).on('scroll.' + lazy.config.eventNamespace, $.throttle(lazy.config.throttle, lazy.load));
    $(window).on('resize.' + lazy.config.eventNamespace, $.throttle(lazy.config.throttle, lazy.load));
  }

  function _removeObservers () {
    $(window).off('scroll.' + lazy.config.eventNamespace);
    $(window).off('resize.' + lazy.config.eventNamespace);
  }

  var lazy = {

    config: {
      throttle: 50,
      loadedClass: 'lazy-loaded',
      imageAttribute: 'data-src',
      eventNamespace: 'lazyload'
    },

    load: function () {
      var scrollY = window.pageYOffset || document.documentElement.scrollTop,
        pageHeight = window.innerHeight || document.documentElement.clientHeight,
        range = {
          min: scrollY - (pageHeight / 2),
          max: scrollY + pageHeight + (pageHeight / 2)
        };

      var i = 0;
      while (i < imagecache.length) {

        var image = imagecache[i],
          imagePosition = getOffsetTop(image),
          imageHeight = image.height || 0,
          alreadyLoaded = $(image).hasClass(lazy.config.loadedClass);

        if ((imagePosition >= range.min - imageHeight) 
          && (imagePosition <= range.max) 
          && $(image).is(':visible') 
          && !alreadyLoaded) {

          image.onload = function () {
            this.className = lazy.config.loadedClass;
          };

          image.src = image.getAttribute(lazy.config.imageAttribute);
          image.removeAttribute(lazy.config.imageAttribute);
          imagecache.splice(i, 1);
          continue;
        } else if (alreadyLoaded) {
          imagecache.splice(i, 1);
          continue;
        }

        i++;
      }

      if (imagecache.length === 0) {
        _removeObservers();
      }
    },

    init: function (options) {

      lazy.config = $.extend({}, lazy.config, options);

      var images = $.makeArray($('img[' + lazy.config.imageAttribute + ']'));

      for (var i = 0, l = images.length; i < l; i++) {
        var img = images[i];
        if ( $.inArray(img, imagecache) === -1) {
          imagecache.push(img);
        }
      }

      _addObservers();
      lazy.load();
    }
  }

  // For IE7 compatibility
  // Adapted from http://www.quirksmode.org/js/findpos.html
  function getOffsetTop(el) {
    var val = 0;
    if (el.offsetParent) {
      do {
        val += el.offsetTop;
      } while (el = el.offsetParent);
      return val;
    }
  }

  window.lazy = lazy;

})(window, document, jQuery);