function main() {
    const whiteboard = document.getElementById("whiteboard");

    const card = new IdeaCard();
    card.addTo(whiteboard);

    card.width = card.height = 100;
    card.x = card.y = 50;
    card.title = "Hi";


    console.log(card);
}

window.onload = main;