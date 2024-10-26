function main() {
    const whiteboard = document.getElementById("whiteboard");

    const card = new IdeaCard();
    card.addTo(whiteboard);

    card.width = card.height = 100;
    card.x = card.y = 50;
    card.title = "Hi";


    console.log(card);

    //Header
    const menuItems = Array.from(document.getElementsByClassName("menu"));
    const submenuGroups = Array.from(document.getElementsByClassName("submenu"));
    let menuActive = false;

    resetMenus(menuItems, submenuGroups);
    for (let i = 0; i < menuItems.length; i++) {
        menuItems[i].addEventListener("click", function(ev) {
            ev.stopPropagation();
            resetMenus(menuItems, submenuGroups);
            menuItems[i].style.borderRadius = "1vh 1vh 0vh 0vh";
            menuItems[i].style.backgroundColor = "#cfdcef";
            submenuGroups[i].style.display = "block";
            menuItems[i].classList.remove("push");
            menuActive = true;
        })
        menuItems[i].addEventListener("mouseenter", function() {
            if (menuActive) {
                ev.stopPropagation();
                resetMenus(menuItems, submenuGroups);
                menuItems[i].style.borderRadius = "1vh 1vh 0vh 0vh";
                menuItems[i].style.backgroundColor = "#cfdcef";
                submenuGroups[i].style.display = "block";
                menuItems[i].classList.remove("push");
            }
        })
    }

    document.addEventListener("click", function(){
        resetMenus(menuItems, submenuGroups);
    })
}

function resetMenus(menuItems, submenuGroups) {
    menuItems.forEach(ele => {
        ele.style.borderRadius = "";
        ele.style.backgroundColor = "";
        ele.classList.add("push");
    })
    submenuGroups.forEach(ele => {
        ele.style.display = "none";
    })
}

const addButton = document.getElementsByClassName("add-circle-container")[0];

const minimizeSidebarButton = document.getElementsByClassName("minimize-icon-container")[0];
const groupContainer = document.getElementsByClassName("group-container");
const sidebarContainer = document.getElementsByClassName("sidebar-container");
const sidebarHeader = document.getElementsByClassName("sidebar-header");
const sidebarMinimizeIcon = document.getElementsByClassName("minimize-icon");
var sidebarMinimized = false;

const groupButtons = document.getElementsByClassName('group-element-container');

groupButtons.forEach((element, index) => {
    element.addEventListener('click', () => {
        console.log(`Element ${index + 1} clicked`);
    });
});

createGroup("Group 10");

function createGroup(groupTitle) {
    const groupElementContainer = document.createElement('div');
    groupElementContainer.classList.add('group-element-container');

    const elementIcon = document.createElement('div');
    elementIcon.classList.add('element-icon');

    const heading = document.createElement('h1');
    heading.textContent = groupTitle;
    heading.classList.add('element-title');

    const closeIcon = document.createElement('ion-icon');
    closeIcon.setAttribute('name', 'close-outline');

    groupElementContainer.appendChild(elementIcon);
    groupElementContainer.appendChild(heading);
    groupElementContainer.appendChild(closeIcon);

    document.querySelector('.group-container').appendChild(groupElementContainer);
    const titles = document.querySelectorAll('.group-element-container .element-title');

    groupElementContainer.addEventListener('click', () => {
        //stuff here
    });

    toggleTextVisibility();
}

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

window.onload = main;

//for sidebar window resizing 
const sidebar = document.querySelector('.sidebar-container');
const titles = document.querySelectorAll('.group-element-container .element-title');

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