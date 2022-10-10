p5.disableFriendlyErrors = true
document.addEventListener("contextmenu", (event) => event.preventDefault())
const url = "../../data/render_data/render2.csv"
let data
let xoff = 0
let yoff = 30
let zoff = -200

let alpha = beta = 0

const tweak = {
    spaceBetween: 50,
    colored: true,
    scl: 10
}

const pane = new Tweakpane.Pane({
    title: 'Parameters',
    expanded: true
})

pane.addInput(
    tweak, 'spaceBetween',
    { min: 10, max: 70, step: 1 }
)

pane.addInput(
    tweak, 'scl',
    { min: 10.0, max: 50.0 }
)

pane.addInput(tweak, 'colored')

const btn = pane.addButton({
    title: 'save frame',
    label: 'save',   // optional
})

btn.on('click', () => {
    saveCanvas('render_' + year() + month() + day() + hour() + minute() + second(), 'png')
})

function preload() {
    Papa.parse(url, {
        download: true,
        skipEmptyLines: true,
        complete: (results) => {
            // Parsed array has all the data in string
            data = results.data

            for (let j = 1; j < data.length; j++) {
                let row = data[j]
                for (let i = 0; i < row.length; i++) {
                    row[i] = parseFloat(row[i])
                }
            }
            data.shift() // Deletes the first row (the header)
        },
    })
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL)
    colorMode(HSB)

    setAttributes('antialias', true)

    createEasyCam({ distance: 400 })
}

function draw() {
    if (!data) return

    background(0)
    ambientLight(200)
    directionalLight(200, 200, 200, 0, 0, 1)
    // pointLight(255, 255, 255, 0, -10, 10);
    normalMaterial()
    
    rotateY(alpha)
    rotateX(beta)

    stroke(20)
    strokeWeight(0.5)

    for (let j = 0; j < data.length - 1; j++) {

        let hue = (360 / data.length) * j
        let sat = tweak.colored ? 80 : 0        
        fill(hue, sat, 80)

        beginShape(TRIANGLE_STRIP)
        for (let i = 0; i < data[0].length; i++) {
            let a = data[j][i] * tweak.scl
            let b = data[j + 1][i] * tweak.scl

            let theta = -radians(i)
            let x = a * cos(theta) + xoff
            let y = a * sin(theta) + yoff
            let z = -j * tweak.spaceBetween - zoff
            vertex(x, y, z)
            x = b * cos(theta) + xoff
            y = b * sin(theta) + yoff
            vertex(x, y, z - tweak.spaceBetween)
        }
        endShape()
    }

    checkControls()
}

function checkControls() {
    if (keyIsDown(87)) zoff -= 10 // W
    if (keyIsDown(83)) zoff += 10 // S
    if (keyIsDown(65)) xoff += 10 // A
    if (keyIsDown(68)) xoff -= 10 // D
    if (keyIsDown(32)) yoff += 1 // space
    if (keyIsDown(16)) yoff -= 1 // left shift
    if (keyIsDown(LEFT_ARROW)) alpha += 0.01
    if (keyIsDown(RIGHT_ARROW)) alpha -= 0.01
    if (keyIsDown(UP_ARROW)) beta -= 0.01
    if (keyIsDown(DOWN_ARROW)) beta += 0.01
}
