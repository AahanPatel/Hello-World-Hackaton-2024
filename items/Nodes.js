class Nodes {
    static selectionNode = document.getElementById("selectionNode")
    nodeArray = []

    appendNodes(cardElementClass) {
        var positionArray = [[cardElementClass.width/2 + cardElementClass.x, cardElementClass.y], [cardElementClass.width/2 + cardElementClass.x, cardElementClass.y  + cardElementClass.height], [cardElementClass.x, cardElementClass.y + cardElementClass.height/2], [cardElementClass.x + cardElementClass.width, cardElementClass.y + cardElementClass.height/2]]
        var selectionNodeClone
        for (var i=0; i < positionArray.length; i++) {
            selectionNodeClone = selectionNode.cloneNode(true)
            cardElementClass.groupElement.append(selectionNodeClone)
            selectionNodeClone.setAttribute("id", "selectionNode" + i);
            selectionNodeClone.setAttribute("cx", positionArray[i][0]);
            selectionNodeClone.setAttribute("cy", positionArray[i][1]);     
            selectionNodeClone.addEventListener("mousedown", onArrowStart);   
            selectionNodeClone.style.display = "block"
            
            this.nodeArray.push(selectionNodeClone)
        }

        function onArrowStart(ev) {
            selectionNodeClone.removeEventListener("mousedown", onArrowStart);
            selectionNodeClone.addEventListener("mouseup", onArrowEnd);
            console.log("Draw arrow start")
            // Implement arrow drawing functionality here. 
        }

        function onArrowEnd(ev) {
            selectionNodeClone.removeEventListener("mouseup", onArrowEnd);
            selectionNodeClone.addEventListener("mousedown", onArrowStart);
            console.log("Draw arrow end")
            // Implement arrow drawing functionality here. 
        }
    }

    dissolveNodes()  {
        if (this.nodeArray.length == 0) { return }
        for (var i=0; i < this.nodeArray.length; i++) {
            this.nodeArray[i].remove()
        }
    }


}
