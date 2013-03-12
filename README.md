# Lazyload

Lazy load your images. Tested on IE7+, Firefox, Chrome, iOS. Supports handling of images that are placed in the DOM after ajax requests or images that are made visible after the page loads.

### Dependencies

- [jQuery](http://jquery.com/)
- [Ben Alman's Throttle/Debounce jQuery plugin](http://benalman.com/projects/jquery-throttle-debounce-plugin/)

### Usage

1) Include `lazyload.js`

2) Add `data-src` to each of your `<img>` tags. Optionally add a placeholder src, and the `lazy-load` class, however it is not necessary but can be used to animate the images.

```html
<img class="lazy-load" data-src="lazy.jpg" src="blank.gif" />
<noscript><img src="lazy.jpg" /></noscript>
```

3) Call `lazy.init()` after images are ready in the DOM. This method adds all images with the `data-src` attribute to a cache and `lazy.load()`'s them if the image `.is(':visible')`

4) If images are initially not visible, you can call `lazy.load()` when they become visiible.