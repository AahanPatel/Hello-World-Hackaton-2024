let menuActive = false;

function main() {
    const whiteboard = document.getElementById("whiteboard");

    const cards = [];

    const card = new IdeaCard();
    card.addTo(whiteboard);

    card.width = card.height = 100;
    card.x = card.y = 50;
    card.title = "Hi";

    cards.push(card);

    //Header
    const menuItems = Array.from(document.getElementsByClassName("menu"));
    const submenuGroups = Array.from(document.getElementsByClassName("submenu"));

    resetMenus(menuItems, submenuGroups);
    for (let i = 0; i < menuItems.length; i++) {
        menuItems[i].addEventListener("click", function (ev) {
            ev.stopPropagation();
            resetMenus(menuItems, submenuGroups);
            menuItems[i].style.borderRadius = "1vh 1vh 0vh 0vh";
            menuItems[i].style.backgroundColor = "#cfdcef";
            submenuGroups[i].style.display = "block";
            menuItems[i].classList.remove("push");
            menuActive = true;
        })
        menuItems[i].addEventListener("mouseenter", function (ev) {
            if (menuActive) {
                ev.stopPropagation();
                resetMenus(menuItems, submenuGroups);
                menuItems[i].style.borderRadius = "1vh 1vh 0vh 0vh";
                menuItems[i].style.backgroundColor = "#cfdcef";
                submenuGroups[i].style.display = "block";
                menuItems[i].classList.remove("push");
                menuActive = true;
            }
        })
    }

    document.addEventListener("click", function () {
        resetMenus(menuItems, submenuGroups);
    });

    // Submenu options
    const header = document.querySelector(".header-container");
    document.getElementById("fullscreen").addEventListener("click", function(){
        header.style.marginTop = "-5vh";
    });

    // document.querySelector(".return-header").addEventListener("click", function(){
    //     header.style.marginTop = "";
    // });

    
    const addButton = document.getElementsByClassName("add-circle-container")[0];

    const minimizeSidebarButton = document.getElementsByClassName("minimize-icon-container")[0];
    const groupContainer = document.getElementsByClassName("group-container");
    const sidebarContainer = document.getElementsByClassName("sidebar-container");
    const sidebarHeader = document.getElementsByClassName("sidebar-header");
    const sidebarMinimizeIcon = document.getElementsByClassName("minimize-icon");
    var sidebarMinimized = false;

    //for sidebar window resizing
    //for sidebar window resizing 
    const sidebar = document.querySelector('.sidebar-container');
    const titles = document.querySelectorAll('.group-element-container .element-title');


    const groupButtons = document.getElementsByClassName('group-element-container');

    groupButtons.forEach((element, index) => {
        element.addEventListener('click', () => {
            console.log(`Element ${index + 1} clicked`);
        });
    });

    createGroup("Group 10", "rgb(100, 200, 20)");
    createGroup("Group 10", "rgb(100, 200, 20)");
    createGroup("Group 10", "rgb(100, 200, 20)");
    createGroup("Group 10", "rgb(100, 200, 20)");
    createGroup("Group 10", "rgb(100, 200, 20)");
    createGroup("Group 10", "rgb(100, 200, 20)");
    createGroup("Group 10", "rgb(100, 200, 20)");
    createGroup("Group 10", "rgb(100, 200, 20)");
    createGroup("Group 10", "rgb(100, 200, 20)");
    createGroup("Group 10", "rgb(100, 200, 20)");
    createGroup("Group 10", "rgb(100, 200, 20)");
    createGroup("Group 10", "rgb(100, 200, 20)");
    createGroup("Group 10", "rgb(100, 200, 20)");
    createGroup("Group 10", "rgb(100, 200, 20)");
    createGroup("Group 10", "rgb(100, 200, 20)");
    createGroup("Group 10", "rgb(100, 200, 20)");
    createGroup("Group 10", "rgb(100, 200, 20)");
    createGroup("Group 10", "rgb(100, 200, 20)");
    createGroup("Group 10", "rgb(100, 200, 20)");
    createGroup("Group 11", "rgb(100, 50, 200)");
    createGroup("Group 11", "rgb(100, 50, 200)");
    createGroup("Group 11", "rgb(100, 50, 200)");
    createGroup("Group 11", "rgb(100, 50, 200)");
    createGroup("Group 11", "rgb(100, 50, 200)");

    function createGroup(groupTitle, iconColor) {
        const groupElementContainer = document.createElement('div');
        groupElementContainer.classList.add('group-element-container');

        const cardHeaderElement = document.createElement('div');
        cardHeaderElement.classList.add('card-header-element');

        const elementIcon = document.createElement('div');
        elementIcon.classList.add('element-icon');
        elementIcon.style.backgroundColor = iconColor;

        const heading = document.createElement('h1');
        heading.textContent = groupTitle;
        heading.classList.add('element-title');

        const closeIcon = document.createElement('ion-icon');
        closeIcon.setAttribute('name', 'close-outline');

        cardHeaderElement.appendChild(elementIcon);
        cardHeaderElement.appendChild(heading);
        cardHeaderElement.appendChild(closeIcon);

        const listContainer = document.createElement('ul');

        /* example list elements */

        const cardOne = document.createElement('li'); 
        const textNodeOne = document.createTextNode("card 1");
        cardOne.appendChild(textNodeOne);

        const cardTwo = document.createElement('li'); 
        const textNodeTwo = document.createTextNode("card 2");
        cardTwo.appendChild(textNodeTwo);

        const cardThree = document.createElement('li');
        const textNodeThree = document.createTextNode("card 3");
        cardThree.appendChild(textNodeThree);


        listContainer.appendChild(cardOne);
        listContainer.appendChild(cardTwo);
        listContainer.appendChild(cardThree);

        groupElementContainer.appendChild(cardHeaderElement);
        groupElementContainer.appendChild(listContainer);

        document.querySelector('.group-container').appendChild(groupElementContainer);
        const titles = document.querySelectorAll('.group-element-container .element-title');

        requestAnimationFrame(() => groupElementContainer.classList.add('applied-styles'));

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

        cards.push(card);
    });

    addButton.click();

    const arrow = new SolidArrow();
    arrow.setBetweenCards(cards[0], cards[1]);

    arrow.addTo(whiteboard);
    
    minimizeSidebarButton.addEventListener("click", () => {
        if (sidebarMinimized) {
            sidebarContainer[0].style.minWidth = "80px";
            groupContainer[0].style.display = "flex";
            sidebarHeader[0].style.display = "flex";
            sidebarMinimizeIcon[0].style.transform = 'rotateZ(0deg)';
        } else {
            sidebarContainer[0].style.minWidth = "1px";
            groupContainer[0].style.display = "none";
            sidebarHeader[0].style.display = "none";
            sidebarMinimizeIcon[0].style.transform = 'rotateZ(180deg)';
        }
        sidebarMinimized = !sidebarMinimized;
    });

    //sidebar minimize 

    toggleTextVisibility();

    window.addEventListener('resize', toggleTextVisibility);
}

// Menu 
function resetMenus(menuItems, submenuGroups) {
    menuItems.forEach(ele => {
        ele.style.borderRadius = "";
        ele.style.backgroundColor = "";
        ele.classList.add("push");
    })
    submenuGroups.forEach(ele => {
        ele.style.display = "none";
    })
    menuActive = false;
}

window.onload = main;