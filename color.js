const hexGen = () => {
    const randomHex = () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
    return randomHex() + randomHex() + randomHex();
}

//fetch color name from color.pizza api
async function findColorName(colorHex) {
    try {
        const response = await fetch(`https://api.color.pizza/v1/${colorHex}`);
        const data = await response.json();

        if (data.colors && data.colors.length > 0) {
            return {name: data.colors[0].name, luminance: data.colors[0].luminance};
        } else {
            console.log("No info found")
            return {name: "Unknown color", luminance: 0};
        }
    } catch (error) {
        console.error('Error fetching color data:', error);
        return {name: "error", luminance: 0};
    }
}

var colorList = [];
let current = 0;

//initalize array with 5 colors
async function initColorList() {
    let promises = [];
    for (let i = 0; i < 5; i++) {
        const colorHex = hexGen();

        promises.push(
            findColorName(colorHex).then(colorData => {
                return {name: colorData.name, hex: colorHex, luminance: colorData.luminance};
            })
        );
    }

    const colorData = await Promise.all(promises);
    colorList.push(...colorData);
    console.log(colorList);
}

// function for adding new color to end of list
async function addToList() {
    const colorHex = hexGen();
    const colorData = await findColorName(colorHex);

    colorList.push({name: colorData.name, hex: colorHex, luminance: colorData.luminance});

}

document.addEventListener("DOMContentLoaded", initColorList);

async function nextInList() {
    document.getElementById('tutorial').textContent = "";
    if (current < colorList.length - 1) {
        console.log(current)

        current++;
        updateColor();
        
        if (current > colorList.length - 5){
            await addToList();
        }
    }
}

function prevInList() {
    if (current > 0) {
        current--;
        updateColor();
    }
}

function updateColor() {
    const colorHex = colorList[current].hex;
    const colorName = colorList[current].name;
    const colorLum = colorList[current].luminance;
    const prevHex = current > 0 ? colorList[current - 1].hex : colorHex;
    const nextHex = current < colorList.length - 1 ? colorList[current + 1].hex : colorHex;


    document.getElementById('colorName').textContent = colorName;
    document.body.style.backgroundColor = `#${colorHex}`;

    const textColor = colorLum > 50 ? "black" : "white";
    document.getElementById('colorName').style.color = textColor;

    document.getElementById('leftHoverButton').style.backgroundColor = `#${prevHex}`;
    document.getElementById('rightHoverButton').style.backgroundColor = `#${nextHex}`;

    //check if hex should be displayed
    if (hexCheckbox.checked) {
        document.getElementById("colorName").textContent += ` - #${colorHex}`;
    }
}


const modal = document.getElementById("myModal");
const openBtn = document.getElementById("hoverButton");
const closeSpan = document.getElementsByClassName("close")[0];

document.body.addEventListener("click", function (e) {
    if (!modal.contains(e.target)) {
        nextInList();
    }
});


//listen for left and right key press
document.body.addEventListener('keydown', function (event) {
    switch (event.key) {
        case "ArrowLeft":
            console.log("left");
            prevInList();
            break;
        case "ArrowRight":
            console.log("right");
            nextInList();
            break;
    }
});


//SETTINGS
//
//
function openModal(e) {
    e.stopPropagation();
    modal.style.display = "block";
}

function closeModal(e) {
    e.stopPropagation();
    modal.style.display = "none";
}

openBtn.addEventListener("click", openModal);
closeSpan.addEventListener("click", closeModal);

window.onclick = function(e) {
    if (e.target == modal) {
        closeModal(e);
    }
}


//hex button press
const hexCheckbox = document.getElementById("hexCheckbox");

hexCheckbox.addEventListener('change', () => {
    const colorHex = colorList[current].hex; 
    if (hexCheckbox.checked) {
        document.getElementById("colorName").textContent += ` - #${colorHex}`;
    } else {
        document.getElementById("colorName").textContent = colorList[current].name;
    }
});


//left right button
const leftBtn = document.getElementById("leftHoverButton");
const rightBtn = document.getElementById("rightHoverButton");

leftBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    prevInList();
});

rightBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    nextInList();
})

//position change
const positionCheckbox = document.getElementById("positionCheckbox")
const colorName = document.getElementById("colorName");

positionCheckbox.addEventListener('change', () => {
    if (positionCheckbox.checked) {
        colorName.classList.add('bottom-left');
    } else {
        colorName.classList.remove('bottom-left');
    }
})

//is it better to just have a singular update on modal close?
//seems possible