let menuActive = false;
let zoomLevel = 1;

function main() {
    const whiteboard = document.getElementById("whiteboard");

    const cards = [];

    function createCard(width, height, x, y, title) {
        const card = new IdeaCard();
        card.addTo(whiteboard);
        card.width = width
        card.height = height;
        card.x = x
        card.y = y
        card.title = title;
        cards.push(card);
    }

    registerShortcuts()
    function registerShortcuts() {
        document.addEventListener('keydown', (event) => {
            const shortcut = `${event.ctrlKey ? 'Control+' : ''}${event.key}`;

            // shortcut array
            const actions = {
                'Control+s': () => createCard(100, 100, 50, 50, "New Idea"),
                'Control+p': () => saveFile("download", "svg"),
            };

            if (actions[shortcut]) {
                event.preventDefault();
                actions[shortcut]();
            }
        });        
    }

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
    registerSubmenuGroups()
    function registerSubmenuGroups() {
        const submenuActions = {
            "New": () => createCard(100, 100, 50, 50, "New Idea"),
            "Copy": () => alert("Copy functionality to be implemented."),
            "Save": () => saveFile("download", "svg"),
            "Print": () => window.print(),
            "Rename": () => alert("Rename functionality to be implemented."),
            "Delete": () => {
                IdeaCard.cardArray.forEach(element => {
                    if (element.selected) {
                        element.remove()
                    }
                })
            }
        }
        
        const submenuOptionList = document.getElementsByClassName("submenu-option")
        submenuOptionList.forEach(element => {
            element.addEventListener("click", function(ev){
                submenuActions[element.children[1].innerHTML]();
            })
        })
    }

    document.addEventListener("click", function () {
        resetMenus(menuItems, submenuGroups);
    });

    function getMousePositionSVG(ev) {
        var point = whiteboard.createSVGPoint();
        point.x = ev.clientX;
        point.y = ev.clientY;
        point = point.matrixTransform(whiteboard.getScreenCTM().inverse());
        return point;
    }

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

    addButton.addEventListener("click", () => {
        createCard(100, 100, 50, 50, "New Idea!");
    });

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