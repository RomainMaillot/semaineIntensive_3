let store = {
    username: ""
}

const storeActions = {
    saveStore: () => {
        localStorage.setItem('gameData', JSON.stringify(store))
    },
    loadStore: () => {
        if (localStorage.getItem('gameData')) {
            store = JSON.parse(localStorage.getItem('gameData'))
        }
    },
    resetStore: () => {
        if (localStorage.getItem('gameData')) {
            localStorage.removeItem('gameData')
        }
        store = {
            username: ""
        }
    }
}

export { store, storeActions }