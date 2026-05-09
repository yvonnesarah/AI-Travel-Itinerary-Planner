let currentPlan = [];
let toastTimeout;

// =========================
// INIT
// =========================
document.addEventListener("DOMContentLoaded", () => {

  // Theme load
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
  }

  else {
    showToast("Welcome to AI Travel Planner ✈️", "info");
  }
});

// =========================
// TOAST 
// =========================
function showToast(msg, type = "success") {

  const toast = document.getElementById("toast");
  if (!toast) return;

  clearTimeout(toastTimeout);

  toast.innerText = msg;
  toast.className = "toast show";

  // reset & apply type
  toast.classList.remove("error", "info", "success");

  if (type) toast.classList.add(type);

  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

// =========================
// THEME
// =========================
function toggleTheme() {

  document.body.classList.toggle("dark");

  const theme = document.body.classList.contains("dark")
    ? "dark"
    : "light";

  localStorage.setItem("theme", theme);

  showToast(
    theme === "dark"
      ? "Dark mode enabled 🌙"
      : "Light mode enabled ☀️",
    "info"
  );
}
// =========================
// DATA
// =========================

const activities = {
  Adventure: [
    "Mountain Hiking Trail",
    "Sunrise Summit Climb",
    "Zipline Forest Adventure",
    "White Water Rafting",
    "Camping Under the Stars",
    "Rock Climbing Session",
    "Paragliding Experience",
    "Off-road Desert Safari",
    "Scuba Diving Reef Tour",
    "Snorkeling Lagoon Trip",
    "Bungee Jump Experience",
    "Kayaking River Tour",
    "ATV Quad Biking",
    "Cave Exploration Tour",
    "Glacier Trekking",
    "Skydiving Experience",
    "Jungle Night Safari",
    "Volcano Hiking Tour",
    "Sandboarding Dunes",
    "Ice Climbing Adventure"
  ],

  Relaxation: [
    "Luxury Spa Treatment",
    "Beach Sun Lounging",
    "Hot Spring Wellness Bath",
    "Yoga & Meditation Retreat",
    "Infinity Pool Relaxation",
    "Full Body Massage Session",
    "Aromatherapy Spa Experience",
    "Floating Salt Therapy",
    "Private Resort Chill Day",
    "Scenic Garden Walk",
    "Thermal Spa Experience",
    "Beachside Reading Day",
    "Oceanfront Hammock Rest",
    "Sauna & Steam Therapy",
    "Forest Sound Healing Session",
    "Wellness Detox Retreat",
    "Sunset Beach Meditation"
  ],

  Cultural: [
    "National Museum Tour",
    "Historic Castle Exploration",
    "Local Art Gallery Visit",
    "Traditional Dance Show",
    "Heritage Walking Tour",
    "Ancient Temple Visit",
    "Old Town Exploration",
    "Cultural Cooking Workshop",
    "Folk Music Performance",
    "Archaeological Site Visit",
    "Religious Landmark Tour",
    "Street Art Discovery Walk",
    "Local Market Exploration",
    "Historical Monument Tour",
    "UNESCO Heritage Site Visit",
    "Traditional Craft Workshop",
    "Cultural Village Experience"
  ],

  Romantic: [
    "Sunset Beach Walk",
    "Candlelight Fine Dining",
    "Private Yacht Cruise",
    "Couples Spa Day",
    "Scenic Rooftop Dinner",
    "Wine Vineyard Tasting",
    "Stargazing Desert Night",
    "Horse Carriage City Ride",
    "Helicopter Scenic Tour",
    "Private Picnic Experience",
    "Lake Side Dinner Setup",
    "Hot Air Balloon Ride",
    "Moonlit River Walk",
    "Luxury Couple Massage",
    "Private Island Escape Day",
    "Sunset Cliff View Dinner"
  ],

  "Food & Nightlife": [
    "Street Food Night Tour",
    "Rooftop Bar Hopping",
    "Night Market Exploration",
    "Local Cooking Class",
    "Wine & Cheese Tasting",
    "Live Jazz Bar Night",
    "Food Festival Experience",
    "Dessert Café Crawl",
    "Michelin Star Dining",
    "Craft Beer Tasting Tour",
    "Night Club Experience",
    "Karaoke Night Out",
    "Sushi Making Workshop",
    "Hidden Local Food Spots Tour",
    "Authentic Street BBQ Crawl",
    "Cocktail Mixology Class",
    "Seafood Night Feast Tour",
    "Late Night Diner Run"
  ]
};

const hotels = {
  Budget: [
    "City Hostel",
    "Backpacker Lodge",
    "Budget Inn",
    "Urban Capsule Hotel",
    "EasyStay Hostel",
    "Nomad Pod Stay",
    "Smart Sleep Inn",
    "Downtown Budget Rooms",
    "Cozy Backpackers Hub",
    "Metro Hostel Central"
  ],

  "Mid-Range": [
    "City Plaza Hotel",
    "Comfort Suites",
    "Grand Horizon Hotel",
    "Urban Boutique Hotel",
    "Harbour View Hotel",
    "Central Stay Hotel",
    "Parkside Inn",
    "Elite Comfort Hotel",
    "Metro Grand Hotel",
    "Riverside Business Hotel"
  ],

  Luxury: [
    "Royal Palace Hotel",
    "Elite Resort & Spa",
    "Grand Imperial Hotel",
    "Skyline Luxury Suites",
    "Oceanfront Palace Resort",
    "The Grand Regent",
    "Diamond Bay Resort",
    "Presidential Luxury Hotel",
    "Aurora Grand Hotel",
    "Golden Crown Palace"
  ]
};

const foods = [
  "Local Street Food Tour",
  "Traditional Home-Style Cuisine",
  "Fine Dining Experience",
  "Hidden Local Restaurant Discovery",
  "Night Market Food Crawl",
  "Seafood Feast by the Coast",
  "Authentic Regional Dish Tasting",
  "Food Truck Street Sampling",
  "Michelin Star Dining Experience",
  "Dessert Café Hopping",
  "Buffet Cultural Feast",
  "Vegetarian Local Specialties Tour",
  "Spice Market Food Walk",
  "Farm-to-Table Dining Experience",
  "Local Bakery & Pastry Crawl",
  "Late Night Snack Run",
  "Chef’s Special Tasting Menu"
];

const transport = [
  "Metro / Subway System",
  "Public Bus Network",
  "Ride-sharing (Uber/Bolt/Lyft)",
  "Traditional Taxi Service",
  "Walking Friendly City Routes",
  "Bike Rental Exploration",
  "Scooter Rental Travel",
  "Tram / Light Rail System",
  "Ferry Boat Transfer",
  "Private Chauffeur Service",
  "Airport Express Train",
  "Hop-on Hop-off Tourist Bus",
  "Rental Car Road Trip",
  "Cable Car Scenic Ride",
  "Boat Taxi Experience"
];


/* =========================
   WEATHER SYSTEM (SIMULATED DAILY)
========================= */

const weatherTypes = [
  "Sunny ☀️",
  "Cloudy ☁️",
  "Rainy 🌧️",
  "Windy 🌬️",
  "Partly Cloudy ⛅"
];

/* =========================
   WEATHER TIP ENGINE
========================= */

function getWeatherTip(weather) {

  if (weather.includes("Rain")) {
    return "Carry umbrella ☔ & focus on indoor attractions";
  }

  if (weather.includes("Sunny")) {
    return "Perfect for outdoor activities 🌞 Use sunscreen";
  }

  if (weather.includes("Wind")) {
    return "Avoid high altitude or boat activities 🌬️";
  }

  if (weather.includes("Cloud")) {
    return "Good sightseeing weather 🚶 Comfortable for walking";
  }

  return "Check conditions before heading out";
}


function getPackingList(weather) {

  let items = [];

  if (weather.includes("Rain")) {
    items.push("☔ Umbrella");
    items.push("🧥 Waterproof jacket");
    items.push("👟 Waterproof shoes");
  }

  if (weather.includes("Sunny")) {
    items.push("🧴 Sunscreen");
    items.push("🕶 Sunglasses");
    items.push("🧢 Hat / Cap");
  }

  if (weather.includes("Wind")) {
    items.push("🧥 Light jacket");
  }

  if (weather.includes("Cloud")) {
    items.push("👕 Comfortable clothing");
  }

  // always included essentials
  items.push("📱 Phone charger");
  items.push("🪪 ID / Passport");
  items.push("💳 Wallet");

  return items;
}

/* =========================
   WEATHER
========================= */

async function fetchWeather(destination){

    document.getElementById("weatherBox").innerHTML =
  "<div class='activity'>🌍 Loading weather...</div>";

  try{

    const apiKey =
      "81c0d22b83ccbe180ccf4acf19f7d978";

    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${destination}&appid=${apiKey}&units=metric`
    );

   const data = await res.json();

if (!data.main) {
  throw new Error("Invalid weather response");
}

    document.getElementById("weatherBox").innerHTML = `

      <div class="day-card">

        <h3>🌍 Current Weather in ${data.name}</h3>

        <div class="activity">🌡 Temp: ${data.main.temp}°C</div>
        <div class="activity">🤔 Feels: ${data.main.feels_like}°C</div>
        <div class="activity">☁️ ${data.weather[0].description}</div>
        <div class="activity">💧 Humidity: ${data.main.humidity}%</div>
        <div class="activity">🌬 Wind: ${data.wind.speed} m/s</div>
        <div class="activity">🔵 Pressure: ${data.main.pressure} hPa</div>
        <div class="activity">👀 Visibility: ${data.visibility / 1000} km</div>

      </div>

    `;

} catch (err) {
  console.error(err);
  showToast("Weather unavailable ❌", "error");
  }
}

/* =========================
   FAVORITES
========================= */

function saveFavorite(activity){

  let favs = JSON.parse(localStorage.getItem("favorites")) || [];

  favs.push(activity);

  localStorage.setItem("favorites", JSON.stringify(favs));

  showToast("Added to favourites ❤️");
}

/* =========================
   COLLAPSE
========================= */

function toggleDay(id){

  document
    .getElementById(id)
    .classList.toggle("hidden");
}

/* =========================
   GENERATE ITINERARY
========================= */

function generateItinerary() {

const destination = document.getElementById("destination").value;
const days = parseInt(document.getElementById("days").value);
const budget = document.getElementById("budget").value;
const style = document.getElementById("style").value;
const travelers = document.getElementById("travelers").value;
const startDate = document.getElementById("startDate").value;

fetchWeather(destination); 

  if (!destination || !days) {
    showToast("Fill all fields", "error");
    return;
  }

  const pick = arr =>
    arr[Math.floor(Math.random() * arr.length)];

  // PRICE PER DAY
  let baseCost =
    budget === "Budget" ? 80 :
    budget === "Mid-Range" ? 180 : 400;

  let totalCost = baseCost * days;

  document.getElementById("tripSummary").innerHTML = `

    <div class="stats-grid">

      <div class="stat-card">
        <h3>${days}</h3>
        <p>Days</p>
      </div>

      <div class="stat-card">
        <h3>${travelers}</h3>
        <p>Travelers</p>
      </div>

      <div class="stat-card">
        <h3>£${totalCost}</h3>
        <p>Total Trip Cost</p>
      </div>

    </div>

    <div class="day-card">
      <h2>${destination}</h2>
      <p>${style} travel plan</p>
    </div>

  `;

  const itinerary = document.getElementById("itinerary");

  itinerary.innerHTML = "";
  currentPlan = [];

  for (let i = 1; i <= days; i++) {

    const baseDate = startDate ? new Date(startDate) : new Date();
    const date = new Date(baseDate);
    date.setDate(baseDate.getDate() + i - 1);

    // 🌤 WEATHER + TIP
    const weather = weatherTypes[i % weatherTypes.length];
    const tip = getWeatherTip(weather);

    const dayCost = baseCost; // 💰 DAILY PRICE

    const day = {
      day: i,
      date: date.toDateString(),
      weather: weather,
      tip: tip,
      cost: dayCost,
      packing: getPackingList(weather), 
      hotel: pick(hotels[budget]),
      schedule: {
        morning: pick(activities[style]),
        midday: pick(foods),
        afternoon: pick(activities[style]),
        evening: pick(transport)
      }
    };

    currentPlan.push(day);

    itinerary.innerHTML += `

      <div class="day-card">

        <div class="day-header"
          onclick="toggleDay('d${i}')">

          <div>
            <h3>Day ${i}</h3>
            <small>${day.date}</small>
          </div>

          <i class="fa-solid fa-chevron-down"></i>

        </div>

        <div class="day-content" id="d${i}">

        <div class="activity">🎒 Packing List:</div>

        <ul class="packing-list">
        ${day.packing.map(item => `<li>${item}</li>`).join("")}
         </ul>

          <div class="activity">🌤 Weather: ${day.weather}</div>

          <div class="activity">💡 Tip: ${day.tip}</div>

          <div class="activity">Day Cost: £${day.cost}</div>

           <div class="activity">🌅 ${day.schedule.morning}</div>
           <div class="activity">🍽️ ${day.schedule.midday}</div>
           <div class="activity">☀️ ${day.schedule.afternoon}</div>
           <div class="activity">🌙 ${day.schedule.evening}</div>

          <div class="activity">🏨 ${day.hotel}</div>

        <!-- ⭐ Favourite moved to end -->
       <div class="activity">
  ❤️ Favourite this day
  <button class="favorite-btn"
    onclick="saveFavorite('Day ${i} - ${day.schedule.morning}')">
    ❤️
  </button>
</div>

      </div>

    `;
  }

  showToast("Trip generated ✨");
}

/* =========================
   EXPORT JSON
========================= */

function exportJSON(){

  if(currentPlan.length === 0){
    showToast("No trip to export ❌", "error");
    return;
  }

  const blob = new Blob(
    [JSON.stringify(currentPlan,null,2)],
    { type:"application/json" }
  );

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = "travel-plan.json";

  a.click();

  showToast("JSON exported 📄");
}

/* =========================
   PDF
========================= */

function downloadPlan(){

  if(currentPlan.length === 0){
    showToast("Generate a trip first ❌", "error");
    return;
  }

  showToast("Generating PDF ⏳", "info");

  html2pdf()
    .from(document.querySelector(".result-section"))
    .save("travel-plan.pdf")
    .then(() => {
      showToast("PDF downloaded 📥");
    });
}

function renderSavedPlan() {
  if (!currentPlan.length) return;

  const itinerary = document.getElementById("itinerary");
  itinerary.innerHTML = "";

  currentPlan.forEach((day, i) => {
    itinerary.innerHTML += `
      <div class="day-card">
        <div class="day-header" onclick="toggleDay('saved${i}')">
          <div>
            <h3>Day ${day.day}</h3>
            <small>${day.date}</small>
          </div>
          <i class="fa-solid fa-chevron-down"></i>
        </div>

        <div class="day-content" id="saved${i}">
          <div class="activity">🌤 Weather: ${day.weather}</div>
          <div class="activity">💡 Tip: ${day.tip}</div>
          <div class="activity">🏨 ${day.hotel}</div>
        </div>
      </div>
    `;
  });
}