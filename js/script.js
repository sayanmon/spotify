
let currentSong = new Audio();
let currentfolder;
let songs;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}


async function getSongs(folder) {

    currentfolder = folder;

    let a = await fetch(`http://127.0.0.1:3000/${folder}/`)
    let response = await a.text();



    let div = document.createElement("div")
    div.innerHTML = response;

    let as = div.getElementsByTagName("a")

    songs = []

    for (let index = 0; index < as.length; index++) {
        const element = as[index];

        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`${folder}`)[1])
        }
    }


   

    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songul.innerHTML = ""

    for (const song of songs) {
        songul.innerHTML = songul.innerHTML + `
        <li>
                            <img class="invert" src="img/music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")}</div>
                                <div>Sayan</div>
                            </div>

                            <div class="playnow">

                                <span>Play Now</span>
                                <img class="invert" src="img/pause.svg" alt="">
                            </div>
         </li>`;
    }

    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {

        e.addEventListener("click", element => {

            console.log(e.querySelector(".info").firstElementChild.innerHTML)

            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })

    })


return songs

}


const playMusic = (track, pause = false) => {

    //   let audio = new Audio("./songs/" + track)

    currentSong.src = `/${currentfolder}/` + track
    if (!pause) {

        currentSong.play()
        play.src = "img/playy.svg"


    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"




}


async function displayalbums() {

    let a = await fetch(`http://127.0.0.1:3000/songs/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;

    let anchors = div.getElementsByTagName("a")

    let cardcontainer = document.querySelector(".cardcontainer")


    let array = Array.from(anchors)

    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if (e.href.includes("/songs") && !e.href.includes(".htaccess")) {
            let folder = e.href.split("/").slice(-2)[0]
            //get the meta data of the folder

            let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`)
            let response = await a.json();



            cardcontainer.innerHTML = cardcontainer.innerHTML + `<div data-folder="${folder}" class="card">
                        <div class="play">
                            <img src="img/play.svg" alt="">
                        </div>
                        <img src="./songs/${folder}/cover.jpg" alt="">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>`
        }

    }


    //load the playlist whenever click on card

    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            console.log(e)
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}/`)
            playMusic(songs[0])

        })


    })
}


async function main() {



    await getSongs("songs/sayan/")
    playMusic(songs[0], true)

    //display albums

    await displayalbums()





    play.addEventListener("click", () => {

        if (currentSong.paused) {
            currentSong.play()

            play.src = "img/playy.svg"
        }
        else {
            currentSong.pause()
            play.src = "img/pause.svg"
        }
    })

    //time update
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    //seekbar add event listner


    document.querySelector(".seekbar").addEventListener("click", e => {

        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100


    })



    // add event listener for hamburger icon

    document.querySelector(".hamburger").addEventListener("click", () => {

        document.querySelector(".left").style.left = "0";


    })


    //add event listener to close icon

    document.querySelector(".close").addEventListener("click", () => {

        document.querySelector(".left").style.left = "-100%";


    })


    // 


    // Add an event listener to previous
    previous.addEventListener("click", () => {
        currentSong.pause()
        currentSong.play()
        play.src = "img/playy.svg"
        console.log("Previous clicked")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })

    // Add an event listener to next
    next.addEventListener("click", () => {
        currentSong.pause()
        currentSong.play()
        play.src = "img/playy.svg"
        console.log("Next clicked")

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })


    //add an event in volume

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {

        currentSong.volume = parseInt(e.target.value) / 100
    })




    //add event to change mute the volume


    document.querySelector(".volume>img").addEventListener("click", e => {

        if (e.target.src.includes("img/volume.svg")) {

            e.target.src = e.target.src.replace("img/volume.svg", "img/mute.svg")
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else {

            e.target.src = e.target.src.replace("img/mute.svg", "img/volume.svg")
            currentSong.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }




    })




}


main()