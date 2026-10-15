/**
 * IBRAHIM SJ — PORTFOLIO SCRIPT ARCHITECTURE (FUEL FRAMER ENGINE)
 * Scroll-Reveal Observer, Velocity-Driven Dynamic Arrow Tilt & Inertia Spring Cursor
 */

document.addEventListener('DOMContentLoaded', () => {
    /* ==========================================================================
       1. FUEL FRAMER SCROLL-REVEAL ANIMATION (INTERSECTION OBSERVER)
       ========================================================================== */
    const revealContainers = document.querySelectorAll('.reveal-on-scroll');

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    // Unobserve once visible for peak performance
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -40px 0px'
        });

        revealContainers.forEach((container) => {
            revealObserver.observe(container);
        });
    } else {
        // Fallback for older environments
        revealContainers.forEach((container) => {
            container.classList.add('is-visible');
        });
    }

    /* ==========================================================================
       2. DYNAMIC ARROW TILT TIED TO MOUSE VELOCITY (FUEL FRAMER DEMO PHYSICS)
       ========================================================================== */
    const interactiveElementsWithArrows = document.querySelectorAll(
        '.project-card, .contact-card, .btn, .btn-instagram, .about-card, .nav-cta-btn, .section-title, .arrow-badge'
    );

    interactiveElementsWithArrows.forEach((el) => {
        let prevX = null;
        let prevY = null;
        let lastTime = performance.now();
        let targetTilt = 45;
        let currentTilt = 45;
        let animFrameId = null;

        const arrow = el.querySelector('.arrow-icon, .card-arrow, .cta-arrow, .diagonal-arrow');
        if (!arrow) return;

        function springUpdate() {
            // Smooth spring easing towards target tilt
            currentTilt += (targetTilt - currentTilt) * 0.18;
            arrow.style.transform = `translate(4px, -4px) rotate(${currentTilt.toFixed(2)}deg)`;

            if (Math.abs(targetTilt - currentTilt) > 0.1) {
                animFrameId = requestAnimationFrame(springUpdate);
            }
        }

        el.addEventListener('mousemove', (e) => {
            const now = performance.now();
            const dt = Math.max(now - lastTime, 16);

            if (prevX !== null && prevY !== null) {
                const deltaX = e.clientX - prevX;
                const deltaY = e.clientY - prevY;
                const speedX = (deltaX / dt) * 10;
                const speedY = (deltaY / dt) * 10;

                // Dynamic tilt angle responding to horizontal velocity (centered at 45deg)
                const velocityTilt = Math.max(-25, Math.min(25, speedX * 2.5 - speedY * 0.8));
                targetTilt = 45 + velocityTilt;

                if (!animFrameId) {
                    animFrameId = requestAnimationFrame(springUpdate);
                }
            }

            prevX = e.clientX;
            prevY = e.clientY;
            lastTime = now;
        });

        el.addEventListener('mouseenter', () => {
            prevX = null;
            prevY = null;
            targetTilt = 45;
            currentTilt = 0;
            if (!animFrameId) {
                animFrameId = requestAnimationFrame(springUpdate);
            }
        });

        el.addEventListener('mouseleave', () => {
            targetTilt = 0;
            if (animFrameId) {
                cancelAnimationFrame(animFrameId);
                animFrameId = null;
            }
            arrow.style.transform = '';
        });
    });

    /* ==========================================================================
       3. FLUID LIQUID CURSOR WITH INERTIA SPRING PHYSICS
       ========================================================================== */
    const isTouchDevice = () => {
        return (
            'ontouchstart' in window ||
            navigator.maxTouchPoints > 0 ||
            window.matchMedia('(pointer: coarse)').matches
        );
    };

    if (!isTouchDevice()) {
        const cursor = document.createElement('div');
        cursor.id = 'custom-cursor';
        cursor.setAttribute('aria-hidden', 'true');
        cursor.innerHTML = '<i class="fa-solid fa-arrow-up-right cursor-arrow" aria-hidden="true"></i>';
        document.body.appendChild(cursor);

        const cursorArrow = cursor.querySelector('.cursor-arrow');

        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let cursorX = mouseX;
        let cursorY = mouseY;
        let velX = 0;
        let velY = 0;
        let isCursorActive = false;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        const spring = 0.2;
        const friction = 0.8;

        function renderCursorPhysics() {
            const dx = mouseX - cursorX;
            const dy = mouseY - cursorY;

            velX = velX * friction + dx * spring;
            velY = velY * friction + dy * spring;

            cursorX += velX * 0.45;
            cursorY += velY * 0.45;

            const velocity = Math.hypot(velX, velY);
            const moveAngle = Math.atan2(velY, velX) * (180 / Math.PI);

            cursor.style.left = `${cursorX}px`;
            cursor.style.top = `${cursorY}px`;

            if (isCursorActive) {
                const tilt = Math.max(-25, Math.min(25, velX * 1.5));
                cursor.style.transform = `translate(-50%, -50%) scale(1)`;
                if (cursorArrow) {
                    cursorArrow.style.transform = `scale(1) rotate(${tilt}deg)`;
                }
            } else {
                const stretch = Math.min(velocity * 0.04, 0.45);
                const scaleX = 1 + stretch;
                const scaleY = 1 - stretch * 0.4;
                cursor.style.transform = `translate(-50%, -50%) rotate(${moveAngle}deg) scale(${scaleX}, ${scaleY})`;
                if (cursorArrow) {
                    cursorArrow.style.transform = 'scale(0.4)';
                }
            }

            requestAnimationFrame(renderCursorPhysics);
        }

        requestAnimationFrame(renderCursorPhysics);

        const interactiveSelectors = [
            'a',
            'button',
            '.interactive-link',
            '.project-card',
            '.contact-card',
            '.skill-badge',
            '.about-card',
            '.content-showcase-box',
            '.arrow-badge'
        ];

        function bindHoverables() {
            const hoverElements = document.querySelectorAll(interactiveSelectors.join(', '));
            hoverElements.forEach((el) => {
                el.addEventListener('mouseenter', () => {
                    isCursorActive = true;
                    cursor.classList.add('active');
                });
                el.addEventListener('mouseleave', () => {
                    isCursorActive = false;
                    cursor.classList.remove('active');
                });
            });
        }

        bindHoverables();

        document.addEventListener('mouseleave', () => {
            cursor.style.opacity = '0';
        });
        document.addEventListener('mouseenter', () => {
            cursor.style.opacity = '1';
        });
    }

    /* ==========================================================================
       4. STICKY NAVBAR, PRECISE SCROLL OFFSET & ACTIVE SECTION SPY
       ========================================================================== */
    const siteHeader = document.getElementById('site-header');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    const menuToggle = document.getElementById('menu-toggle');
    const navContainer = document.querySelector('.nav-container');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 30) {
            siteHeader.classList.add('scrolled');
        } else {
            siteHeader.classList.remove('scrolled');
        }

        // Active section spy
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 160;

        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    // Precise Smooth Scrolling with Navbar Offset
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();

                if (navContainer && navContainer.classList.contains('open')) {
                    navContainer.classList.remove('open');
                }

                const headerOffset = 90;
                const elementPosition = targetEl.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Mobile Navigation Toggle
    if (menuToggle && navContainer) {
        menuToggle.addEventListener('click', () => {
            navContainer.classList.toggle('open');
        });

        document.addEventListener('click', (e) => {
            if (!siteHeader.contains(e.target) && navContainer.classList.contains('open')) {
                navContainer.classList.remove('open');
            }
        });
    }

    /* ==========================================================================
       5. 3D MAGNETIC TILT ON FEATURED PROJECT CARDS
       ========================================================================== */
    const magneticCards = document.querySelectorAll('.project-card, .content-showcase-box');

    magneticCards.forEach((card) => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const cardX = e.clientX - rect.left;
            const cardY = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((cardY - centerY) / centerY) * -4;
            const rotateY = ((cardX - centerX) / centerX) * 4;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        });
    });

    /* ==========================================================================
       6. HERO VIDEO AUDIO INTEGRATION & INTERACTIVE TOGGLE CONTROLLER
       ========================================================================== */
    const heroVideo = document.getElementById('hero-bg-video');
    const audioToggleBtn = document.getElementById('hero-audio-toggle');

    function updateAudioButtonUI() {
        if (!heroVideo || !audioToggleBtn) return;
        if (heroVideo.muted || heroVideo.volume === 0) {
            audioToggleBtn.textContent = '📁 Unmute Audio';
            audioToggleBtn.setAttribute('aria-label', 'Unmute audio');
            audioToggleBtn.classList.remove('is-unmuted');
        } else {
            audioToggleBtn.textContent = '🔊 Mute Audio';
            audioToggleBtn.setAttribute('aria-label', 'Mute audio');
            audioToggleBtn.classList.add('is-unmuted');
        }
    }

    if (heroVideo) {
        // Attempt initial unmuted autoplay per requirement (muted attribute removed)
        const playPromise = heroVideo.play();
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    // Autoplay succeeded with audio allowed by environment
                    updateAudioButtonUI();
                })
                .catch(() => {
                    // Browser autoplay policy restricted unmuted playback: mute and play
                    heroVideo.muted = true;
                    heroVideo.play().catch(() => {});
                    updateAudioButtonUI();
                });
        }

        if (audioToggleBtn) {
            audioToggleBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                if (heroVideo.muted || heroVideo.volume === 0) {
                    heroVideo.muted = false;
                    heroVideo.volume = 1.0;
                    heroVideo.play().then(() => {
                        updateAudioButtonUI();
                    }).catch(() => {
                        updateAudioButtonUI();
                    });
                } else {
                    heroVideo.muted = true;
                    updateAudioButtonUI();
                }
            });
        }

        heroVideo.addEventListener('volumechange', updateAudioButtonUI);
    }
});