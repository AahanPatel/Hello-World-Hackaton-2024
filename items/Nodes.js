class Nodes {
    static selectionNode = document.getElementById("selectionNode")
    static whiteboard = document.getElementById("whiteboard")
    nodeArray = []

    appendNodes(cardElementClass) {
        var positionArray = [[cardElementClass.width/2 + cardElementClass.x, cardElementClass.y], [cardElementClass.width/2 + cardElementClass.x, cardElementClass.y  + cardElementClass.height], [cardElementClass.x, cardElementClass.y + cardElementClass.height/2], [cardElementClass.x + cardElementClass.width, cardElementClass.y + cardElementClass.height/2]]
        var selectionNodeClone
        var arrow

        for (var i=0; i < positionArray.length; i++) {
            selectionNodeClone = selectionNode.cloneNode(true)
            cardElementClass.groupElement.append(selectionNodeClone)
            selectionNodeClone.setAttribute("id", "selectionNode" + i);
            selectionNodeClone.setAttribute("cx", positionArray[i][0]);
            selectionNodeClone.setAttribute("cy", positionArray[i][1]);     
            selectionNodeClone.addEventListener("mousedown", onArrowStart);   
            selectionNodeClone.style.display = "block"
            this.nodeArray.push(selectionNodeClone);
        }

        function getMousePositionSVG(ev) {
            var point = whiteboard.createSVGPoint();
            point.x = ev.clientX;
            point.y = ev.clientY;
            point = point.matrixTransform(whiteboard.getScreenCTM().inverse());
            return point;
        }

        function onArrowStart(ev) {
            ev.target.removeEventListener("mousedown", onArrowStart);
            whiteboard.addEventListener("mouseup", onArrowEnd);
            arrow = new SolidArrow()
            arrow.addTo(whiteboard)
            console.log("Draw arrow start")
            arrow.setStartPoint(ev.target.cx.baseVal.value, ev.target.cy.baseVal.value)
            whiteboard.addEventListener('mousemove', onArrowMove)
        }

        function onArrowMove(ev) {
            var mousePos = getMousePositionSVG(ev)
            arrow.setEndPoint(mousePos.x, mousePos.y)
            IdeaCard.cardArray.forEach(element => {
                if (element.hover) {
                    arrow.setBetweenCards(cardElementClass, element)

                }
            });
        }

        function onArrowEnd(ev) {
            whiteboard.removeEventListener('mousemove', onArrowMove)
            whiteboard.removeEventListener("mouseup", onArrowEnd);
            ev.target.addEventListener("mousedown", onArrowStart);
        }
    }

    dissolveNodes()  {
        if (this.nodeArray.length == 0) { return }
        for (var i=0; i < this.nodeArray.length; i++) {
            this.nodeArray[i].remove()
        }
    }


}
