export default class ImageComponent {
    initializer(config) {
        this.addVariable({
            name: "image"
        })

        this.imageObj = new Image()
        this.imageObj.src = this.getImageUrl()
    }

    getImageUrl() {
        return "/assets/" + this.getImage()
    }

    getImageObj() {
        return this.imageObj
    }
}