'use strict'

// const API_KEY = 'AIzaSyAidkPm4wJUPqkrTvMJf9zRE5Bnt9fDo5w'
const API_KEY = 'AIzaSyDXLCT1WhcKet2-VBh_v4CZmhZYxrOdEaE'
const YOUTUBE_API = `https://www.googleapis.com/youtube/v3/search?part=snippet&videoEmbeddable=true&type=video&key=${API_KEY}`
let searchValue = 'Tarkan'

function onInit() {
    requestData()
    addSearchListener()
    addVideoListener()
}

function requestData() {
    retrieveData(`${YOUTUBE_API}&q=${searchValue}`)
}

function recieveData(data) {
    saveData(data)
    renderData()
}

function renderData() {
    const videosHTML = getVideos().map(({ title, description, thumbnail }, index) => `
        <div class="video${index}">
            <img src="${thumbnail}">
            <a>${title}</a>
            <span>${description}
            <article class="loader video-loader">
                <div class="ball ball1"></div>
                <div class="ball ball2"></div>
                <div class="ball ball3"></div>
            </article>
        </div>
        `)

    $('.videos-container').html(videosHTML)

    const videoURL = `https://www.youtube.com/embed/${getVideos()[0].id}`
    $('.player-container>iframe').attr('src', videoURL)

    $('.loader').each((i, loader) => {
        setTimeout(() => {
            $(loader).css('opacity', '0')
        }, 500);
    })
}

function addSearchListener() {
    $('.submit-btn').on('click', (event) => {
        event.preventDefault()
        searchValue = $('#search-input').val()
        requestData()        
    })
}

function addVideoListener() {
    $('.videos-container').on('click', 'div', (event) => {
        const videoID = $(event.currentTarget).attr('class').match(/video(\d+)/)[1]
        const videoObject = getVideos().filter((video, index) => index === +videoID)
        const videoURL = `https://www.youtube.com/embed/${videoObject[0].id}`

        $('.player-container>iframe').attr('src', videoURL)
    })
}


function addModalListeners() {
    $('.modal-overlay').off('click').on('click', () => {
        // $('.modal-container').html([])

        $('.modal-container').addClass('hidden')
        $('.modal-overlay').removeClass('overlay-on')
    })
}