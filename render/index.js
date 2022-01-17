p5.disableFriendlyErrors = true
const url = "http://127.0.0.1:5500/Data/data.csv"
let data
let scl = 10
let spaceBetween = 100
let zoff = 0
let yoff = 30
let xoff = 0

let alpha = 0
let beta = 0

function preload() {
    Papa.parse(url, {
        download: true,
        skipEmptyLines: true,
        complete: (results) => {
            // Parsed arraw has all the data in string
            data = results.data
            data.forEach((row) => {
                for (let i = 0; i < row.length; i++) {
                    row[i] = parseFloat(row[i])
                }
            })
        },
    })
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL)
}

function draw() {
    if (!data) return

    background(0)
    ambientLight(200)
    directionalLight(255, 255, 255, 0, 0, 1)
    normalMaterial()
    rotateY(alpha)
    rotateX(beta)

    fill(255)
    stroke(0)
    strokeWeight(0.5)

    for (let i = 0; i < data[0].length - 1; i++) {
        beginShape(TRIANGLE_STRIP)
        for (let j = 0; j < data.length - 1; j++) {
            let a = data[j][i] * scl
            let b = data[j][i + 1] * scl
            let theta = -radians(2 * j)
            let x = a * cos(theta) + xoff
            let y = a * sin(theta) + yoff
            let z = -i * spaceBetween - zoff
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
