// Constants
const MIN_CARD_WIDTH = 10;
const MIN_CARD_HEIGHT = 20;
const CARD_TITLE_PADDING = 4; // Distance on either side

const RESIZE_ELEMENT_LENGTH = 12;
const RESIZE_ELEMENT_BORDER_RADIUS = 5; // Pull from CSS
const RESIZE_ELEMENT_BORDER_WIDTH = 1.5; // Pull from CSS

/**
 * @type {HTMLInputElement}
 */
let TITLE_INPUT;
let editingCard = null;

class IdeaCard {
    constructor() {
        if(!TITLE_INPUT) {
            TITLE_INPUT = document.getElementById("title-input");
            TITLE_INPUT.addEventListener("input", () => { 
                if(editingCard) {
                    editingCard.title = TITLE_INPUT.value;
                }
            });
        }

        this.groupElement = document.createElementNS("http://www.w3.org/2000/svg", "g");
        this.cardElement = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        this.titleElement = document.createElementNS("http://www.w3.org/2000/svg", "text");

        this.arrows = [];

        this.titleElement.style.userSelect = "none";

        this.descriptionElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
        this.resizeElement = document.createElementNS("http://www.w3.org/2000/svg", "path");

        this.groupElement.setAttribute("class", "group-element");
        this.cardElement.setAttribute("class", "idea-card");
        this.titleElement.setAttribute("class", "idea-card-title");
        this.descriptionElement.setAttribute("class", "idea-card-description");
        this.resizeElement.setAttribute("class", "idea-card-resize");

        this.groupElement.append(this.cardElement, this.titleElement, this.descriptionElement, this.resizeElement);
        this.nodes = new Nodes()

        this.addEvents();
    }

    addTo(element) {
        this.containerElement = element;
        element.appendChild(this.groupElement);
    }

    addEvents() {
        this.addMovementEvents();
        this.addResizeEvents();
        this.addEditEvents();
        this.addHoverEvents()
    }

    addHoverEvents() {
        const scope = this; 

        function OnMouseEnter() {
            scope.cardElement.removeEventListener("mouseenter", OnMouseEnter);
            scope.cardElement.addEventListener("mouseleave", OnMouseExit);
            scope.nodes.appendNodes(scope)
        }

        function OnMouseExit() {
            scope.nodes.dissolveNodes()
            scope.cardElement.removeEventListener("mouseleave", OnMouseExit);
            scope.cardElement.addEventListener("mouseenter", OnMouseEnter);
        }

        this.cardElement.addEventListener("mouseenter", OnMouseEnter);
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
            scope.nodes.dissolveNodes()
            scope.x += ev.movementX * sc;
            scope.y += ev.movementY * sc;
        }

        function OnMouseUp() {
            if(scope.containerElement) {
                scope.containerElement.removeEventListener("mousemove", OnMouseMove);
                scope.containerElement.removeEventListener("mouseup", OnMouseUp);
                scope.cardElement.addEventListener("mousedown", OnMouseDown);
                scope.nodes.appendNodes(scope)
            }
        }

        this.cardElement.addEventListener("mousedown", OnMouseDown);
    }

    addResizeEvents() {
        console.log("Hi");

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

    addEditEvents() {
        const scope = this;

        function OnDoubleClick() {
            if(!scope.containerElement)
                return;

            editingCard = scope;

            TITLE_INPUT.value = scope.title;
            TITLE_INPUT.focus();
        }

        function OnClick() {
            if(editingCard)
                editingCard = null;
        }

        this.cardElement.addEventListener("dblclick", OnDoubleClick);
        this.titleElement.addEventListener("dblclick", OnDoubleClick);

        this.cardElement.addEventListener("click", OnClick);
        this.titleElement.addEventListener("click", OnClick);
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

        const r1 = viewWidth / styleWidth;
        const r2 = viewHeight / styleHeight;

        if(r1 > r2) {
            return r1;
        } else {
            return r2;
        }
    }

    getResizePathString() {
        return `M ${this.x + this.width - RESIZE_ELEMENT_LENGTH + RESIZE_ELEMENT_BORDER_WIDTH / 2},${this.y + this.height - RESIZE_ELEMENT_BORDER_WIDTH / 2} h ${RESIZE_ELEMENT_LENGTH - RESIZE_ELEMENT_BORDER_RADIUS - RESIZE_ELEMENT_BORDER_WIDTH / 2} a ${RESIZE_ELEMENT_BORDER_RADIUS - RESIZE_ELEMENT_BORDER_WIDTH / 2},${RESIZE_ELEMENT_BORDER_RADIUS - RESIZE_ELEMENT_BORDER_WIDTH / 2}, 0 0 0 ${RESIZE_ELEMENT_BORDER_RADIUS - RESIZE_ELEMENT_BORDER_WIDTH / 2},-${RESIZE_ELEMENT_BORDER_RADIUS - RESIZE_ELEMENT_BORDER_WIDTH / 2} v -${RESIZE_ELEMENT_LENGTH - RESIZE_ELEMENT_BORDER_RADIUS - RESIZE_ELEMENT_BORDER_WIDTH / 2} Z`;
    }

    overlapsWith(other) {
        const isOverlapping1D = (xmin1, xmax1, xmin2, xmax2) => xmax1 >= xmin2 && xmax2 >= xmin1;

        return isOverlapping1D(this.x, this.x + this.width, other.x, other.x + other.width) &&
               isOverlapping1D(this.y, this.y + this.height, other.y, other.y + other.height);
            
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

        for(const arrow of this.arrows) {
            arrow.updateFromSetCards();
        }
    }

    get height() {
        return this.cardElement.height.baseVal.value;
    }

    set height(height) {
        height = Math.max(height, MIN_CARD_HEIGHT);
        this.cardElement.height.baseVal.value = height;

        this.resizeElement.setAttribute("d", this.getResizePathString());

        for(const arrow of this.arrows) {
            arrow.updateFromSetCards();
        }
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
        
        for(const arrow of this.arrows) {
            arrow.updateFromSetCards();
        }
    }

    get y() {
        return this.cardElement.y.baseVal.value;
    }

    set y(y) {
        this.cardElement.y.baseVal.value = y;
        this.titleElement.setAttribute("y", y + CARD_TITLE_PADDING);
        this.resizeElement.setAttribute("d", this.getResizePathString());
        
        for(const arrow of this.arrows) {
            arrow.updateFromSetCards();
        }
    }

    get textLength() {
        return this.titleElement.getComputedTextLength();
    }
}
