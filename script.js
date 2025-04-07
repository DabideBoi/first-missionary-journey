document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const progressBar = document.getElementById('progress-bar');
    
    // Set initial state
    let currentSlideIndex = 0;
    const totalSlides = slides.length;
    
    // Initialize progress bar
    updateProgressBar();
    
    // Event listeners for navigation buttons
    prevBtn.addEventListener('click', showPreviousSlide);
    nextBtn.addEventListener('click', showNextSlide);
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
            showNextSlide();
        } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
            showPreviousSlide();
        } else if (e.key === 'Home') {
            goToSlide(0);
        } else if (e.key === 'End') {
            goToSlide(totalSlides - 1);
        }
    });
    
    // Swipe navigation for touch devices
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    document.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        if (touchEndX < touchStartX - swipeThreshold) {
            // Swipe left, go to next slide
            showNextSlide();
        } else if (touchEndX > touchStartX + swipeThreshold) {
            // Swipe right, go to previous slide
            showPreviousSlide();
        }
    }
    
    // Navigation functions
    function showNextSlide() {
        if (currentSlideIndex < totalSlides - 1) {
            goToSlide(currentSlideIndex + 1);
        } else {
            // Optional: loop back to first slide
            animateButtonShake(nextBtn);
        }
    }
    
    function showPreviousSlide() {
        if (currentSlideIndex > 0) {
            goToSlide(currentSlideIndex - 1);
        } else {
            // Optional: loop to last slide
            animateButtonShake(prevBtn);
        }
    }
    
    function goToSlide(index) {
        // Remove active class from current slide
        slides[currentSlideIndex].classList.remove('active');
        
        // Update current slide index
        currentSlideIndex = index;
        
        // Add active class to new current slide
        slides[currentSlideIndex].classList.add('active');
        
        // Update progress bar
        updateProgressBar();
        
        // Update button states
        updateButtonStates();
        
        // Animate entrance of new slide
        animateSlideEntrance();
    }
    
    function updateProgressBar() {
        const progressPercentage = ((currentSlideIndex + 1) / totalSlides) * 100;
        progressBar.style.width = progressPercentage + '%';
    }
    
    function updateButtonStates() {
        // Optional: Disable prev button on first slide
        prevBtn.classList.toggle('disabled', currentSlideIndex === 0);
        
        // Optional: Disable next button on last slide
        nextBtn.classList.toggle('disabled', currentSlideIndex === totalSlides - 1);
    }
    
    function animateButtonShake(button) {
        button.classList.add('shake');
        setTimeout(() => {
            button.classList.remove('shake');
        }, 500);
    }
    
    function animateSlideEntrance() {
        const currentSlide = slides[currentSlideIndex];
        currentSlide.style.animation = 'none';
        setTimeout(() => {
            currentSlide.style.animation = 'fadeIn 0.5s ease-in-out';
        }, 10);
    }
    
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            50% { transform: translateX(5px); }
            75% { transform: translateX(-5px); }
        }
        
        .shake {
            animation: shake 0.5s ease-in-out;
        }
        
        .disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
    `;
    document.head.appendChild(style);
    
    // Initialize button states
    updateButtonStates();
    
    // Add slide counter
    const controls = document.querySelector('.controls');
    const slideCounter = document.createElement('div');
    slideCounter.className = 'slide-counter';
    slideCounter.innerHTML = `<span id="current-slide">1</span>/<span id="total-slides">${totalSlides}</span>`;
    slideCounter.style.margin = '0 15px';
    slideCounter.style.fontSize = '0.9rem';
    slideCounter.style.color = 'var(--primary-color)';
    controls.appendChild(slideCounter);
    
    const currentSlideElement = document.getElementById('current-slide');
    
    // Update slide counter when changing slides
    function updateSlideCounter() {
        currentSlideElement.textContent = currentSlideIndex + 1;
    }
    
    // Override goToSlide to update counter
    const originalGoToSlide = goToSlide;
    goToSlide = function(index) {
        originalGoToSlide(index);
        updateSlideCounter();
    };
    
    // Initialize slide counter
    updateSlideCounter();
    
    // Add fullscreen toggle
    const fullscreenBtn = document.createElement('button');
    fullscreenBtn.className = 'nav-btn fullscreen-btn';
    fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
    fullscreenBtn.style.marginLeft = '10px';
    controls.appendChild(fullscreenBtn);
    
    fullscreenBtn.addEventListener('click', toggleFullscreen);
    
    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable fullscreen: ${err.message}`);
            });
            fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
            }
        }
    }
    
    // Listen for fullscreen change
    document.addEventListener('fullscreenchange', function() {
        if (document.fullscreenElement) {
            fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
        } else {
            fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
        }
    });
    
    // Add automatic slide transition (optional, commented out by default)
    /*
    let autoSlideInterval;
    const autoSlideDelay = 5000; // 5 seconds
    
    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            if (currentSlideIndex < totalSlides - 1) {
                showNextSlide();
            } else {
                goToSlide(0); // Loop back to first slide
            }
        }, autoSlideDelay);
    }
    
    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }
    
    // Toggle auto-slide with 'A' key
    document.addEventListener('keydown', function(e) {
        if (e.key.toLowerCase() === 'a') {
            if (autoSlideInterval) {
                stopAutoSlide();
                autoSlideInterval = null;
            } else {
                startAutoSlide();
            }
        }
    });
    */
    
    // Add slide transition effects
    slides.forEach(slide => {
        // Use a flag to ensure animations only happen once per slide activation
        let animatedElements = new WeakSet();
        
        slide.addEventListener('transitionend', function() {
            if (this.classList.contains('active')) {
                // Animate elements within the slide
                const elements = this.querySelectorAll('p, ul, ol, .two-column, .theology-item, .timeline-item');
                
                // Skip headings to prevent shaking
                // Only animate elements that haven't been animated yet for this slide activation
                elements.forEach((element, index) => {
                    if (!animatedElements.has(element)) {
                        element.style.opacity = '0';
                        element.style.transform = 'translateY(20px)';
                        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                        element.style.transitionDelay = `${index * 0.1}s`;
                        
                        setTimeout(() => {
                            element.style.opacity = '1';
                            element.style.transform = 'translateY(0)';
                            // Mark this element as animated
                            animatedElements.add(element);
                        }, 50);
                    }
                });
            } else {
                // Reset the animation tracking when slide is no longer active
                animatedElements = new WeakSet();
            }
        });
    });
    
    // Initialize first slide animations - only for non-heading elements
    setTimeout(() => {
        const firstSlideElements = slides[0].querySelectorAll('p, .decorative-line');
        firstSlideElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            element.style.transitionDelay = `${index * 0.2}s`;
            
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, 100);
        });
    }, 300);
});
