const defenser = {
    weapons: [
        {
            name: 'fuuf',
            interval: 30,
            behavior: () => {
                // action de l'arme
            }
        },
        {
            name: 'jeej',
            interval: 10,
            behavior: () => {
                //action de l'arme
            }
        },
        {
            name: 'saas',
            interval: 25,
            behavior: () => {
                //action de l'arme
            }
        },
    ],
    
}

const attacker = {
    score: 0,
    health: 3,
    hasJump: true,
    win : function () {
        
        window.removeEventListener('keydown')
        character.fadeOut()
        mapWrapper.fadeOut()
        setTimeout(() => { //gère toute la partie pendant le changement de niveau
            listenArrows()
            character.fadeIn()
            initMap()
            mapWrapper.fadeIn()
        }, 10000)
        scrollTo(0, 0)
        this.score += 1
        if (parseInt(localStorage.getItem('bestScore')) < this.score ) {
            localStorage.setItem('bestScore', this.score)
        }

        scoreCounter.innerHTML = this.score
        initMap()
    }
}

const Player = {
    username: "",
    score: 0
}
