"use strict";

const sound = document.getElementById("sound");
const error_sound = document.getElementById("error_sound");
const buttons = document.querySelectorAll("[data-seconds]");
const form = document.querySelector("#form");
const pause_resume = document.querySelector("#pause_resume");
const input = document.querySelector("#input");
const remainingTime = document.querySelector(".display-remaining-time");
const endTime = document.querySelector(".display-end-time");
const nowTime = document.querySelector(".display-now-time");
let countdown;

let pause_then = 0;
let is_paused=false
let quick_timer = 9
var remainingSeconds=-quick_timer;


function playSound () {
	//let ding = new Audio('sound/end_sound.mp3');
	//ding.play();
  sound.play()
}


function timer(seconds) {
  clearInterval(countdown);
  const now = Date.now();
  const then = now + seconds * 1000;
  displayRemainingTime(seconds);
  displayEndTime(then);
  remainingSeconds = Math.round((then - Date.now()) / 1000);
  pause_then = now + remainingSeconds * 1000;
  resume(pause_then);
}

function resume(then) {
  countdown = setInterval(() => {
    remainingSeconds = Math.round((then - Date.now()) / 1000);
    if (remainingSeconds < 0) {
      clearInterval(countdown);
      playSound()
      remainingSeconds = 0
      pause_resume.innerText = "Stop Alarm"
      return;
    }
    if (remainingTime.innerText === "00:00") {
      //console.log("remaining")
      //sound.play();
    }
    displayRemainingTime(remainingSeconds);
  });
}

function displayRemainingTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const _remainingSeconds = seconds % 60;
  const time = `${minutes < 10 ? "0" : ""}${minutes}:${
    _remainingSeconds < 10 ? "0" : ""
  }${_remainingSeconds}`;
  remainingTime.textContent = time;
  remainingTime.style.fontSize = "22rem";
  document.title = time;
}


function displayNowTime() {
  const end = new Date();
  const time = `Time ${end.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit', hour12: true})}`
  //  ${hours < 10 ? "0" : ""}${hours}:${
  //   minutes < 10 ? "0" : ""
  // }${minutes}`;
   nowTime.textContent = time
}

function displayEndTime(then) {
  const end = new Date(then);
  const time = `Complete at ${end.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit', hour12: true})}`
  //  ${hours < 10 ? "0" : ""}${hours}:${
  //   minutes < 10 ? "0" : ""
  // }${minutes}`;
   endTime.textContent = time
}

function click_pause_resume() {
  if (remainingSeconds==0) {
    sound.pause();
    remainingSeconds=-quick_timer 
    pause_resume.innerText = `Snooze ${quick_timer}`
  }
  else if (remainingSeconds==-quick_timer) {
    sound.pause()
    pause_resume.innerText = "Pause"
    timer(quick_timer*60);  
  }
  else if (!is_paused) {
    clearInterval(countdown);
    is_paused = true
    pause_resume.innerText = "Resume"
  }
  else {
    is_paused = false
    pause_resume.innerText = "Pause"
    clearInterval(countdown);
    const now = Date.now();
    const then = now + remainingSeconds * 1000;
    resume(then)
  } 
}

function startTimer1() {
  const seconds = this.dataset.seconds;
  sound.pause()
  pause_resume.innerText = "Pause"
  timer(seconds);
}

function startTimer2(e) {
  e.preventDefault();
 // sound.pause();
  const minutes = input.value;
  const seconds = minutes * 60;

  if (minutes / 1 != minutes) {
    error_sound.play();
    clearInterval(countdown);
    remainingTime.textContent = "Please enter only numbers.";
    remainingTime.style.fontSize = window.innerWidth < 500 ? "4rem" : "7rem";
    document.title = "Countdown Timer";
    endTime.textContent = "";
    this.reset();
    return;
  }

  if (minutes < 0) {
    // This could be an error sound?
    error_sound.play();
    clearInterval(countdown);
    remainingTime.textContent = "Please enter a positive number.";
    remainingTime.style.fontSize = window.innerWidth < 500 ? "3.9rem" : "7rem";
    document.title = "Countdown Timer";
    endTime.textContent = "";
    this.reset();
    return;
  }

  if (minutes == 0) {
    // This could be an error sound?
    error_sound.play();
    clearInterval(countdown);
    remainingTime.textContent = "Oh, no! Zero?";
    remainingTime.style.fontSize = "7rem";
    document.title = "Zero?";
    endTime.textContent = "";
    this.reset();
    return;
  }

  timer(seconds);
  this.reset();
}

buttons.forEach((button) => button.addEventListener("click", startTimer1));

pause_resume.addEventListener("click", click_pause_resume);
pause_resume.innerText = `Snooze ${quick_timer}`

form.addEventListener("submit", startTimer2);

let time_timer = setInterval(() => {
  displayNowTime()
},450)