function main() {
    const whiteboard = document.getElementById("whiteboard");

    const card = new IdeaCard();
    card.addTo(whiteboard);

    card.width = card.height = 100;
    card.x = card.y = 50;
    card.title = "Hi";


    console.log(card);

    const addButton = document.getElementsByClassName("add-circle-container")[0];
    const minimizeSidebarButton = document.getElementsByClassName("minimize-icon-container")[0];
    const groupContainer = document.getElementsByClassName("group-container");
    const sidebarContainer = document.getElementsByClassName("sidebar-container");
    const sidebarHeader = document.getElementsByClassName("sidebar-header");
    const sidebarMinimizeIcon = document.getElementsByClassName("minimize-icon");
    var sidebarMinimized = false;

    addButton.addEventListener("click", () => {
        const card = new IdeaCard();
        card.addTo(whiteboard);

        card.width = 150;
        card.height = 40;
        card.x = card.y = 10;
        card.title = "New Idea!";
    });

    minimizeSidebarButton.addEventListener("click", () => {
        if (sidebarMinimized) {
            sidebarContainer[0].style.minWidth = "80px";
            groupContainer[0].style.display = "flex";
            sidebarHeader[0].style.display = "block";
            sidebarMinimizeIcon[0].style.transform = 'rotateZ(0deg)';
        } else {
            sidebarContainer[0].style.minWidth = "1px";
            groupContainer[0].style.display = "none";
            sidebarHeader[0].style.display = "none";
            sidebarMinimizeIcon[0].style.transform = 'rotateZ(180deg)';
        }
        sidebarMinimized = !sidebarMinimized; 
    });
}

window.onload = main;

//for sidebar window resizing 
const sidebar = document.querySelector('.sidebar-container');
const titles = document.querySelectorAll('.group-element-container h1');

function toggleTextVisibility() {
    if (sidebar.offsetWidth < 100) {
        titles.forEach(title => title.style.display = 'none');
    } else {
        titles.forEach(title => title.style.display = 'block');
    }
}

//sidebar minimize 

toggleTextVisibility();

window.addEventListener('resize', toggleTextVisibility);