export default class ImageComponent {
    initializer(config) {
        this.addVariable({
            name: "image",
            default: "white.png"
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