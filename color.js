// color getter functions. i could probably reduce this to one function.
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

async function addToList() {
    const colorHex = hexGen();
    const colorName = await findColorName(colorHex);

    colorList.push({name: colorName, hex: colorHex });

    console.log(colorList);
}

document.addEventListener("DOMContentLoaded", initColorList);

let current = 0;

document.body.addEventListener("click", function () {
    console.log(current)

    console.log("array size pre iteration: " + colorList.length);



    //something is broken with the way current is being updated and tracked, specifically when left is pressed and array bigger than 9. look into it. 
    if (colorList.length > 9) {
        colorList.shift();
        console.log("shift!")
        current--;
    }
    colorHex = colorList[current].hex;
    colorName = colorList[current].name;
    

    document.getElementById('colorName').textContent = colorName;
    document.body.style.backgroundColor = `#${colorHex}`;

    current++;

    
    addToList();
})



//listen for left and right key press
document.body.addEventListener('keydown', function (event) {
    const key = event.key;
    switch (key) {
        case "ArrowLeft":
            str = 'Left';
            console.log(str)
            if (current > 0) {
                current--;
                colorHex = colorList[current].hex;
                colorName = colorList[current].name;
            
                document.getElementById('colorName').textContent = colorName;
                document.body.style.backgroundColor = `#${colorHex}`;
            }
            break;
        case "ArrowRight":
            str = 'Right';
            console.log(str)
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