function main() {
    const whiteboard = document.getElementById("whiteboard");

    const card = new IdeaCard();

    card.width = card.height = 100;
    card.x = card.y = 50;
    card.title = "Hi";

    card.addTo(whiteboard);

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

window.onload = main;