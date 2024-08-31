'use strict'

// const API_KEY = 'AIzaSyAidkPm4wJUPqkrTvMJf9zRE5Bnt9fDo5w'
const API_KEY = 'AIzaSyDXLCT1WhcKet2-VBh_v4CZmhZYxrOdEaE'
const YOUTUBE_API = `https://www.googleapis.com/youtube/v3/search?part=snippet&videoEmbeddable=true&type=video&key=${API_KEY}`
const WIKIPEDIA_API = `https://en.wikipedia.org/w/api.php?&origin=*&action=query&list=search`

let searchValue = 'Everest'

function onInit() {
    requestData()
    addSearchListener()
    addVideoListener()
    addModalListeners()
    addColorListeners()
    renderPreviousSearches()
}

function requestData() {
    retrieveData(`${YOUTUBE_API}&q=${searchValue}`)
    retrieveData(`${WIKIPEDIA_API}&srsearch=${searchValue}&format=json`)
}

function recieveData(data, type) {
    saveData(data)
    renderData(type)
}

function renderData(type) {
    if (type === 'videos') {
        const videosHTML = getData('videos').map(({ title, description, thumbnail }, index) => `
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

        const videoURL = `https://www.youtube.com/embed/${getData('videos')[0].id}`
        $('.player-container>iframe').attr('src', videoURL)

        hideLoader()
    } else {
        const wikiHTML = getData('wiki').map(({ title, snippet }, index) => `
        <div class="wiki${index}">
            <span onclick="window.open('https://en.wikipedia.org/wiki/${title}', '_blank')">${title}</span>
            <p>${snippet}</p>
            <article class="loader wiki-loader">
                <div class="ball ball1"></div>
                <div class="ball ball2"></div>
                <div class="ball ball3"></div>
            </article>
        </div>
        `)

        $('.wiki-container').html(wikiHTML)

        hideLoader()
    }
}

function addSearchListener() {
    $('.submit-btn').on('click', (event) => {
        event.preventDefault()

        if ($('#search-input').val() === '') return

        searchValue = $('#search-input').val()
        $('#search-input').val('')

        let savedSearches = loadFromStorage('savedSearches') || []
        if (!savedSearches.some(search => search === searchValue)) savedSearches.push(searchValue)
        saveToStorage('savedSearches', savedSearches)

        renderPreviousSearches()
        requestData()
    })
    $('.saved-searches').on('click', 'span', (event) => {
        searchValue = $(event.currentTarget).text()
        requestData()
        $('.logo').focus()
    })
    $('.fa-eraser').on('click', () => {
        Swal.fire({
            title: "Delete previous searches?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete!"
        }).then((result) => {
            if (result.isConfirmed) {
                saveToStorage('savedSearches', [])
                $('.saved-searches').html('')
                Swal.fire({
                    title: "Deleted!",
                    text: "Previous searches have been deleted.",
                    icon: "success"
                })
            }
        })
    })
}

function addVideoListener() {
    $('.videos-container').on('click', 'div', (event) => {
        const videoID = $(event.currentTarget).attr('class').match(/video(\d+)/)[1]
        const videoObject = getData('videos').filter((video, index) => index === +videoID)
        const videoURL = `https://www.youtube.com/embed/${videoObject[0].id}`

        $('.player-container>iframe').attr('src', videoURL)
        $('.logo').focus()
    })
}

function addModalListeners() {
    $('.open-modal').on('click', () => {
        $('.modal-container').removeClass('hidden')
        $('.modal-overlay').addClass('overlay-on')
    })
    $('.modal-overlay').off('click').on('click', () => {
        $('.modal-container').addClass('hidden')
        $('.modal-overlay').removeClass('overlay-on')
    })
}

function addColorListeners() {
    $('#bgc-input').on('input', () => {
        $('.main-content').css('background-color', $('#bgc-input').val())
    })
}

function renderPreviousSearches() {
    let savedSearches = loadFromStorage('savedSearches') || []

    const savedSearchHTML = savedSearches.map(search => `
        <span>${search}</span>
        `)

    $('.saved-searches').html(savedSearchHTML)
}

function showLoader() {
    $('.loader').each((i, loader) => {
        setTimeout(() => {
            $(loader).css('visibility', 'visible')
        }, 500);
    })}

function hideLoader() {
    $('.loader').each((i, loader) => {
        setTimeout(() => {
            $(loader).css('visibility', 'hidden')
        }, 500);
    })}