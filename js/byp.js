// Set sound volume
let sounds = document.getElementsByTagName("audio");
for (let s of sounds)
    if (s.hasAttribute("volume"))
        s.volume = parseFloat(s.getAttribute("volume"));
const punkte_prof_elem = document.getElementById("profs");
const punkte_studis_elem = document.getElementById("studis");
var currentSlide;
let currentGame = "None";
let points = { "None": [0, 0] };
load();
const win_sound = document.getElementById("win_sound");
const one_up_sound = document.getElementById("one_up_sound");
const visib_prof_win = document.getElementsByClassName("prof_win");
const visib_stud_win = document.getElementsByClassName("stud_win");
function setWinningTeam(profPoints, studPoints) {
    for (let i of visib_prof_win)
        i.hidden = profPoints < studPoints;
    for (let i of visib_stud_win)
        i.hidden = profPoints > studPoints;
}
function setPoints() {
    punkte_prof_elem.innerHTML = points[currentGame][0].toString();
    punkte_studis_elem.innerHTML = points[currentGame][1].toString();
}
function setGlobalPoints() {
    for (let i of document.getElementsByClassName("punkteStudis"))
        i.innerHTML = points["Global"][1].toString();
    for (let i of document.getElementsByClassName("punkteProfs"))
        i.innerHTML = points["Global"][0].toString();
}
document.addEventListener('keydown', (event) => {
    if (event.getModifierState("Alt")) {
        if (currentGame == "Global") {
            if (event.key == "p") {
                points[currentGame][0]++;
                one_up_sound.play();
            }
            else if (event.key == "P")
                points[currentGame][0]--;
            else if (event.key == "o") {
                points[currentGame][1]++;
                one_up_sound.play();
            }
            else if (event.key == "O")
                points[currentGame][1]--;
            setGlobalPoints();
            save();
            setWinningTeam(points[currentGame][0], points[currentGame][1]);
        }
        else {
            if (event.key == "p") {
                points[currentGame][0]++;
                win_sound.play();
            }
            else if (event.key == "P")
                points[currentGame][0]--;
            else if (event.key == "o") {
                points[currentGame][1]++;
                win_sound.play();
            }
            else if (event.key == "O")
                points[currentGame][1]--;
            setPoints();
            save();
        }
    }
});
var webcams = document.getElementsByClassName("webcam");
if (navigator.mediaDevices.getUserMedia && webcams.length != 0) {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
        for (let video of webcams)
            video.srcObject = stream;
    })
        .catch((error) => {
        console.log("Can't access WebCam! Remember to allow this!");
    });
}
Reveal.addEventListener("slidechanged", (event) => {
    currentSlide = event.currentSlide;
    if (currentSlide.hasAttribute("game")) {
        currentGame = currentSlide.getAttribute("game");
        if (!points.hasOwnProperty(currentGame)) {
            points[currentGame] = [0, 0];
        }
        setPoints();
    }
    if (currentSlide.hasAttribute("globalPoints")) {
        currentGame = "Global";
        if (!points.hasOwnProperty(currentGame)) {
            points[currentGame] = [0, 0];
        }
        setGlobalPoints();
    }
    // toggle points view
    if (currentSlide.hasAttribute("noPoints")) {
        punkte_prof_elem.parentElement.hidden = true;
        punkte_studis_elem.parentElement.hidden = true;
    }
    else {
        punkte_prof_elem.parentElement.hidden = false;
        punkte_studis_elem.parentElement.hidden = false;
    }
    if (currentSlide.hasAttribute("stopTimer")) {
        stopTimer();
    }
    let curWebCam = currentSlide.getElementsByClassName("webcam")[0];
    if (curWebCam != null)
        curWebCam.play();
    if (event.lastSlide != null) {
        let prevWebCam = event.lastSlide.getElementsByClassName("webcam")[0];
        if (prevWebCam != null)
            prevWebCam.pause();
    }
});
let runningTimer = null;
// Check if in an iFrame. Prevent this script from being executed twice
if (window.frameElement == null) {
    // Play Sound on Frament show
    Reveal.addEventListener('fragmentshown', event => {
        for (let shownFragment of event.fragments) {
            if (shownFragment.hasAttribute("sound")) {
                let soundToPlay = shownFragment.getAttribute("sound");
                let sound_elem = document.getElementById(soundToPlay + "_sound");
                if (sound_elem != null)
                    (sound_elem).play();
            }
            else if (shownFragment.classList.contains("timer"))
                if (runningTimer == null)
                    startTimer(shownFragment, parseInt(shownFragment.getAttribute("seconds")));
        }
    });
}
function stopTimer() {
    if (runningTimer != null) {
        clearInterval(runningTimer);
        runningTimer = null;
    }
}
function startTimer(timer, time) {
    let endTime = Date.now() + time * 1000;
    runningTimer = setInterval(() => {
        let mins = Math.floor((endTime - Date.now()) / 1000 / 60);
        let secs = Math.floor(((endTime - Date.now()) / 1000) % 60);
        timer.innerHTML = "";
        if (mins < 10)
            timer.innerHTML += "0";
        timer.innerHTML += mins.toString();
        timer.innerHTML += ":";
        if (secs < 10)
            timer.innerHTML += "0";
        timer.innerHTML += secs.toString();
        if (Date.now() >= endTime) {
            timer.innerHTML = "00:00";
            clearInterval(runningTimer);
            runningTimer = null;
        }
    }, 100);
}
function load() {
    try {
        let pointsJS = JSON.parse(getCookie("points"));
        points = pointsJS;
    }
    catch (e) {
        console.log("Could not load points.");
    }
    setPoints();
}
function resetPoints() {
    for (let i in points)
        points[i] = [0, 0];
    save();
}
function save() {
    setCookie("points", JSON.stringify(points), 1);
}
function setCookie(cname, cvalue, exhours) {
    var d = new Date();
    d.setTime(d.getTime() + (exhours * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
let video_running = false;
let interval;
let timeout;
let current_video;
let current_progB;
if (window.frameElement == null) {
    Reveal.addEventListener("slidechanged", (event) => {
        if (video_running) {
            clearTimeout(timeout);
            current_video.pause();
            clearInterval(interval);
            video_running = false;
        }
        let currentSlide = event.currentSlide;
        let video = currentSlide.getElementsByTagName("video")[0];
        let progBar = currentSlide.getElementsByTagName("progress")[0];
        current_video = video;
        if (video != null) {
            video_running = true;
            video.currentTime = 0;
            timeout = setTimeout(() => video.play(), 500);
        }
        if (video == null || progBar == null)
            return;
        progBar.max = video.duration;
        progBar.value = 0;
        current_progB = progBar;
        interval = setInterval(updateProgBar, 10);
    });
}
function updateProgBar() {
    // console.log("Video Duration="+current_video.currentTime.toString())
    current_progB.value = current_video.currentTime;
}
const drum_sound = document.getElementById("drumroll_sound");
const delay = parseInt(drum_sound.getElementsByTagName("source")[0].getAttribute("delay"));
// Check if in an iFrame. Prevent this script from being executed twice
if (window.frameElement == null) {
    // Play Sound on Frament show
    Reveal.addEventListener('fragmentshown', event => {
        for (let shownFragment of event.fragments) {
            if (!(shownFragment.classList.contains("drumroll")))
                return;
            drum_sound.play();
            setTimeout(() => {
                Reveal.next();
            }, drum_sound.duration * 1000 - delay);
        }
    });
}
const ans_sound = document.getElementById("answer_sound");
const delay_ans = parseInt(ans_sound.getElementsByTagName("source")[0].getAttribute("delay"));
let audio_to_stop = null;
// Check if in an iFrame. Prevent this script from being executed twice
if (window.frameElement == null) {
    // Play Sound on Frament show
    Reveal.addEventListener('fragmentshown', event => {
        if (audio_to_stop != null) {
            audio_to_stop.pause();
            audio_to_stop = null;
        }
        for (let shownFragment of event.fragments) {
            if ((shownFragment.classList.contains("ans_sound"))) {
                ans_sound.play();
                setTimeout(() => {
                    Reveal.next();
                }, ans_sound.duration * 1000 - delay_ans);
            }
            else if (shownFragment.classList.contains("audio")) {
                audio_to_stop = shownFragment;
                audio_to_stop.play();
            }
        }
    });
}
