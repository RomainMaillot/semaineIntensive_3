// let timer = 0;

const $map = $('.map')

// const Player = {
//     username: "",
//     mode: "attack",
//     score: 0,
//     weapons: [
//         {
//             name: 'fuuf',
//             interval: 30,
//             behavior: () => {
//                 // action de l'arme
//             }
//         },
//         {
//             name: 'jeej',
//             interval: 10,
//             behavior: () => {
//                 //action de l'arme
//             }
//         },
//         {
//             name: 'saas',
//             interval: 25,
//             behavior: () => {
//                 //action de l'arme
//             }
//         },
//     ],
//     win: () => {
//         this.score += 1
//         initMap()
//     }
// }

// const firstPlayer = new Player

// const secPlayer = new Player

//fonction qui initialise le terrain

function initMap() {
    let map = "" //chaîne de caractère contenant la disposition du terrain

    let fullLane, laneNum = 1, emptyLane = "", corNum = 1

    //remplissage de la string
    for (let i = 0; i < 4; i++) {
        fullLane = ""
        emptyLane = ""
        for (let j = 0; j < 60; j++) {
            fullLane += `lane${laneNum} `
        }
        map += `"${fullLane}"`
        map += '\n'
        laneNum++

        for (let j = 0; j < 60; j++) {
            let randomChara = Math.floor(Math.random() * 80 )
            
            if (randomChara >= 29 || emptyLane.substring(emptyLane.length - 16, emptyLane.length + 1) === ". . . . . . . . . . . . . . . . . . . . . . . . . . . . . . ") {
                console.log(emptyLane.substring(0, emptyLane.length).includes(`corridor${i * 2}`))
                emptyLane += `corridor${corNum}`
                corNum++
            } else  {
                emptyLane += '. '
            }
        }
        map += `"${emptyLane}"`
        map += '\n'
        console.log(emptyLane.substring(emptyLane.length - 16, emptyLane.length + 1))
    }

    fullLane = ""
    for (let j = 0; j < 60; j++) {
        fullLane += `lane${laneNum} `
    }
    map += `"${fullLane}"`

    console.log(map)

    $('.map').css('grid-template-areas', map)
}

// function initMap() {
//     let odlCorr, corrNum = 1
//     for (let i = 0; i < 6; i++) {
//         odlCorr = document.querySelector('div[class^=corridor]')
//         console.log(odlCorr)
//         odlCorr.parentNode.removeChild(odlCorr)
//     }
//     for (let j = 0; j < 3; j++) {
//         let lane = document.querySelector('.lane' + j)
//         for (let i = 0; i < Math.ceil(Math.random() * 2); i++) {
//             let newCorr = document.createElement('div')
//             newCorr.classList.add('corridor' + corrNum)
//             lane.appendChild(newCorr)
//         } 
//     }
// } --> ajoute des noeuds html mais change pas layout

