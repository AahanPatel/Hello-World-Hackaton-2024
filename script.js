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