const defenser = {
    activeWeapon: 'dossier',
    weapons: [
        {
            name: 'dossier',
            interval: 0,
            behavior: () => {
                if (this.interval === 0) {
                    console.log('feef')
                    interval += 30
                }
            }
        },
        {
            name: 'gandalf',
            interval: 10,
            behavior: () => {
                //action de l'arme
            }
        },
        {
            name: 'ascenseur',
            interval: 25,
            behavior: () => {
                //
            }
        },
        {
            name: 'alarme',
            interval: 25,
            behavior: () => {
                //
            }
        },
        {
            name: 'heure sup',
            interval: 25,
            behavior: () => {
                //
            }
        }
    ],
    
}

const attacker = {
    score: 0,
    health: 3,
    hasJump: true,
    win : function () {
        
        // window.removeEventListener('keydown')
        let gg = document.querySelector('.gg')
        gg.classList.remove('fadeOut')
        clearInterval(go)
        left = 0
        frameRight = 0
        frameLeft = 0
        character.parentNode.removeChild(character)
        mapWrapper.classList.add('fadeOut')
        setTimeout(() => { //gère toute la partie pendant le changement de niveau
            initMap()
            gg.classList.add('fadeOut')
            mapWrapper.classList.remove('fadeOut')
        }, 4000)
        scrollTo(0, 0)
        this.score += 1
        if (parseInt(localStorage.getItem('bestScore')) < this.score ) {
            localStorage.setItem('bestScore', this.score)
        }

        document.querySelector('.score').innerHTML = `score : ${this.score}`
        init()
    }
}

const Player = {
    username: "",
    score: 0
}

// export { defenser, attacker }
