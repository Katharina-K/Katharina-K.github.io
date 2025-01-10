let video_running = false;
let interval; 
let timeout;
let current_video: HTMLVideoElement;
let current_progB: HTMLProgressElement;

if(window.frameElement == null)
{
Reveal.addEventListener( "slidechanged", (event) =>{
    
    if(video_running)
    {
        clearTimeout(timeout);
        current_video.pause();
        clearInterval(interval);
        video_running = false;
    }
    let currentSlide  = event.currentSlide as HTMLElement;
    let video: HTMLVideoElement = currentSlide.getElementsByTagName("video")[0] as HTMLVideoElement;
    let progBar: HTMLProgressElement = currentSlide.getElementsByTagName("progress")[0] as HTMLProgressElement;
    current_video = video;    
    if(video != null)
    {
        video_running = true;
        video.currentTime = 0;
        timeout = setTimeout(() => video.play(), 500);
    }
    if(video == null || progBar == null)
        return;
    progBar.max = video.duration;
    progBar.value = 0;
    current_progB = progBar;
    interval = setInterval(updateProgBar, 10);
}
);
}

function updateProgBar()
{
    // console.log("Video Duration="+current_video.currentTime.toString())
    current_progB.value = current_video.currentTime;
}