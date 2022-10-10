p5.disableFriendlyErrors = true
const url = "http://127.0.0.1:5500/data/render_data/render2.csv"
let data
let scl = 10
let spaceBetween = 100
let zoff = 0
let yoff = 30
let xoff = 0

let alpha = 0
let beta = 0

let colored = true

function preload() {
    Papa.parse(url, {
        download: true,
        skipEmptyLines: true,
        complete: (results) => {
            // Parsed array has all the data in string
            data = results.data
            console.log(data);

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
}

function draw() {
    if (!data) return

    background(0)
    ambientLight(200)
    directionalLight(255, 255, 255, 0, 0, 1)
    normalMaterial()
    rotateY(alpha)
    rotateX(beta)

    stroke(0)
    strokeWeight(0.5)

    for (let j = 0; j < data.length - 1; j++) {

        let hue = (360 / data.length) * j
        let sat = colored ? 80 : 0        
        fill(hue, sat, 100)

        beginShape(TRIANGLE_STRIP)
        for (let i = 0; i < data[0].length; i++) {
            let a = data[j][i] * scl
            let b = data[j + 1][i] * scl

            let theta = -radians(i)
            let x = a * cos(theta) + xoff
            let y = a * sin(theta) + yoff
            let z = -j * spaceBetween - zoff
            vertex(x, y, z)
            x = b * cos(theta) + xoff
            y = b * sin(theta) + yoff
            vertex(x, y, z - spaceBetween)
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
    if (keyIsDown(LEFT_ARROW)) alpha += degrees(0.0005)
    if (keyIsDown(RIGHT_ARROW)) alpha -= degrees(0.0005)
    if (keyIsDown(UP_ARROW)) beta -= degrees(0.0005)
    if (keyIsDown(DOWN_ARROW)) beta += degrees(0.0005)
}
