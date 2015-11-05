(function(window, document, undefined) {

    var imagesToLoad = [];
    var currentImage = 0;
    var loadInProgress = false;
    var maxBeforeScroll = 2;
    var requestLoaderReset = false;

    function resetLoader() {
        imagesToLoad = [];
        currentImage = 0;
        loadInProgress = false;
        maxBeforeScroll = 2;
        requestLoaderReset = false;
        scanPageForImages();
    }

    function domReady () {

        // hook to alax loader
        $.fn.almComplete = function(alm) {
            if (loadInProgress) requestLoaderReset = true;
            else resetLoader();
        };

        // inject custom CSS
        var css  = ".fadedOut { opacity: 0; } .fadedIn { opacity: 1; -webkit-transition: 400ms opacity ease; -moz-transition: 400ms opacity ease; -ms-transition: 400ms opacity ease; transition: 400ms opacity ease; }";
        var head = document.head || document.getElementsByTagName('head')[0];
        var style = document.createElement('style');
        style.type = 'text/css';
        if (style.styleSheet) style.styleSheet.cssText = css;
        else style.appendChild(document.createTextNode(css));
        head.appendChild(style);

        window.onscroll = function(event) {
            var top = document.documentElement.scrollTop || document.body.scrollTop;
            if (top > 300) {
                maxBeforeScroll = 100;
                if (!loadInProgress && currentImage < imagesToLoad.length) loadImage(imagesToLoad[currentImage], loadNextImage);
            }
        }

        scanPageForImages();
    }

    function scanPageForImages() {

        var images = document.getElementsByTagName("IMG");

        for (var i = 0; i < images.length; i++) {
            var img = images[i];
            var src = img.getAttribute("data-src");
            var bg = img.parentNode;
            var wrapper = bg.parentNode;
            if (src && bg.className == "gen__bg" && !img.lazyLoaded) {
                img.lazyLoaded = true;
                bg.className = "gen__bg fadedOut";
                bg.parentNode.style.background = "url('data:image/gif;base64,R0lGODlhEAALAPQAAPLy8uzs7KysrJeXl/n5+aKiovb29ra2tomJieDg4JmZmcjIyOXl5dzc3O7u7vT09Pj4+NLS0oiIiIqKip2dnejo6O3t7bS0tN7e3qqqqsTExP///wAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQJCwAAACwAAAAAEAALAEAFLSAgjmQJVGglWqy1ttXzqKdMx3PrAvrL4jebCGgqGo8rYW02tBGXwdlzqkSSQgAh+QQJCwAAACwAAAAABAALAAAFEeAkSSJFjSZ6Sim7tvB7imQIACH5BAkLAAAALAAAAAAKAAsAAAUrICCOgyQN2nVpopRl0oVhV/vGcw24sEzbvRwQ99vdfDoeMXlLrYYjkmkQAgAh+QQJCwAAACwGAAAACgALAAAFKyAgjgqCKMtxLCIiCMiRJEf7xnMNuLBM270cEPfb3Xw6HjF5S62GI5JJEQIAIfkECQsABgAsBgABAAoACQAABSagIY7FMBRAEADiIAhDQBBB+8ZzbbiwTNu9HBD3291Sq+GIZCqEAAAh+QQFCwAAACwAAAIAEAAHAAAFLeDjOA8AiKTZRFHjQJBjvrEZMUxEy8Bu4zoYzwe45YhEY7DWE/5yqNJpJF21QgAh+QQFFgACACwAAAIAEAAHAAAFJiAQBIAgiKSJioYRmEH7CrFbzzcs57Ss276e6zcK8m4r1ah0WoYAADs=') center 30px no-repeat";
                imagesToLoad.push(img)
            }
        }

        if (imagesToLoad.length > 0) loadImage(imagesToLoad[0], loadNextImage);

    }

    function loadNextImage() {

        if (requestLoaderReset) {
            resetLoader();
            return;
        }

        currentImage++;

        if (currentImage < imagesToLoad.length && currentImage < maxBeforeScroll) {
            loadImage(imagesToLoad[currentImage], loadNextImage);
        }
        else {
            loadInProgress = false;
        }
    }

    function loadImage(img, loaded) {
        loadInProgress = true;
        var src = img.getAttribute("data-src");
        var bg = img.parentNode;
        img.onload = function() {
            bg.style.backgroundImage = "url(" + src + ")";
            bg.className = "gen__bg fadedIn";
            var wrapper = bg.parentNode;
            wrapper.style.background = "transparent";
            loaded();
        }
        img.src = src;
    }

    if (document.addEventListener) {
        document.addEventListener("DOMContentLoaded", function() {
            document.removeEventListener("DOMContentLoaded", arguments.callee, false);
            domReady();
        }, false );
    } else if (document.attachEvent) {
        document.attachEvent("onreadystatechange", function() {
            if (document.readyState === "complete") {
                document.detachEvent("onreadystatechange", arguments.callee);
                domReady();
            }
        });
    }

}(window, document));
