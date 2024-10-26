// Constants
const MIN_CARD_WIDTH = 10;
const MIN_CARD_HEIGHT = 10;
const CARD_TITLE_PADDING = 3; // Distance on either side

const RESIZE_ELEMENT_LENGTH = 10;
const RESIZE_ELEMENT_BORDER_RADIUS = 5; // Pull from CSS
const RESIZE_ELEMENT_BORDER_WIDTH = 1.5; // Pull from CSS

class IdeaCard {
    constructor() {
        this.groupElement = document.createElementNS("http://www.w3.org/2000/svg", "g");
        this.cardElement = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        this.titleElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
        this.descriptionElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
        this.resizeElement = document.createElementNS("http://www.w3.org/2000/svg", "path");

        this.groupElement.setAttribute("class", "group-element");
        this.cardElement.setAttribute("class", "idea-card");
        this.titleElement.setAttribute("class", "idea-card-title");
        this.descriptionElement.setAttribute("class", "idea-card-description");
        this.resizeElement.setAttribute("class", "idea-card-resize");

        this.groupElement.append(this.cardElement, this.titleElement, this.descriptionElement, this.resizeElement);

        this.addEvents();
    }

    addTo(element) {
        this.containerElement = element;
        element.appendChild(this.groupElement);
    }

    addEvents() {
        this.addMovementEvents();
        this.addResizeEvents()
    }

    addMovementEvents() {
        const scope = this;
        let sc = 0;

        function OnMouseDown(ev) {
            if(scope.containerElement) {
                scope.cardElement.removeEventListener("mousedown", OnMouseDown);
                scope.containerElement.addEventListener("mousemove", OnMouseMove);
                scope.containerElement.addEventListener("mouseup", OnMouseUp);

                sc = scope.getScaleFactor();
            }
        }

        function OnMouseMove(ev) {
            scope.x += ev.movementX * sc;
            scope.y += ev.movementY * sc;
        }

        function OnMouseUp() {
            if(scope.containerElement) {
                scope.containerElement.removeEventListener("mousemove", OnMouseMove);
                scope.containerElement.removeEventListener("mouseup", OnMouseUp);
                scope.cardElement.addEventListener("mousedown", OnMouseDown);
            }
        }

        this.cardElement.addEventListener("mousedown", OnMouseDown);
    }

    addResizeEvents() {
        const scope = this;

        let sc = 0;

        function OnMouseDown(ev) {
            if(scope.containerElement) {
                scope.resizeElement.removeEventListener("mousedown", OnMouseDown);
                scope.containerElement.addEventListener("mousemove", OnMouseMove);
                scope.containerElement.addEventListener("mouseup", OnMouseUp);
                sc = scope.getScaleFactor();
                ev.stopPropagation();
            }
        }

        function OnMouseMove(ev) {
            scope.width += ev.movementX * sc;
            scope.height += ev.movementY * sc;
        }

        function OnMouseUp() {
            if(scope.containerElement) {
                scope.containerElement.removeEventListener("mousemove", OnMouseMove);
                scope.containerElement.removeEventListener("mouseup", OnMouseUp);
                scope.resizeElement.addEventListener("mousedown", OnMouseDown);
            }
        }

        this.resizeElement.addEventListener("mousedown", OnMouseDown);
    }

    getScaleFactor() {
        if(!this.containerElement)
            return 0;

        const viewbox = this.containerElement.getAttribute("viewBox");
        if(!viewbox)
            return 0;

        const [,,viewWidth, viewHeight] = viewbox.split(" ").map((v) => parseInt(v));
        const compStyle = window.getComputedStyle(this.containerElement);

        const styleWidth = parseInt(compStyle.width.replace("px", ""));
        const styleHeight = parseInt(compStyle.height.replace("px", ""));

        if(styleWidth < styleHeight) {
            return viewWidth / styleWidth;
        } else {
            return viewHeight / styleHeight;
        }
    }

    getResizePathString() {
        return `M ${this.x + this.width - RESIZE_ELEMENT_LENGTH + RESIZE_ELEMENT_BORDER_WIDTH / 2},${this.y + this.height - RESIZE_ELEMENT_BORDER_WIDTH / 2} h ${RESIZE_ELEMENT_LENGTH - RESIZE_ELEMENT_BORDER_RADIUS - RESIZE_ELEMENT_BORDER_WIDTH / 2} a ${RESIZE_ELEMENT_BORDER_RADIUS - RESIZE_ELEMENT_BORDER_WIDTH / 2},${RESIZE_ELEMENT_BORDER_RADIUS - RESIZE_ELEMENT_BORDER_WIDTH / 2}, 0 0 0 ${RESIZE_ELEMENT_BORDER_RADIUS - RESIZE_ELEMENT_BORDER_WIDTH / 2},-${RESIZE_ELEMENT_BORDER_RADIUS - RESIZE_ELEMENT_BORDER_WIDTH / 2} v -${RESIZE_ELEMENT_LENGTH - RESIZE_ELEMENT_BORDER_RADIUS - RESIZE_ELEMENT_BORDER_WIDTH / 2} Z`;
        // return `M ${this.x + this.width - RESIZE_ELEMENT_LENGTH},${this.y + this.height} h ${RESIZE_ELEMENT_LENGTH - RESIZE_ELEMENT_BORDER_RADIUS} a ${RESIZE_ELEMENT_BORDER_RADIUS},${RESIZE_ELEMENT_BORDER_RADIUS} 0 0 0 ${RESIZE_ELEMENT_BORDER_RADIUS},-${RESIZE_ELEMENT_BORDER_RADIUS} v ${RESIZE_ELEMENT_LENGTH - RESIZE_ELEMENT_BORDER_RADIUS} Z`;
    }

    get title() {
        return this.titleElement.textContent || "";
    }

    set title(title) {
        this.titleElement.textContent = title;

        const length = this.textLength;
        if(length > this.width - 2 * CARD_TITLE_PADDING) {
            this.width = length + 2 * CARD_TITLE_PADDING;
        } else {
            const textOffset = (this.width - length) / 2;
            this.titleElement.setAttribute("x", this.x + textOffset);
        }
    }

    get description() {
        return this.descriptionElement.textContent || "";
    }

    set description(description) {
        this.descriptionElement.textContent = description;
    }

    get width() {
        return this.cardElement.width.baseVal.value;
    }

    set width(width) {
        const len = this.textLength;

        width = Math.max(width, Math.max(MIN_CARD_WIDTH, len + 2 * CARD_TITLE_PADDING));
        this.cardElement.width.baseVal.value = width;

        const textOffset = (this.width - len) / 2;
        this.titleElement.setAttribute("x", this.x + textOffset);
        
        this.resizeElement.setAttribute("d", this.getResizePathString());
    }

    get height() {
        return this.cardElement.height.baseVal.value;
    }

    set height(height) {
        height = Math.max(height, MIN_CARD_HEIGHT);
        this.cardElement.height.baseVal.value = height;

        this.resizeElement.setAttribute("d", this.getResizePathString());
    }

    get x() {
        return this.cardElement.x.baseVal.value;
    }

    set x(x) {
        this.cardElement.x.baseVal.value = x;
        const len = this.textLength;
        const textOffset = (this.width - len) / 2;
        this.titleElement.setAttribute("x", x + textOffset);

        this.resizeElement.setAttribute("d", this.getResizePathString());
    }

    get y() {
        return this.cardElement.y.baseVal.value;
    }

    set y(y) {
        this.cardElement.y.baseVal.value = y;
        this.titleElement.setAttribute("y", y + CARD_TITLE_PADDING);
        this.resizeElement.setAttribute("d", this.getResizePathString());
    }

    get textLength() {
        return this.titleElement.getComputedTextLength();
    }
}
