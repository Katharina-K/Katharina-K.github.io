// Set sound volume
let sounds = document.getElementsByTagName("audio");
for(let s of sounds)
    if(s.hasAttribute("volume"))
        s.volume = parseFloat(s.getAttribute("volume"));


const punkte_prof_elem : HTMLDivElement = document.getElementById("profs") as HTMLDivElement;
const punkte_studis_elem : HTMLDivElement = document.getElementById("studis") as HTMLDivElement;
var currentSlide : HTMLElement; 

let currentGame: string = "None";
let points = {"None": [0, 0]};

load();

const win_sound : HTMLAudioElement = document.getElementById("win_sound") as HTMLAudioElement;
const one_up_sound : HTMLAudioElement = document.getElementById("one_up_sound") as HTMLAudioElement;

const visib_prof_win: HTMLCollectionOf<HTMLElement> = document.getElementsByClassName("prof_win") as HTMLCollectionOf<HTMLElement>;
const visib_stud_win: HTMLCollectionOf<HTMLElement> = document.getElementsByClassName("stud_win") as HTMLCollectionOf<HTMLElement>;

function setWinningTeam(profPoints, studPoints)
{
    for(let i of visib_prof_win)
        i.hidden = profPoints < studPoints;
    
    for(let i of visib_stud_win)
        i.hidden = profPoints > studPoints;
}

function setPoints()
{
    punkte_prof_elem.innerHTML = points[currentGame][0].toString();
    punkte_studis_elem.innerHTML = points[currentGame][1].toString();
}

function setGlobalPoints()
{
    for(let i of document.getElementsByClassName("punkteStudis"))
        i.innerHTML = points["Global"][1].toString();
    for(let i of document.getElementsByClassName("punkteProfs"))
        i.innerHTML = points["Global"][0].toString();
}


document.addEventListener('keydown', (event : KeyboardEvent)=>{
    if(event.getModifierState("Alt"))
    {
        if(currentGame == "Global")
        {
            if(event.key == "p")
            {
                points[currentGame][0] ++;
                one_up_sound.play();
            }
            else if(event.key == "P")
                points[currentGame][0] --;
            else if(event.key == "o")
            {
                points[currentGame][1] ++;
                one_up_sound.play();
            }
            else if(event.key == "O")
                points[currentGame][1] --;
            setGlobalPoints();
            save();
            setWinningTeam(points[currentGame][0], points[currentGame][1]);
        }else{
            if(event.key == "p")
            {
                points[currentGame][0] ++;
                win_sound.play();
            }
            else if(event.key == "P")
                points[currentGame][0] --;
            else if(event.key == "o")
            {
                points[currentGame][1] ++;
                win_sound.play();
            }
            else if(event.key == "O")
                points[currentGame][1] --;
            setPoints();
            save();
        }
    }
} );

var webcams : HTMLCollectionOf<HTMLVideoElement> = document.getElementsByClassName("webcam") as HTMLCollectionOf<HTMLVideoElement>;

if (navigator.mediaDevices.getUserMedia && webcams.length != 0) {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then( (stream) => {
        for(let video of webcams)
            video.srcObject = stream;
    })
    .catch( (error) => {
      console.log("Can't access WebCam! Remember to allow this!");
    });
}

Reveal.addEventListener( "slidechanged", (event) =>{
        currentSlide  = event.currentSlide as HTMLElement;

        if(currentSlide.hasAttribute("game"))
        {
            currentGame = currentSlide.getAttribute("game");
            if(!points.hasOwnProperty(currentGame))
            {
                points[currentGame] = [0, 0];
            }
            setPoints();
        }

        if(currentSlide.hasAttribute("globalPoints"))
        {
            currentGame = "Global";
            if(!points.hasOwnProperty(currentGame))
            {
                points[currentGame] = [0, 0];
            }
            setGlobalPoints();
        }

        // toggle points view
        if(currentSlide.hasAttribute("noPoints")){
            punkte_prof_elem.parentElement.hidden = true;
            punkte_studis_elem.parentElement.hidden = true;
        }else{
            punkte_prof_elem.parentElement.hidden = false;
            punkte_studis_elem.parentElement.hidden = false;
        }

        if(currentSlide.hasAttribute("stopTimer")){
            stopTimer();
        }


        let curWebCam : HTMLVideoElement = currentSlide.getElementsByClassName("webcam")[0] as HTMLVideoElement;
        if(curWebCam != null)
            curWebCam.play();
        
        if(event.lastSlide != null)
        {
            let prevWebCam : HTMLVideoElement = event.lastSlide.getElementsByClassName("webcam")[0] as HTMLVideoElement;
            if(prevWebCam != null)
                prevWebCam.pause();
        }
    }
);

let runningTimer = null; 


// Check if in an iFrame. Prevent this script from being executed twice
if(window.frameElement == null)
{
// Play Sound on Frament show
Reveal.addEventListener( 'fragmentshown', event => {
    for(let shownFragment of event.fragments)
    {
        if(shownFragment.hasAttribute("sound")){
            let soundToPlay: string = shownFragment.getAttribute("sound");
            let sound_elem: HTMLAudioElement = document.getElementById(soundToPlay+"_sound") as HTMLAudioElement;
            if (sound_elem != null)
                (sound_elem).play();
        }else if(shownFragment.classList.contains("timer"))
            if(runningTimer == null)
                startTimer(shownFragment, parseInt(shownFragment.getAttribute("seconds")));        
    }
} );

}

function stopTimer()
{
    if(runningTimer != null)
    {
        clearInterval(runningTimer);
        runningTimer = null;
    }
}

function startTimer(timer : HTMLDivElement, time: number)
{
    let endTime = Date.now() + time*1000;
    runningTimer = setInterval(()=>{
        let mins = Math.floor((endTime - Date.now()) / 1000/60);
        let secs = Math.floor(((endTime - Date.now()) / 1000) % 60);
        timer.innerHTML = "";
        if(mins < 10)
            timer.innerHTML += "0";
        timer.innerHTML += mins.toString();
        timer.innerHTML += ":";
        if(secs < 10)
            timer.innerHTML += "0";
        timer.innerHTML += secs.toString()
        if(Date.now() >= endTime)
        {
            timer.innerHTML = "00:00";
            clearInterval(runningTimer);
            runningTimer = null;
        }
    } , 100); 
}

function load()
{
    try{
        let pointsJS = JSON.parse(getCookie("points"));
        points = pointsJS;
    }catch(e){
        console.log("Could not load points.")
    }

    setPoints();
}

function resetPoints()
{
    for(let i in points)
        points[i] = [0, 0];
    save();
}

function save()
{
    setCookie("points", JSON.stringify(points), 1);
}

function setCookie(cname, cvalue, exhours) {
    var d = new Date();
    d.setTime(d.getTime() + (exhours * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
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