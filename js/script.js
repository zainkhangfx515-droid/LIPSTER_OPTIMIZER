/* ═══════════════════════════════════════════════════════════ */
/*  ⚡ LIPSTER — SCRIPT                                         */
/* ═══════════════════════════════════════════════════════════ */

const CONFIG = {
    githubUser: "YourGitHubUsername",
    githubRepo: "LIPSTER",
    easypaisaNumber: "03XX-XXXXXXX",
    jazzcashNumber: "03XX-XXXXXXX",
    counterKey: "lipster-downloads",
    currentVersion: "1.0.0"
};

document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initCounters();
    initScrollAnimations();
    initSmoothScroll();
    loadDownloadCount();
    checkUpdate();
});

function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    for (let i = 0; i < 50; i++) {
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

function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const steps = 60;
        const increment = target / steps;
        let step = 0;

        const timer = setInterval(() => {
            step++;
            const current = Math.min(Math.floor(increment * step), target);
            counter.textContent = formatNumber(current);

            if (step >= steps) {
                clearInterval(timer);
                counter.textContent = formatNumber(target) + '+';
            }
        }, duration / steps);
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

function initScrollAnimations() {
    const elements = document.querySelectorAll(
        '.feature-card, .pricing-card, .update-card, .support-card, .section-header'
    );

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

function openPayment(method) {
    const number = method === 'easypaisa' ? CONFIG.easypaisaNumber : CONFIG.jazzcashNumber;
    const methodName = method === 'easypaisa' ? 'Easypaisa' : 'JazzCash';
    showPaymentModal(methodName, number);
}

function showPaymentModal(methodName, number) {
    const existing = document.getElementById('paymentModal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'paymentModal';
    modal.style.cssText = `
        position: fixed; inset: 0; background: rgba(0, 0, 0, 0.85);
        backdrop-filter: blur(10px); z-index: 9999;
        display: flex; align-items: center; justify-content: center;
        padding: 20px; animation: fadeIn 0.3s ease;
    `;

    modal.innerHTML = `
        <div style="max-width: 480px; width: 100%; padding: 40px;
            background: linear-gradient(135deg, #0a0a12, #0f0f1a);
            border: 2px solid #00ffff; border-radius: 20px;
            box-shadow: 0 0 60px rgba(0, 255, 255, 0.5);
            text-align: center; position: relative;
            animation: slideUp 0.3s ease;">
            <button onclick="closePaymentModal()" style="position: absolute; top: 15px; right: 15px;
                background: transparent; border: none; color: #00ffff; font-size: 24px; cursor: pointer;">✕</button>
            <div style="font-size: 60px; margin-bottom: 20px;">💳</div>
            <h2 style="font-family: 'Orbitron', sans-serif; color: #00ffff; font-size: 22px; margin-bottom: 10px;">${methodName} Payment</h2>
            <div style="font-family: 'Orbitron', sans-serif; color: #ffd700; font-size: 48px; font-weight: 900; margin: 20px 0;">$1.00</div>
            <p style="color: #888899; font-size: 14px; margin-bottom: 20px;">Send $1 (or equivalent in PKR) to the number below:</p>
            <div style="padding: 20px; background: rgba(0, 255, 255, 0.05);
                border: 1px solid rgba(0, 255, 255, 0.3); border-radius: 12px;
                margin-bottom: 20px; cursor: pointer;" onclick="copyNumber('${number}')">
                <div style="font-family: 'Orbitron', sans-serif; color: #00ffff; font-size: 24px; font-weight: 700;">${number}</div>
                <div style="color: #888899; font-size: 12px;">Click to copy</div>
            </div>
            <button onclick="copyNumber('${number}')" style="width: 100%; padding: 15px;
                background: linear-gradient(135deg, #00ffff, #0088aa); color: #050508;
                border: none; border-radius: 12px; font-family: 'Rajdhani', sans-serif;
                font-size: 16px; font-weight: 700; cursor: pointer; margin-bottom: 15px;
                box-shadow: 0 0 30px rgba(0, 255, 255, 0.5);">📋 COPY NUMBER</button>
            <p style="color: #888899; font-size: 12px;">After payment, send screenshot on Discord<br>and you'll receive your license key within 24 hours.</p>
        </div>
    `;

    document.body.appendChild(modal);
}

function closePaymentModal() {
    const modal = document.getElementById('paymentModal');
    if (modal) {
        modal.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => modal.remove(), 300);
    }
}

function copyNumber(number) {
    navigator.clipboard.writeText(number).then(() => {
        const toast = document.createElement('div');
        toast.textContent = '✅ Number copied!';
        toast.style.cssText = `
            position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%);
            padding: 12px 24px; background: #00ffff; color: #050508;
            border-radius: 30px; font-weight: 700; font-size: 14px;
            z-index: 10000; box-shadow: 0 0 30px #00ffff;
            animation: slideUp 0.3s ease;
        `;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    });
}

async function loadDownloadCount() {
    const counterEl = document.getElementById('downloadCount');
    if (!counterEl) return;

    try {
        const response = await fetch(`https://api.countapi.xyz/get/lipster/${CONFIG.counterKey}`);
        const data = await response.json();
        if (data && data.value !== undefined) {
            animateNumber(counterEl, data.value);
        } else {
            animateNumber(counterEl, 0);
        }
    } catch (error) {
        animateNumber(counterEl, Math.floor(Math.random() * 500) + 100);
    }
}

async function incrementDownload() {
    try {
        const response = await fetch(`https://api.countapi.xyz/hit/lipster/${CONFIG.counterKey}`);
        const data = await response.json();
        if (data && data.value !== undefined) {
            const counterEl = document.getElementById('downloadCount');
            if (counterEl) counterEl.textContent = formatNumber(data.value);
        }
    } catch (error) {}
}

function animateNumber(element, target) {
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let step = 0;

    const timer = setInterval(() => {
        step++;
        const current = Math.min(Math.floor(increment * step), target);
        element.textContent = formatNumber(current);
        if (step >= steps) {
            clearInterval(timer);
            element.textContent = formatNumber(target);
        }
    }, duration / steps);
}

async function checkUpdate() {
    const statusEl = document.getElementById('updateStatus');
    const versionEl = document.getElementById('currentVersion');
    const changelogEl = document.getElementById('changelog');

    if (!statusEl) return;
    statusEl.textContent = '🔍 Checking for updates...';

    try {
        const response = await fetch(
            `https://api.github.com/repos/${CONFIG.githubUser}/${CONFIG.githubRepo}/releases/latest`
        );

        if (!response.ok) throw new Error('No releases found');

        const data = await response.json();
        const latestVersion = data.tag_name.replace('v', '');
        const currentVersion = CONFIG.currentVersion;

        if (compareVersions(latestVersion, currentVersion) > 0) {
            statusEl.textContent = `✅ Update available: v${latestVersion}`;
            statusEl.style.color = '#00ff88';
            if (versionEl) versionEl.textContent = `v${currentVersion} → v${latestVersion}`;

            if (changelogEl && data.body) {
                changelogEl.innerHTML = `
                    <h4>What's New in v${latestVersion}</h4>
                    <div style="color: #888899; font-size: 14px; line-height: 1.8; white-space: pre-wrap;">${data.body}</div>
                    <a href="${data.html_url}" target="_blank" style="display: inline-block; margin-top: 15px;
                        padding: 12px 24px; background: linear-gradient(135deg, #00ffff, #0088aa);
                        color: #050508; text-decoration: none; border-radius: 8px; font-weight: 700;">
                        Download v${latestVersion}
                    </a>
                `;
            }
        } else {
            statusEl.textContent = `✅ You are up to date (v${currentVersion})`;
            statusEl.style.color = '#00ff88';
            if (versionEl) versionEl.textContent = `v${currentVersion}`;
        }
    } catch (error) {
        statusEl.textContent = `✅ Current version: v${CONFIG.currentVersion}`;
        statusEl.style.color = '#00ff88';
    }
}

function compareVersions(v1, v2) {
    const parts1 = v1.split('.').map(Number);
    const parts2 = v2.split('.').map(Number);
    for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
        const p1 = parts1[i] || 0;
        const p2 = parts2[i] || 0;
        if (p1 > p2) return 1;
        if (p1 < p2) return -1;
    }
    return 0;
}

function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
}

// Animations for modal
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
    @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
`;
document.head.appendChild(style);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closePaymentModal();
});

document.addEventListener('click', (e) => {
    const modal = document.getElementById('paymentModal');
    if (modal && e.target === modal) closePaymentModal();
});

document.addEventListener('click', (e) => {
    const target = e.target.closest('a');
    if (target && target.href && target.href.includes('github.com')) {
        incrementDownload();
    }
});