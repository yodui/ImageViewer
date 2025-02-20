export default class ImageViewer {

    #ids = {
        'viewerGrid': false
    }

    #xmlns = 'http://www.w3.org/2000/svg';
    #xlink = 'http://www.w3.org/1999/xlink';

    // array of objects
    #images = [];

    #nodes = {
        'container': false,
        'dest': false,
        'imageName': false,
        'thumbnails': false,
        'backdrop': false,
        'viewbox': false,
        'fullImageDest': false,
        'touch': {
            'left': false,
            'right': false
        }
    }

    // set loader image
    #uiPath = 'assets/ui.svg';

    #state = {
        'selected': 0,
        'lastClickedIndex': false,
        'fullImageIndex': false,
        'loading': false,
    }

    constructor(viewerId) {
        this.#ids.viewerGrid = viewerId;
        this.init();
    }

    init() {
        // get component container
        this.#nodes.container = document.getElementById(this.#ids.viewerGrid);
        if(!this.#nodes.container) {
            console.log('Can\'t find ImageViewer container node');
            return false;
        }

        // preload UI SVG
        this.preloadUI();

        // get main image dest
        this.#nodes.dest = this.#nodes.container.querySelector('.mainImage .dst');
        if(!this.#nodes.dest) {
            console.log('Can\'t find ImageViewer main image destination node');
            return false;
        }
        // get main image name
        this.#nodes.imageName = this.#nodes.container.querySelector('.imageName');

        // get thumbnails container
        this.#nodes.thumbnails = this.#nodes.container.querySelector('.thumbnails');

        // read and load images
        if(this.#nodes.thumbnails) {
            this.getImagesFromContainer();
            this.bindEvents();
        } else {
            console.log('Can\'t find ImageViewer thumbnails container node');
            return false;
        }
    }

    preloadUI() {
        const link = document.createElement('link');
        link.setAttribute('rel','prefetch');
        link.setAttribute('href',this.#uiPath);
        link.setAttribute('as','image');
        link.setAttribute('type','image/svg+xml');
        document.querySelector('body').append(link);
    }

    getImagesFromContainer() {
        const hrefs = this.#nodes.thumbnails.getElementsByTagName('a');
        for(let i=0; i < hrefs.length; i++) {
            const a = hrefs[i];
            // add index image to node
            a.setAttribute('data-index', i);
            // save image variables
            let src = {
                'small': false,
                'medium': false,
                'big': a.getAttribute('href')
            };
            // check exists medium size
            let mediumImage = false;
            if(a.dataset.medium) {
                src.medium = a.dataset.medium;
            }
            // get small image link
            const smallImage = a.querySelector('img');
            if(false != smallImage) {
                src.small = smallImage.getAttribute('src');
                this.addImage(src.small, src.medium, src.big, smallImage.getAttribute('alt'), a)
            }
        }
    }

    bindEvents() {
        if(this.#images.length) {
            this.#images.forEach(img => img.link.addEventListener('click', this.handleClickByThumbnail))

            // bind click event by main image
            const img = this.#nodes.dest.querySelector('img');
            img.addEventListener('click', () => this.handleClickByMainImage(0))
        }
    }

    createLoader() {
        const loader = document.createElement('div');
        loader.classList.toggle('loader',true);
        return loader;
    }

    handleClickByThumbnail = (e) => {
        const target = e.currentTarget;
        const index = parseInt(target.dataset.index);

        e.preventDefault();

        this.#state.lastClickedIndex = index;
        if(this.#state.selected == index) {
            return false;
        }
        const item = this.#images[index];

        // mark current thumbnail
        this.#nodes.thumbnails.querySelectorAll('a').forEach((t) => t.classList.toggle('selected',false));
        target.classList.toggle('selected');

        this.#nodes.dest.innerHTML = '';

        // show image name if exists
        let imageName;
        (item.name) ?  imageName = item.name : imageName = '';
        this.#nodes.imageName.innerHTML = imageName;

        if(item.medium.isLoaded === false) {
            this.#state.loading = true;
            // show loader
            this.#nodes.dest.classList.toggle('loading', true);
            this.#nodes.dest.append(this.createLoader());

            // try to load medium size of image
            item.medium.img.src = item.medium.src;
            // bind event when loaded
            item.medium.img.onload = () => {
                // save loaded state
                item.medium.isLoaded = true;
                // change main image only when this is last click
                if(this.#state.lastClickedIndex == index) {
                    this.#nodes.dest.classList.toggle('loading', false);
                    this.#nodes.dest.innerHTML = '';
                    // set state of loading in component
                    this.#state.loading = false;
                    this.showImage(index);
                }
            }
        } else {
            this.showImage(index);
        }
    }

    showImage(index) {
        const item = this.#images[index];
        // save selected image
        this.#state.selected = index;
        // show main image
        const img = document.createElement('img');
        img.setAttribute('src', item.medium.src);
        item.name && img.setAttribute('alt', item.name);
        this.#nodes.dest.append(img);
        // bind click event by main image
        img.addEventListener('click', () => this.handleClickByMainImage(index))
    }

    closeViewbox() {
        this.#nodes.backdrop.classList.toggle('show', false);
        this.#nodes.viewbox.classList.toggle('show', false);
        this.removeLoader();
    }

    createViewbox() {
        const d = document;
        const body = d.querySelector('body');
        let viewbox;
        // try to find viewebox in body root
        const viewboxFromHTML = d.querySelector('body > .viewebox')
        if(!viewboxFromHTML) {

            // create viewebox
            viewbox = d.createElement('div');
            viewbox.classList.toggle('viewbox', true);
            body.append(viewbox);

            // create close button
            const closeBtn = this.createIcon('close');
            const touch = {'left':false,'right':false};

            closeBtn.classList.toggle('close', true);
            closeBtn.addEventListener('click', this.closeViewbox.bind(this));
            viewbox.append(closeBtn);

            const nav = document.createElement('div');
            nav.classList.toggle('nav', true);

            touch.left = document.createElement('div');
            touch.left.classList.toggle('left', true);

            touch.right = document.createElement('div');
            touch.right.classList.toggle('right', true);

            // create arrows
            touch.left.append(this.createIcon('chevron-left'));
            touch.right.append(this.createIcon('chevron-right'));

            nav.append(touch.left);
            nav.append(touch.right);

            touch.left.addEventListener('click', this.prev.bind(this));
            touch.right.addEventListener('click', this.next.bind(this));
            viewbox.append(nav);

            // save touch nodes
            this.#nodes.touch.left = touch.left;
            this.#nodes.touch.right = touch.right;

        } else {
            viewbox = viewboxFromHTML;
        }
        this.#nodes.viewbox = viewbox;
    }

    prev(e) {
        const el = e.currentTarget;
        const prevIndex = parseInt(el.dataset.prev);
        this.#state.fullImageIndex = prevIndex;

        this.setFullImage(prevIndex);
    }

    next(e) {
        const el = e.currentTarget;
        const nextIndex = parseInt(el.dataset.next);
        this.#state.fullImageIndex = nextIndex;

        this.setFullImage(nextIndex);
    }

    handleClickByMainImage(index) {

        const d = document;
        const body = d.querySelector('body');

        this.#state.fullImageIndex = index;

        // show backdrop
        if(this.#nodes.backdrop == false) {
            let backdrop;
            // try to find backdrop in body root
            const backdropFromHTML = d.querySelector('body > .backdrop')
            if(!backdropFromHTML) {
                // create backdrop
                backdrop = d.createElement('div');
                backdrop.classList.toggle('backdrop', true);
                body.append(backdrop);
            } else {
                backdrop = backdropFromHTML;
            }
            this.#nodes.backdrop = backdrop;
            // bind event
            this.#nodes.backdrop.addEventListener('click', this.closeViewbox.bind(this));
        }
        // show backdrop
        this.#nodes.backdrop.classList.toggle('show', true);

        // create viewbox if need
        (this.#nodes.viewbox == false) && this.createViewbox();

        // show viewbox
        this.#nodes.viewbox.classList.toggle('show', true);

        this.setFullImage(index);
    }

    setFullImage(index) {

        this.removeLoader();
        this.changeNavIndexes();

        const b = this.#images[index].big;
        // clear image
        const oldImage = this.#nodes.viewbox.querySelector('.fullImage');
        if(oldImage) {
            oldImage.remove();
        }
        // check big image loaded status
        if(b.isLoaded === false) {
            // show loader
            const loader = this.createLoader();
            loader.classList.toggle('white', true);

            this.#nodes.viewbox.classList.toggle('loading', true);
            this.#nodes.viewbox.append(loader);

            b.img.src = b.src;
            b.img.onload = () => {
                // save loaded state
                b.isLoaded = true;
                // change main image only when this is last click
                if(this.#state.fullImageIndex == index) {
                    this.removeLoader();
                    // show image
                    this.showFullImage(index);
                }
            }
        } else {
            // show image
            this.showFullImage(index);
        }
    }

    changeNavIndexes() {
        const index = this.#state.fullImageIndex;
        // rebind nav events
        let n = {
            'next': false,
            'prev': false
        };
        // next
        (index + 1 < this.#images.length) ? n.next = index + 1 : n.next = 0;
        // prev
        (index - 1 >= 0) ? n.prev = (index - 1) : n.prev = this.#images.length;
        this.#nodes.touch.left.setAttribute('data-prev', n.prev);
        this.#nodes.touch.right.setAttribute('data-next', n.next);
    }

    removeLoader() {
        // remove loader
        const loader = this.#nodes.viewbox.querySelector('.loader');
        if(loader) {
            this.#nodes.viewbox.classList.toggle('loading', false);
            loader.remove();
        }
    }

    showFullImage(index) {
        const b = this.#images[index].big;
        // create image
        const img = document.createElement('img');
        img.classList.toggle('fullImage', true);
        img.src = b.src;
        this.#nodes.viewbox.append(img);
    }

    toggleClasses(el, cls, mode = true) {
        cls.map(cl => el.classList.toggle('cl', mode))
    }

    createIcon(iconId) {
        const svg = document.createElementNS(this.#xmlns, 'svg');
        const useTag = document.createElementNS(this.#xmlns, 'use');
        useTag.setAttributeNS(this.#xmlns, 'xlink', 'http://www.w3.org/1999/xlink');
        useTag.setAttributeNS(this.#xlink, 'xlink:href', 'assets/ui.svg#'+iconId);
        svg.append(useTag);
        return svg;
    }

    addImage(srcSmall, srcMedium, srcBig, name, link) {
        this.#images.push({
            'small': { 'src': srcSmall },
            'medium': { 'src': srcMedium, 'img': new Image(), 'isLoaded': false },
            'big': { 'src': srcBig, 'img': new Image(), 'isLoaded': false },
            'name': name,
            'link': link
        })
    }

}
