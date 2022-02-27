/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(self, function() {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/imageViewer/ImageViewer.js":
/*!****************************************!*\
  !*** ./src/imageViewer/ImageViewer.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ ImageViewer)\n/* harmony export */ });\nclass ImageViewer {\n\n    #ids = {\n        'viewerGrid': false\n    }\n\n    #xmlns = 'http://www.w3.org/2000/svg';\n    #xlink = 'http://www.w3.org/1999/xlink';\n\n    // array of objects\n    #images = [];\n\n    #nodes = {\n        'container': false,\n        'dest': false,\n        'imageName': false,\n        'thumbnails': false,\n        'backdrop': false,\n        'viewbox': false,\n        'fullImageDest': false,\n        'touch': {\n            'left': false,\n            'right': false\n        }\n    }\n\n    // set loader image\n    #uiPath = 'assets/ui.svg';\n\n    #state = {\n        'selected': 0,\n        'lastClickedIndex': false,\n        'fullImageIndex': false,\n        'loading': false,\n    }\n\n    constructor(viewerId) {\n        this.#ids.viewerGrid = viewerId;\n        this.init();\n    }\n\n    init() {\n        // get component container\n        this.#nodes.container = document.getElementById(this.#ids.viewerGrid);\n        if(!this.#nodes.container) {\n            console.log('Can\\'t find ImageViewer container node');\n            return false;\n        }\n\n        // preload UI SVG\n        this.preloadUI();\n\n        // get main image dest\n        this.#nodes.dest = this.#nodes.container.querySelector('.mainImage .dst');\n        if(!this.#nodes.dest) {\n            console.log('Can\\'t find ImageViewer main image destination node');\n            return false;\n        }\n        // get main image name\n        this.#nodes.imageName = this.#nodes.container.querySelector('.imageName');\n\n        // get thumbnails container\n        this.#nodes.thumbnails = this.#nodes.container.querySelector('.thumbnails');\n\n        // read and load images\n        if(this.#nodes.thumbnails) {\n            this.getImagesFromContainer();\n            this.bindEvents();\n        } else {\n            console.log('Can\\'t find ImageViewer thumbnails container node');\n            return false;\n        }\n    }\n\n    preloadUI() {\n        const link = document.createElement('link');\n        link.setAttribute('rel','prefetch');\n        link.setAttribute('href',this.#uiPath);\n        link.setAttribute('as','image');\n        link.setAttribute('type','image/svg+xml');\n        document.querySelector('body').append(link);\n    }\n\n    getImagesFromContainer() {\n        const hrefs = this.#nodes.thumbnails.getElementsByTagName('a');\n        for(let i=0; i < hrefs.length; i++) {\n            const a = hrefs[i];\n            // add index image to node\n            a.setAttribute('data-index', i);\n            // save image variables\n            let src = {\n                'small': false,\n                'medium': false,\n                'big': a.getAttribute('href')\n            };\n            // check exists medium size\n            let mediumImage = false;\n            if(a.dataset.medium) {\n                src.medium = a.dataset.medium;\n            }\n            // get small image link\n            const smallImage = a.querySelector('img');\n            if(false != smallImage) {\n                src.small = smallImage.getAttribute('src');\n                this.addImage(src.small, src.medium, src.big, smallImage.getAttribute('alt'), a)\n            }\n        }\n    }\n\n    bindEvents() {\n        if(this.#images.length) {\n            this.#images.forEach(img => img.link.addEventListener('click', this.handleClickByThumbnail))\n\n            // bind click event by main image\n            const img = this.#nodes.dest.querySelector('img');\n            img.addEventListener('click', () => this.handleClickByMainImage(0))\n        }\n    }\n\n    createLoader() {\n        const loader = document.createElement('div');\n        loader.classList.toggle('loader',true);\n        return loader;\n    }\n\n    handleClickByThumbnail = (e) => {\n        const target = e.currentTarget;\n        const index = parseInt(target.dataset.index);\n\n        e.preventDefault();\n\n        this.#state.lastClickedIndex = index;\n        if(this.#state.selected == index) {\n            return false;\n        }\n        const item = this.#images[index];\n\n        // mark current thumbnail\n        this.#nodes.thumbnails.querySelectorAll('a').forEach((t) => t.classList.toggle('selected',false));\n        target.classList.toggle('selected');\n\n        this.#nodes.dest.innerHTML = '';\n\n        // show image name if exists\n        let imageName;\n        (item.name) ?  imageName = item.name : imageName = '';\n        this.#nodes.imageName.innerHTML = imageName;\n\n        if(item.medium.isLoaded === false) {\n            this.#state.loading = true;\n            // show loader\n            this.#nodes.dest.classList.toggle('loading', true);\n            this.#nodes.dest.append(this.createLoader());\n\n            // try to load medium size of image\n            item.medium.img.src = item.medium.src;\n            // bind event when loaded\n            item.medium.img.onload = () => {\n                // save loaded state\n                item.medium.isLoaded = true;\n                // change main image only when this is last click\n                if(this.#state.lastClickedIndex == index) {\n                    this.#nodes.dest.classList.toggle('loading', false);\n                    this.#nodes.dest.innerHTML = '';\n                    // set state of loading in component\n                    this.#state.loading = false;\n                    this.showImage(index);\n                }\n            }\n        } else {\n            this.showImage(index);\n        }\n    }\n\n    showImage(index) {\n        const item = this.#images[index];\n        // save selected image\n        this.#state.selected = index;\n        // show main image\n        const img = document.createElement('img');\n        img.setAttribute('src', item.medium.src);\n        item.name && img.setAttribute('alt', item.name);\n        this.#nodes.dest.append(img);\n        // bind click event by main image\n        img.addEventListener('click', () => this.handleClickByMainImage(index))\n    }\n\n    closeFullSlider() {\n        this.#nodes.backdrop.classList.toggle('show', false);\n        this.#nodes.viewbox.classList.toggle('show', false);\n        this.removeLoader();\n    }\n\n    createViewbox() {\n        const d = document;\n        const body = d.querySelector('body');\n        let viewbox;\n        // try to find viewebox in body root\n        const viewboxFromHTML = d.querySelector('body > .viewebox')\n        if(!viewboxFromHTML) {\n\n            // create viewebox\n            viewbox = d.createElement('div');\n            viewbox.classList.toggle('viewbox', true);\n            body.append(viewbox);\n\n            // create close button\n            const closeBtn = this.createIcon('close');\n            const touch = {'left':false,'right':false};\n\n            closeBtn.classList.toggle('close', true);\n            closeBtn.addEventListener('click', this.closeFullSlider.bind(this));\n            viewbox.append(closeBtn);\n\n            const nav = document.createElement('div');\n            nav.classList.toggle('nav', true);\n\n            touch.left = document.createElement('div');\n            touch.left.classList.toggle('left', true);\n\n            touch.right = document.createElement('div');\n            touch.right.classList.toggle('right', true);\n\n            // create arrows\n            touch.left.append(this.createIcon('chevron-left'));\n            touch.right.append(this.createIcon('chevron-right'));\n\n            nav.append(touch.left);\n            nav.append(touch.right);\n\n            touch.left.addEventListener('click', this.prev.bind(this));\n            touch.right.addEventListener('click', this.next.bind(this));\n            viewbox.append(nav);\n\n            // save touch nodes\n            this.#nodes.touch.left = touch.left;\n            this.#nodes.touch.right = touch.right;\n\n        } else {\n            viewbox = viewboxFromHTML;\n        }\n        this.#nodes.viewbox = viewbox;\n    }\n\n    prev(e) {\n        const el = e.currentTarget;\n        const prevIndex = parseInt(el.dataset.prev);\n        this.#state.fullImageIndex = prevIndex;\n\n        this.setFullImage(prevIndex);\n    }\n\n    next(e) {\n        const el = e.currentTarget;\n        const nextIndex = parseInt(el.dataset.next);\n        this.#state.fullImageIndex = nextIndex;\n\n        this.setFullImage(nextIndex);\n    }\n\n    handleClickByMainImage(index) {\n\n        const d = document;\n        const body = d.querySelector('body');\n\n        this.#state.fullImageIndex = index;\n\n        // show backdrop\n        if(this.#nodes.backdrop == false) {\n            let backdrop;\n            // try to find backdrop in body root\n            const backdropFromHTML = d.querySelector('body > .backdrop')\n            if(!backdropFromHTML) {\n                // create backdrop\n                backdrop = d.createElement('div');\n                backdrop.classList.toggle('backdrop', true);\n                body.append(backdrop);\n            } else {\n                backdrop = backdropFromHTML;\n            }\n            this.#nodes.backdrop = backdrop;\n            // bind event\n            this.#nodes.backdrop.addEventListener('click', this.closeFullSlider.bind(this));\n        }\n        // show backdrop\n        this.#nodes.backdrop.classList.toggle('show', true);\n\n        // create viewbox if need\n        (this.#nodes.viewbox == false) && this.createViewbox();\n\n        // show viewbox\n        this.#nodes.viewbox.classList.toggle('show', true);\n\n        this.setFullImage(index);\n    }\n\n    setFullImage(index) {\n\n        this.removeLoader();\n        this.changeNavIndexes();\n\n        const b = this.#images[index].big;\n        // clear image\n        const oldImage = this.#nodes.viewbox.querySelector('.fullImage');\n        if(oldImage) {\n            oldImage.remove();\n        }\n        // check big image loaded status\n        if(b.isLoaded === false) {\n            // show loader\n            const loader = this.createLoader();\n            loader.classList.toggle('white', true);\n\n            this.#nodes.viewbox.classList.toggle('loading', true);\n            this.#nodes.viewbox.append(loader);\n\n            b.img.src = b.src;\n            b.img.onload = () => {\n                // save loaded state\n                b.isLoaded = true;\n                // change main image only when this is last click\n                if(this.#state.fullImageIndex == index) {\n                    this.removeLoader();\n                    // show image\n                    this.showFullImage(index);\n                }\n            }\n        } else {\n            // show image\n            this.showFullImage(index);\n        }\n    }\n\n    changeNavIndexes() {\n        const index = this.#state.fullImageIndex;\n        // rebind nav events\n        let n = {\n            'next': false,\n            'prev': false\n        };\n        // next\n        (index + 1 < this.#images.length) ? n.next = index + 1 : n.next = 0;\n        // prev\n        (index - 1 >= 0) ? n.prev = (index - 1) : n.prev = this.#images.length;\n        this.#nodes.touch.left.setAttribute('data-prev', n.prev);\n        this.#nodes.touch.right.setAttribute('data-next', n.next);\n    }\n\n    removeLoader() {\n        // remove loader\n        const loader = this.#nodes.viewbox.querySelector('.loader');\n        if(loader) {\n            this.#nodes.viewbox.classList.toggle('loading', false);\n            loader.remove();\n        }\n    }\n\n    showFullImage(index) {\n        const b = this.#images[index].big;\n        // create image\n        const img = document.createElement('img');\n        img.classList.toggle('fullImage', true);\n        img.src = b.src;\n        this.#nodes.viewbox.append(img);\n    }\n\n    toggleClasses(el, cls, mode = true) {\n        cls.map(cl => el.classList.toggle('cl', mode))\n    }\n\n    createIcon(iconId) {\n        const svg = document.createElementNS(this.#xmlns, 'svg');\n        const useTag = document.createElementNS(this.#xmlns, 'use');\n        useTag.setAttributeNS(this.#xmlns, 'xlink', 'http://www.w3.org/1999/xlink');\n        useTag.setAttributeNS(this.#xlink, 'xlink:href', 'assets/ui.svg#'+iconId);\n        svg.append(useTag);\n        return svg;\n    }\n\n    addImage(srcSmall, srcMedium, srcBig, name, link) {\n        this.#images.push({\n            'small': { 'src': srcSmall },\n            'medium': { 'src': srcMedium, 'img': new Image(), 'isLoaded': false },\n            'big': { 'src': srcBig, 'img': new Image(), 'isLoaded': false },\n            'name': name,\n            'link': link\n        })\n    }\n\n}\n\n\n//# sourceURL=webpack://imageviewer/./src/imageViewer/ImageViewer.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"ImageViewer\": () => (/* reexport safe */ _imageViewer_ImageViewer__WEBPACK_IMPORTED_MODULE_0__[\"default\"])\n/* harmony export */ });\n/* harmony import */ var _imageViewer_ImageViewer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./imageViewer/ImageViewer */ \"./src/imageViewer/ImageViewer.js\");\n\n\n\n\n\n//# sourceURL=webpack://imageviewer/./src/index.js?");

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
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});