const wrapper = document.querySelector('.wrapper'),
  musicImg = wrapper.querySelector('.img-area img'),
  musicName = wrapper.querySelector('.song-details .name'),
  musicArtist = wrapper.querySelector('.song-details .artist'),
  mainAudio = wrapper.querySelector('#main-audio'),
  playPauseBtn = wrapper.querySelector('.play-pause'),
  prevBtn = wrapper.querySelector('#prev'),
  nextBtn = wrapper.querySelector('#next'),
  progressArea = wrapper.querySelector('.progress-area'),
  progressBar = wrapper.querySelector('.progress-bar'),
  musicList = wrapper.querySelector('.music-list'),
  showMoreBtn = wrapper.querySelector('#more-music'),
  hideMusicBtn = musicList.querySelector('#close')

let musicIndex = Math.floor(Math.random() * allMusic.length + 1)

window.addEventListener('load', () => {
  loadMusic(musicIndex)
  playingNow()
})

//carregando os dados da musica
function loadMusic(indexNumb) {
  musicName.innerText = allMusic[indexNumb - 1].name
  musicArtist.innerText = allMusic[indexNumb - 1].artist
  musicImg.src = `images/${allMusic[indexNumb - 1].img}.jpg`
  mainAudio.src = `songs/${allMusic[indexNumb - 1].src}.mp3`
}

//funcao play, ela chama o audio e enquanto voce estiver com a musica tocando ela troca o icone para pause
function playMusic() {
  wrapper.classList.add('paused')
  playPauseBtn.querySelector('i').innerText = 'pause'
  mainAudio.play()
}

function pauseMusic() {
  wrapper.classList.remove('paused')
  playPauseBtn.querySelector('i').innerText = 'play_arrow'
  mainAudio.pause()
}

function nextMusic() {
  musicIndex++
  musicIndex > allMusic.length ? (musicIndex = 1) : (musicIndex = musicIndex)
  loadMusic(musicIndex)
  playMusic()
}

function prevMusic() {
  musicIndex--
  musicIndex < 1 ? (musicIndex = allMusic.length) : (musicIndex = musicIndex)
  loadMusic(musicIndex)
  playMusic()
}

//adiciona o evento do botao para chamar as funcao play ou pause
playPauseBtn.addEventListener('click', () => {
  const isMusicPaused = wrapper.classList.contains('paused')
  isMusicPaused ? pauseMusic() : playMusic()
})

nextBtn.addEventListener('click', () => {
  nextMusic()
})

prevBtn.addEventListener('click', () => {
  prevMusic()
})

mainAudio.addEventListener('timeupdate', event => {
  const currentTime = event.target.currentTime //pega o tempo em que esta
  const duration = event.target.duration //pega a duracao inteira do audio
  let progressWidth = (currentTime / duration) * 100
  progressBar.style.width = ` ${progressWidth}%`

  //adicionando o tempo total do audio no player
  let musicCurrentTime = wrapper.querySelector('.current'), //duraçao que o audio esta
    musicDuration = wrapper.querySelector('.duration') //duraçao do auido total

  mainAudio.addEventListener('loadeddata', () => {
    let audioDuration = mainAudio.duration
    let totalMin = Math.floor(audioDuration / 60)
    let totalSec = Math.floor(audioDuration % 60)
    if (totalSec < 10) {
      totalSec = `0${totalSec}`
    }
    musicDuration.innerText = `${totalMin}:${totalSec}`
  })
  let currentMin = Math.floor(currentTime / 60)
  let currentSec = Math.floor(currentTime % 60)
  if (currentSec < 10) {
    currentSec = `0${currentSec}`
  }
  musicCurrentTime.innerText = `${currentMin}:${currentSec}`
})

//movimento da barra de tempo da musica
progressArea.addEventListener('click', e => {
  let progressWidthval = progressArea.clientWidth //pega onde a barra esta
  let clickedOffSetX = e.offsetX //pega o valor da barra
  let songDuration = mainAudio.duration //pega a duração total do audio

  mainAudio.currentTime = (clickedOffSetX / progressWidthval) * songDuration
  playMusic()
})

//mudanco o incone do repeat
const repeatBtn = wrapper.querySelector('#repeat-plist')
repeatBtn.addEventListener('click', () => {
  //primeiro pegamos o texto do icone para conseguir troca-lo
  let getText = repeatBtn.innerText //pega o texto do icone
  switch (getText) {
    case 'repeat': //se o texto do icone for repeat
      repeatBtn.innerText = 'repeat_one' //trocar para repeat one
      repeatBtn.setAttribute('title', 'Song looped')
      break

    case 'repeat_one': //se o texto for repeat_one
      repeatBtn.innerText = 'shuffle' //trocar para shuffle
      repeatBtn.setAttribute('title', 'Playlist shuffle')
      break

    case 'shuffle': //se o texto for shuffle
      repeatBtn.innerText = 'repeat' //para repeat
      repeatBtn.setAttribute('title', 'Playlist looped')
      break
  }
})

//trocando o que o repeat vai fazer
mainAudio.addEventListener('ended', () => {
  let getText = repeatBtn.innerText //pega o texto do icone

  switch (getText) {
    case 'repeat': //se o texto do icone for repeat
      nextMusic() //ir para a proxima musica
      break
    case 'repeat_one': //se o texto for repeat_one
      mainAudio.currentTime = 0 //voltar o tempo da musica ate 0
      loadMusic(musicIndex)
      playMusic()
      break

    case 'shuffle': //se o texto for shuffle
      let randIndex = Math.floor(Math.random() * allMusic.length + 1)
      do {
        randIndex = Math.floor(Math.random() * allMusic.length + 1) //embaralhar as musicas
      } while (musicIndex == randIndex)
      musicIndex = randIndex //colocando a musica embaralhada no length
      loadMusic(musicIndex) //chama a funcao de carregar a musica
      playMusic() //chama a funcao de tocar a musica
      break
  }
})

showMoreBtn.addEventListener('click', () => {
  musicList.classList.toggle('show')
})

hideMusicBtn.addEventListener('click', () => {
  showMoreBtn.click()
})

const ulTag = wrapper.querySelector('ul')
for (let i = 0; i < allMusic.length; i++) {
  let liTag = `<li li-index= "${i + 1}">
                <div class="row">
                  <span> ${allMusic[i].name} </span>
                  <p> ${allMusic[i].artist} </p>    
                </div>
                  <audio class= "${allMusic[i].src}" src= "songs/${
    allMusic[i].src
  }.mp3"></audio>
              </li>`
  ulTag.insertAdjacentHTML('beforeend', liTag)
}

const allLiTags = ulTag.querySelectorAll('li')

function playingNow() {
  for (let j = 0; j < allLiTags.length; j++) {
    if (allLiTags[j].classList.contains('playing')) {
      allLiTags[j].classList.remove('playing')
    }
    if (allLiTags[j].getAttribute('li-index') == musicIndex) {
      allLiTags[j].classList.add('playing')
    }
    allLiTags[j].setAttribute('onclick', 'clicked(this)')
  }
}

function clicked(element) {
  let getLiIndex = element.getAttribute('li-index')
  musicIndex = getLiIndex
  loadMusic(musicIndex)
  playMusic()
  playingNow()
}
