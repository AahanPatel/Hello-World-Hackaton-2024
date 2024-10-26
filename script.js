// Constants
const MIN_CARD_WIDTH = 10;
const MIN_CARD_HEIGHT = 10;
const CARD_TITLE_PADDING = 1; // Distance on either side
const RESIZE_ELEMENT_LENGTH = 10;

class IdeaCard {
    constructor() {
        this.groupElement = document.createElementNS("http://www.w3.org/2000/svg", "g");
        this.cardElement = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        this.titleElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
        this.descriptionElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
        this.resizeElement = document.createElementNS("http://www.w3.org/2000/svg", "path");

        this.cardElement.setAttribute("fill", "white");
        this.cardElement.setAttribute("stroke", "black");

        this.titleElement.setAttribute("fill", "black");
        this.titleElement.setAttribute("dominant-baseline", "hanging");

        this.resizeElement.setAttribute("fill", "grey");
        this.resizeElement.setAttribute("stroke", "none");

        this.groupElement.append(this.cardElement, this.titleElement, this.descriptionElement, this.resizeElement);
    }

    addTo(element) {
        element.appendChild(this.groupElement);
    }

    get title() {
        return this.titleElement.textContent || "";
    }

    set title(title) {
        this.titleElement.textContent = title;

        const length = this.titleElement.getComputedTextLength();
        if(length > this.width - 2 * CARD_TITLE_PADDING) {
            this.width = length + 2 * CARD_TITLE_PADDING;
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
        width = Math.max(width, MIN_CARD_WIDTH);
        this.cardElement.width.baseVal.value = width;
        
        this.resizeElement.setAttribute("d", `M ${this.x + this.width},${this.y + this.height} l -${RESIZE_ELEMENT_LENGTH},0 l ${RESIZE_ELEMENT_LENGTH},-${RESIZE_ELEMENT_LENGTH} Z`);
    }

    get height() {
        return this.cardElement.height.baseVal.value;
    }

    set height(height) {
        height = Math.max(height, MIN_CARD_HEIGHT);
        this.cardElement.height.baseVal.value = height;

        this.resizeElement.setAttribute("d", `M ${this.x + this.width},${this.y + this.height} l -${RESIZE_ELEMENT_LENGTH},0 l ${RESIZE_ELEMENT_LENGTH},-${RESIZE_ELEMENT_LENGTH} Z`);
    }

    get x() {
        return this.cardElement.x.baseVal.value;
    }

    set x(x) {
        this.cardElement.x.baseVal.value = x;
        this.titleElement.setAttribute("x", x + CARD_TITLE_PADDING);
        this.resizeElement.setAttribute("d", `M ${this.x + this.width},${this.y + this.height} l -${RESIZE_ELEMENT_LENGTH},0 l ${RESIZE_ELEMENT_LENGTH},-${RESIZE_ELEMENT_LENGTH} Z`);
    }

    get y() {
        return this.cardElement.y.baseVal.value;
    }

    set y(y) {
        this.cardElement.y.baseVal.value = y;
        this.titleElement.setAttribute("y", y + CARD_TITLE_PADDING);
        this.resizeElement.setAttribute("d", `M ${this.x + this.width},${this.y + this.height} l -${RESIZE_ELEMENT_LENGTH},0 l ${RESIZE_ELEMENT_LENGTH},-${RESIZE_ELEMENT_LENGTH} Z`);
    }
}

function main() {
    const whiteboard = document.getElementById("whiteboard");

    const card = new IdeaCard();

    card.width = card.height = 100;
    card.x = card.y = 50;
    card.title = "Hi";

    card.addTo(whiteboard);

    console.log(card);
}

window.onload = main;