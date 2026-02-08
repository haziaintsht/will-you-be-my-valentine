// Elements
const envelope = document.getElementById("envelope-container");
const letter = document.getElementById("letter-container");
const noBtn = document.querySelector(".no-btn");
const yesBtn = document.querySelector(".btn[alt='Yes']");

const title = document.getElementById("letter-title");
const catImg = document.getElementById("letter-cat");
const buttons = document.getElementById("letter-buttons");
const loveMessage = document.getElementById("love-message");

// Audio control
let backgroundMusicAudio = null;
let musicStarted = false;
let bgMusicCreated = false; // Flag to prevent creating multiple instances

// Create flying photos when page loads
window.addEventListener('load', () => {
    playBackgroundMusic();
    createFlyingPhotos();
});

// Also try to play immediately for faster loading
if (!bgMusicCreated) {
    playBackgroundMusic();
}

// Play background music on first user interaction (click or touch anywhere)
document.addEventListener('click', startBackgroundMusicOnInteraction, { once: true });
document.addEventListener('touchstart', startBackgroundMusicOnInteraction, { once: true });

function startBackgroundMusicOnInteraction() {
    if (!musicStarted && backgroundMusicAudio) {
        backgroundMusicAudio.play().catch(e => console.log('Music playback failed:', e));
    }
}

// Click Envelope (works on both desktop and mobile)
envelope.addEventListener("click", () => {
    envelope.style.display = "none";
    letter.style.display = "flex";

    setTimeout( () => {
        document.querySelector(".letter-window").classList.add("open");
    },50);
});

// Touch support for envelope
envelope.addEventListener("touchstart", (e) => {
    e.preventDefault();
    envelope.style.display = "none";
    letter.style.display = "flex";

    setTimeout( () => {
        document.querySelector(".letter-window").classList.add("open");
    },50);
});

// Logic to move the NO btn - it flees from the mouse/touch!
let isMoving = false;

function moveNoButton() {
    if (isMoving) return;
    
    isMoving = true;
    const minDistance = 100;
    const maxDistance = 250;
    const distance = Math.random() * (maxDistance - minDistance) + minDistance;
    const angle = Math.random() * Math.PI * 2;

    const moveX = Math.cos(angle) * distance;
    const moveY = Math.sin(angle) * distance;

    noBtn.style.transition = "transform 0.5s ease-out";
    noBtn.style.transform = `translate(${moveX}px, ${moveY}px)`;
    
    setTimeout(() => {
        isMoving = false;
    }, 500);
}

// Works with mouse
noBtn.addEventListener("mouseenter", moveNoButton);

// Works with touch on phones
noBtn.addEventListener("touchstart", (e) => {
    e.preventDefault();
    moveNoButton();
});

// YES is clicked (works on desktop)
yesBtn.addEventListener("click", () => {
    celebrateYes();
});

// YES is tapped (works on mobile/phone)
yesBtn.addEventListener("touchstart", (e) => {
    e.preventDefault();
    celebrateYes();
});

function celebrateYes() {
    // Stop interaction listeners to prevent any more background music
    document.removeEventListener('click', startBackgroundMusicOnInteraction);
    document.removeEventListener('touchstart', startBackgroundMusicOnInteraction);
    
    // Completely stop and remove background music
    if (backgroundMusicAudio) {
        backgroundMusicAudio.pause();
        backgroundMusicAudio.currentTime = 0;
        backgroundMusicAudio.volume = 0;
        backgroundMusicAudio.loop = false;
        backgroundMusicAudio.src = ''; // Clear the source
        backgroundMusicAudio = null; // Set to null so it can't be used again
    }
    
    // Stop ALL other audio on the page
    const allAudio = document.querySelectorAll('audio');
    allAudio.forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
        audio.volume = 0;
        audio.loop = false;
    });
    
    // Play song IMMEDIATELY when button is pressed
    playSong();
    
    title.textContent = "Yippeeee!";
    title.classList.add("celebrate");

    catImg.src = "cat_dance.gif";

    const letterWindow = document.querySelector(".letter-window");
    letterWindow.classList.add("final");
    letterWindow.classList.add("shake");
    
    buttons.style.display = "none";
    loveMessage.style.display = "block";
    
    // Create celebration effects
    createConfetti();
    createFloatingHearts();
    createFireworks();
}

// Enhanced confetti effect
function createConfetti() {
    for (let i = 0; i < 60; i++) {
        const confetti = document.createElement("div");
        confetti.classList.add("confetti");
        confetti.style.left = Math.random() * 100 + "%";
        confetti.style.delay = Math.random() * 0.5 + "s";
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 3500);
    }
}

// Floating hearts effect
function createFloatingHearts() {
    const hearts = ["💕", "❤️", "💗", "💖", "💝"];
    
    for (let i = 0; i < 20; i++) {
        const heart = document.createElement("div");
        heart.classList.add("floating-heart");
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = Math.random() * 100 + "%";
        heart.style.delay = Math.random() * 0.4 + "s";
        document.body.appendChild(heart);
        
        setTimeout(() => heart.remove(), 4000);
    }
}

// Fireworks effect
function createFireworks() {
    for (let i = 0; i < 15; i++) {
        const spark = document.createElement("div");
        spark.classList.add("firework");
        const startX = 50 + (Math.random() - 0.5) * 20;
        const startY = 50 + (Math.random() - 0.5) * 20;
        spark.style.left = startX + "%";
        spark.style.top = startY + "%";
        spark.style.delay = Math.random() * 0.3 + "s";
        document.body.appendChild(spark);
        
        setTimeout(() => spark.remove(), 2500);
    }
}

// Play background music - "Sunsets with You" instrumental
function playSong() {
    try {
        // Create audio element
        const audio = new Audio('sunsets-with-you.mp3');
        audio.volume = 0.5; // Set volume to 50%
        audio.loop = false;
        
        // Start playing immediately
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log('Autoplay prevented, trying with user interaction');
                // Fallback: try playing with a small delay
                setTimeout(() => {
                    audio.play().catch(e => console.log('Audio failed:', e));
                }, 100);
            });
        }
    } catch (e) {
        // Audio not supported, continue silently
    }
}

// Play background music when site opens
function playBackgroundMusic() {
    // Only create background music once
    if (bgMusicCreated) return;
    bgMusicCreated = true;
    
    try {
        // Create audio element for background music
        backgroundMusicAudio = new Audio('background_music.mp3');
        backgroundMusicAudio.volume = 0.3; // Softer volume for background
        backgroundMusicAudio.loop = true; // Loop continuously
        backgroundMusicAudio.preload = 'auto';
        
        // Start playing immediately
        const playPromise = backgroundMusicAudio.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                musicStarted = true;
            }).catch(error => {
                console.log('Background music autoplay prevented - will play on first interaction');
                // Fallback: play on first user interaction (already set up above)
            });
        }
    } catch (e) {
        // Audio not supported, continue silently
    }
}

// Flying photos effect when page opens
function createFlyingPhotos() {
    const photos = [
        'photo1.jpg',
        'photo2.jpg',
        'photo3.jpg'
    ];
    
    for (let i = 0; i < 8; i++) {
        const photoDiv = document.createElement('div');
        photoDiv.classList.add('flying-photo');
        
        const photoImg = document.createElement('img');
        photoImg.src = photos[i % photos.length];
        photoImg.style.width = (80 + Math.random() * 60) + 'px';
        
        photoDiv.appendChild(photoImg);
        photoDiv.style.left = Math.random() * 100 + '%';
        photoDiv.style.delay = (i * 0.1) + 's';
        
        document.body.appendChild(photoDiv);
        
        setTimeout(() => photoDiv.remove(), 4000);
    }
}
