class ImageViewer {

    #ids = {
        'viewerGrid': false
    }

    // array of objects
    #images = [];

    #nodes = {
        'wrapper': false,
        'mainImage': false,
        'thumbnails': false,
    }

    #state = {
        'selected': 0
    }

    constructor(viewerId) {
        this.#ids.viewerGrid = viewerId;
        this.init();
    }

    init() {
        // get component wrapper
        this.#nodes.wrapper = document.getElementById(this.#ids.viewerGrid);
        if(!this.#nodes.wrapper) {
            console.log('Can\'t find ImageViewer wrapper node');
            return false;
        }
        // get main image dest
        this.#nodes.mainImage = this.#nodes.wrapper.querySelector('.mainImage .dst');
        if(!this.#nodes.mainImage) {
            console.log('Can\'t find ImageViewer main image destination node');
            return false;
        }
        // get thumbnails container
        this.#nodes.thumbnails = this.#nodes.wrapper.querySelector('.thumbnails');
        // read and load images
        if(this.#nodes.thumbnails) {
            this.getImagesFromContainer();
            this.bindEvents();
            this.preloadImages();
        } else {
            console.log('Can\'t find ImageViewer thumbnails container node');
            return false;
        }
    }

    preloadImages = () => {
        console.log('preload images...');
        this.#images.forEach((item) => {
            // preload all medium sizes
            item.medium.img.onload = () => { console.log('image is loaded...') }
            item.medium.img.src = item.medium.src;
            // big size we will preloaded when image is selected

        })

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
        }
    }

    handleClickByThumbnail = (e) => {
        const target = e.currentTarget;
        const index = parseInt(target.dataset.index);

        e.preventDefault();

        if(this.#state.selected == index) {
            return false;
        }
        const item = this.#images[index];

        // mark current thumbnail
        this.#nodes.thumbnails.querySelectorAll('a').forEach((t) => t.classList.toggle('selected',false));
        target.classList.toggle('selected');
        this.#state.selected = index;

        // update main image
        const img = document.createElement('img');
        img.setAttribute('src', item.medium.src);
        item.name && img.setAttribute('alt', item.name);

        this.#nodes.mainImage.innerHTML = '';
        this.#nodes.mainImage.append(img);
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

    showImage(index) {
    }

}