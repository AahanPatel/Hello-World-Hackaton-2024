class Arrow {
    constructor() {
        this.arrowElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
        this.arrowElement.setAttribute("stroke", "black");
        this.arrowElement.setAttribute("fill", "none");
        this.arrowElement.setAttribute("stroke-linecap", "round");

        this._startPoint = [0, 0];
        this._endPoint = [0, 0];
    }

    addTo(element) {
        element.appendChild(this.arrowElement);
    }

    get startX() {
        return this._startPoint[0];
    }

    set startX(x) {
        this._startPoint[0] = x;
        this._recalculateArrow();
    }

    get startY() {
        return this._startPoint[1];
    }

    set startY(y) {
        this._startPoint[1] = y;
        this._recalculateArrow();
    }

    get endX() {
        return this._endPoint[0];
    }

    set endX(x) {
        this._endPoint[0] = x;
        this._recalculateArrow();
    }

    get endY() {
        return this._endPoint[1];
    }

    set endY(y) {
        this._endPoint[1] = y;
        this._recalculateArrow();
    }

    setStartPoint(x, y) {
        this._startPoint[0] = x;
        this._startPoint[1] = y;
        this._recalculateArrow();
    }

    setEndPoint(x, y) {
        this._endPoint[0] = x;
        this._endPoint[1] = y;
        this._recalculateArrow();
    }

    _recalculateArrow() {
        throw "_recalculateArrow not implemented for base arrow class";
    }
}