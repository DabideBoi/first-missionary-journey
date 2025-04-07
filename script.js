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
    let markers = [];

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
        
        // Initialize map if we're on the map slide
        if (index === 3 && !mapInitialized) {
            setTimeout(initMap, 100);
        }
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

    // Leaflet Map integration
    function initMap() {
        const mapElement = document.getElementById('journey-map');
        if (!mapElement) {
            console.error('Map element not found');
            return;
        }
        
        // Create a map centered on the Mediterranean region
        map = L.map('journey-map').setView([36.0, 33.0], 6);
        
        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        
        mapInitialized = true;
        
        // Add journey route points
        addJourneyPoints();
    }
    
    function addJourneyPoints() {
        const journeyPoints = [
            { name: "Antioch, Syria", coords: [36.2021, 36.1511] },
            { name: "Seleucia, Turkey", coords: [36.1156, 35.9391] },
            { name: "Salamis, Cyprus", coords: [35.1856, 33.9000] },
            { name: "Paphos, Cyprus", coords: [34.7564, 32.4087] },
            { name: "Perga, Turkey", coords: [36.9598, 30.8540] },
            { name: "Antioch in Pisidia, Turkey", coords: [38.3019, 31.1891] },
            { name: "Konya, Turkey", coords: [37.8747, 32.4932] },
            { name: "Lystra, Turkey", coords: [37.5856, 32.3406] },
            { name: "Derbe, Turkey", coords: [37.3575, 33.2564] },
            { name: "Antalya, Turkey", coords: [36.8969, 30.7133] }
        ];
        
        // Create a polyline for the journey route
        const routePoints = journeyPoints.map(point => point.coords);
        const polyline = L.polyline(routePoints, {color: 'red', weight: 3}).addTo(map);
        
        // Add markers for each point
        journeyPoints.forEach(point => {
            const marker = L.marker(point.coords)
                .addTo(map)
                .bindPopup(`<strong>${point.name}</strong>`);
            markers.push(marker);
        });
        
        // Fit the map to show all points
        map.fitBounds(polyline.getBounds());
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

        // Find the marker for this location
        const marker = markers.find(m => m.getPopup().getContent().includes(location));
        
        if (marker) {
            // Open the popup and center the map on this location
            marker.openPopup();
            map.setView(marker.getLatLng(), 10);
        } else {
            // If we don't have a pre-defined marker, try to geocode the location
            // This is a simplified approach since we don't have a geocoding service
            console.log(`Location not pre-defined: ${location}`);
            
            // For demonstration, we'll just center on the Mediterranean
            map.setView([36.0, 33.0], 6);
        }
    }
});
