// fetch("http://127.0.0.1:5500/Data/first_test_data.csv")
//     .then((response) =>
//         // console.log(response)
//     )
//     .catch((err) => console.log(err))

p5.disableFriendlyErrors = true
const url = "http://127.0.0.1:5500/Data/first_test_data.csv"
let data

let angle = 0
const PHI = (Math.sqrt(5) + 1) / 2

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
    console.log(data)
    noLoop()

    background(0)
    ambientLight(200)
    directionalLight(255, 255, 255, 0, 0, 1)
    normalMaterial()
    // rotateX(angle)
    // rotateY(angle * PHI)

    fill(255)
    beginShape()

    endShape(CLOSE)

    // angle += 0.01
}
