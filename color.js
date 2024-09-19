// color getter functions. i could probably reduce this to one function.
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }
  
  function rgbToHex(r, g, b) {
    return componentToHex(r) + componentToHex(g) + componentToHex(b);
  }
const randColour = () => {
    const randomBetween = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
    const r = randomBetween(0, 255);
    const g = randomBetween(0, 255);
    const b = randomBetween(0, 255);

    const colourHex = rgbToHex(r, g, b);

    return colourHex;
}


// sets click to change color
document.body.addEventListener("click", async () => {
    const colourHex = randColour();
    console.log("Color Hex:" + colourHex)

    try {
        const apiUrl = `https://api.color.pizza/v1/${colourHex}`
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.colors && data.colors.length > 0) {

            const colorName = data.colors[0].name;
            console.log(colorName);
    
            document.getElementById('colorName').textContent = colorName;
            document.body.style.backgroundColor = `#${colourHex}`;
            
        } else {
            console.log("No info found")
        }

    } catch (error) {
        console.error('Error fetching color data:', error);
    }
    
    
})


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
}