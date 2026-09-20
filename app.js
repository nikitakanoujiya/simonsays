let gameSeq = [];
let userSeq = [];

let btns = ["yellow", "red", "purple", "green"];

let started = false;
let level = 0;
let canClick = false;
let levelTimeout = null;
let sequenceTimeouts = [];

let h2 = document.querySelector("h2");
let startBtn = document.querySelector("#start, #start-btn, .start-btn");

function clearAllTimeouts() {
    if (levelTimeout) {
        clearTimeout(levelTimeout);
        levelTimeout = null;
    }
    for (let t of sequenceTimeouts) {
        clearTimeout(t);
    }
    sequenceTimeouts = [];
}

function startGame() {
    if (started == false) {
        console.log("game is started");
        started = true;
        clearAllTimeouts();
        levelUp();
    }
}

document.addEventListener("keydown", startGame);
document.addEventListener("keypress", startGame);
if (h2) {
    h2.addEventListener("click", startGame);
}
if (startBtn) {
    startBtn.addEventListener("click", startGame);
}

function gameFlash(btn) {
    btn.classList.add("flash");
    let t = setTimeout(function () {
        btn.classList.remove("flash");
    }, 250);
    sequenceTimeouts.push(t);
}

function userFlash(btn) {
    btn.classList.add("userflash");
    setTimeout(function () {
        btn.classList.remove("userflash");
    }, 250);
}

function playSequence() {
    canClick = false;
    let stepDelay = 600; // ms between flashes
    let initialDelay = 300; // pause before flashing begins

    gameSeq.forEach((color, i) => {
        let t = setTimeout(() => {
            if (!started) return;
            let btn = document.querySelector(`.${color}`);
            if (btn) {
                gameFlash(btn);
            }
            if (i === gameSeq.length - 1) {
                let finishTimeout = setTimeout(() => {
                    if (started) {
                        canClick = true;
                    }
                }, 300);
                sequenceTimeouts.push(finishTimeout);
            }
        }, initialDelay + i * stepDelay);
        sequenceTimeouts.push(t);
    });
}

function levelUp() {
    userSeq = [];
    level++;
    h2.innerText = `Level ${level}`;

    canClick = false;
    let randIdx = Math.floor(Math.random() * btns.length);
    let randColor = btns[randIdx];
    gameSeq.push(randColor);
    console.log(gameSeq);

    playSequence();
}

function checkAns(idx) {
    if (userSeq[idx] === gameSeq[idx]) {
        if (userSeq.length == gameSeq.length) {
            canClick = false;
            levelTimeout = setTimeout(levelUp, 1000);
        }
    } else {
        canClick = false;
        clearAllTimeouts();
        h2.innerHTML = `Game Over! Your score was <b>${level}</b> <br> Press any key or click Start to restart.`;
        document.querySelector("body").style.backgroundColor = "red";
        setTimeout(function () {
            document.querySelector("body").style.backgroundColor = "white";
        }, 150);
        reset();
    }
}

function btnpress() {
    if (!started || !canClick) {
        return;
    }
    console.log(this);
    let btn = this;
    userFlash(btn);

    let userColor = btn.getAttribute("id");
    userSeq.push(userColor);

    checkAns(userSeq.length - 1);
}

let allBtns = document.querySelectorAll(".btn");
for (let btn of allBtns) {
    btn.addEventListener("click", btnpress);
}

function reset() {
    started = false;
    gameSeq = [];
    userSeq = [];
    level = 0;
    canClick = false;
    clearAllTimeouts();
}