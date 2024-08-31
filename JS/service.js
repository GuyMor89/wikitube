'use strict'

function retrieveData(API) {
    showLoader()

    let arrayInCache = false
    let dataFromStorage
    let dataKeyword

    if (API.includes('youtube')) {
        dataFromStorage = loadFromStorage('videosData') || []
        dataKeyword = 'videos'
    } else {
        dataFromStorage = loadFromStorage('wikiData') || []
        dataKeyword = 'wiki'
    }
    dataFromStorage.forEach(dataArray => {
        if (dataArray[0].search === searchValue) {
            arrayInCache = true
        }
    })
    if (!arrayInCache) {
        fetch(API)
            .then(response => response.json())
            .then(data => recieveData(data, dataKeyword))
            .catch(() => hideLoader())
    } else {
        renderData(dataKeyword)
    }
}

function saveData(data) {

    let arrayInCache = false
    let dataFromStorage
    let dataKeyword
    let dataArrayToPush

    if (data.kind) {
        dataKeyword = 'videosData'
        dataFromStorage = loadFromStorage(dataKeyword) || []

        const { items } = data
        dataArrayToPush = items.map(({ id, snippet }) => ({ search: searchValue, id: id.videoId, title: snippet.title, description: snippet.description, thumbnail: snippet.thumbnails.medium.url }))
    } else {
        dataKeyword = 'wikiData'
        dataFromStorage = loadFromStorage(dataKeyword) || []

        const { query } = data
        const { search } = query
        dataArrayToPush = search.map(({ title, snippet }) => ({ search: searchValue, title, snippet }))
    }    

    dataFromStorage.forEach(dataArray => {        
        if (dataArray[0].search === dataArrayToPush[0].search) {
            arrayInCache = true
        }
    })
    if (!arrayInCache) {        
        dataFromStorage.push(dataArrayToPush)
        saveToStorage(dataKeyword, dataFromStorage)
    }
}

function getData(type) {
    let dataFromStorage

    if (type === 'videos') {
        dataFromStorage = loadFromStorage('videosData')
    } else {
        dataFromStorage = loadFromStorage('wikiData')
    }
    dataFromStorage = dataFromStorage.filter(dataArray => dataArray[0].search === searchValue)

    return dataFromStorage.flat()
}


