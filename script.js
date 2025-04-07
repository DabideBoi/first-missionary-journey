document.addEventListener('DOMContentLoaded', function() {
    // Variables
    const slidesContainer = document.getElementById('slides-container');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const progressBar = document.getElementById('progress-bar');
    let currentSlideIndex = 0;
    let totalSlides = 0;
    let slides = [];
    let mapInitialized = false;
    let map;

    // Load all slides
    loadSlides();

    // Event listeners
    prevBtn.addEventListener('click', showPreviousSlide);
    nextBtn.addEventListener('click', showNextSlide);
    document.addEventListener('keydown', handleKeyPress);

    // Functions
    async function loadSlides() {
        try {
            // Load slides from 1 to 19
            for (let i = 1; i <= 19; i++) {
                const response = await fetch(`slides/slide${i}.html`);
                const slideContent = await response.text();
                slidesContainer.innerHTML += slideContent;
            }

            // Initialize slides after loading
            slides = document.querySelectorAll('.slide');
            totalSlides = slides.length;
            
            // Set first slide as active
            slides[0].classList.add('active');
            
            // Update progress bar
            updateProgressBar();
            
            // Add event listeners to location links
            setupLocationLinks();
        } catch (error) {
            console.error('Error loading slides:', error);
        }
    }

    function showSlide(index) {
        // Hide all slides
        slides.forEach(slide => slide.classList.remove('active'));
        
        // Show the selected slide
        slides[index].classList.add('active');
        
        // Update progress bar
        updateProgressBar();
    }

    function showPreviousSlide() {
        if (currentSlideIndex > 0) {
            currentSlideIndex--;
            showSlide(currentSlideIndex);
        }
    }

    function showNextSlide() {
        if (currentSlideIndex < totalSlides - 1) {
            currentSlideIndex++;
            showSlide(currentSlideIndex);
        }
    }

    function updateProgressBar() {
        const progress = ((currentSlideIndex + 1) / totalSlides) * 100;
        progressBar.style.width = `${progress}%`;
    }

    function handleKeyPress(e) {
        if (e.key === 'ArrowLeft') {
            showPreviousSlide();
        } else if (e.key === 'ArrowRight') {
            showNextSlide();
        }
    }

    function setupLocationLinks() {
        const locationLinks = document.querySelectorAll('.location-link');
        locationLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const location = this.getAttribute('data-location');
                
                // Navigate to the map slide (slide 4)
                currentSlideIndex = 3;
                showSlide(currentSlideIndex);
                
                // Wait a bit for the slide to be visible before showing the location
                setTimeout(() => {
                    showLocationOnMap(location);
                }, 500);
            });
        });
    }

    // Google Maps integration
    function initMap() {
        const mapElement = document.getElementById('journey-map');
        if (!mapElement) {
            console.error('Map element not found');
            return;
        }
        
        // Create a map centered on the Mediterranean region
        map = new google.maps.Map(mapElement, {
            center: { lat: 36.0, lng: 33.0 },
            zoom: 6,
            mapTypeId: 'terrain'
        });
        
        mapInitialized = true;
    }

    function showLocationOnMap(location) {
        // Make sure we're on a slide with the map
        const mapElement = document.getElementById('journey-map');
        if (!mapElement) {
            console.error('Map element not found');
            return;
        }
        
        if (!mapInitialized) {
            initMap();
        }

        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ 'address': location }, function(results, status) {
            if (status === 'OK') {
                map.setCenter(results[0].geometry.location);
                const marker = new google.maps.Marker({
                    map: map,
                    position: results[0].geometry.location,
                    title: location
                });
                
                // Open info window with location name
                const infoWindow = new google.maps.InfoWindow({
                    content: `<div><strong>${location}</strong></div>`
                });
                
                infoWindow.open(map, marker);
            } else {
                console.error('Geocode was not successful for the following reason: ' + status);
            }
        });
    }

    // Initialize Google Maps when needed
    window.initMap = function() {
        // We'll initialize the map when a location link is clicked
        console.log('Google Maps API loaded');
    };
});
