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
/**
 * @type {HTMLTextAreaElement}
 */
let DESCRIPTION_INPUT;
let editingCard = null;
const selectedCards = [];

class IdeaCard {
    static initialize() {
        TITLE_INPUT = document.getElementById("title-input");
        TITLE_INPUT.addEventListener("input", () => { 
            if(editingCard) {
                editingCard.title = TITLE_INPUT.value;
            }
        });

        DESCRIPTION_INPUT = document.getElementById("description-input");
        DESCRIPTION_INPUT.addEventListener("input", () => {
            if(editingCard) {
                editingCard.description = DESCRIPTION_INPUT.value;
            }
        });

        Array.from(document.getElementsByClassName("dropdown-item")).forEach((v) => {
            const c = v.style.background.match(/linear-gradient\((\w+) 60%, white\)/)[1];

            v.addEventListener("click", () => {
                while (selectedCards.length > 0) {
                    selectedCards[0].color = c;
                    selectedCards[0].deselect();
                }
            });
        });


    }

    static cardArray = []
    
    constructor() {
        if(!TITLE_INPUT) {
            IdeaCard.initialize();
        }

        this.groupElement = document.createElementNS("http://www.w3.org/2000/svg", "g");
        this.cardElement = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        this.titleElement = document.createElementNS("http://www.w3.org/2000/svg", "text");

        this.selected = false;

        this._color = "#ababab";

        this.arrows = [];

        this.titleElement.style.userSelect = "none";

        this.descriptionElement = document.createElementNS("http://www.w3.org/2000/svg", "g");
        this._desc = "";
        this.resizeElement = document.createElementNS("http://www.w3.org/2000/svg", "path");

        this.groupElement.setAttribute("class", "group-element");
        this.cardElement.setAttribute("class", "idea-card");
        this.titleElement.setAttribute("class", "idea-card-title");
        this.descriptionElement.setAttribute("class", "idea-card-description");
        this.resizeElement.setAttribute("class", "idea-card-resize");

        this.groupElement.append(this.cardElement, this.titleElement, this.descriptionElement, this.resizeElement);
        this.nodes = new Nodes()

        this.addEvents();
        this.hover = false
        IdeaCard.cardArray.push(this)
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
            scope.hover = true
            scope.nodes.appendNodes(scope)
        }

        function OnMouseExit() {
            setTimeout(() => { scope.nodes.dissolveNodes() }, 300);
            scope.hover = false
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
            scope.nodes.dissolveNodes()
            scope.width += ev.movementX * sc;
            scope.height += ev.movementY * sc;
        }

        function OnMouseUp() {
            scope.nodes.appendNodes(scope)
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

        function getMousePositionSVG(ev) {
            var point = whiteboard.createSVGPoint();
            point.x = ev.clientX;
            point.y = ev.clientY;
            point = point.matrixTransform(whiteboard.getScreenCTM().inverse());
            return point;
        }

        function OnDoubleClick(ev) {
            if(!scope.containerElement) {
                scope.deselect();
                return;
            }

            editingCard = scope;

            scope.toggleSelection();

            const pt = getMousePositionSVG(ev);

            if(pt.y < scope.y + 20) {
                TITLE_INPUT.value = scope.title;
                TITLE_INPUT.focus();
            } else {
                DESCRIPTION_INPUT.value = scope.description;
                DESCRIPTION_INPUT.focus();
            }
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

    deselect() {
        if(this.selected) {
            selectedCards.splice(selectedCards.indexOf(this), 1);
            this.cardElement.style.stroke = "#ababab";
            this.selected = false;
        }
    }

    select() {
        if(!this.selected) {
            selectedCards.push(this);
            this.cardElement.style.stroke = "#000000";
            this.cardElement.style.strokeWidth = "2.5px";
            this.selected = true;
        }
    }

    toggleSelection() {
        if(this.selected) {
            this.deselect();
        } else {
            this.select();
        }
    }

    remove() {
        this.groupElement.remove();

        for(const arrow of this.arrows) {
            arrow.remove();
            arrow.setBetweenCards(null, null);
        }
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

    updateDescriptionElement() {
        while(this.descriptionElement.children.length > 0) {
            this.descriptionElement.children[0].remove();
        }

        const words = this._desc.split(" ");
        let line = "", elem = document.createElementNS("http://www.w3.org/2000/svg", "text");
        this.descriptionElement.appendChild(elem);
        elem.setAttribute("y", this.y + 20);
        elem.setAttribute("x", this.x + CARD_TITLE_PADDING);

        let lines = 1;
        for(let i = 0; i < words.length && 20 + lines * 16 < this.height; i++) {
            line += words[i] + " ";

            elem.textContent = line;

            if(elem.getComputedTextLength() > this.width - 2 * CARD_TITLE_PADDING) {
                line = line.substring(0, line.length - words[i].length - 1);
                elem.textContent = line;
                
                line = "";
                elem = document.createElementNS("http://www.w3.org/2000/svg", "text");
                this.descriptionElement.appendChild(elem);
                elem.setAttribute("y", this.y + 20 + lines * 16);
                elem.setAttribute("x", this.x + CARD_TITLE_PADDING);
                lines++;
                i--;
            }
        }
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
        this._desc = description;
        this.updateDescriptionElement();
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
        
        this.updateDescriptionElement();

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

        this.updateDescriptionElement();

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

        this.updateDescriptionElement();

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

        this.updateDescriptionElement();
        
        for(const arrow of this.arrows) {
            arrow.updateFromSetCards();
        }
    }

    get textLength() {
        return this.titleElement.getComputedTextLength();
    }

    set color(color) {
        let oldColor = this._color;

        this._color = color;
        this.cardElement.style.fill = color;

        Groups.updateColorGroup(oldColor, this);
    }

    get color() {
        return this._color;
    }
}

