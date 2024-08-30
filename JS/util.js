'use strict'

function saveToStorage(key, value) {
    var valueString = JSON.stringify(value)
    localStorage.setItem(key, valueString)
}

function loadFromStorage(key) {
    var valueString = localStorage.getItem(key)
    if (valueString === 'undefined' || valueString === null) return undefined
    return JSON.parse(valueString)
}