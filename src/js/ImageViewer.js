function ImageViewer() {

}

ImageViewer.prototype = {
    debug: true,
    nodes: {
        'backdrop': false,
        'image': false,
        'nails': false
    },
    state: {},
    // functions:
    init: () => {
        console.log('init ImageViewer');
    }
}