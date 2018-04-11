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

const defenser = {
    activeWeapon: 'dossier',
    weapons: [
        {
            name: 'dossier',
            interval: 30,
            behavior: function () {
                if (this.interval === 0) {
                    console.log('feef')
                    this.interval += 30
                }
            }
        },
        {
            name: 'gandalf',
            interval: 10,
            behavior: (e) => {
                if (this.interval === 0) {
                    //actions
                    this.interval += 10
                }
            }
        },
        {
            name: 'ascenseur',
            interval: 25,
            behavior: () => {
                if (this.interval === 0) {
                    //actions
                    this.interval += 25
                }
            }
        },
        {
            name: 'alarme',
            interval: 0,
            behavior: function () {
                console.log('suus la soossis')
                if (this.interval === 0) {
                    console.log('siiss')
                    clearInterval()
                    chronoSet(750)
                    
                    setTimeout(() => {
                        chronoSet(1000)
                    }, 6000)
                    this.interval += 25
                }
            }
        },
        {
            name: 'heure sup',
            interval: 0,
            behavior: function () {
                if (this.interval === 0) {
                    console.log('jaaj')
                    window.removeEventListener('keydown', keyHandler)
                    speed = 50
                    listenArrows()
                    triggerKeyDown.which = 37
                    document.dispatchEvent(triggerKeyDown)
                    setTimeout(() => {
                        speed = 30
                        listenArrows()
                    }, 5000)
                    this.interval += 25
                }
            }
        }
    ],
}

const Player = {
    username: "",
    score: 0
}

export { attacker, defenser }
