// Constants
const ARROW_HEAD_LENGTH = 15;
const ARROW_HEAD_ANGLE = 30; // Degrees on either side of the shaft
const DEFAULT_DASH_SIZE = 10;
const DEFAULT_DOT_DISTANCE = 4;
const ARROW_OFFSET_DISTANCE = 10;

const ARROW_HEAD_ANGLE_RADIANS = ARROW_HEAD_ANGLE * Math.PI / 180; // DO NOT CHANGE THIS

const arrows = [];

function intersectAABB(rayOrigin, rayDir, boxMin, boxMax) {
    const tMin = boxMin.map((v, i) => (v - rayOrigin[i]) / rayDir[i]);
    const tMax = boxMax.map((v, i) => (v - rayOrigin[i]) / rayDir[i]);
    const t1 = tMin.map((v, i) => Math.min(v, tMax[i]));
    const t2 = tMin.map((v, i) => Math.max(v, tMax[i]));
    const tNear = Math.max(...t1);
    const tFar = Math.min(...t2);
    return [tNear, tFar];
};

class Arrow {
    constructor() {
        this.arrowElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
        this.arrowElement.setAttribute("stroke", "black");
        this.arrowElement.setAttribute("fill", "none");
        this.arrowElement.setAttribute("stroke-linecap", "round");

        this.fromCard = null;
        this.toCard = null;

        this._startPoint = [0, 0];
        this._endPoint = [0, 0];

        arrows.push(this);
    }

    addTo(element) {
        element.appendChild(this.arrowElement);
    }

    setBetweenCards(from, to) {
        if(this.fromCard !== null && this.toCard !== null) {
            this.fromCard.arrows.splice(this.fromCard.arrows.indexOf(this), 1);
            this.toCard.arrows.splice(this.toCard.arrows.indexOf(this), 1);
        }

        this.fromCard = from;
        this.toCard = to;

        if(this.fromCard !== null && this.toCard !== null) {
            this.fromCard.arrows.push(this);
            this.toCard.arrows.push(this);

            this.updateFromSetCards();
        }
    }

    pointInBounds(point) {
        const [sx, sy] = this._startPoint;
        const [ex, ey] = this._endPoint;

        const dx = ex - sx;
        const dy = ey - sy;

        const tx = point.x - sx;
        const ty = point.y - sy;

        const magSq = (dx * dx + dy * dy);

        const t = (dx * tx + dy * ty) / magSq;

        if(t < 0 || t > 1)
            return false;

        const d = Math.sqrt(tx * tx + ty * ty - t * t * magSq);

        return d < ARROW_HEAD_LENGTH * Math.sin(ARROW_HEAD_ANGLE_RADIANS);
    }

    updateFromSetCards() {
        if(this.fromCard.overlapsWith(this.toCard)) {
            this.arrowElement.style.display = "none";
            return;
        } else {
            this.arrowElement.style.display = "";
        }

        const x1 = this.fromCard.x, y1 = this.fromCard.y, w1 = this.fromCard.width, h1 = this.fromCard.height;
        const x2 = this.toCard.x, y2 = this.toCard.y, w2 = this.toCard.width, h2 = this.toCard.height;

        const cx1 = x1 + w1 / 2, cy1 = y1 + h1 / 2;
        const cx2 = x2 + w2 / 2, cy2 = y2 + h2 / 2;

        const m = Math.hypot(cx2 - cx1, cy2 - cy1);

        const dirX = (cx2 - cx1) / m;
        const dirY = (cy2 - cy1) / m;

        const int1 = intersectAABB([cx1, cy1], [dirX, dirY], [x1, y1], [x1 + w1, y1 + h1])[1] + ARROW_OFFSET_DISTANCE;
        const int2 = intersectAABB([cx1, cy1], [dirX, dirY], [x2, y2], [x2 + w2, y2 + h2])[0] - ARROW_OFFSET_DISTANCE;

        if(int2 > int1) {
            this._startPoint[0] = cx1 + dirX * int1;
            this._startPoint[1] = cy1 + dirY * int1;

            this._endPoint[0] = cx1 + dirX * int2;
            this._endPoint[1] = cy1 + dirY * int2;

            this.arrowElement.style.display = "";
        } else {
            this.arrowElement.style.display = "none";
        }

        this._recalculateArrow();
    }

    remove() {
        this.arrowElement.remove();

        const ind = arrows.indexOf(this);

        if(ind != -1) {
            arrows.splice(ind, 1);
        }
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

        const low = ang - ARROW_HEAD_ANGLE_RADIANS;
        const high = ang + ARROW_HEAD_ANGLE_RADIANS;

        const pt1x = endX - Math.cos(low) * ARROW_HEAD_LENGTH;
        const pt1y = endY - Math.sin(low) * ARROW_HEAD_LENGTH;

        const pt2x = endX - Math.cos(high) * ARROW_HEAD_LENGTH;
        const pt2y = endY - Math.sin(high) * ARROW_HEAD_LENGTH;


        let pathStr = `M ${startX}, ${startY}`;

        let numSteps = Math.floor(mag / (this.dotDistance));

        for(let i = 0; i < numSteps; i++) {
            pathStr += `h 0 m ${dirX * this.dotDistance}, ${dirY * this.dotDistance}`;
        }

        this.lineElement.setAttribute("d", pathStr);
        this.headElement.setAttribute("d", `M ${endX}, ${endY} L ${pt1x}, ${pt1y} M ${endX}, ${endY} L ${pt2x}, ${pt2y}`);
    }
}