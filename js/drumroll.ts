const drum_sound : HTMLAudioElement = document.getElementById("drumroll_sound") as HTMLAudioElement;
const delay : number = parseInt(drum_sound.getElementsByTagName("source")[0].getAttribute("delay"));
// Check if in an iFrame. Prevent this script from being executed twice
if(window.frameElement == null)
{

// Play Sound on Frament show
Reveal.addEventListener( 'fragmentshown', event => {
    for(let shownFragment of event.fragments)
    {
        if(!(shownFragment.classList.contains("drumroll")))
            return;
        drum_sound.play();
        setTimeout(()=>{
            Reveal.next();
        }, drum_sound.duration*1000 - delay);
    }
} );

}

const ans_sound : HTMLAudioElement = document.getElementById("answer_sound") as HTMLAudioElement;
const delay_ans : number = parseInt(ans_sound.getElementsByTagName("source")[0].getAttribute("delay"));
let audio_to_stop : HTMLAudioElement = null;

// Check if in an iFrame. Prevent this script from being executed twice
if(window.frameElement == null)
{

// Play Sound on Frament show
Reveal.addEventListener( 'fragmentshown', event => {
    if(audio_to_stop != null)
    {
        audio_to_stop.pause();
        audio_to_stop = null;
    }
    for(let shownFragment of event.fragments)
    {
        if((shownFragment.classList.contains("ans_sound"))){
            ans_sound.play();
            setTimeout(()=>{
                Reveal.next();
            }, ans_sound.duration*1000 - delay_ans);
        }else if(shownFragment.classList.contains("audio")){
            audio_to_stop = shownFragment;
            audio_to_stop.play();
        }   
    }
    

} );

}