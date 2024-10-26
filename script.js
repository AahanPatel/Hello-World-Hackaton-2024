function main() {
    const whiteboard = document.getElementById("whiteboard");

    const cards = [];

    const card = new IdeaCard();
    card.addTo(whiteboard);

    card.width = card.height = 100;
    card.x = card.y = 50;
    card.title = "Hi";

    cards.push(card);

    const addButton = document.getElementsByClassName("add-circle-container")[0];

    addButton.addEventListener("click", () => {
        const card = new IdeaCard();
        card.addTo(whiteboard);

        card.width = 150;
        card.height = 40;
        card.x = card.y = 10;
        card.title = "New Idea!";

        cards.push(card);
    });

    addButton.click();

    const arrow = new SolidArrow();
    arrow.setBetweenCards(cards[0], cards[1]);

    arrow.addTo(whiteboard);
}

window.onload = main;