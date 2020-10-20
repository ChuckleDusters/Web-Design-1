// establish vars
var canvas, ctx, source, context, analyser, fbc_array, rads,
	center_x, center_y, radius, radius_old, deltarad, shockwave,
	bars, bar_x, bar_y, bar_x_term, bar_y_term, bar_width,
	bar_height, react_x, react_y, intensity, rot, firstPlay,
	audio, pause, source, artist, title, isSeeking, artwork;



//Create multiple objects...
let songs = [
	song1 = {
		title:"Believer", 
		artist:"Imagine Dragons", 
		source:'../AUDIO/IDBeliever.mp3', 
		art:'../IMAGES/IDBeliever.jpg'
	}, 
	song2 = {
		title:"Soothsayer", 
		artist:"Buckethead", 
		source:'../AUDIO/BSoothsayer.mp3', 
		art:'../IMAGES/BSoothsayer.jpg'
	}
]


// give vars an initial real value to validate
bars = 200;
react_x = 0;
react_y = 0;
radius = 0;
deltarad = 0;
shockwave = 0;
rot = 0;
intensity = 0;
pause = 1;
isSeeking = 0;
artist = "Artist: None";
title = "Not Playing - Choose a Song!"
firstPlay = 0;



function initPage() {
	canvas = document.getElementById("visualizer_render");
	ctx = canvas.getContext("2d");

	//resize_canvas();
	document.getElementById("artwork").style.opacity = 0;
	artwork = document.getElementById("artwork");

	audio = new Audio();
	audio.crossOrigin = "anonymous";
	audio.controls = true;
	audio.loop = false;
	audio.autoplay = false;
	
	context = new AudioContext();
	analyser = context.createAnalyser();
	// route audio playback
	source = context.createMediaElementSource(audio);
	source.connect(analyser);
	analyser.connect(context.destination);
	
	fbc_array = new Uint8Array(analyser.frequencyBinCount);
	
	frameLooper();
}

function resize_canvas() {
		canvas.width  = window.innerWidth;
		canvas.height = window.innerHeight/1.3;
}

function togglepause() {

    if(firstPlay) {
        if(pause) {
		    pause = 0;
            audio.play();
            document.getElementById("button_pause").innerHTML = '<button type="button" class="button" onclick="togglepause()" style="position: relative; right: 40px;">&#10074&#10074</button>';
	    } else {
		    pause = 1;
         audio.pause();
         document.getElementById("button_pause").innerHTML = '<button type="button" class="button" onclick="togglepause()" style="position: relative; right: 40px;">&#x23f5</button>';
        }
    } 
}

function Autoplay() {
	if(document.getElementById("autoplay_styling").style.backgroundColor != "rgb(255, 255, 255)") {
		
	}
}

function initMp3Player(input) {
	context.resume()

	audio.src = songs[input].source;
	
    pause = 0;
    firstPlay=1;
	audio.play();
	
	document.getElementById("button_pause").innerHTML = '<button type="button" class="button" onclick="togglepause()" style="position: relative; right: 40px;">&#10074&#10074</button>';
	document.getElementById("artistname").innerHTML = "Artist: " + songs[input].artist;
	document.getElementById("songname").innerHTML = "Title: " + songs[input].title;
	artwork.src = songs[input].art;

	audio.onended = function() {
		if(document.getElementById("replay_styling").style.backgroundColor == "rgb(255, 255, 255)") {
			document.getElementById("button_pause").innerHTML = '<button type="button" class="button" onclick="togglepause()" style="position: relative; right: 40px;">&#x23f5</button>';
		}
		else {
			document.getElementById("time").innerHTML = "0:00";
			initMp3Player(input);
		}
	}

}

function frameLooper() {
	resize_canvas(); // for some reason i have to resize the canvas every update or else the framerate decreases over time
			
	var grd = ctx.createLinearGradient(0, 0, 0, canvas.height);
	grd.addColorStop(0, "rgba(0, 150, 0, 1)");
	grd.addColorStop(1, "rgba(0, 0, 0, 1)");

	ctx.fillStyle = grd;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	
	ctx.fillStyle = "rgba(255, 255, 255, " + (intensity * 0.0000125 - 0.4) + ")";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
		
	rot = rot + intensity * 0.0000001;
		
	react_x = 0;
	react_y = 0;
				
	intensity = 0;
				
	analyser.getByteFrequencyData(fbc_array);
	
	for (var i = 0; i < bars; i++) {
		rads = Math.PI * 2 / bars;
						
		bar_x = center_x;
		bar_y = center_y;
				
		bar_height = Math.min(99999, Math.max((fbc_array[i] * 2.5 - 200), 0));
		bar_width = bar_height * 0.02;
						
		bar_x_term = center_x + Math.cos(rads * i + rot) * (radius + bar_height);
		bar_y_term = center_y + Math.sin(rads * i + rot) * (radius + bar_height);
						
		ctx.save();
					
		var lineColor = "rgb(" + (fbc_array[i]).toString() + ", " + 198 + ", " + 0 + ")";
						
		ctx.strokeStyle = lineColor;
		ctx.lineWidth = bar_width;
		ctx.beginPath();
		ctx.moveTo(bar_x, bar_y);
		ctx.lineTo(bar_x_term, bar_y_term);
		ctx.stroke();
					
		react_x += Math.cos(rads * i + rot) * (radius + bar_height);
		react_y += Math.sin(rads * i + rot) * (radius + bar_height);
					
		intensity += bar_height;
	}
				
	center_x = canvas.width / 2 - (react_x * 0.007);
	center_y = canvas.height / 2 - (react_y * 0.007);
				
	radius_old = radius;
	radius =  25 + (intensity * 0.002);
	deltarad = radius - radius_old;
				
	ctx.strokeStyle = "rgb(255, 255, 255)";
	ctx.lineWidth = 5;
	ctx.beginPath();
	ctx.arc(center_x, center_y, radius + 2, 0, Math.PI * 2, false);
	ctx.stroke();
	ctx.clip();
	ctx.drawImage(artwork, center_x - artwork.width, center_y - artwork.height);
	ctx.restore();

	// shockwave effect			
	shockwave += 60;
				
	ctx.lineWidth = 15;
	ctx.strokeStyle = "rgb(255, 255, 255)";
	ctx.beginPath();
	ctx.arc(center_x, center_y, shockwave + radius, 0, Math.PI * 2, false);
	ctx.stroke();
				
				
	if (deltarad > 12) {
		shockwave = 0;
		
		ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		
		rot = rot + 0.4;
	}
	
	if (!isSeeking) {
		document.getElementById("audioTime").value = (100 / audio.duration) * audio.currentTime;
	}
	
	document.getElementById("time").innerHTML = Math.floor(audio.currentTime / 60) + ":" + (Math.floor(audio.currentTime % 60) < 10 ? "0" : "") + Math.floor(audio.currentTime % 60);

	
	window.requestAnimationFrame(frameLooper);
}

function popupFunction() {
	var popup = document.getElementById("myPopup");
	popup.classList.toggle("show");
  }

window.onkeydown = function(e) { 
	if(e.keyCode == 32) {
		togglepause();
	}
    return !(e.keyCode == 32);
};

function colorToggle() {
	current = document.getElementById("replay_styling").style.backgroundColor;
	if(current == "rgb(255, 255, 255)") {
		document.getElementById("replay_styling").style.backgroundColor = "rgb(80, 80, 80)";
		document.getElementById("replay_styling").style.color = current;
		document.getElementById("replay_styling").style.borderColor = current;
	}
	if(current == "rgb(80, 80, 80)") {
		document.getElementById("replay_styling").style.backgroundColor = "rgb(255, 255, 255)";
		document.getElementById("replay_styling").style.color = "rgb(0, 0, 0)";
		document.getElementById("replay_styling").style.borderColor = "rgb(0, 0, 0)";
	}

}

