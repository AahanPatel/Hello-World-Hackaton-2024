// Constants
const ARROW_HEAD_LENGTH = 15;
const ARROW_HEAD_ANGLE = 30; // Degrees on either side of the shaft
const DEFAULT_DASH_SIZE = 10;
const DEFAULT_DOT_DISTANCE = 4;

const ARROW_HEAD_ANGLE_RADIANS = ARROW_HEAD_ANGLE * Math.PI / 180; // DO NOT CHANGE THIS

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

class SolidArrow extends Arrow {
    _recalculateArrow() {
        const [startX, startY] = this._startPoint;
        const [endX, endY] = this._endPoint;

        const dx = endX - startX;
        const dy = endY - startY;

        const ang = Math.atan2(dy, dx);

        const low = ang - ARROW_HEAD_ANGLE_RADIANS;
        const high = ang + ARROW_HEAD_ANGLE_RADIANS;

        const pt1x = endX - Math.cos(low) * ARROW_HEAD_LENGTH;
        const pt1y = endY - Math.sin(low) * ARROW_HEAD_LENGTH;

        const pt2x = endX - Math.cos(high) * ARROW_HEAD_LENGTH;
        const pt2y = endY - Math.sin(high) * ARROW_HEAD_LENGTH;

        this.arrowElement.setAttribute("d", `M ${startX}, ${startY} L ${endX}, ${endY} M ${endX}, ${endY} L ${pt1x}, ${pt1y} M ${endX}, ${endY} L ${pt2x}, ${pt2y}`);
    }
}

class DashedArrow extends Arrow {
    constructor(dashSize = DEFAULT_DASH_SIZE) {
        super();
        this.dashSize = dashSize;
    }

    _recalculateArrow() {
        const [startX, startY] = this._startPoint;
        const [endX, endY] = this._endPoint;

        let dx = endX - startX;
        let dy = endY - startY;

        let ang = Math.atan2(dy, dx);
        let mag = Math.hypot(dx, dy);

        let dirX = Math.cos(ang);
        let dirY = Math.sin(ang);

        const low = ang - ARROW_HEAD_ANGLE_RADIANS;
        const high = ang + ARROW_HEAD_ANGLE_RADIANS;

        const pt1x = endX - Math.cos(low) * ARROW_HEAD_LENGTH;
        const pt1y = endY - Math.sin(low) * ARROW_HEAD_LENGTH;

        const pt2x = endX - Math.cos(high) * ARROW_HEAD_LENGTH;
        const pt2y = endY - Math.sin(high) * ARROW_HEAD_LENGTH;

        let pathStr = `M ${startX}, ${startY}`;

        let numSteps = Math.round(mag / (2 * this.dashSize));

        for(let i = 0; i < numSteps; i++) {
            pathStr += `l ${dirX * this.dashSize}, ${dirY * this.dashSize} m ${dirX * this.dashSize}, ${dirY * this.dashSize}`;
        }
        this.arrowElement.setAttribute("d", `${pathStr} M ${endX}, ${endY} L ${pt1x}, ${pt1y} M ${endX}, ${endY} L ${pt2x}, ${pt2y}`);
    }
}

class DottedArrow extends Arrow {
    constructor(from, to, dotDistance = 10) {
        super(from, to);

        this.arrowElement = document.createElementNS("http://www.w3.org/2000/svg", "g");
        this.lineElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
        this.headElement = document.createElementNS("http://www.w3.org/2000/svg", "path");

        this.lineElement.setAttribute("stroke-width", "2");

        this.arrowElement.append(this.lineElement, this.headElement);

        this.arrowElement.setAttribute("stroke", "black");
        this.arrowElement.setAttribute("fill", "none");
        this.arrowElement.setAttribute("stroke-linecap", "round");

        this.dotDistance = dotDistance;
    }

    _recalculateArrow() {
        const [startX, startY] = this._startPoint;
        const [endX, endY] = this._endPoint;

        let dx = endX - startX;
        let dy = endY - startY;

        let ang = Math.atan2(dy, dx);
        let mag = Math.hypot(dx, dy);

        let dirX = Math.cos(ang);
        let dirY = Math.sin(ang);

        const low = ang - Math.PI / 6;
        const high = ang + Math.PI / 6;

        const pt1x = endX - Math.cos(low) * 15;
        const pt1y = endY - Math.sin(low) * 15;

        const pt2x = endX - Math.cos(high) * 15;
        const pt2y = endY - Math.sin(high) * 15;


        let pathStr = `M ${startX}, ${startY}`;

        let numSteps = Math.floor(mag / (this.dotDistance));

        for(let i = 0; i < numSteps; i++) {
            pathStr += `h 0 m ${dirX * this.dotDistance}, ${dirY * this.dotDistance}`;
        }

        this.lineElement.setAttribute("d", pathStr);
        this.headElement.setAttribute("d", `M ${endX}, ${endY} L ${pt1x}, ${pt1y} M ${endX}, ${endY} L ${pt2x}, ${pt2y}`);
    }
}