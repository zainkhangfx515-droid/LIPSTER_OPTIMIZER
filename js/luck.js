/* ═══════════════════════════════════════════════════════════ */
/*  🎰 LUCK PAGE — SPIN LOGIC                                    */
/* ═══════════════════════════════════════════════════════════ */

const LUCK_CONFIG = {
    maxSpins: 3,
    totalWinners: 10,
    totalUsers: 1000,
    downloadLink: "https://drive.google.com/YOUR_FILE_LINK_HERE",
    winProbability: 0.01
};

const STORAGE_KEYS = {
    spinsUsed: "lipster_luck_spins_used",
    isWinner: "lipster_luck_is_winner",
    hasWon: "lipster_luck_has_won",
    winnersRemaining: "lipster_luck_winners_remaining",
    userID: "lipster_luck_user_id"
};

let state = {
    spinsUsed: 0,
    isWinner: false,
    hasWon: false,
    winnersRemaining: 10,
    isSpinning: false,
    userID: null,
    currentRotation: 0
};

document.addEventListener('DOMContentLoaded', () => {
    loadState();
    updateUI();
    initParticles();
});

function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        const size = Math.random() * 3 + 1;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.animationDelay = Math.random() * 5 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 5) + 's';
        container.appendChild(particle);
    }
}

function loadState() {
    state.userID = localStorage.getItem(STORAGE_KEYS.userID);
    if (!state.userID) {
        state.userID = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem(STORAGE_KEYS.userID, state.userID);
    }

    const spinsUsed = localStorage.getItem(STORAGE_KEYS.spinsUsed);
    state.spinsUsed = spinsUsed ? parseInt(spinsUsed) : 0;

    state.isWinner = localStorage.getItem(STORAGE_KEYS.isWinner) === 'true';
    state.hasWon = localStorage.getItem(STORAGE_KEYS.hasWon) === 'true';

    const winnersRemaining = localStorage.getItem(STORAGE_KEYS.winnersRemaining);
    state.winnersRemaining = winnersRemaining ? parseInt(winnersRemaining) : LUCK_CONFIG.totalWinners;
}

function saveState() {
    localStorage.setItem(STORAGE_KEYS.spinsUsed, state.spinsUsed.toString());
    localStorage.setItem(STORAGE_KEYS.isWinner, state.isWinner.toString());
    localStorage.setItem(STORAGE_KEYS.hasWon, state.hasWon.toString());
    localStorage.setItem(STORAGE_KEYS.winnersRemaining, state.winnersRemaining.toString());
}

function updateUI() {
    const spinsRemaining = LUCK_CONFIG.maxSpins - state.spinsUsed;
    document.getElementById('spinsRemaining').textContent = spinsRemaining;
    document.getElementById('remainingWinners').textContent = state.winnersRemaining;

    const spinBtn = document.getElementById('spinBtn');
    
    if (spinsRemaining <= 0) {
        spinBtn.disabled = true;
        spinBtn.querySelector('.spin-btn-text').textContent = 'LOCKED';
    } else if (state.isWinner) {
        spinBtn.disabled = true;
        spinBtn.querySelector('.spin-btn-text').textContent = 'WON!';
    } else {
        spinBtn.disabled = false;
        spinBtn.querySelector('.spin-btn-text').textContent = 'SPIN';
    }

    if (state.isWinner && spinsRemaining > 0) {
        setTimeout(() => showWinnerState(), 500);
    }
}

function spinWheel() {
    if (state.isSpinning) return;
    
    const spinsRemaining = LUCK_CONFIG.maxSpins - state.spinsUsed;
    if (spinsRemaining <= 0) return;
    if