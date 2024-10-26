function main() {
    const whiteboard = document.getElementById("whiteboard");

    const card = new IdeaCard();
    const solidArrow = new SolidArrow();
    const dottedArrow = new DottedArrow();

    solidArrow.setStartPoint(100, 100); 
    solidArrow.setEndPoint(300, 200);
    dottedArrow.setStartPoint(300, 200); 
    dottedArrow.setEndPoint(100, 300);
    solidArrow.addTo(whiteboard);
    dottedArrow.addTo(whiteboard);

    card.width = card.height = 100;
    card.x = card.y = 50;
    card.title = "Hi";

    card.addTo(whiteboard);

    console.log(card);
}

window.onload = main;