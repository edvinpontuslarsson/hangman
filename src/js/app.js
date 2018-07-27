'use strict'

import Hangman from './HangmanGame'

// environment variables
require('dotenv').config()

Hangman.create()
/*
const getWordFromApi = async () => {
    const url = 
        `https://api.wordnik.com/v4/words.json/randomWord?hasDictionaryDef=true&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=3&maxLength=22&api_key=${process.env.wordnikAPIKey}`

    const word = await window.fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        }
    })

    console.log(word)
}

getWordFromApi()*/
