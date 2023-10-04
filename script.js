const songName = document.getElementById("song-name");
const bandName = document.getElementById("band-name");
const song = document.getElementById("audio");
const cover = document.getElementById("cover");
const play = document.getElementById("play");
const next = document.getElementById("next");
const previous = document.getElementById("previous");
const likeBtn = document.getElementById("like");
const currentProgress = document.getElementById("current-progress");
const progressContainer = document.getElementById("progress-container");
const shuffleBtn = document.getElementById("shuffle");
const repeatBtn = document.getElementById("repeat");
const songTime = document.getElementById("song-time");
const totalTime = document.getElementById("total-time");

const soEraNos = {
    songName: "Só Era Nós",
    artist: "Hungria Hip-Hop",
    file: "so-era-nos",
    liked: false
};
const tiffany = {
    songName: "Tiffany",
    artist: "MD Chefe e Offlei Sounds",
    file: "tiffany",
    liked: false
};
const reiLacoste = {
    songName: "Rei Lacoste",
    artist: "OFFLEI SOUNDS, MD Chefe e DomLaike",
    file: "rei-lacoste",
    liked: false
};

let isPlaying = false;
let isShuffled = false;
let repeatOn = false;
const originalPlaylist = JSON.parse(localStorage.getItem("playlist")) ?? [soEraNos, tiffany, reiLacoste];
let sortedPlaylist = [...originalPlaylist];
let index = 0;

function playSong() {
    play.querySelector(".bi").classList.remove("bi-play-circle-fill");
    play.querySelector(".bi").classList.add("bi-pause-circle-fill");
    song.play();
    isPlaying = true;
}

function pauseSong() {
    play.querySelector(".bi").classList.add("bi-play-circle-fill");
    play.querySelector(".bi").classList.remove("bi-pause-circle-fill");
    song.pause();
    isPlaying = false;
}

function playPauseDecider() {
    if (isPlaying === true) {
        pauseSong();
    }
    else {
        playSong();
    }
}

function likeBtnRender() {
    if (sortedPlaylist[index].liked === false) {
        likeBtn.querySelector(".bi").classList.add("bi-heart");
        likeBtn.querySelector(".bi").classList.remove("bi-heart-fill");
        likeBtn.classList.remove("btn-active");
    }
    else {
        likeBtn.querySelector(".bi").classList.remove("bi-heart");
        likeBtn.querySelector(".bi").classList.add("bi-heart-fill");
        likeBtn.classList.add("btn-active");
    }
}

function inicializeSong() {
    cover.src = `images/${sortedPlaylist[index].file}.jpg`
    song.src = `songs/${sortedPlaylist[index].file}.mp3`;
    songName.innerText = sortedPlaylist[index].songName;
    bandName.innerText = sortedPlaylist[index].artist;
    likeBtnRender();
}

function previousSong() {
    if (index === 0) {
        index = sortedPlaylist.length - 1;
    }
    else {
        index -= 1;
    }
    inicializeSong();
    playSong();
}

function nextSong() {
    if (index === sortedPlaylist.length - 1) {
        index = 0;
    }
    else {
        index += 1;
    }
    inicializeSong();
    playSong();
}

function updateProgress() {
    const barWidth = (song.currentTime / song.duration) * 100;
    currentProgress.style.setProperty("--progress", `${barWidth}%`);
    songTime.innerText = toHHMMSS(song.currentTime);
}

function jumpTo(event) {
    const width = progressContainer.clientWidth;
    const clickPosition = event.offsetX;
    const jumpToTime = (clickPosition / width) * song.duration;
    song.currentTime = jumpToTime;
}

function shuffleArray(preShuffleArray) {
    const size = preShuffleArray.length;
    let currentIndex = size - 1;
    while (currentIndex > 0) {
        let randomIndex = Math.floor(Math.random() * size);
        let aux = preShuffleArray[currentIndex];
        preShuffleArray[currentIndex] = preShuffleArray[randomIndex];
        preShuffleArray[randomIndex] = aux;
        currentIndex -= 1;
    }
}

function shuffleBtnClicked() {
    if (isShuffled === false) {
        isShuffled = true;
        shuffleArray(sortedPlaylist);
        shuffleBtn.classList.add("btn-active");
    }
    else {
        isShuffled = false;
        sortedPlaylist = [...originalPlaylist];
        shuffleBtn.classList.remove("btn-active");
    }
}

function repeatBtnClicked() {
    if (repeatOn === false) {
        repeatOn = true;
        repeatBtn.classList.add("btn-active");
    }
    else {
        repeatOn = false;
        repeatBtn.classList.remove("btn-active");
    }
}

function nextOrRepeat() {
    if (repeatOn === false) {
        nextSong();
    }
    else {
        playSong();
    }
}

function toHHMMSS(originalNumber) {
    let hours = Math.floor(originalNumber / 3600);
    let min = Math.floor((originalNumber - hours * 3600) / 60);
    let secs = Math.floor(originalNumber - hours * 3600 - min * 60);

    return `${hours.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

function updateTotalTime() {
    totalTime.innerText = toHHMMSS(song.duration);
}

function likeBtnClicked() {
    if (sortedPlaylist[index].liked === false) {
        sortedPlaylist[index].liked = true;
    }
    else {
        sortedPlaylist[index].liked = false
    }
    likeBtnRender();
    localStorage.setItem("playlist", JSON.stringify(originalPlaylist));
}

inicializeSong();

play.addEventListener("click", playPauseDecider);
previous.addEventListener("click", previousSong);
next.addEventListener("click", nextSong);
song.addEventListener("timeupdate", updateProgress);
song.addEventListener("ended", nextOrRepeat);
song.addEventListener("loadedmetadata", updateTotalTime);
progressContainer.addEventListener("click", jumpTo);
shuffleBtn.addEventListener("click", shuffleBtnClicked);
repeatBtn.addEventListener("click", repeatBtnClicked);
likeBtn.addEventListener("click", likeBtnClicked);