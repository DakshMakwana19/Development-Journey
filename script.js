/* ===================================
   WanderVista — Main JavaScript
   Three.js Globe + GSAP + Interactions
   =================================== */

// =============================================
// DESTINATION DATA — Full details for each place
// =============================================
const DESTINATIONS = [
    {
        id: 'bali',
        name: 'Bali',
        country: 'Indonesia',
        lat: -8.3405,
        lng: 115.0920,
        image: 'images/bali.png',
        price: '$499',
        rating: 4.8,
        climate: 'Tropical',
        bestTime: 'Apr–Oct',
        language: 'Indonesian',
        currency: 'IDR (Rupiah)',
        topAttractions: 'Uluwatu Temple, Tegallalang Rice Terraces, Seminyak Beach',
        cuisine: 'Nasi Goreng, Satay, Babi Guling',
        description: 'Bali is a tropical paradise known for its stunning beaches, ancient temples, lush rice terraces, and vibrant nightlife. From surfing in Kuta to yoga retreats in Ubud, Bali offers an unforgettable blend of culture and relaxation.',
        reviews: [
            { name: 'Sarah M.', avatar: 'S', stars: 5, text: 'Absolutely magical! The rice terraces were breathtaking and the locals were incredibly welcoming.' },
            { name: 'James T.', avatar: 'J', stars: 5, text: 'Best trip of my life. The sunsets at Uluwatu Temple are something you have to experience.' },
            { name: 'Priya K.', avatar: 'P', stars: 4, text: 'Beautiful beaches and amazing food. Would recommend the Tegallalang rice terraces!' }
        ]
    },
    {
        id: 'paris',
        name: 'Paris',
        country: 'France',
        lat: 48.8566,
        lng: 2.3522,
        image: 'images/paris.png',
        price: '$799',
        rating: 4.9,
        climate: 'Temperate',
        bestTime: 'Jun–Sep',
        language: 'French',
        currency: 'EUR (Euro)',
        topAttractions: 'Eiffel Tower, Louvre Museum, Champs-Élysées, Notre-Dame',
        cuisine: 'Croissants, Coq au Vin, Crème Brûlée',
        description: 'The City of Light captivates with its iconic landmarks, world-class museums, romantic boulevards, and exquisite cuisine. Paris is the ultimate destination for art lovers, foodies, and romantics.',
        reviews: [
            { name: 'Emily R.', avatar: 'E', stars: 5, text: 'Paris exceeded all my expectations. The Louvre alone could fill a whole week of exploration!' },
            { name: 'Marco L.', avatar: 'M', stars: 5, text: 'The food, the art, the architecture — everything is perfection. A must-visit city.' },
            { name: 'Aisha B.', avatar: 'A', stars: 4, text: 'Romantic and beautiful. The Eiffel Tower at night is truly spectacular.' }
        ]
    },
    {
        id: 'maldives',
        name: 'Maldives',
        country: 'Indian Ocean',
        lat: 3.2028,
        lng: 73.2207,
        image: 'images/maldives.png',
        price: '$1,299',
        rating: 4.9,
        climate: 'Tropical',
        bestTime: 'Nov–Apr',
        language: 'Dhivehi',
        currency: 'MVR (Rufiyaa)',
        topAttractions: 'Overwater Villas, Snorkeling, Bioluminescent Beach, Malé City',
        cuisine: 'Garudhiya, Mas Huni, Bis Keemiya',
        description: 'The Maldives is a luxury paradise of crystal-clear waters, pristine white beaches, and stunning overwater villas. Perfect for honeymooners and anyone seeking ultimate relaxation surrounded by marine beauty.',
        reviews: [
            { name: 'David & Lisa', avatar: 'D', stars: 5, text: 'The overwater villa was an absolute dream. We saw dolphins right from our deck!' },
            { name: 'Sophie W.', avatar: 'S', stars: 5, text: 'Most beautiful water I have ever seen. The snorkeling was world-class.' },
            { name: 'Raj P.', avatar: 'R', stars: 5, text: 'Honeymoon perfection. The sunsets, the food, the privacy — all incredible.' }
        ]
    },
    {
        id: 'tokyo',
        name: 'Tokyo',
        country: 'Japan',
        lat: 35.6762,
        lng: 139.6503,
        image: 'images/tokyo.png',
        price: '$899',
        rating: 4.8,
        climate: 'Humid Subtropical',
        bestTime: 'Mar–May, Sep–Nov',
        language: 'Japanese',
        currency: 'JPY (Yen)',
        topAttractions: 'Shibuya Crossing, Senso-ji Temple, Akihabara, Mt. Fuji',
        cuisine: 'Sushi, Ramen, Tempura, Matcha',
        description: 'Tokyo is a dazzling fusion of ultra-modern technology and ancient tradition. From the neon-lit streets of Shibuya to the serene Meiji Shrine, Tokyo offers endless discoveries for every type of traveler.',
        reviews: [
            { name: 'Chris K.', avatar: 'C', stars: 5, text: 'The blend of traditional and modern is mind-blowing. Best ramen of my life in Shinjuku!' },
            { name: 'Yuki T.', avatar: 'Y', stars: 5, text: 'Cherry blossom season is absolutely magical. Every corner is picture-perfect.' },
            { name: 'Anna G.', avatar: 'A', stars: 4, text: 'Fascinating culture, incredible food, and the most polite people I have ever met.' }
        ]
    },
    {
        id: 'swiss',
        name: 'Swiss Alps',
        country: 'Switzerland',
        lat: 46.8182,
        lng: 8.2275,
        image: 'images/swiss.png',
        price: '$1,099',
        rating: 4.9,
        climate: 'Alpine',
        bestTime: 'Jun–Sep (summer), Dec–Mar (skiing)',
        language: 'German, French, Italian',
        currency: 'CHF (Swiss Franc)',
        topAttractions: 'Matterhorn, Jungfrau, Lake Lucerne, Interlaken',
        cuisine: 'Fondue, Raclette, Rösti, Swiss Chocolate',
        description: 'The Swiss Alps offer breathtaking mountain scenery, crystal-clear lakes, charming villages, and world-class skiing. Whether you seek adventure or tranquility, Switzerland delivers perfection.',
        reviews: [
            { name: 'Thomas H.', avatar: 'T', stars: 5, text: 'The train ride through the Alps was the most scenic journey of my life. Absolutely stunning.' },
            { name: 'Nina F.', avatar: 'N', stars: 5, text: 'Lake Lucerne at sunrise is something from a painting. Switzerland is pure magic.' },
            { name: 'Leo M.', avatar: 'L', stars: 4, text: 'Amazing skiing in Zermatt with the Matterhorn as your backdrop. Unforgettable!' }
        ]
    },
    {
        id: 'santorini',
        name: 'Santorini',
        country: 'Greece',
        lat: 36.3932,
        lng: 25.4615,
        image: 'images/santorini.png',
        price: '$749',
        rating: 4.7,
        climate: 'Mediterranean',
        bestTime: 'May–Oct',
        language: 'Greek',
        currency: 'EUR (Euro)',
        topAttractions: 'Oia Sunset, Caldera Views, Red Beach, Akrotiri',
        cuisine: 'Moussaka, Souvlaki, Baklava, Fava',
        description: 'Santorini\'s iconic blue-domed churches, whitewashed buildings, and dramatic caldera views make it one of the most photographed destinations in the world. Perfect for romance and Mediterranean bliss.',
        reviews: [
            { name: 'Maria G.', avatar: 'M', stars: 5, text: 'The Oia sunset was the most beautiful thing I have ever witnessed. Pure romance!' },
            { name: 'John B.', avatar: 'J', stars: 4, text: 'Beautiful island with amazing food and wine. The caldera views are unreal.' },
            { name: 'Elena V.', avatar: 'E', stars: 5, text: 'A dream destination. Every corner is postcard-worthy. The cave hotels are unique!' }
        ]
    },
    {
        id: 'dubai',
        name: 'Dubai',
        country: 'United Arab Emirates',
        lat: 25.2048,
        lng: 55.2708,
        image: 'images/dubai.png',
        price: '$999',
        rating: 4.8,
        climate: 'Desert (Hot)',
        bestTime: 'Nov–Mar',
        language: 'Arabic, English',
        currency: 'AED (Dirham)',
        topAttractions: 'Burj Khalifa, Palm Jumeirah, Dubai Mall, Desert Safari',
        cuisine: 'Shawarma, Al Harees, Luqaimat, Camel Burger',
        description: 'Dubai is a futuristic metropolis rising from the desert, featuring the world\'s tallest buildings, luxury shopping, desert adventures, and vibrant nightlife. It\'s where tradition meets ultra-modernity.',
        reviews: [
            { name: 'Ahmed Z.', avatar: 'A', stars: 5, text: 'The view from the top of Burj Khalifa is indescribable. Dubai is the future!' },
            { name: 'Kate S.', avatar: 'K', stars: 5, text: 'Desert safari at sunset was pure magic. The hospitality is world-class.' },
            { name: 'Mike D.', avatar: 'M', stars: 4, text: 'Incredible shopping, amazing food, and the most luxurious hotels I have ever stayed in.' }
        ]
    },
    {
        id: 'newyork',
        name: 'New York',
        country: 'United States',
        lat: 40.7128,
        lng: -74.0060,
        image: 'images/newyork.png',
        price: '$849',
        rating: 4.8,
        climate: 'Continental',
        bestTime: 'Apr–Jun, Sep–Nov',
        language: 'English',
        currency: 'USD (Dollar)',
        topAttractions: 'Statue of Liberty, Central Park, Times Square, Brooklyn Bridge',
        cuisine: 'Pizza, Bagels, Cheesecake, Hot Dogs',
        description: 'The city that never sleeps offers world-class art, iconic skyscrapers, Broadway shows, and an unmatched energy. From Central Park to the Statue of Liberty, NYC is an unforgettable urban adventure.',
        reviews: [
            { name: 'Linda W.', avatar: 'L', stars: 5, text: 'NYC blew me away! Broadway was incredible and the food scene is unmatched.' },
            { name: 'Carlos R.', avatar: 'C', stars: 5, text: 'Central Park in autumn is pure magic. The skyline views from Top of the Rock are breathtaking.' },
            { name: 'Mia T.', avatar: 'M', stars: 4, text: 'So much to do and see! The energy of Times Square at night is electric.' }
        ]
    },
    {
        id: 'rome',
        name: 'Rome',
        country: 'Italy',
        lat: 41.9028,
        lng: 12.4964,
        image: 'images/rome.png',
        price: '$699',
        rating: 4.9,
        climate: 'Mediterranean',
        bestTime: 'Apr–Jun, Sep–Oct',
        language: 'Italian',
        currency: 'EUR (Euro)',
        topAttractions: 'Colosseum, Vatican City, Trevi Fountain, Pantheon',
        cuisine: 'Pasta Carbonara, Gelato, Tiramisu, Supplì',
        description: 'The Eternal City is a living museum of ancient history, Renaissance art, and vibrant Italian culture. Walk through 3,000 years of history while savoring the world\'s finest cuisine.',
        reviews: [
            { name: 'Sofia B.', avatar: 'S', stars: 5, text: 'Rome is pure magic. The Colosseum at sunset gave me chills. Best gelato of my life!' },
            { name: 'Hans M.', avatar: 'H', stars: 5, text: 'Vatican City is overwhelming in the best way. The Sistine Chapel left me speechless.' },
            { name: 'Rachel K.', avatar: 'R', stars: 4, text: 'Tossing a coin in the Trevi Fountain is a must! The pasta here ruined all other pasta for me.' }
        ]
    },
    {
        id: 'capetown',
        name: 'Cape Town',
        country: 'South Africa',
        lat: -33.9249,
        lng: 18.4241,
        image: 'images/capetown.png',
        price: '$799',
        rating: 4.7,
        climate: 'Mediterranean',
        bestTime: 'Oct–Mar',
        language: 'English, Afrikaans',
        currency: 'ZAR (Rand)',
        topAttractions: 'Table Mountain, Cape of Good Hope, Robben Island, V&A Waterfront',
        cuisine: 'Braai, Bobotie, Biltong, Cape Malay Curry',
        description: 'Where mountains meet the ocean, Cape Town dazzles with stunning landscapes, rich history, world-class wines, and incredible wildlife. A destination that truly has it all.',
        reviews: [
            { name: 'Thabo N.', avatar: 'T', stars: 5, text: 'Table Mountain at sunrise is a spiritual experience. Cape Town is Africa\'s gem!' },
            { name: 'Emma L.', avatar: 'E', stars: 5, text: 'The wine farms in Stellenbosch were heavenly. Such a diverse and beautiful city.' },
            { name: 'Jake P.', avatar: 'J', stars: 4, text: 'Shark cage diving was the thrill of a lifetime! The food scene is underrated.' }
        ]
    },
    {
        id: 'iceland',
        name: 'Iceland',
        country: 'Nordic',
        lat: 64.1466,
        lng: -21.9426,
        image: 'images/iceland.png',
        price: '$1,199',
        rating: 4.9,
        climate: 'Subarctic',
        bestTime: 'Jun–Aug (summer), Sep–Mar (northern lights)',
        language: 'Icelandic, English',
        currency: 'ISK (Króna)',
        topAttractions: 'Northern Lights, Blue Lagoon, Golden Circle, Glaciers',
        cuisine: 'Skyr, Lamb Stew, Fermented Shark, Rye Bread',
        description: 'A land of fire and ice where glaciers meet volcanoes, geysers erupt, and the Northern Lights dance across the sky. Iceland is nature\'s ultimate masterpiece.',
        reviews: [
            { name: 'Olaf S.', avatar: 'O', stars: 5, text: 'Seeing the Northern Lights was a bucket-list moment. Iceland is otherworldly!' },
            { name: 'Amy C.', avatar: 'A', stars: 5, text: 'The Blue Lagoon was pure bliss. Driving the Golden Circle felt like another planet.' },
            { name: 'Derek H.', avatar: 'D', stars: 5, text: 'Walking on a glacier and seeing waterfalls everywhere — Iceland is paradise for adventurers.' }
        ]
    },
    {
        id: 'machupicchu',
        name: 'Machu Picchu',
        country: 'Peru',
        lat: -13.1631,
        lng: -72.5450,
        image: 'images/machupicchu.png',
        price: '$949',
        rating: 4.9,
        climate: 'Subtropical Highland',
        bestTime: 'May–Sep',
        language: 'Spanish, Quechua',
        currency: 'PEN (Sol)',
        topAttractions: 'Inca Citadel, Huayna Picchu, Sacred Valley, Cusco',
        cuisine: 'Ceviche, Lomo Saltado, Pisco Sour, Quinoa Soup',
        description: 'The legendary lost city of the Incas sits atop the Andes, shrouded in mist and mystery. Trek through ancient trails and witness one of the New Seven Wonders of the World.',
        reviews: [
            { name: 'Pablo M.', avatar: 'P', stars: 5, text: 'The Inca Trail trek was life-changing. Arriving at Machu Picchu at sunrise was beyond words.' },
            { name: 'Sarah J.', avatar: 'S', stars: 5, text: 'A bucket-list destination that exceeded every expectation. The energy here is spiritual.' },
            { name: 'Ben R.', avatar: 'B', stars: 4, text: 'Cusco is a gem too! The altitude takes some adjusting but the views are worth every breath.' }
        ]
    }
];

// Package details data
const PACKAGES = {
    premium: {
        name: 'Premium',
        tier: 'Most Popular',
        hotel: {
            name: 'Grand Meridien Resort',
            rating: '5-Star',
            amenities: ['Ocean View', 'King Bed', 'Spa Access', 'Minibar', 'Room Service', 'Infinity Pool', 'Gym', 'Concierge']
        },
        vehicles: [
            { name: 'Business Class Flight', desc: 'Lie-flat seats, premium dining', icon: 'fa-plane' },
            { name: 'Luxury Sedan', desc: 'Private Mercedes transfer', icon: 'fa-car' }
        ],
        itinerary: [
            'Day 1: VIP airport pickup, resort check-in, welcome dinner',
            'Day 2: Private guided tour of iconic landmarks',
            'Day 3: Adventure activity — snorkeling/hiking/safari',
            'Day 4: Spa & wellness day at the resort',
            'Day 5: Cultural immersion — local cooking class',
            'Day 6: Free day with optional excursions',
            'Day 7: Farewell brunch & departure'
        ]
    },
    luxury: {
        name: 'Royal',
        tier: 'Ultra Luxury',
        hotel: {
            name: 'The Ritz Presidential Suite',
            rating: '7-Star',
            amenities: ['Private Pool', 'Butler Service', 'Helipad', 'Michelin Dining', 'Private Beach', 'Yacht Access', 'Personal Chef', 'Limousine']
        },
        vehicles: [
            { name: 'First Class Flight', desc: 'Private suite, champagne service', icon: 'fa-plane' },
            { name: 'Rolls Royce', desc: 'Chauffeur-driven luxury transfer', icon: 'fa-car' },
            { name: 'Private Yacht', desc: 'Island hopping & sunset cruise', icon: 'fa-ship' },
            { name: 'Helicopter Tour', desc: 'Aerial sightseeing experience', icon: 'fa-helicopter' }
        ],
        itinerary: [
            'Day 1: Private jet arrival, presidential suite check-in, champagne reception',
            'Day 2: Helicopter aerial tour of the destination',
            'Day 3: Private yacht cruise with gourmet lunch',
            'Day 4: Exclusive cultural experience with local VIPs',
            'Day 5: Michelin-star dining experience & spa retreat',
            'Day 6: Adventure day — bespoke activities',
            'Day 7: Shopping with personal stylist',
            'Day 8: Farewell gala dinner',
            'Day 9: Private jet departure with gift hamper'
        ]
    },
    adventure: {
        name: 'Adventurer',
        tier: 'Thrill Seeker',
        hotel: {
            name: 'Adventure Lodge & Camp',
            rating: '4-Star',
            amenities: ['Mountain View', 'Campfire Area', 'Gear Storage', 'Breakfast & Lunch', 'Hot Showers', 'WiFi in Lodge']
        },
        vehicles: [
            { name: 'Direct Flight', desc: 'Standard seating with extra legroom', icon: 'fa-plane' },
            { name: '4x4 Jeep', desc: 'Off-road adventure transfers', icon: 'fa-truck-monster' }
        ],
        itinerary: [
            'Day 1: Arrival & lodge check-in, gear fitting',
            'Day 2: Guided mountain trek with panoramic views',
            'Day 3: River rafting & kayaking adventure',
            'Day 4: Rock climbing & zip-lining',
            'Day 5: Wildlife safari or snorkeling',
            'Day 6: Free exploration day with optional paragliding',
            'Day 7: Farewell campfire & departure'
        ]
    },
    honeymoon: {
        name: 'Honeymoon',
        tier: 'Romance Package',
        hotel: {
            name: 'Lovebird Beach Resort',
            rating: '5-Star Boutique',
            amenities: ['Overwater Suite', 'Private Plunge Pool', 'Rose Petal Turndown', 'Couple\'s Spa', 'Room Service 24/7', 'Private Beach Access', 'Champagne on Arrival']
        },
        vehicles: [
            { name: 'Business Class Flight', desc: 'Premium comfort for couples', icon: 'fa-plane' },
            { name: 'Private Speedboat', desc: 'Scenic transfer to resort island', icon: 'fa-ship' }
        ],
        itinerary: [
            'Day 1: VIP couple\'s arrival, suite check-in, champagne & sunset',
            'Day 2: Couple\'s spa day with aromatherapy & massage',
            'Day 3: Private island picnic & snorkeling adventure',
            'Day 4: Sunset sailing cruise with gourmet dinner',
            'Day 5: Cultural excursion & local shopping',
            'Day 6: Beach day, photography session at golden hour',
            'Day 7: Romantic farewell dinner under the stars',
            'Day 8: Late checkout & departure with gift hamper'
        ]
    }
};

// Reviews for carousel
const REVIEWS = [
    { name: 'Sarah Mitchell', avatar: 'SM', rating: 5, dest: 'Bali, Indonesia', text: '"WanderVista made my dream trip a reality! The 3D globe on their website helped me visualize my journey, and the booking process was seamless. Our hotel in Bali was absolutely stunning."' },
    { name: 'James & Rachel', avatar: 'JR', rating: 5, dest: 'Maldives', text: '"Our honeymoon in the Maldives was pure perfection. From the overwater villa to the private dinner on the beach — WanderVista organized everything flawlessly. Worth every penny!"' },
    { name: 'Akira Tanaka', avatar: 'AT', rating: 5, dest: 'Swiss Alps', text: '"The Swiss Alps package exceeded all expectations. The train journey through the mountains, the cozy chalet, and the fondue experience — everything was curated to perfection."' },
    { name: 'Priya Sharma', avatar: 'PS', rating: 4, dest: 'Paris, France', text: '"Paris was a dream come true. Our guide knew all the hidden gems, and the boutique hotel near the Seine was magical. I will definitely be booking with WanderVista again!"' },
    { name: 'David Kim', avatar: 'DK', rating: 5, dest: 'Tokyo, Japan', text: '"Tokyo blew my mind! The blend of ancient temples and modern tech is unreal. WanderVista\'s premium package gave us a truly VIP experience with incredible local guides."' },
    { name: 'Emma & Tom', avatar: 'ET', rating: 5, dest: 'Santorini, Greece', text: '"Watching the sunset in Oia with a glass of local wine was the highlight of our year. The cave hotel WanderVista booked for us was absolutely phenomenal!"' }
];


// =============================================
// DEVICE CAPABILITY DETECTION
// =============================================
const isLowEnd = (() => {
    const nav = navigator;
    const lowMemory = nav.deviceMemory && nav.deviceMemory <= 2;
    const slowCPU = nav.hardwareConcurrency && nav.hardwareConcurrency <= 2;
    const small = window.innerWidth < 480;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return lowMemory || slowCPU || reducedMotion || false;
})();
const isMobile = window.innerWidth <= 768;
const isTinyScreen = window.innerWidth <= 480;

// =============================================
// PRELOADER
// =============================================
function hidePreloader() {
    const preloader = document.getElementById('preloader');
    if (preloader && !preloader.classList.contains('hidden')) {
        preloader.classList.add('hidden');
    }
}

// Use multiple fallback strategies to ensure preloader always clears
window.addEventListener('load', () => setTimeout(hidePreloader, 1500));
document.addEventListener('DOMContentLoaded', () => setTimeout(hidePreloader, 2500));
setTimeout(hidePreloader, 4000);


// =============================================
// THREE.JS — INTERACTIVE 3D GLOBE
// =============================================
let scene, camera, renderer, globe, clouds, markers = [], raycaster, mouse;
let isGlobeInteracting = false;
let autoRotate = true;
let selectedMarker = null;

function initGlobe() {
    const container = document.getElementById('globe-container');
    const w = container.clientWidth;
    const h = container.clientHeight;

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000);
    camera.position.set(0, 0, 3.5);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Enhanced lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff5e0, 1.4);
    sunLight.position.set(5, 3, 5);
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0x6590be, 0.3);
    rimLight.position.set(-5, -2, -5);
    scene.add(rimLight);

    // Star field background
    const starGeo = new THREE.BufferGeometry();
    const starCount = 1200;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i++) {
        starPos[i] = (Math.random() - 0.5) * 200;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.12, transparent: true, opacity: 0.4 });
    scene.add(new THREE.Points(starGeo, starMat));

    // Globe — 48 segments for smoother sphere
    const globeGeo = new THREE.SphereGeometry(1, 48, 48);

    // Ultra High-resolution Earth texture (2048x1024)
    const globeCanvas = document.createElement('canvas');
    globeCanvas.width = 2048;
    globeCanvas.height = 1024;
    const ctx = globeCanvas.getContext('2d');
    
    // Aesthetic Ocean base — deep rich olive-emerald to navy
    const oceanGrad = ctx.createLinearGradient(0, 0, 0, 1024);
    oceanGrad.addColorStop(0, '#0f2027');
    oceanGrad.addColorStop(0.3, '#203a43');
    oceanGrad.addColorStop(0.5, '#2c5364');
    oceanGrad.addColorStop(0.7, '#203a43');
    oceanGrad.addColorStop(1, '#0f2027');
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, 0, 2048, 1024);

    // Ocean depth, currents, and noise mapping
    for (let i = 0; i < 200; i++) {
        const x = Math.random() * 2048;
        const y = Math.random() * 1024;
        const rad = 20 + Math.random() * 80;
        const grad = ctx.createRadialGradient(x, y, 0, x, y, rad);
        const intensity = 0.05 + Math.random() * 0.1;
        grad.addColorStop(0, `rgba(163, 177, 138, ${intensity})`); // our olive theme
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.ellipse(x, y, rad * 2, rad, Math.random() * Math.PI, 0, Math.PI * 2);
        ctx.fill();
    }

    // Ocean depth and current variation
    for (let i = 0; i < 60; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 256;
        const grad = ctx.createRadialGradient(x, y, 0, x, y, 15 + Math.random() * 30);
        grad.addColorStop(0, `rgba(${15 + Math.random() * 25}, ${80 + Math.random() * 60}, ${140 + Math.random() * 50}, 0.12)`);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.ellipse(x, y, 30 + Math.random() * 40, 15 + Math.random() * 20, Math.random() * Math.PI, 0, Math.PI * 2);
        ctx.fill();
    }

    // Add ocean depth variation
    ctx.fillStyle = 'rgba(26, 82, 118, 0.15)';
    for (let i = 0; i < 30; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 256;
        ctx.beginPath();
        ctx.ellipse(x, y, 20 + Math.random() * 40, 10 + Math.random() * 20, Math.random() * Math.PI, 0, Math.PI * 2);
        ctx.fill();
    }

    // Helper to draw landmass with natural edges
    function drawLand(shapes, fillColor, borderColor) {
        ctx.fillStyle = fillColor;
        shapes.forEach(s => {
            ctx.beginPath();
            ctx.ellipse(s[0], s[1], s[2], s[3], s[4] || 0, 0, Math.PI * 2);
            ctx.fill();
        });
        if (borderColor) {
            ctx.strokeStyle = borderColor;
            ctx.lineWidth = 1;
            shapes.forEach(s => {
                ctx.beginPath();
                ctx.ellipse(s[0], s[1], s[2], s[3], s[4] || 0, 0, Math.PI * 2);
                ctx.stroke();
            });
        }
    }

    // North America (green-brown)
    drawLand([
        [105, 55, 30, 18, -0.2],
        [90, 70, 38, 25, -0.3],
        [100, 90, 25, 15, 0],
        [115, 100, 12, 10, 0.1],
    ], '#3d7a3a', 'rgba(30, 80, 30, 0.4)');

    // Central America
    drawLand([
        [110, 112, 8, 5, 0.5],
        [115, 118, 6, 4, 0.3],
    ], '#4a8c3f', null);

    // South America
    drawLand([
        [125, 140, 18, 15, 0.15],
        [130, 160, 20, 25, 0.1],
        [128, 185, 14, 18, 0],
        [125, 200, 8, 10, -0.1],
    ], '#2d6b2d', 'rgba(30, 80, 30, 0.4)');

    // Europe
    drawLand([
        [250, 55, 22, 12, 0],
        [260, 65, 18, 15, 0.1],
        [245, 75, 15, 10, -0.2],
        [270, 55, 8, 6, 0],
    ], '#4a8f3f', 'rgba(40, 90, 40, 0.3)');

    // Africa
    drawLand([
        [260, 105, 22, 15, 0],
        [262, 125, 25, 20, 0],
        [258, 148, 22, 20, 0],
        [260, 168, 15, 15, -0.1],
        [255, 180, 8, 8, 0],
    ], '#8B7D3C', 'rgba(100, 90, 40, 0.4)');
    // African green belt
    drawLand([
        [262, 118, 18, 8, 0],
    ], '#3d7a3a', null);

    // Middle East
    drawLand([
        [285, 90, 12, 10, 0.2],
        [290, 100, 8, 6, 0],
    ], '#c4a84d', null);

    // Asia
    drawLand([
        [310, 55, 30, 15, 0],
        [330, 65, 40, 18, 0.1],
        [350, 55, 25, 12, 0],
        [355, 75, 20, 10, 0.15],
        [310, 75, 25, 12, -0.1],
        [300, 85, 15, 10, 0],
    ], '#457a3a', 'rgba(40, 90, 40, 0.35)');

    // India
    drawLand([
        [315, 100, 10, 15, 0],
        [315, 110, 8, 8, 0],
    ], '#3d7a3a', null);

    // Southeast Asia / Indonesia
    drawLand([
        [345, 95, 8, 5, 0.3],
        [355, 100, 6, 4, 0.2],
        [360, 108, 10, 4, 0.1],
        [375, 112, 8, 3, 0],
    ], '#3d8a3a', null);

    // Japan
    drawLand([
        [375, 68, 3, 10, 0.3],
        [377, 60, 2, 6, 0.2],
    ], '#4a8f3f', null);

    // Australia
    drawLand([
        [380, 160, 22, 16, 0],
        [375, 155, 18, 12, -0.1],
        [390, 165, 15, 10, 0.1],
    ], '#b8993e', 'rgba(140, 120, 50, 0.4)');
    // Australian green coast
    drawLand([
        [370, 155, 6, 4, 0],
        [395, 158, 5, 3, 0],
    ], '#4a8f3f', null);

    // Sub-surface glowing atmosphere overlay directly on canvas
    const glowGrad = ctx.createLinearGradient(0, 0, 0, 1024);
    glowGrad.addColorStop(0, 'rgba(163, 177, 138, 0.3)');
    glowGrad.addColorStop(0.1, 'rgba(163, 177, 138, 0.0)');
    glowGrad.addColorStop(0.9, 'rgba(163, 177, 138, 0.0)');
    glowGrad.addColorStop(1, 'rgba(163, 177, 138, 0.3)');
    ctx.fillStyle = glowGrad;
    ctx.fillRect(0, 0, 2048, 1024);

    const globeTexture = new THREE.CanvasTexture(globeCanvas);
    globeTexture.anisotropy = 4;
    globeTexture.colorSpace = THREE.SRGBColorSpace;

    // Create High-Res bump map
    const bumpCanvas = document.createElement('canvas');
    bumpCanvas.width = 2048;
    bumpCanvas.height = 1024;
    const bctx = bumpCanvas.getContext('2d');
    bctx.fillStyle = '#000';
    bctx.fillRect(0, 0, 2048, 1024);
    
    // Copy the same structure as land for bump map (but in greyscale)
    function drawBump(xBase, yBase, width, height, density) {
        for (let i = 0; i < density; i++) {
            const lx = xBase + (Math.random() - 0.5) * width;
            const ly = yBase + (Math.random() - 0.5) * height;
            const size = 15 + Math.random() * 35;
            const grad = bctx.createRadialGradient(lx, ly, 0, lx, ly, size);
            grad.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
            grad.addColorStop(0.5, 'rgba(150, 150, 150, 0.4)');
            grad.addColorStop(1, 'transparent');
            bctx.fillStyle = grad;
            bctx.beginPath();
            bctx.ellipse(lx, ly, size * (1 + Math.random()), size, Math.random() * Math.PI, 0, Math.PI * 2);
            bctx.fill();
        }
    }
    drawBump(450, 300, 300, 250, 150);
    drawBump(600, 650, 200, 300, 100);
    drawBump(1200, 250, 500, 250, 250);
    drawBump(1100, 550, 250, 300, 120);
    drawBump(1700, 750, 200, 150, 60);
    const bumpTexture = new THREE.CanvasTexture(bumpCanvas);

    const globeMat = new THREE.MeshPhysicalMaterial({
        map: globeTexture,
        bumpMap: bumpTexture,
        bumpScale: 0.05,
        roughness: 0.4,
        metalness: 0.1,
        clearcoat: 0.3,
        clearcoatRoughness: 0.2,
        emissive: new THREE.Color(0x1a2510),
        emissiveIntensity: 0.2
    });

    globe = new THREE.Mesh(globeGeo, globeMat);
    scene.add(globe);

    // Cloud layer
    const cloudGeo = new THREE.SphereGeometry(1.025, 48, 48);
    const cloudCanvas = document.createElement('canvas');
    cloudCanvas.width = 1024;
    cloudCanvas.height = 512;
    const cctx = cloudCanvas.getContext('2d');
    // Transparent base
    cctx.clearRect(0, 0, 1024, 512);
    // Cloud patches
    for (let i = 0; i < 80; i++) {
        const x = Math.random() * 1024;
        const y = Math.random() * 512;
        const r = 15 + Math.random() * 45;
        const grad = cctx.createRadialGradient(x, y, 0, x, y, r);
        grad.addColorStop(0, `rgba(255,255,255,${0.15 + Math.random() * 0.2})`);
        grad.addColorStop(0.6, `rgba(255,255,255,${0.05 + Math.random() * 0.08})`);
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        cctx.fillStyle = grad;
        cctx.beginPath();
        cctx.ellipse(x, y, r * 1.5, r, Math.random() * Math.PI, 0, Math.PI * 2);
        cctx.fill();
    }
    const cloudTexture = new THREE.CanvasTexture(cloudCanvas);
    const cloudMat = new THREE.MeshBasicMaterial({
        map: cloudTexture,
        transparent: true,
        opacity: 0.4,
        depthWrite: false
    });
    clouds = new THREE.Mesh(cloudGeo, cloudMat);
    scene.add(clouds);

    // Atmosphere — multi-layer blue glow
    const atmosphereGeo = new THREE.SphereGeometry(1.06, 48, 48);
    const atmosphereMat = new THREE.MeshBasicMaterial({
        color: 0x4a90d9,
        transparent: true,
        opacity: 0.12,
        side: THREE.BackSide
    });
    scene.add(new THREE.Mesh(atmosphereGeo, atmosphereMat));

    // Mid haze
    const midHazeGeo = new THREE.SphereGeometry(1.12, 48, 48);
    const midHazeMat = new THREE.MeshBasicMaterial({
        color: 0x87CEEB,
        transparent: true,
        opacity: 0.06,
        side: THREE.BackSide
    });
    scene.add(new THREE.Mesh(midHazeGeo, midHazeMat));

    // Outer glow
    const outerGlowGeo = new THREE.SphereGeometry(1.2, 48, 48);
    const outerGlowMat = new THREE.MeshBasicMaterial({
        color: 0xadd8e6,
        transparent: true,
        opacity: 0.03,
        side: THREE.BackSide
    });
    scene.add(new THREE.Mesh(outerGlowGeo, outerGlowMat));

    // Add destination markers
    DESTINATIONS.forEach(dest => {
        addMarker(dest);
    });

    // Raycaster for click detection
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    // Events
    renderer.domElement.addEventListener('click', onGlobeClick);
    renderer.domElement.addEventListener('mousedown', () => { isGlobeInteracting = true; autoRotate = false; });
    renderer.domElement.addEventListener('mouseup', () => { isGlobeInteracting = false; setTimeout(() => autoRotate = true, 3000); });
    window.addEventListener('resize', onGlobeResize);

    // Mouse rotation
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };

    renderer.domElement.addEventListener('mousedown', (e) => {
        isDragging = true;
        prevMouse = { x: e.clientX, y: e.clientY };
    });

    renderer.domElement.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const dx = e.clientX - prevMouse.x;
        const dy = e.clientY - prevMouse.y;
        globe.rotation.y += dx * 0.005;
        globe.rotation.x += dy * 0.005;
        markers.forEach(m => {
            if (m.group) {
                m.group.rotation.y = globe.rotation.y;
                m.group.rotation.x = globe.rotation.x;
            }
        });
        prevMouse = { x: e.clientX, y: e.clientY };
    });

    renderer.domElement.addEventListener('mouseup', () => { isDragging = false; });

    // Touch support for globe interaction
    renderer.domElement.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
            isDragging = true;
            autoRotate = false;
            prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
    }, { passive: true });

    renderer.domElement.addEventListener('touchmove', (e) => {
        if (!isDragging || e.touches.length !== 1) return;
        const dx = e.touches[0].clientX - prevMouse.x;
        const dy = e.touches[0].clientY - prevMouse.y;
        globe.rotation.y += dx * 0.005;
        globe.rotation.x += dy * 0.005;
        markers.forEach(m => {
            if (m.group) {
                m.group.rotation.y = globe.rotation.y;
                m.group.rotation.x = globe.rotation.x;
            }
        });
        prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }, { passive: true });

    renderer.domElement.addEventListener('touchend', () => {
        isDragging = false;
        setTimeout(() => autoRotate = true, 3000);
    }, { passive: true });

    // Scroll zoom - only when Ctrl is held to avoid blocking page scroll
    renderer.domElement.addEventListener('wheel', (e) => {
        if (e.ctrlKey) {
            e.preventDefault();
            camera.position.z = Math.max(2, Math.min(6, camera.position.z + e.deltaY * 0.003));
        }
    }, { passive: false });

    animateGlobe();
}

function latLngToVector3(lat, lng, radius) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    return new THREE.Vector3(
        -(radius * Math.sin(phi) * Math.cos(theta)),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
    );
}

function addMarker(dest) {
    const group = new THREE.Group();

    const pos = latLngToVector3(dest.lat, dest.lng, 1.02);

    // Marker pin
    const markerGeo = new THREE.SphereGeometry(0.028, 16, 16);
    const markerMat = new THREE.MeshBasicMaterial({
        color: 0xc67a4a,
        transparent: true,
        opacity: 0.95
    });
    const marker = new THREE.Mesh(markerGeo, markerMat);
    marker.position.copy(pos);
    marker.userData = { destination: dest };
    group.add(marker);

    // Pulse ring
    const ringGeo = new THREE.RingGeometry(0.035, 0.05, 32);
    const ringMat = new THREE.MeshBasicMaterial({
        color: 0xc67a4a,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.copy(pos);
    ring.lookAt(new THREE.Vector3(0, 0, 0));
    ring.userData.isPulse = true;
    group.add(ring);

    scene.add(group);
    markers.push({ mesh: marker, ring: ring, group: group, dest: dest });
}

function onGlobeClick(event) {
    const container = document.getElementById('globe-container');
    const rect = container.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const markerMeshes = markers.map(m => m.mesh);
    const intersects = raycaster.intersectObjects(markerMeshes, true);

    if (intersects.length > 0) {
        let clickedDest = null;
        // Find the destination data
        for (const m of markers) {
            if (m.mesh === intersects[0].object) {
                clickedDest = m.dest;
                break;
            }
        }
        if (clickedDest) {
            showDestinationPanel(clickedDest);
            // Smooth camera fly-to
            flyToDestination(clickedDest);
        }
    }
}

function flyToDestination(dest) {
    const targetPos = latLngToVector3(dest.lat, dest.lng, 3);
    autoRotate = false;

    gsap.to(camera.position, {
        x: targetPos.x * 0.8,
        y: targetPos.y * 0.8,
        z: targetPos.z * 0.8,
        duration: 1.5,
        ease: 'power3.inOut',
        onUpdate: () => camera.lookAt(0, 0, 0)
    });
}

function flyBack() {
    gsap.to(camera.position, {
        x: 0, y: 0, z: 3.5,
        duration: 1.2,
        ease: 'power3.inOut',
        onComplete: () => { autoRotate = true; },
        onUpdate: () => camera.lookAt(0, 0, 0)
    });
}

function onGlobeResize() {
    const container = document.getElementById('globe-container');
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
}

let globeVisible = true;

function animateGlobe() {
    requestAnimationFrame(animateGlobe);

    // Skip rendering when globe is not visible (scrolled past)
    if (!globeVisible) return;

    if (autoRotate) {
        globe.rotation.y += 0.002;
        if (clouds) clouds.rotation.y += 0.0025; // Clouds rotate slightly faster
        markers.forEach(m => {
            if (m.group) m.group.rotation.y = globe.rotation.y;
        });
    }

    // Pulse markers
    const time = Date.now() * 0.003;
    markers.forEach((m, i) => {
        const scale = 1 + Math.sin(time + i) * 0.3;
        m.ring.scale.set(scale, scale, scale);
        m.ring.material.opacity = 0.5 - Math.sin(time + i) * 0.3;
    });

    renderer.render(scene, camera);
}

// Pause globe rendering when hero section is not visible
function setupGlobeVisibilityObserver() {
    const hero = document.getElementById('hero');
    if (!hero || typeof IntersectionObserver === 'undefined') return;
    const obs = new IntersectionObserver((entries) => {
        globeVisible = entries[0].isIntersecting;
    }, { threshold: 0.05 });
    obs.observe(hero);
}


// =============================================
// DESTINATION PANEL
// =============================================
function showDestinationPanel(dest) {
    const panel = document.getElementById('destinationPanel');
    document.getElementById('panelMainImg').src = dest.image;
    document.getElementById('panelMainImg').alt = dest.name;
    document.getElementById('panelName').textContent = `${dest.name}, ${dest.country}`;
    document.getElementById('panelRating').textContent = dest.rating;
    document.getElementById('panelDesc').textContent = dest.description;
    document.getElementById('panelPrice').textContent = dest.price;

    // Stars
    const starsEl = document.getElementById('panelStars');
    starsEl.innerHTML = '';
    for (let i = 0; i < 5; i++) {
        starsEl.innerHTML += i < Math.floor(dest.rating)
            ? '<i class="fa-solid fa-star"></i> '
            : '<i class="fa-regular fa-star"></i> ';
    }

    // Details grid
    const detailsEl = document.getElementById('panelDetails');
    detailsEl.innerHTML = `
        <div class="panel-detail-item"><span class="detail-label">Climate</span><span class="detail-value">${dest.climate}</span></div>
        <div class="panel-detail-item"><span class="detail-label">Best Time</span><span class="detail-value">${dest.bestTime}</span></div>
        <div class="panel-detail-item"><span class="detail-label">Language</span><span class="detail-value">${dest.language}</span></div>
        <div class="panel-detail-item"><span class="detail-label">Currency</span><span class="detail-value">${dest.currency}</span></div>
        <div class="panel-detail-item" style="grid-column: 1/-1"><span class="detail-label">Top Attractions</span><span class="detail-value">${dest.topAttractions}</span></div>
        <div class="panel-detail-item" style="grid-column: 1/-1"><span class="detail-label">Local Cuisine</span><span class="detail-value">${dest.cuisine}</span></div>
    `;

    // Reviews
    const reviewsList = document.getElementById('panelReviewsList');
    reviewsList.innerHTML = '';
    dest.reviews.forEach(r => {
        reviewsList.innerHTML += `
            <div class="panel-review-card">
                <div class="review-header">
                    <div class="review-avatar">${r.avatar}</div>
                    <span class="review-name">${r.name}</span>
                    <span class="review-stars">${'★'.repeat(r.stars)}${'☆'.repeat(5 - r.stars)}</span>
                </div>
                <p class="review-text">${r.text}</p>
            </div>
        `;
    });

    // Thumbs (reuse same image for demo)
    const thumbs = document.getElementById('panelThumbs');
    thumbs.innerHTML = '';
    for (let i = 0; i < 4; i++) {
        const img = document.createElement('img');
        img.src = dest.image;
        img.alt = dest.name;
        if (i === 0) img.classList.add('active');
        img.addEventListener('click', () => {
            document.getElementById('panelMainImg').src = img.src;
            thumbs.querySelectorAll('img').forEach(t => t.classList.remove('active'));
            img.classList.add('active');
        });
        thumbs.appendChild(img);
    }

    panel.classList.add('active');
}

// Moved to DOMContentLoaded init


// =============================================
// DESTINATIONS GRID
// =============================================
function renderDestinations() {
    const grid = document.getElementById('destinationsGrid');
    grid.innerHTML = '';

    DESTINATIONS.forEach((dest, i) => {
        const card = document.createElement('div');
        card.className = 'dest-card glass-card reveal';
        card.style.animationDelay = `${i * 0.1}s`;
        card.innerHTML = `
            <img class="dest-card-img" src="${dest.image}" alt="${dest.name}" loading="lazy">
            <div class="dest-card-overlay">
                <span class="dest-card-badge"><i class="fa-solid fa-fire"></i> Popular</span>
                <h3 class="dest-card-name">${dest.name}</h3>
                <p class="dest-card-country">${dest.country}</p>
                <div class="dest-card-info">
                    <span><i class="fa-solid fa-star"></i> ${dest.rating}</span>
                    <span><i class="fa-solid fa-tag"></i> From ${dest.price}</span>
                    <span><i class="fa-solid fa-sun"></i> ${dest.bestTime}</span>
                </div>
                <div class="dest-card-details">
                    <div class="dest-card-detail-grid">
                        <div class="dest-mini-detail"><strong>Climate</strong>${dest.climate}</div>
                        <div class="dest-mini-detail"><strong>Language</strong>${dest.language}</div>
                        <div class="dest-mini-detail"><strong>Currency</strong>${dest.currency}</div>
                        <div class="dest-mini-detail"><strong>Cuisine</strong>${dest.cuisine.split(',')[0]}</div>
                    </div>
                </div>
            </div>
        `;
        card.addEventListener('click', () => showDestinationPanel(dest));
        grid.appendChild(card);
    });
}


// =============================================
// PACKAGE DETAIL MODAL
// =============================================
function openPackageModal(packageType) {
    const pkg = PACKAGES[packageType];
    if (!pkg) return;

    const body = document.getElementById('packageModalBody');
    body.innerHTML = `
        <h2>${pkg.name} <span class="gradient-text">Package</span></h2>
        <p class="modal-subtitle">${pkg.tier} — Everything you need for an unforgettable journey</p>

        <div class="modal-section">
            <h3><i class="fa-solid fa-hotel"></i> Hotel — ${pkg.hotel.name}</h3>
            <div class="modal-img-carousel">
                <img src="images/hotel.png" alt="Hotel view 1">
                <img src="images/hotel.png" alt="Hotel view 2">
                <img src="images/hotel.png" alt="Hotel view 3">
            </div>
            <p style="color:var(--text-muted);font-size:0.85rem;margin-bottom:10px"><i class="fa-solid fa-star" style="color:var(--accent-4)"></i> ${pkg.hotel.rating} Rating</p>
            <div class="modal-amenities">
                ${pkg.hotel.amenities.map(a => `<span class="amenity-tag"><i class="fa-solid fa-check"></i> ${a}</span>`).join('')}
            </div>
        </div>

        <div class="modal-section">
            <h3><i class="fa-solid fa-car"></i> Transport & Vehicles</h3>
            <div class="vehicle-cards">
                ${pkg.vehicles.map(v => `
                    <div class="vehicle-card">
                        <div style="width:100%;height:80px;background:var(--glass-bg);border-radius:var(--radius-sm);display:flex;align-items:center;justify-content:center;margin-bottom:8px">
                            <i class="fa-solid ${v.icon}" style="font-size:2rem;color:var(--accent-3)"></i>
                        </div>
                        <div class="vehicle-name">${v.name}</div>
                        <div class="vehicle-desc">${v.desc}</div>
                    </div>
                `).join('')}
            </div>
        </div>

        <div class="modal-section">
            <h3><i class="fa-solid fa-calendar-days"></i> Itinerary</h3>
            <ul class="modal-itinerary">
                ${pkg.itinerary.map(item => `<li><strong>${item.split(':')[0]}:</strong>${item.split(':').slice(1).join(':')}</li>`).join('')}
            </ul>
        </div>

        <button class="btn-primary btn-glow btn-full" onclick="closePackageModal(); openBooking();">
            <i class="fa-solid fa-paper-plane"></i> Book This Package
        </button>
    `;

    document.getElementById('packageModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closePackageModal() {
    document.getElementById('packageModal').classList.remove('active');
    document.body.style.overflow = '';
}

// Moved to DOMContentLoaded init


// =============================================
// REVIEWS CAROUSEL
// =============================================
function renderReviews() {
    const carousel = document.getElementById('reviewsCarousel');
    const dots = document.getElementById('reviewsDots');
    carousel.innerHTML = '';
    dots.innerHTML = '';

    REVIEWS.forEach((review, i) => {
        const card = document.createElement('div');
        card.className = 'review-card glass-card';
        card.innerHTML = `
            <div class="review-top">
                <div class="review-avatar-lg">${review.avatar}</div>
                <div class="reviewer-info">
                    <h4>${review.name}</h4>
                    <p>Verified Traveler</p>
                </div>
            </div>
            <div class="review-stars-lg">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</div>
            <p class="review-body">${review.text}</p>
            <div class="review-destination">
                <i class="fa-solid fa-location-dot"></i> Traveled to ${review.dest}
            </div>
        `;
        carousel.appendChild(card);

        const dot = document.createElement('div');
        dot.className = `dot ${i === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => scrollToReview(i));
        dots.appendChild(dot);
    });

    // Auto-scroll
    let currentReview = 0;
    setInterval(() => {
        currentReview = (currentReview + 1) % REVIEWS.length;
        scrollToReview(currentReview);
    }, 5000);
}

function scrollToReview(index) {
    const carousel = document.getElementById('reviewsCarousel');
    const cards = carousel.querySelectorAll('.review-card');
    if (!cards[index]) return;
    const scrollLeft = cards[index].offsetLeft - carousel.offsetLeft - 30;
    carousel.scrollTo({ left: scrollLeft, behavior: 'smooth' });

    document.querySelectorAll('.reviews-dots .dot').forEach((d, i) => {
        d.classList.toggle('active', i === index);
    });
}


// =============================================
// BOOKING MODAL
// =============================================
function openBooking() {
    document.getElementById('bookingModal').classList.add('active');
    document.getElementById('bookingForm').style.display = '';
    document.getElementById('bookingSuccess').classList.add('hidden');
    document.body.style.overflow = 'hidden';
}

function closeBooking() {
    document.getElementById('bookingModal').classList.remove('active');
    document.body.style.overflow = '';
}

// NOTE: Form event listeners moved to DOMContentLoaded init block below


// =============================================
// CONFETTI
// =============================================
function launchConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#6b7c3f', '#8fa85a', '#c67a4a', '#c9a959', '#5a8f6a', '#a3b18a'];

    for (let i = 0; i < 150; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            w: Math.random() * 10 + 5,
            h: Math.random() * 6 + 3,
            color: colors[Math.floor(Math.random() * colors.length)],
            speed: Math.random() * 3 + 2,
            angle: Math.random() * Math.PI * 2,
            spin: (Math.random() - 0.5) * 0.2,
            drift: (Math.random() - 0.5) * 2
        });
    }

    let frame = 0;
    function animateConfetti() {
        if (frame > 180) { ctx.clearRect(0, 0, canvas.width, canvas.height); return; }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.y += p.speed;
            p.x += p.drift;
            p.angle += p.spin;
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.angle);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
            ctx.restore();
        });
        frame++;
        requestAnimationFrame(animateConfetti);
    }
    animateConfetti();
}


// =============================================
// NAVBAR (guarded — runs at top level but checks for elements)
// =============================================
// Throttled scroll handler to reduce main thread work
let scrollTicking = false;
window.addEventListener('scroll', () => {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(() => {
        const navbar = document.getElementById('navbar');
        if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);

        const sections = ['hero', 'destinations', 'packages', 'reviews', 'contact'];
        sections.forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const link = document.querySelector(`.nav-link[href="#${id}"]`);
            if (link) {
                link.classList.toggle('active', rect.top < 300 && rect.bottom > 300);
            }
        });
        scrollTicking = false;
    });
}, { passive: true });

// NOTE: Mobile menu toggle is bound inside DOMContentLoaded to avoid
// null reference errors when script loads before DOM is ready.


// =============================================
// SCROLL REVEAL ANIMATIONS (IntersectionObserver)
// Replaced GSAP ScrollTrigger — works reliably with file:// protocol
// =============================================
function initScrollAnimations() {
    // Inject reveal styles
    const style = document.createElement('style');
    style.textContent = `
        .scroll-reveal {
            opacity: 0;
            transform: translateY(40px);
            transition: opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                        transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .scroll-reveal.slide-left  { transform: translateX(-60px); }
        .scroll-reveal.slide-right { transform: translateX(60px);  }
        .scroll-reveal.scale-up    { transform: scale(0.9) translateY(60px); }
        .scroll-reveal.visible {
            opacity: 1 !important;
            transform: translateY(0) translateX(0) scale(1) !important;
        }
    `;
    document.head.appendChild(style);

    // Tag elements for reveal
    document.querySelectorAll('.section-header').forEach(el => el.classList.add('scroll-reveal'));
    document.querySelectorAll('.dest-card').forEach((el, i) => {
        el.classList.add('scroll-reveal');
        el.style.transitionDelay = `${i * 0.08}s`;
    });
    document.querySelectorAll('.package-card').forEach((el, i) => {
        el.classList.add('scroll-reveal', 'scale-up');
        el.style.transitionDelay = `${i * 0.12}s`;
    });
    document.querySelectorAll('.review-card').forEach((el, i) => {
        el.classList.add('scroll-reveal');
        el.style.transitionDelay = `${i * 0.1}s`;
    });
    const contactInfo = document.querySelector('.contact-info');
    const contactForm = document.querySelector('.contact-form-container');
    if (contactInfo) contactInfo.classList.add('scroll-reveal', 'slide-left');
    if (contactForm) contactForm.classList.add('scroll-reveal', 'slide-right');

    // IntersectionObserver — reveal when 15% visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));

    // Fallback: force everything visible after 4 seconds
    setTimeout(() => {
        document.querySelectorAll('.scroll-reveal').forEach(el => el.classList.add('visible'));
    }, 4000);
}


// =============================================
// STAT COUNTER ANIMATION
// =============================================
function animateStats() {
    document.querySelectorAll('.stat-number').forEach(stat => {
        const target = parseFloat(stat.dataset.count);
        const isDecimal = stat.dataset.decimal === 'true';
        const duration = 2000;
        const startTime = Date.now();

        function update() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = target * eased;

            if (isDecimal) {
                stat.textContent = current.toFixed(1);
            } else {
                stat.textContent = Math.floor(current).toLocaleString();
            }

            if (progress < 1) requestAnimationFrame(update);
        }
        update();
    });
}


// =============================================
// FLOATING PARTICLES (minimal for performance)
// =============================================
function createParticles() {
    if (isLowEnd) return;
    const count = isMobile ? 3 : 6;
    const colors = ['var(--accent-1)', 'var(--accent-2)', 'var(--accent-3)'];
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (15 + Math.random() * 15) + 's';
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particle.style.width = (2 + Math.random() * 4) + 'px';
        particle.style.height = particle.style.width;
        document.body.appendChild(particle);
    }
}


// =============================================
// CARD 3D TILT EFFECT
// =============================================
// Tilt effect removed for performance — was causing constant repaints on mousemove


// =============================================
// SCROLL PROGRESS BAR
// =============================================
function initScrollProgress() {
    const bar = document.createElement('div');
    bar.className = 'scroll-progress';
    bar.style.width = '0%';
    document.body.prepend(bar);

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        bar.style.width = progress + '%';
    }, { passive: true });
}


// =============================================
// MAGNETIC BUTTON EFFECT
// =============================================
function initMagneticButtons() {
    if (isMobile || isLowEnd) return;
    document.querySelectorAll('.btn-primary, .btn-glass').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translateY(-3px) translate(${x * 0.15}px, ${y * 0.15}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });
}


// =============================================
// INITIALIZE EVERYTHING
// =============================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('[WanderVista] DOMContentLoaded fired — initializing...');

    try {
        // Mobile menu toggle (moved here from top level to avoid null reference)
        const menuToggle = document.getElementById('menuToggle');
        if (menuToggle) {
            menuToggle.addEventListener('click', () => {
                document.getElementById('mobileMenu').classList.toggle('active');
            });
        }
        document.querySelectorAll('.mobile-nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                document.getElementById('mobileMenu').classList.remove('active');
            });
        });

        // Render dynamic content
        renderDestinations();
        console.log('[WanderVista] Destinations rendered');
        renderReviews();
        console.log('[WanderVista] Reviews rendered');
        createParticles();

        // Bind close panel button
        document.getElementById('closePanelBtn').addEventListener('click', () => {
            document.getElementById('destinationPanel').classList.remove('active');
            flyBack();
        });

        // Bind package detail buttons
        document.querySelectorAll('.package-detail-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                openPackageModal(btn.dataset.package);
            });
        });

        // Bind booking form
        document.getElementById('bookingForm').addEventListener('submit', (e) => {
            e.preventDefault();
            document.getElementById('bookingForm').style.display = 'none';
            document.getElementById('bookingSuccess').classList.remove('hidden');
            launchConfetti();
        });

        // Bind enquiry form
        document.getElementById('enquiryForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = e.target.querySelector('button[type="submit"]');
            btn.innerHTML = '<i class="fa-solid fa-check-circle"></i> Enquiry Sent!';
            btn.style.background = 'linear-gradient(135deg, #5a8f6a, #6b7c3f)';
            setTimeout(() => {
                btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Enquiry';
                btn.style.background = '';
                e.target.reset();
            }, 3000);
        });

        // Nav buttons
        document.getElementById('bookNowNav').addEventListener('click', openBooking);
        document.getElementById('exploreBtn').addEventListener('click', () => {
            document.getElementById('destinations').scrollIntoView({ behavior: 'smooth' });
        });

        // Initialize heavy operations (delayed for faster first paint)
        setTimeout(() => {
            // Skip globe on very tiny screens or low-end devices
            if (!isLowEnd && window.innerWidth > 360) {
                try {
                    initGlobe();
                    setupGlobeVisibilityObserver();
                    console.log('[WanderVista] Globe initialized');
                } catch (err) {
                    console.error('[WanderVista] Globe init error:', err);
                }
            } else {
                console.log('[WanderVista] Globe skipped (low-end/small device)');
            }

            try {
                initScrollAnimations();
            } catch (err) {
                console.error('[WanderVista] Scroll animations error:', err);
            }

            animateStats();
            initMagneticButtons();
            console.log(`[WanderVista] Init complete (mobile=${isMobile}, lowEnd=${isLowEnd})`);
        }, isMobile ? 100 : 300);

        // Scroll progress bar
        initScrollProgress();
    } catch (err) {
        console.error('[WanderVista] Init error:', err);
    }
});

// Make functions globally available
window.openBooking = openBooking;
window.closeBooking = closeBooking;
window.closePackageModal = closePackageModal;
