document.addEventListener('DOMContentLoaded', () => {
    // Global error / promise rejection logging helps catch runtime issues
    window.addEventListener('error', e => {
        console.error('Global error caught:', e.error || e.message, e);
    });
    window.addEventListener('unhandledrejection', e => {
        console.error('Unhandled promise rejection:', e.reason);
    });

    const enterBtn = document.getElementById('enter-btn');
    const surpriseContent = document.getElementById('surprise-content');
    const mainNav = document.getElementById('main-nav');

    // --- STORY MODE LOGIC ---
    const sections = Array.from(document.querySelectorAll('.section'));
    const storyNav = document.getElementById('story-nav');
    const sceneNext = document.getElementById('scene-next');
    const scenePrev = document.getElementById('scene-prev');
    let currentSceneIndex = 0;

    // --- N8N AUTOMATION LOGIC ---
    // Automatically switch between Test and Production URLs
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const N8N_ENV = isLocal ? 'test' : 'prod';

    const N8N_CONFIG = {
        test: "https://n8n-yhly.onrender.com/webhook-test/birthday-climax",
        prod: "https://n8n-yhly.onrender.com/webhook/birthday-climax"
    };

    const n8nWebhookURL = N8N_CONFIG[N8N_ENV];
    console.log(`[n8n Debug] Webhook active: ${n8nWebhookURL} (${N8N_ENV} mode)`);

    // Expose a global test function for you to use in the console
    window.testN8N = () => triggerN8N('manual_test_from_console');

    async function triggerN8N(event) {
        console.log(`[n8n Debug] Attempting to trigger event: ${event}`);
        if (!n8nWebhookURL) {
            console.warn("[n8n Debug] Webhook URL is missing!");
            return;
        }

        try {
            const response = await fetch(n8nWebhookURL, {
                method: 'POST',
                mode: 'cors', // Explicitly enable CORS
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    event: event,
                    timestamp: new Date().toISOString()
                })
            });

            if (response.ok) {
                console.log(`[n8n Debug] Successfully triggered: ${event}`);
            } else {
                console.error(`[n8n Debug] Server responded with status: ${response.status}`);
            }
        } catch (err) {
            console.error("[n8n Debug] Webhook failed. Check if n8n is running and listening:", err);
        }
    }

    function goToSection(index) {
        if (index < 0 || index >= sections.length) return;

        // Hide current
        sections[currentSceneIndex].classList.remove('active-scene');

        // Show new
        currentSceneIndex = index;
        sections[currentSceneIndex].classList.add('active-scene');

        // Update Nav visibility
        if (currentSceneIndex > 0) {
            storyNav.classList.remove('hidden');
            mainNav.classList.remove('hidden');
        } else {
            storyNav.classList.add('hidden');
            mainNav.classList.add('hidden');
        }

        // Update Prev Button
        scenePrev.disabled = currentSceneIndex <= 1;

        // Update Next Button label for final section
        if (currentSceneIndex === sections.length - 1) {
            sceneNext.innerText = "Gift for You 🎁";
        } else {
            sceneNext.innerText = "Next ❤️";
        }

        // Scroll to top of section (legacy safety)
        window.scrollTo(0, 0);

        // Trigger specific animations
        if (sections[currentSceneIndex].id === 'parchment-section') {
            typePoem();
        }
    }

    enterBtn.addEventListener('click', () => {
        surpriseContent.classList.remove('hidden');
        goToSection(1); // Go to Letter
    });

    sceneNext.addEventListener('click', () => {
        if (currentSceneIndex < sections.length - 1) {
            goToSection(currentSceneIndex + 1);
        }
    });

    scenePrev.addEventListener('click', () => {
        if (currentSceneIndex > 1) {
            goToSection(currentSceneIndex - 1);
        }
    });

    // Navigation Links (Story Mode version)
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            const targetId = link.getAttribute('data-target');
            const targetIndex = sections.findIndex(s => s.id === targetId);
            if (targetIndex !== -1) goToSection(targetIndex);
        });
    });

    // 2. Floating Hearts Animation
    const heartContainer = document.getElementById('heart-container');
    const createHeart = () => {
        const heart = document.createElement('div');
        heart.classList.add('floating-heart');
        heart.innerHTML = '❤️';
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.setProperty('--speed', Math.random() * 10 + 5 + 's');
        heart.style.setProperty('--size', Math.random() * 20 + 20 + 'px');
        heartContainer.appendChild(heart);

        setTimeout(() => {
            heart.remove();
        }, 15000);
    };

    setInterval(createHeart, 800);

    // 3. Rose Petal Animation
    const petalContainer = document.getElementById('petal-container');
    const createPetal = () => {
        const petal = document.createElement('div');
        petal.classList.add('petal');
        const size = Math.random() * 15 + 10;
        petal.style.width = size + 'px';
        petal.style.height = (size * 0.8) + 'px';
        petal.style.left = Math.random() * 100 + 'vw';
        petal.style.setProperty('--duration', Math.random() * 5 + 7 + 's');
        petalContainer.appendChild(petal);

        setTimeout(() => petal.remove(), 12000);
    };

    setInterval(createPetal, 1000);


    // 5. Countdown Timer Logic (Target: Feb 23, 2026, 1:15 PM)
    const countdownDate = new Date("Feb 23, 2026 13:15:00").getTime();
    const countdownTitle = document.getElementById('countdown-title');
    let countdownInterval; // store reference so we can clear it when done

    const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = countdownDate - now;

        if (distance < 0) {
            // stop future ticks
            if (countdownInterval) clearInterval(countdownInterval);

            // Trigger Crash Sequence (only once)
            if (!document.body.classList.contains('crashed')) {
                triggerCrashSequence();
            } else {
                // if we've already run crash sequence, make sure page is usable
                completeReboot();
            }
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').innerText = days.toString().padStart(2, '0');
        document.getElementById('hours').innerText = hours.toString().padStart(2, '0');
        document.getElementById('minutes').innerText = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').innerText = seconds.toString().padStart(2, '0');
    };

    countdownInterval = setInterval(updateCountdown, 1000);
    updateCountdown();

    // 6. Reveal Animations on Scroll
    const observerOptions = { threshold: 0.1 };
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('active');
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // 7. Reasons Why I Love You (Card Flip)
    const reasons = [
        "I love you because your smile melts my heart.",
        "I love you because you understand me without words.",
        "I love you because you make ordinary days magical.",
        "I love you because you are YOU.",
        "I love you because you're my best friend and my soulmate.",
        "I love you because you challenge me to be a better man.",
        "I love you because of the way you look at me.",
        "I love you because your laugh is my favorite song.",
        "I love you because you make me feel safe.",
        "I love you because you're the first thing I think of when I wake up.",
        "I love you because you're beautiful inside and out.",
        "I love you because our souls just click.",
        "I love you because you support my wildest dreams.",
        "I love you because of your kind heart.",
        "I love you because every moment with you is a treasure."
    ];

    const loveCard = document.getElementById('love-card');
    const reasonBtn = document.getElementById('reason-btn');
    const reasonText = document.getElementById('reason-text');

    loveCard.addEventListener('click', () => {
        loveCard.classList.toggle('flipped');
    });

    reasonBtn.addEventListener('click', () => {
        const randomIndex = Math.floor(Math.random() * reasons.length);

        // Return to front if flipped
        if (loveCard.classList.contains('flipped')) {
            loveCard.classList.remove('flipped');
            setTimeout(() => {
                reasonText.innerText = reasons[randomIndex];
            }, 400); // Change text halfway through unflip
        } else {
            reasonText.innerText = reasons[randomIndex];
            loveCard.classList.add('flipped');
        }
    });

    // 8. Starry Night Background
    const starsContainer = document.getElementById('stars-container');
    const createStar = () => {
        const star = document.createElement('div');
        star.classList.add('star');
        const size = Math.random() * 3 + 'px';
        star.style.width = size;
        star.style.height = size;
        star.style.top = Math.random() * 100 + '%';
        star.style.left = Math.random() * 100 + '%';
        star.style.setProperty('--opacity', Math.random());
        star.style.setProperty('--duration', Math.random() * 3 + 2 + 's');
        starsContainer.appendChild(star);
    };

    for (let i = 0; i < 150; i++) {
        createStar();
    }

    // 9. Video Gallery Enhancements
    const videoFrames = document.querySelectorAll('.video-frame');
    videoFrames.forEach(frame => {
        const video = frame.querySelector('video');
        const overlay = frame.querySelector('.video-overlay');

        // Hide overlay when video is playing
        video.addEventListener('play', () => {
            overlay.style.opacity = '0';
        });

        video.addEventListener('pause', () => {
            overlay.style.opacity = '1';
        });

        // Click to play/pause
        frame.addEventListener('click', (e) => {
            if (e.target !== video && !video.contains(e.target)) {
                if (video.paused) {
                    video.play();
                } else {
                    video.pause();
                }
            }
        });
    });

    // 10. Gallery Lightbox (Updated for Story Mode)
    const photoFrames = document.querySelectorAll('.photo-frame');
    const timelineImages = document.querySelectorAll('.timeline-img img');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeLightbox = document.querySelector('.close-lightbox');

    const openFullImage = (src) => {
        if (!lightbox || !lightboxImg) return;
        lightboxImg.src = src;
        lightbox.classList.add('active');
        // No need to hide body overflow as Story Mode already does it
    };

    // Gallery photos
    photoFrames.forEach(frame => {
        frame.addEventListener('click', () => {
            const img = frame.querySelector('img');
            if (img) openFullImage(img.src);
        });
    });

    // Timeline images
    timelineImages.forEach(img => {
        img.addEventListener('click', (e) => {
            e.stopPropagation();
            openFullImage(img.src);
        });
    });

    if (closeLightbox) {
        closeLightbox.addEventListener('click', () => {
            lightbox.classList.remove('active');
        });
    }

    if (lightbox) {
        lightbox.addEventListener('click', () => {
            lightbox.classList.remove('active');
        });
    }

    // Close lightbox on Escape key OR Return to Home if surprise is active
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (lightbox.classList.contains('active')) {
                lightbox.classList.remove('active');
                document.body.style.overflow = '';
            } else if (!surpriseContent.classList.contains('hidden')) {
                // If the surprise content is visible, go back to "Home" (Reload)
                window.location.reload();
            }
        }
    });

    // 11. Enhanced Scroll Animations
    const fadeObserverOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, fadeObserverOptions);

    document.querySelectorAll('.glass-card, .timeline-item, .photo-frame').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        fadeObserver.observe(el);
    });

    // Timeline item stagger animation
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.1}s`;
    });

    // 7. Final Love Button & Confetti
    const loveBtn = document.getElementById('love-btn');
    if (loveBtn) {
        loveBtn.addEventListener('click', () => {
            // Trigger n8n
            triggerN8N('i_love_you_clicked');

            // Confetti explosion
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#ff4d6d', '#ff8fa3', '#7209b7']
            });

            // Heart explosion (multiple smaller bursts)
            const defaults = {
                spread: 360,
                ticks: 50,
                gravity: 0,
                decay: 0.94,
                startVelocity: 30,
                shapes: ['heart'],
                colors: ['FFC0CB', 'FF69B4', 'FF1493', 'C71585']
            };

            const heartShape = confetti.shapeFromPath({
                path: 'M167 11c-75.1 0-136 60.9-136 136 0 92.6 156 211 156 211s156-118.4 156-211c0-75.1-60.9-136-136-136-31.5 0-60.5 10.7-83.6 28.9C102.5 21.7 73.5 11 42 11'
            });

            confetti({
                ...defaults,
                particleCount: 40,
                scalar: 2,
                shapes: [heartShape]
            });

            confetti({
                ...defaults,
                particleCount: 20,
                scalar: 3,
                shapes: [heartShape]
            });
        });
    }

    // 15. 3D Memory Carousel Logic
    const carousel3d = document.getElementById('carousel-3d');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    const carouselImages = [
        "assets/WhatsApp Image 2026-02-14 at 5.13.09 PM (1).jpeg",
        "assets/WhatsApp Image 2026-02-14 at 5.13.10 PM (1).jpeg",
        "assets/WhatsApp Image 2026-02-14 at 5.13.11 PM (1).jpeg",
        "assets/WhatsApp Image 2026-02-14 at 5.13.12 PM (1).jpeg",
        "assets/WhatsApp Image 2026-02-14 at 5.13.13 PM (1).jpeg",
        "assets/WhatsApp Image 2026-02-14 at 5.13.14 PM (1).jpeg",
        "assets/WhatsApp Image 2026-02-14 at 5.13.15 PM (1).jpeg",
        "assets/WhatsApp Image 2026-02-14 at 5.13.17 PM (1).jpeg"
    ];

    let currentRotation = 0;
    const itemsCount = carouselImages.length;
    const angle = 360 / itemsCount;

    carouselImages.forEach((src, i) => {
        const item = document.createElement('div');
        item.className = 'carousel-item';
        item.style.transform = `rotateY(${i * angle}deg) translateZ(300px)`;
        item.innerHTML = `<img src="${src}" alt="Memory ${i + 1}">`;
        carousel3d.appendChild(item);
    });

    if (prevBtn) prevBtn.addEventListener('click', () => {
        currentRotation += angle;
        carousel3d.style.transform = `rotateY(${currentRotation}deg)`;
    });

    if (nextBtn) nextBtn.addEventListener('click', () => {
        currentRotation -= angle;
        carousel3d.style.transform = `rotateY(${currentRotation}deg)`;
    });

    // 16. Draggable Polaroid Wall Logic
    const corkboard = document.getElementById('corkboard');
    const polaroidMessages = [
        "Our first date! ☕",
        "That sunset was magical. 🌅",
        "Your laugh is my favorite sound. 🎶",
        "I love this smile of yours. 😊",
        "Strongest together. 💪",
        "The day we talked for hours. 📱",
        "Pure happiness with you. ✨",
        "You look stunning here! 💖"
    ];

    if (corkboard) {
        carouselImages.forEach((src, i) => {
            const polaroid = document.createElement('div');
            polaroid.className = 'polaroid';

            const x = Math.random() * (corkboard.offsetWidth - 200 || 500);
            const y = Math.random() * (corkboard.offsetHeight - 250 || 300);
            const rotation = Math.random() * 40 - 20;

            polaroid.style.left = `${x}px`;
            polaroid.style.top = `${y}px`;
            polaroid.style.transform = `rotate(${rotation}deg)`;

            polaroid.innerHTML = `
                <div class="polaroid-front">
                    <img src="${src}" alt="Snapshot ${i + 1}">
                </div>
                <div class="polaroid-back">
                    <p>${polaroidMessages[i]}</p>
                </div>
            `;

            polaroid.addEventListener('click', (e) => {
                if (!polaroid.dataset.dragging) {
                    polaroid.classList.toggle('flipped');
                }
            });

            let isDragging = false;
            let startX, startY;

            polaroid.addEventListener('mousedown', startDrag);
            polaroid.addEventListener('touchstart', (e) => startDrag(e.touches[0]), { passive: false });

            function startDrag(e) {
                isDragging = true;
                polaroid.dataset.dragging = "";
                startX = e.clientX - polaroid.offsetLeft;
                startY = e.clientY - polaroid.offsetTop;
                polaroid.style.transition = 'none';
                polaroid.style.zIndex = "100";
            }

            const moveDrag = (e) => {
                if (!isDragging) return;
                const clientX = e.clientX || (e.touches ? e.touches[0].clientX : null);
                const clientY = e.clientY || (e.touches ? e.touches[0].clientY : null);
                if (clientX === null) return;

                polaroid.dataset.dragging = "true";
                const newX = clientX - startX;
                const newY = clientY - startY;
                polaroid.style.left = `${newX}px`;
                polaroid.style.top = `${newY}px`;
            };

            const endDrag = () => {
                if (isDragging) {
                    isDragging = false;
                    setTimeout(() => delete polaroid.dataset.dragging, 100);
                    polaroid.style.transition = 'transform 0.3s ease';
                    polaroid.style.zIndex = "1";
                }
            };

            window.addEventListener('mousemove', moveDrag);
            window.addEventListener('touchmove', (e) => moveDrag(e), { passive: false });
            window.addEventListener('mouseup', endDrag);
            window.addEventListener('touchend', endDrag);

            corkboard.appendChild(polaroid);
        });
    }


    // allow user to dismiss the struck overlay after reboot
    const struckOverlay = document.getElementById('struck-overlay');
    if (struckOverlay) {
        struckOverlay.addEventListener('click', () => {
            struckOverlay.classList.add('hidden');
        });
        // also close with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !struckOverlay.classList.contains('hidden')) {
                struckOverlay.classList.add('hidden');
            }
        });
    }

    // diagnostics helper
    function logFeatureDiagnoses() {
        try {
            const bed = document.getElementById('flower-bed');
            console.log('diagnose: flower-bed children=', bed ? bed.children.length : 'missing');
            console.log('diagnose: constellation canvas exists=', !!document.getElementById('constellation-canvas'));
            console.log('diagnose: scratch cards container=', !!document.getElementById('scratch-container'));
        } catch (e) {
            console.error('diagnosis failed', e);
        }
    }

    // initial diagnostics after DOM load
    logFeatureDiagnoses();

    // 17. Scratch Cards Logic
    const scratchContainer = document.getElementById('scratch-container');
    const promises = [
        "A Whole Day of Surprises! 🎁",
        "A Candlelight Dinner Date. 🕯️",
        "Unlimited Hugs & Kisses. ❤️",
        "Your Favorite Movie Night. 🍿",
        "A Weekend Trip Together. 🚗",
        "Breakfast in Bed. ☕"
    ];

    if (scratchContainer) {
        promises.forEach((text, i) => {
            const card = document.createElement('div');
            card.className = 'scratch-card';
            card.innerHTML = `
                <div class="scratch-content">${text}</div>
                <canvas class="scratch-canvas" width="300" height="150"></canvas>
            `;
            scratchContainer.appendChild(card);

            const canvas = card.querySelector('.scratch-canvas');
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#C0C0C0';
            ctx.fillRect(0, 0, 300, 150);
            ctx.fillStyle = '#888';
            ctx.font = '20px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('SCRATCH ME! ✨', 150, 85);

            let isDown = false;
            function scratch(e) {
                if (!isDown) return;
                const rect = canvas.getBoundingClientRect();
                const clientX = e.clientX || (e.touches ? e.touches[0].clientX : null);
                const clientY = e.clientY || (e.touches ? e.touches[0].clientY : null);
                if (clientX === null) return;

                // Scale coordinates to internal canvas resolution
                const x = (clientX - rect.left) * (canvas.width / rect.width);
                const y = (clientY - rect.top) * (canvas.height / rect.height);

                ctx.globalCompositeOperation = 'destination-out';
                ctx.beginPath();
                ctx.arc(x, y, 25, 0, Math.PI * 2);
                ctx.fill();
            }

            canvas.addEventListener('mousedown', () => isDown = true);
            canvas.addEventListener('touchstart', (e) => { isDown = true; e.preventDefault(); }, { passive: false });
            window.addEventListener('mouseup', () => isDown = false);
            window.addEventListener('touchend', () => isDown = false);
            canvas.addEventListener('mousemove', scratch);
            canvas.addEventListener('touchmove', (e) => { scratch(e); e.preventDefault(); }, { passive: false });
        });
    }

    // 18. Virtual Gift Box Logic
    const giftBox = document.getElementById('gift-box');
    const giftInstruction = document.getElementById('gift-instruction');

    if (giftBox) {
        giftBox.addEventListener('click', () => {
            giftBox.classList.add('open');
            giftInstruction.innerText = "Yay! Happy Birthday!!! ❤️";
            confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
            triggerN8N('gift_opened');
        });
    }


    // 13. Theme Switching Logic
    const themeBtns = document.querySelectorAll('.theme-btn');
    themeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const theme = btn.getAttribute('data-theme');
            document.documentElement.setAttribute('data-theme', theme);
            themeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            if (theme === 'midnight') createStars();
            else if (theme === 'sunset') createSunsetGlow();
        });
    });

    function createSunsetGlow() {
        // Sunset theme specific effect
        heartContainer.style.background = 'radial-gradient(circle at top, #ff9e80 0%, transparent 70%)';
    }

    // 14. Interactive Flower Garden
    function initFlowerGarden() {
        const flowerBed = document.getElementById('flower-bed');
        const flowerMsg = document.getElementById('flower-message');
        const flowerEmojis = ['🌸', '🌹', '🌺', '🌻', '🌼', '🌷', '🏵️', '🌻'];
        const flowerQuotes = [
            "You are the most beautiful flower in my life. ❤️",
            "Every day with you is like a spring day. 🍃",
            "Your smile is brighter than any sunflower. 🌻",
            "Like a rose, you are elegant and precious. 🌹",
            "Thank you for blooming in my heart. 🌸",
            "You make the world more colorful. 🌺",
            "My love for you grows every single day. 🌷",
            "You are my favorite bloom! 🌼"
        ];

        if (!flowerBed) return;
        flowerBed.innerHTML = ''; // reset if reinitializing
        flowerEmojis.forEach((emoji, index) => {
            const flower = document.createElement('div');
            flower.className = 'flower';
            flower.innerHTML = emoji;
            flower.addEventListener('click', () => {
                flower.classList.add('bloomed');
                flowerMsg.innerText = flowerQuotes[index];
                flowerMsg.classList.remove('hidden');
                confetti({
                    particleCount: 20,
                    spread: 30,
                    origin: {
                        x: flower.getBoundingClientRect().left / window.innerWidth,
                        y: flower.getBoundingClientRect().top / window.innerHeight
                    },
                    colors: ['#ff4d6d', '#ff8fa3', '#ffd700']
                });
            });
            flowerBed.appendChild(flower);
        });
    }

    // call on load
    initFlowerGarden();

    // 20. Love Map Logic
    const mapPins = document.querySelectorAll('.map-pin');
    const mapInfo = document.getElementById('map-info');

    mapPins.forEach(pin => {
        pin.addEventListener('click', () => {
            const info = pin.getAttribute('data-info');
            mapInfo.innerText = info;
            mapInfo.classList.remove('hidden');

            // Mini fireworks at pin
            confetti({
                particleCount: 15,
                spread: 30,
                origin: {
                    x: pin.getBoundingClientRect().left / window.innerWidth,
                    y: pin.getBoundingClientRect().top / window.innerHeight
                }
            });
        });
    });

    // 21. Interactive Constellation Logic
    function initConstellation() {
        const starCanvas = document.getElementById('constellation-canvas');
        if (!starCanvas) return;
        const sCtx = starCanvas.getContext('2d');
        const starPoints = [];
        const heartPoints = [
            { x: 300, y: 150 }, { x: 350, y: 100 }, { x: 400, y: 100 }, { x: 450, y: 150 },
            { x: 450, y: 220 }, { x: 300, y: 350 }, { x: 150, y: 220 }, { x: 150, y: 150 },
            { x: 200, y: 100 }, { x: 250, y: 100 }, { x: 300, y: 150 }
        ];

        let connectedCount = 0;

        // Draw background stars
        for (let i = 0; i < 50; i++) {
            starPoints.push({
                x: Math.random() * starCanvas.width,
                y: Math.random() * starCanvas.height,
                size: Math.random() * 2
            });
        }

        function drawConstellation() {
            sCtx.clearRect(0, 0, starCanvas.width, starCanvas.height);

            // Draw background stars
            sCtx.fillStyle = '#fff';
            starPoints.forEach(p => {
                sCtx.beginPath();
                sCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                sCtx.fill();
            });

            // Draw clickable destiny stars
            heartPoints.forEach((p, i) => {
                sCtx.beginPath();
                sCtx.arc(p.x, p.y, 8, 0, Math.PI * 2); // Bigger stars
                sCtx.fillStyle = i < connectedCount ? '#bb86fc' : 'rgba(255, 255, 255, 0.3)';
                sCtx.shadowBlur = i < connectedCount ? 20 : 0;
                sCtx.shadowColor = '#bb86fc';
                sCtx.fill();
                sCtx.shadowBlur = 0;

                // Add a faint pulse to the next star
                if (i === connectedCount) {
                    sCtx.beginPath();
                    sCtx.arc(p.x, p.y, 12 + Math.sin(Date.now() / 200) * 5, 0, Math.PI * 2);
                    sCtx.strokeStyle = 'rgba(187, 134, 252, 0.5)';
                    sCtx.stroke();
                }
            });

            // Draw lines
            if (connectedCount > 1) {
                sCtx.beginPath();
                sCtx.moveTo(heartPoints[0].x, heartPoints[0].y);
                for (let i = 1; i < connectedCount; i++) {
                    sCtx.lineTo(heartPoints[i].x, heartPoints[i].y);
                }
                sCtx.strokeStyle = 'rgba(187, 134, 252, 0.8)';
                sCtx.lineWidth = 4; // Thicker lines
                sCtx.stroke();
            }

            if (connectedCount < heartPoints.length) {
                requestAnimationFrame(drawConstellation);
            }
        }

        const handleCanvasClick = (e) => {
            const rect = starCanvas.getBoundingClientRect();
            const clientX = e.clientX || (e.touches ? e.touches[0].clientX : null);
            const clientY = e.clientY || (e.touches ? e.touches[0].clientY : null);
            if (clientX === null) return;

            const mouseX = (clientX - rect.left) * (starCanvas.width / rect.width);
            const mouseY = (clientY - rect.top) * (starCanvas.height / rect.height);

            const nextStar = heartPoints[connectedCount];
            if (nextStar) {
                const dist = Math.sqrt((mouseX - nextStar.x) ** 2 + (mouseY - nextStar.y) ** 2);
                if (dist < 40) { // More forgiving radius
                    connectedCount++;
                    if (connectedCount === heartPoints.length) {
                        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
                    }
                }
            }
        };

        starCanvas.addEventListener('click', handleCanvasClick);
        starCanvas.addEventListener('touchstart', (e) => {
            handleCanvasClick(e);
            e.preventDefault();
        }, { passive: false });

        drawConstellation();
    }

    // initial call
    initConstellation();

    // 22. Ink & Parchment Logic
    const handwrittenText = document.getElementById('handwritten-text');
    const poem = `To my dearest Rakshna,

Like ink upon this aged page,
My love for you grows with every stage.
Each birthday is a new chapter blessed,
In your heart, I find my sweetest rest.

Forever yours... ❤️`;

    let charIndex = 0;
    let isTyping = false;
    function typePoem() {
        if (isTyping) return;
        isTyping = true;
        handwrittenText.innerHTML = '';
        charIndex = 0;

        const typeChar = () => {
            if (charIndex < poem.length) {
                handwrittenText.innerHTML += poem.charAt(charIndex) === '\n' ? '<br>' : poem.charAt(charIndex);
                charIndex++;
                setTimeout(typeChar, 50);
            } else {
                isTyping = false;
            }
        };
        typeChar();
    }

    // 23. Message in a Bottle Logic
    const bottle = document.getElementById('bottle');
    const bottleModal = document.getElementById('bottle-message-modal');
    const closeBottle = document.getElementById('close-bottle');
    const bottleText = document.getElementById('bottle-text');

    const secretMessages = [
        "I've loved you since the moment I saw you. 💖",
        "You are my anchor in every storm. ⚓",
        "I'm keeping this love safe forever. 🍾",
        "A message from the future: We are still happy together! 💍"
    ];

    if (bottle) {
        bottle.addEventListener('click', () => {
            const randomMsg = secretMessages[Math.floor(Math.random() * secretMessages.length)];
            bottleText.innerText = randomMsg;
            bottleModal.classList.remove('hidden');
        });
    }

    if (closeBottle) {
        closeBottle.addEventListener('click', () => {
            bottleModal.classList.add('hidden');
        });
    }

    // 24. Daily Love Fortune Logic
    const crystalBall = document.getElementById('crystal-ball');
    const fortuneReveal = document.getElementById('fortune-reveal');
    const fortunes = [
        "Today, someone is thinking about you rmbha rmbha! ❤️",
        "You will receive a 1000 kisses today. 💋",
        "Your smile will be the highlight of my day. 😊",
        "Something wonderful is about to happen between us! ✨"
    ];

    if (crystalBall) {
        crystalBall.addEventListener('click', () => {
            const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
            fortuneReveal.innerText = randomFortune;
            fortuneReveal.classList.remove('hidden');
            crystalBall.style.boxShadow = '0 0 100px rgba(187, 134, 252, 0.8)';
            setTimeout(() => {
                crystalBall.style.boxShadow = '0 0 50px rgba(187, 134, 252, 0.4)';
            }, 1000);
        });
    }

    // 25. Heartbeat Central Logic
    const megaHeart = document.getElementById('mega-heart');
    const heartbeatAudio = document.getElementById('heartbeat-audio');
    let beatInterval;
    let speed = 800;

    if (megaHeart) {
        const startHeartbeat = (e) => {
            if (e.type === 'touchstart') e.preventDefault();
            megaHeart.classList.add('heart-beating');
            if (heartbeatAudio) {
                heartbeatAudio.currentTime = 0;
                heartbeatAudio.playbackRate = 1;
                heartbeatAudio.play().catch(e => console.log("Audio play blocked"));
            }

            beatInterval = setInterval(() => {
                speed = Math.max(100, speed - 50);
                megaHeart.style.setProperty('--beat-speed', `${speed}ms`);

                if (heartbeatAudio) {
                    heartbeatAudio.playbackRate = Math.min(4, 800 / speed);
                }

                if (speed <= 100) {
                    clearInterval(beatInterval);
                    if (heartbeatAudio) heartbeatAudio.pause();

                    // BURST!
                    megaHeart.style.transform = 'scale(5)';
                    megaHeart.style.opacity = '0';
                    confetti({ particleCount: 300, spread: 100, origin: { y: 0.6 } });
                    setTimeout(() => {
                        megaHeart.style.transform = 'scale(1)';
                        megaHeart.style.opacity = '1';
                        megaHeart.classList.remove('heart-beating');
                        speed = 800;
                    }, 2000);
                }
            }, 300);
        };

        megaHeart.addEventListener('mousedown', startHeartbeat);
        megaHeart.addEventListener('touchstart', startHeartbeat, { passive: false });

        const stopHeartbeat = () => {
            clearInterval(beatInterval);
            megaHeart.classList.remove('heart-beating');
            if (heartbeatAudio) {
                heartbeatAudio.pause();
                heartbeatAudio.currentTime = 0;
            }
            speed = 800;
        };

        window.addEventListener('mouseup', stopHeartbeat);
        window.addEventListener('touchend', stopHeartbeat);
        window.addEventListener('mouseleave', stopHeartbeat);
    }

    // 26. Virtual Scrapbook Logic
    const scrapbook = document.getElementById('scrapbook');
    const bookPrev = document.getElementById('book-prev');
    const bookNext = document.getElementById('book-next');
    const pages = document.querySelectorAll('.page');
    let currentPage = 0;

    // Set initial stacking order
    pages.forEach((page, index) => {
        page.style.zIndex = pages.length - index;
    });

    if (bookNext) {
        bookNext.addEventListener('click', () => {
            if (currentPage < pages.length - 1) {
                pages[currentPage].classList.add('turned');
                currentPage++;
            }
        });
    }

    if (bookPrev) {
        bookPrev.addEventListener('click', () => {
            if (currentPage > 0) {
                currentPage--;
                pages[currentPage].classList.remove('turned');
            }
        });
    }

    // 12. Crash Sequence Logic (moved to global for access)
    window.triggerCrashSequence = () => {
        document.body.classList.add('crashed');
        document.body.classList.add('screen-jitter');
        setTimeout(() => alert("⚠️ SYSTEM STABILITY COMPROMISED!"), 300);
        setTimeout(() => alert("⚠️ CRITICAL ERROR: HEART_OVERFLOW_EXCEPTION!"), 800);
        setTimeout(() => alert("⚠️ FINAL WARNING: TOTAL SYSTEM COLLAPSE IMMINENT!"), 1300);

        setTimeout(() => {
            document.body.classList.remove('screen-jitter');
            const crashOverlay = document.getElementById('crash-overlay');
            crashOverlay.classList.remove('hidden');
            document.body.classList.add('freeze-scroll');
            let timeLeft = 5;
            const timerEl = document.getElementById('reboot-timer');
            const rebootInterval = setInterval(() => {
                timeLeft--;
                if (timerEl) timerEl.innerText = timeLeft;
                if (timeLeft <= 0) {
                    clearInterval(rebootInterval);
                    completeReboot();
                }
            }, 1000);
        }, 3000);
    };

    function completeReboot() {
        const crashOverlay = document.getElementById('crash-overlay');
        crashOverlay.style.background = '#fff';
        crashOverlay.style.transition = 'background 1s ease';
        setTimeout(() => {
            crashOverlay.classList.add('hidden');
            document.getElementById('countdown-title').innerHTML = '🎉 It’s Your Day, Rakshna!!! 🎉';
            document.querySelector('.countdown-container').classList.add('hidden');
            const struckOverlay = document.getElementById('struck-overlay');
            if (struckOverlay) {
                struckOverlay.classList.remove('hidden');
            }
            // remove crash indicators so user can continue interacting
            document.body.classList.remove('crashed', 'freeze-scroll');
            // reinitialize features in case something failed earlier
            initFlowerGarden();
            initConstellation();
            logFeatureDiagnoses();
            confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 } });
        }, 1000);
    }

    function createStars() {
        starsContainer.innerHTML = '';
        for (let i = 0; i < 150; i++) createStar();
    }
});
