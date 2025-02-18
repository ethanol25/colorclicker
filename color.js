
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }

const hexGen = () => {
    const randomBetween = (min, max) => min + Math.floor(Math.random() * (max - min + 1));

    const r = componentToHex(randomBetween(0, 255));
    const g = componentToHex(randomBetween(0, 255));
    const b = componentToHex(randomBetween(0, 255));

    const colorHex = r + g + b;

    return colorHex;
}

//fetch color name from color.pizza api
async function findColorName(colorHex) {
    try {
        const apiUrl = `https://api.color.pizza/v1/${colorHex}`
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.colors && data.colors.length > 0) {

            const colorName = data.colors[0].name;
            return colorName;
        } else {
            console.log("No info found")
            return "Unknown color";
        }

    } catch (error) {
        console.error('Error fetching color data:', error);
        return "error";
    }
}
var colorList = [];


//initalize array with 5 colors
async function initColorList() {
    let promises = [];
    for (let i = 0; i < 5; i++) {
        const colorHex = hexGen();

        promises.push(
            findColorName(colorHex).then(colorName => {
                return {name: colorName, hex: colorHex};
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
    const colorName = await findColorName(colorHex);

    colorList.push({name: colorName, hex: colorHex });

    console.log(colorList);
}

document.addEventListener("DOMContentLoaded", initColorList);

let current = 0;

async function nextInList() {
    if (current < colorList.length - 1) {
        console.log(current)

        current++;
        updateColor();
        
        if (current > colorList.length - 5){
            await addToList();
        }
    }
}

async function prevInList() {
    if (current > 0) {
        current--;
        updateColor();
    }
}

function updateColor() {
    const colorHex = colorList[current].hex;
    const colorName = colorList[current].name;

    document.getElementById('colorName').textContent = colorName;
    document.body.style.backgroundColor = `#${colorHex}`;
}

document.body.addEventListener("click", function () {
    nextInList();
})


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


/*

//modal javascript

var modal = document.getElementById("myModal");

var btn = document.getElementById("settingsBtn");

var span = document.getElementsByClassName("close")[0];

btn.onclick = function() {
    modal.style.display = "block";
}

span.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}*/