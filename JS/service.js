'use strict'

function retrieveData(API) {
    $('.loader').css('opacity', '1')

    let searchFound = false

    const videosData = loadFromStorage('videosData') || []

    videosData.forEach(videoArray => {
        if (videoArray[0].search === searchValue) {
            searchFound = true
        }
    })

    if (!searchFound) {
        fetch(API)
            .then(response => response.json())
            .then(data => recieveData(data))
            .catch(() => $('.loader').css('opacity', '0'))
    } else {
        renderData()
    }

    // $.get(API, (data) => {
    //     recieveData(data)
    // })
    //     .fail(() => {
    //     })
}

function saveData(data) {
    const videosData = loadFromStorage('videosData') || []
    let arrayFound = false

    const { items } = data
    const videosDatatoPush = items.map(({ id, snippet }) => ({ search: searchValue, id: id.videoId, title: snippet.title, description: snippet.description, thumbnail: snippet.thumbnails.medium.url }))

    videosData.forEach(videoArray => {
        if (videoArray[0].search === videosDatatoPush[0].search) {
            arrayFound = true
        }
    })
    if (!arrayFound) {
        videosData.push(videosDatatoPush)
            saveToStorage('videosData', videosData)
    }
}

function getVideos() {
    let videosData = loadFromStorage('videosData')

    videosData = videosData.filter(videoArray => videoArray[0].search === searchValue)

    return videosData.flat()
}
