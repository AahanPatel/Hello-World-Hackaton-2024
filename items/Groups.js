
const colorMap = {};

function createGroup(groupTitle, iconColor) {
    
    const groupElementContainer = document.createElement('div');
    groupElementContainer.classList.add('group-element-container');
    groupElementContainer.dataset.color = iconColor;

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

    closeIcon.addEventListener("click", (ev) => {
        ev.stopPropagation();
        removeGroup(iconColor);
    });

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

    let editing = false;

    groupElementContainer.addEventListener("contextmenu", (ev) => {
        ev.preventDefault();
        if(editing) {
            heading.contentEditable = false;
            heading.blur();

            editing = false;
        } else {
            heading.contentEditable = true;
            heading.focus();

            editing = true;
        }
    })

    groupElementContainer.addEventListener('click', () => {

        if(editing) {
            heading.contentEditable = false;
            heading.blur();

            editing = false;
            return;
        }

        if(colorMap[iconColor].selected) {
            listContainer.style.display = "none";
            for(const color in colorMap) {
                colorMap[color].forEach((card) => {
                    card.cardElement.style.fillOpacity = "100%";
                    card.cardElement.style.strokeOpacity = "100%";
                    card.titleElement.style.fillOpacity = "100%";
                    card.resizeElement.style.fillOpacity = "100%";
                });
            }

            colorMap[iconColor].selected = false;
        } else {
            listContainer.style.display = "flex";
            for(const color in colorMap) {
                colorMap[color].selected = false;
                colorMap[color].forEach((card) => {
                    card.cardElement.style.fillOpacity = "10%";
                    card.cardElement.style.strokeOpacity = "10%";
                    card.titleElement.style.fillOpacity = "10%";
                    card.resizeElement.style.fillOpacity = "10%";
                });
            }

            colorMap[iconColor].selected = true;
            colorMap[iconColor].forEach((card) => {
                card.cardElement.style.fillOpacity = "100%";
                card.cardElement.style.strokeOpacity = "100%";
                card.titleElement.style.fillOpacity = "100%";
                card.resizeElement.style.fillOpacity = "100%";
            });
        }
    });

    toggleTextVisibility();
}

function removeGroup(color) {
    if(colorMap[color].length > 0) {
        for(const card of colorMap[color]) {
            card._color = "";
            card.cardElement.style.fill = "";
        }

        colorMap[color].length = 0;
    }
    
    const groups = Array.from(document.getElementsByClassName("group-element-container applied-styles"));

    for(let i = 0; i < groups.length; i++) {
        if(groups[i].dataset.color == color) {            
            groups[i].remove();
            break;
        }
    }
}

function toggleTextVisibility() {
    const sidebar = document.querySelector('.sidebar-container');
    const titles = document.querySelectorAll('.group-element-container .element-title');

    if (sidebar.offsetWidth < 100) {
        titles.forEach(title => title.style.display = 'none');
    } else {
        titles.forEach(title => title.style.display = 'block');
    }
}

class Groups {
    static addColorGroup(card) {
        if(!colorMap[card.color]) {
            colorMap[card.color] = [];
        }

        if(colorMap[card.color].length === 0) {
            createGroup("New Group", card.color);
        }

        colorMap[card.color].push(card);
    }

    static updateColorGroup(oldColor, card) {
        const ind = colorMap[oldColor]?.indexOf(card);
        if(ind != -1 && ind !== undefined)
            colorMap[oldColor].splice(ind, 1);

        if(colorMap[oldColor]?.length === 0)
            removeGroup(oldColor);

        this.addColorGroup(card);
    }
}