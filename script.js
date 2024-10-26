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


const sidebar = document.querySelector('.sidebar-container');
const titles = document.querySelectorAll('.group-element-container h1');

function toggleTextVisibility() {
    if (sidebar.offsetWidth < 100) {
        titles.forEach(title => title.style.display = 'none');
    } else {
        titles.forEach(title => title.style.display = 'block');
    }
}

toggleTextVisibility();

window.addEventListener('resize', toggleTextVisibility);