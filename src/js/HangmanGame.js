'use strict'

class Hangman {
  constructor () {
    this.alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
      'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
    this.words = ['potato',
      'book',
      'orange',
      'magpie',
      'hamster',
      'horse',
      'pillow',
      'chair',
      'apple',
      'train',
      'railroad',
      'hologram',
      'bicycle',
      'koala',
      'tea',
      'coffee',
      'universe',
      'bird',
      'money',
      'water',
      'elephant',
      'hippopotamus',
      'duck',
      'goose',
      'house',
      'spoon',
      'moon',
      'galaxy',
      'mountain',
      'tree',
      'planet',
      'dinosaur',
      'table',
      'rock',
      'computer',
      'forklift',
      'mirror',
      'car',
      'cat',
      'floor',
      'zombie',
      'baboon',
      'robot',
      'badger',
      'snake',
      'tomato',
      'helicopter',
      'guitar',
      'beetroot',
      'banana',
      'keyboard',
      'word'
    ]
    this.wordShuffle()
    this.storage = window.localStorage
    this.container = document.querySelector('#hangman-space')
    this.beginning()
  }
  /**
       * Creates a new Hangman instance
       */
  static create () {
    const hangman = new Hangman()
    return hangman
  }
  /**
       * Fisher-Yates shuffle algorithm
       */
  wordShuffle () {
    for (let i = this.words.length - 1; i > 0; i -= 1) {
      let random = Math.floor(Math.random() * (i + 1))
      let temp = this.words[random]
      this.words[random] = this.words[i]
      this.words[i] = temp
    }
  }
  /**
       * Picks the last word and removes it from the array.
       */
  wordPick () {
    return this.words.pop()
  }
  /**
      * Renders instructions from HTML-template
      */
  beginning () {
    this.solvedWords = 0
    let template = document.querySelector('#hangmanInstructions')
    this.instruction = document.importNode(template.content.firstElementChild, true)
    this.container.appendChild(this.instruction)
    // Gets the nickname and starts the game
    this.instruction.querySelectorAll('.hangStartBtn')[0].addEventListener('click', () => {
      const tempNick = this.instruction.querySelectorAll('.hangNick')[0].value
      this.playerNick = xssFilters.inHTMLData(tempNick)
      this.container.removeChild(this.instruction)
      this.hangGame()
    })
  }
  /**
      * Initiates a Hangman game round
      */
  hangGame () {
    this.currentWord = this.wordPick()
    if (this.currentWord === undefined) {
      this.theEnd('Wow! Congratulations, you solved all words', ':)', true)
    } else {
      this.hangScene()
      this.renderAlphabet()
      this.wordLength()
      this.amountOfCorrectGuesses = 0
      this.fails = 0
      // inspects the selected letter
      this.hangWindow.querySelectorAll('.letter-space')[0]
        .addEventListener('click', (event) => {
          event.preventDefault()
          if (event.target.value !== undefined) {
            this.hangWindow.querySelectorAll(`.${event.target.value}`)[0]
              .classList.add('hide')
            this.matches = false
            this.checkForMatch(event.target.value)
            if (this.amountOfCorrectGuesses === this.currentWord.length) {
              setTimeout(() => {
                this.container.removeChild(this.hangWindow)
                this.newRound()
              }, 250)
            }
            if (this.matches === false) {
              this.fails += 1
              if (this.fails === 11) {
                setTimeout(() => {
                  this.container.removeChild(this.hangWindow)
                  this.theEnd('Game over', ':(', false)
                }, 300)
              }
              this.hangWindow.querySelectorAll('.hangmanPic')[0].src = `
                      pics/hangman-pics/hm${this.fails}.png
                      `
            }
          }
        })
    }
  }
  /**
   * Renders the first picture, divs for an alphabet and the word.
   * Also displays solved words and the nickname.
   */
  hangScene () {
    this.hangWindow = document.createElement('div')
    this.hangWindow.innerHTML = `
            <img src="pics/hangman-pics/hm0.png" class="hangmanPic" alt="Hangman picture">
            <div class="letter-space"></div>
            <h3 class="word-space"></h3>
            <h3  class="solvedWords">Solved words: ${this.solvedWords}</h3>
            <h3 class="hangNick-space">${this.playerNick}</h3>
            `
    this.hangWindow.classList.add('hangman')

    this.container.appendChild(this.hangWindow)
  }
  /**
   * Renders an alphabet to the user.
   */
  renderAlphabet () {
    this.letterSpace = this.hangWindow.querySelectorAll('.letter-space')[0]
    for (let i = 0; this.alphabet.length > i; i += 1) {
      let letter = document.createElement('div')
      letter.innerHTML = `
      <input type="submit" class="${this.alphabet[i]}" value="${this.alphabet[i]}">
      `
      letter.setAttribute('class', 'letter')
      if (i === 3 || i === 7 || i === 11 || i === 15 || i === 19 || i === 23) {
        letter.appendChild(document.createElement('br'))
        letter.appendChild(document.createElement('br'))
      }
      this.letterSpace.appendChild(letter)
    }
  }
  /**
   * Renders an underscore for every letter in the word
   */
  wordLength () {
    for (let i = 0; this.currentWord.length > i; i += 1) {
      let underscore = document.createElement('own-element')
      underscore.innerHTML = '_ '
      this.hangWindow.querySelectorAll('.word-space')[0].appendChild(underscore)
    }
  }
  /**
   * Checks if the selected letter occurs in the current word.
   * Also replaces the underscore symbols with the correct letters
   *
   * @param {any} letter - letter to be checked
   */
  checkForMatch (letter) {
    for (let i = 0; this.currentWord.length > i; i += 1) {
      if (this.currentWord[i] === letter) {
        this.matches = true
        this.amountOfCorrectGuesses += 1

        let correctLetter = document.createElement('correct-letter')
        correctLetter.innerHTML = this.currentWord[i]
        this.hangWindow.querySelectorAll('.word-space')[0]
          .replaceChild(correctLetter, this.hangWindow.querySelectorAll('.word-space')[0]
            .childNodes[i])
      }
    }
  }
  /**
   * Initiates a new Hangman round
   */
  newRound () {
    this.amountOfCorrectGuesses = 0
    this.solvedWords += 1
    this.hangGame()
  }
  /**
   * Renders ending message with high score list
   *
   * @param {any} message
   * @param {any} smiley
   * @param {any} finished - true if all words have been solved
   */
  theEnd (message, smiley, finished) {
    this.playerStorage()
    this.sorts()
    this.ending = document.createElement('div')
    this.ending.innerHTML = `
      <p class="hangEnd">${message} ${this.playerNick} ${smiley}</p>
      <p class="lastWordWas">The last word was ${this.currentWord}</p>
      <p>You solved ${this.solvedWords} words</p>
      <h3 class="hangmanHighScore">High Score:</h3>
      <div class="hangScoreList"></div>
      <input class="againHangButton" type="submit" value="Play again!">
      `
    this.ending.classList.add('hangmanEnding')
    this.container.appendChild(this.ending)
    for (let i = 0; this.hangmanPlayers.length > i; i += 1) {
      let championSpot = document.createElement('p')
      championSpot.innerHTML = `
        ${i + 1}: ${this.hangmanPlayers[i].nickname}, solved ${this.hangmanPlayers[i].score} words 
        `
      this.ending.querySelectorAll('.hangScoreList')[0].appendChild(championSpot)
      if (i === 4) {
        break
      }
    }
    if (this.hangmanPlayers.length < 1) {
      this.ending.removeChild(this.ending.querySelectorAll('.hangmanHighScore')[0])
    }
    if (finished === true) {
      this.ending.removeChild(this.ending.querySelectorAll('.lastWordWas')[0])
    }
    this.ending.querySelectorAll('.againHangButton')[0].addEventListener('click', () => {
      this.container.removeChild(this.ending)
      this.beginning()
    })
  }
  /**
   * Gets previous Hangman players from local storage
   * Also sets it with the current user
   */
  playerStorage () {
    this.hangmanPlayers = JSON.parse(this.storage.getItem('hangmanPlayers')) || []
    if (this.solvedWords > 0) {
      let player = {
        nickname: this.playerNick,
        score: this.solvedWords
      }
      this.hangmanPlayers.push(player)
      this.storage.setItem('hangmanPlayers', JSON.stringify(this.hangmanPlayers))
    }
  }
  /**
     * Sorts players after the highest amount of solved words
     */
  sorts () {
    this.hangmanPlayers.sort((a, b) => {
      return b.score - a.score
    })
  }
}

export default Hangman
