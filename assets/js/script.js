let budgetChart;
let currentPlan = [];
let toastTimeout;
let compareChart;

// =========================
// INIT
// =========================
document.addEventListener("DOMContentLoaded", () => {

  // =========================
  // THEME RESTORE
  // =========================
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
  }

  renderFavoriteTrips();
  renderSavedTripsHistory();
  populateCompareDropdowns();

  // =========================
  // 🚫 HARD RESET ACTIVE STATE
  // =========================
  currentPlan = [];

  const itinerary = document.getElementById("itinerary");
  const summary = document.getElementById("tripSummary");
  const weather = document.getElementById("weatherBox");
  const countdown = document.getElementById("countdown");

  if (itinerary) itinerary.innerHTML = "";
  if (summary) summary.innerHTML = "";
  if (weather) weather.innerHTML = "";
  if (countdown) countdown.innerHTML = "";

  // =========================
  // ONLY SHOW MESSAGE (NO AUTO LOAD)
  // =========================
  const hasGeneratedTrip =
    localStorage.getItem("hasGeneratedTrip");

  if (!hasGeneratedTrip) {
    showToast("Start by generating a trip ✈️", "info");
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
  toast.classList.add("show");

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

function formatCurrency(amount){

  const currencyEl = document.getElementById("currency");
  const currency = currencyEl ? currencyEl.value : "GBP";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency
  }).format(amount);
}

function loadMap(destination){
  document.getElementById("map").innerHTML = `
    <iframe
      width="100%"
      height="350"
      frameborder="0"
      src="https://www.google.com/maps?q=${encodeURIComponent(destination)}&output=embed">
    </iframe>
  `;
}

/* =========================
   TRIP COMPARISON MODE
========================= */

function openCompareMode(){

  populateCompareDropdowns();

  document
    .getElementById("comparisonResults")
    .scrollIntoView({
      behavior:"smooth"
    });

  showToast(
    "Comparison mode ready ❤️"
  );
}

/* =========================
   POPULATE DROPDOWNS
========================= */

function populateCompareDropdowns(){

  const savedTrips =
    JSON.parse(
      localStorage.getItem("savedTrips")
    ) || [];

  const select1 =
    document.getElementById(
      "compareTrip1"
    );

  const select2 =
    document.getElementById(
      "compareTrip2"
    );

  if(!select1 || !select2) return;

  select1.innerHTML =
    `<option value="">Select Trip 1</option>`;

  select2.innerHTML =
    `<option value="">Select Trip 2</option>`;

  savedTrips.forEach(trip => {

    const option = `

      <option value="${trip.id}">

        ${trip.destination}
        (${trip.plan?.length || 0} days)

      </option>

    `;

    select1.innerHTML += option;
    select2.innerHTML += option;
  });
}

/* =========================
   COMPARE
========================= */

function compareTrips(){

  const trip1Id =
    document.getElementById(
      "compareTrip1"
    ).value;

  const trip2Id =
    document.getElementById(
      "compareTrip2"
    ).value;

  if(!trip1Id || !trip2Id){

    showToast(
      "Select two trips ❌",
      "error"
    );

    return;
  }

  if(trip1Id === trip2Id){

    showToast(
      "Choose different trips ⚠️",
      "error"
    );

    return;
  }

  const savedTrips =
    JSON.parse(
      localStorage.getItem("savedTrips")
    ) || [];

  const trip1 =
    savedTrips.find(
      t => t.id == trip1Id
    );

  const trip2 =
    savedTrips.find(
      t => t.id == trip2Id
    );

  if(!trip1 || !trip2){

    showToast(
      "Trips not found ❌",
      "error"
    );

    return;
  }

  renderComparison(
    trip1,
    trip2
  );
}

/* =========================
   RENDER COMPARISON
========================= */

function renderComparison(
  trip1,
  trip2
){

  const results =
    document.getElementById(
      "comparisonResults"
    );

  const cost1 =
    calculateTripCost(trip1);

  const cost2 =
    calculateTripCost(trip2);

  const cheaperTrip =
    cost1 < cost2
      ? trip1.destination
      : trip2.destination;

  const winner =
    cost1 < cost2
      ? "trip1"
      : "trip2";

  results.innerHTML = `

    <div class="comparison-grid">

      <!-- =========================
           TRIP 1
      ========================== -->

      <div class="
        compare-card
        ${winner === "trip1"
          ? "compare-winner"
          : ""}
      ">

        <div class="compare-header">

          <div>

            <div class="compare-title">
              ✈️ ${trip1.destination}
            </div>

            <small>
              ${trip1.plan?.length || 0}
              Days
            </small>

          </div>

        </div>

        <div class="compare-stat">
          💰 Cost:
          ${formatCurrency(cost1)}
        </div>

        <div class="compare-stat">
          🏨 Hotel:
          ${trip1.plan?.[0]?.hotel || "N/A"}
        </div>

        <div class="compare-stat">
          🌤 Weather:
          ${trip1.plan?.[0]?.weather || "N/A"}
        </div>

        <div class="compare-stat">
          🎯 Style:
          ${detectTripStyle(trip1)}
        </div>

        <div class="compare-stat">
          📅 Trip Length:
          ${trip1.plan?.length || 0} days
        </div>

        <h3 style="margin-top:20px;">
          📍 Top Highlights
        </h3>

        ${trip1.plan.slice(0,3).map(day => `

          <div class="compare-day">

            <strong>
              Day ${day.day}
            </strong>

            <p>
              ${day.schedule?.morning || ""}
            </p>

            <small>
              ${day.schedule?.afternoon || ""}
            </small>

          </div>

        `).join("")}

      </div>

      <!-- =========================
           TRIP 2
      ========================== -->

      <div class="
        compare-card
        ${winner === "trip2"
          ? "compare-winner"
          : ""}
      ">

        <div class="compare-header">

          <div>

            <div class="compare-title">
              ✈️ ${trip2.destination}
            </div>

            <small>
              ${trip2.plan?.length || 0}
              Days
            </small>

          </div>

        </div>

        <div class="compare-stat">
          💰 Cost:
          ${formatCurrency(cost2)}
        </div>

        <div class="compare-stat">
          🏨 Hotel:
          ${trip2.plan?.[0]?.hotel || "N/A"}
        </div>

        <div class="compare-stat">
          🌤 Weather:
          ${trip2.plan?.[0]?.weather || "N/A"}
        </div>

        <div class="compare-stat">
          🎯 Style:
          ${detectTripStyle(trip2)}
        </div>

        <div class="compare-stat">
          📅 Trip Length:
          ${trip2.plan?.length || 0} days
        </div>

        <h3 style="margin-top:20px;">
          📍 Top Highlights
        </h3>

        ${trip2.plan.slice(0,3).map(day => `

          <div class="compare-day">

            <strong>
              Day ${day.day}
            </strong>

            <p>
              ${day.schedule?.morning || ""}
            </p>

            <small>
              ${day.schedule?.afternoon || ""}
            </small>

          </div>

        `).join("")}

      </div>

    </div>

    <div class="compare-summary">

      <h3>
        ❤️ AI Comparison Summary
      </h3>

      <p>

        ${cheaperTrip}
        offers the best overall value
        based on total estimated cost,
        itinerary quality,
        and included activities ✨

      </p>

    </div>

  `;

  showToast(
    "Trips compared ❤️"
  );
}

/* =========================
   COST CALCULATOR
========================= */

function calculateTripCost(trip){

  if(!trip.plan) return 0;

  return trip.plan.reduce(
    (total, day) =>
      total + (day.cost || 0),
    0
  );
}

/* =========================
   STYLE DETECTOR
========================= */

function detectTripStyle(trip){

  if(!trip.plan?.length)
    return "Mixed";

  const text = JSON.stringify(
    trip.plan
  ).toLowerCase();

  if(
    text.includes("disney") ||
    text.includes("theme park")
  ){
    return "Theme Park";
  }

  if(
    text.includes("spa") ||
    text.includes("beach")
  ){
    return "Relaxation";
  }

  if(
    text.includes("museum") ||
    text.includes("castle")
  ){
    return "Cultural";
  }

  if(
    text.includes("hiking") ||
    text.includes("rafting")
  ){
    return "Adventure";
  }

  if(
    text.includes("food") ||
    text.includes("bar")
  ){
    return "Food & Nightlife";
  }

  return "Mixed Experience";
}

function calculateTripCost(trip){

  if(!trip.plan) return 0;

  return trip.plan.reduce(
    (total, day) =>
      total + (day.cost || 0),
    0
  );
}

function detectTripStyle(trip){

  if(!trip.plan?.length)
    return "Unknown";

  const morning =
    trip.plan[0]
      ?.schedule
      ?.morning || "";

  if(morning.includes("Disney") ||
     morning.includes("Theme")){
    return "Theme Park";
  }

  if(morning.includes("Spa") ||
     morning.includes("Beach")){
    return "Relaxation";
  }

  if(morning.includes("Museum") ||
     morning.includes("Castle")){
    return "Cultural";
  }

  if(morning.includes("Hiking") ||
     morning.includes("Rafting")){
    return "Adventure";
  }

  return "Mixed Experience";
}


function startCountdown(startDate){

  if(!startDate) return;

  const countdown =
    document.getElementById("countdown");

  const interval = setInterval(()=>{

    const tripDate =
      new Date(startDate);

    const now =
      new Date();

    const diff =
      tripDate - now;

    if(diff <= 0){

      countdown.innerHTML =
        "✈️ Trip Started!";

      clearInterval(interval);

      return;
    }

    const days =
      Math.floor(
        diff /
        (1000*60*60*24)
      );

    countdown.innerHTML =
      `⏳ ${days} days until your trip`;

  },1000);
}

function renderBudgetChart(total) {

  const ctx = document.getElementById("budgetChart");
  if (!ctx) return;

  if (budgetChart) budgetChart.destroy();

  const data = {
    labels: ["Hotels", "Food", "Activities", "Transport"],
    datasets: [{
      label: "Trip Budget Breakdown",
      data: [
        total * 0.4,
        total * 0.2,
        total * 0.25,
        total * 0.15
      ],
      borderWidth: 1
    }]
  };

  budgetChart = new Chart(ctx, {
    type: "doughnut",
    data,

    options: {
      responsive: true,
      maintainAspectRatio: false,

      plugins: {
        legend: {
          position: "bottom"
        },

        tooltip: {
          callbacks: {
            label: function (context) {
              const value = context.raw;
              const percent = ((value / total) * 100).toFixed(1);
              return `${context.label}: ${formatCurrency(value)} (${percent}%)`;
            }
          }
        }
      },

      cutout: "65%"
    }
  });
}

function getAISuggestion(style, weather){

  if(weather.includes("Rain")){
    return "Visit indoor rides and covered attractions today ☔";
  }

  if(style === "Adventure"){
    return "Perfect weather for outdoor exploration 🏔";
  }

  if(style === "Romantic"){
    return "Book a sunset dinner tonight 🌅";
  }

  if(style === "Theme Park"){
    return "Arrive early for shorter ride queues 🎢";
  }

  if(style === "Food & Nightlife"){
    return "Try local street food and rooftop dining tonight 🍜";
  }

  return "Explore local attractions nearby ✨";
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
  ],

  "Theme Park": [
    "Disneyland Adventure Day",
    "Universal Studios Experience",
    "Roller Coaster Marathon",
    "Water Park Splash Day",
    "Fantasy Castle Tour",
    "Theme Park Night Parade",
    "4D Cinema Experience",
    "Character Meet & Greet",
    "Extreme Thrill Ride Session",
    "Family Fun Carnival",
    "Theme Park Food Festival",
    "Virtual Reality Ride Experience",
    "Fireworks Spectacular Show",
    "Haunted House Adventure",
    "Aquatic Theme Park Visit",
    "Safari Theme Park Journey",
    "Arcade & Gaming Zone",
    "Magic Kingdom Exploration",
    "Adventure Island Ride Tour",
    "Theme Park VIP Experience"
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

function getPackingList(weather, style) {

  let items = [];

  const w = weather.toLowerCase();

  // =========================
  // WEATHER-BASED ITEMS
  // =========================

  if (w.includes("rain")) {
    items.push("☔ Umbrella");
    items.push("🧥 Waterproof jacket");
    items.push("👟 Waterproof shoes");
    items.push("🛍 Dry bag / waterproof pouch");
  }

  if (w.includes("sunny") || w.includes("clear")) {
    items.push("🧴 Sunscreen");
    items.push("🕶 Sunglasses");
    items.push("🧢 Hat / Cap");
    items.push("💧 Water bottle");
  }

  if (w.includes("wind")) {
    items.push("🧥 Windproof jacket");
    items.push("🧣 Light scarf");
  }

  if (w.includes("cloud")) {
    items.push("👕 Light layered clothing");
  }

  if (w.includes("cold") || w.includes("snow")) {
    items.push("🧥 Warm coat");
    items.push("🧤 Gloves");
    items.push("🧣 Scarf");
    items.push("🧢 Beanie");
    items.push("🥾 Warm boots");
  }

  if (w.includes("hot")) {
    items.push("👕 Breathable clothing");
    items.push("🧴 Sunscreen (high SPF)");
    items.push("💧 Electrolyte tablets");
  }

  // =========================
// THEME PARK ITEMS
// =========================

if(style === "Theme Park"){
  items.push("🎟 Theme park tickets");
  items.push("🔋 Portable phone charger");
  items.push("👟 Comfortable walking shoes");
  items.push("🧢 Sun hat");
  items.push("💦 Water bottle");
  items.push("🎢 Fast-pass / ride pass");
}

  // =========================
  // ALWAYS INCLUDED ESSENTIALS
  // =========================

  items.push("📱 Phone + charger");
  items.push("🔋 Power bank");
  items.push("🪪 Passport / ID");
  items.push("💳 Wallet / cards");
  items.push("💊 Basic medication");
  items.push("🧻 Toiletries kit");
  items.push("🔌 Travel adapter");

  // remove duplicates (important for cleanliness)
  return [...new Set(items)];
}

/* =========================
   REAL WEATHER FORECAST SYSTEM
========================= */


async function fetchWeather(destination) {

  const weatherBox =
    document.getElementById("weatherBox");

  weatherBox.innerHTML = `
    <div class="activity">
      🌍 Loading advanced forecast...
    </div>
  `;

  try {

    const apiKey =
      "81c0d22b83ccbe180ccf4acf19f7d978";

    // =========================
    // CURRENT WEATHER
    // =========================
    const currentRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${destination}&appid=${apiKey}&units=metric`
    );

    const currentData =
      await currentRes.json();

    // =========================
    // FORECAST WEATHER
    // =========================
    const forecastRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${destination}&appid=${apiKey}&units=metric`
    );

    const forecastData =
      await forecastRes.json();

    if (!forecastData.list) {
      throw new Error("Forecast unavailable");
    }

    // =========================
    // GROUP DAYS
    // =========================
    const groupedDays = {};

    forecastData.list.forEach(item => {

      const date =
        item.dt_txt.split(" ")[0];

      if (!groupedDays[date]) {
        groupedDays[date] = [];
      }

      groupedDays[date].push(item);
    });

    const days =
      Object.keys(groupedDays).slice(0, 5);

    // =========================
    // MAIN WEATHER CARD
    // =========================
    weatherBox.innerHTML = `

      <div class="forecast-main-card">

        <div class="forecast-main-top">

          <div>

            <h2>
              🌍 ${currentData.name}
            </h2>

            <p class="weather-condition">
              ${currentData.weather[0].description}
            </p>

          </div>

          <div class="forecast-main-icon">

            <img
              src="https://openweathermap.org/img/wn/${currentData.weather[0].icon}@2x.png"
            >

            <h1>
              ${Math.round(currentData.main.temp)}°C
            </h1>

          </div>

        </div>

        <div class="forecast-stats">

          <div class="activity">
            🌡 Current:
            ${Math.round(currentData.main.temp)}°C
          </div>

          <div class="activity">
            🤔 Feels Like:
            ${Math.round(currentData.main.feels_like)}°C
          </div>

          <div class="activity">
            💧 Humidity:
            ${currentData.main.humidity}%
          </div>

          <div class="activity">
            🔵 Pressure:
            ${currentData.main.pressure} hPa
          </div>

          <div class="activity">
            🌬 Wind Speed:
            ${currentData.wind.speed} m/s
          </div>

          <div class="activity">
            🧭 Wind Direction:
            ${getWindDirection(currentData.wind.deg)}
          </div>

          <div class="activity">
            👀 Visibility:
            ${(currentData.visibility / 1000).toFixed(1)} km
          </div>

          <div class="activity">
            ☁️ Cloudiness:
            ${currentData.clouds.all}%
          </div>

          <div class="activity">
            🌅 Sunrise:
            ${formatTime(currentData.sys.sunrise)}
          </div>

          <div class="activity">
            🌇 Sunset:
            ${formatTime(currentData.sys.sunset)}
          </div>

        </div>

        <div class="activity">
          💡 ${getSmartWeatherAdvice(currentData)}
        </div>

      </div>

      <h2 class="section-title">
        📅 5-Day Forecast
      </h2>

    `;

    // =========================
    // DAILY FORECAST
    // =========================
    days.forEach((day, index) => {

      const entries =
        groupedDays[day];

      const midday =
        entries[Math.floor(entries.length / 2)];

      const icon =
        midday.weather[0].icon;

      const condition =
        midday.weather[0].description;

      const temp =
        Math.round(midday.main.temp);

      const min =
        Math.round(
          Math.min(...entries.map(
            e => e.main.temp_min
          ))
        );

      const max =
        Math.round(
          Math.max(...entries.map(
            e => e.main.temp_max
          ))
        );

      weatherBox.innerHTML += `

        <div class="forecast-card">

          <div class="forecast-top">

            <div>

              <h3>
                ${new Date(day).toDateString()}
              </h3>

              <p class="weather-condition">
                ${condition}
              </p>

            </div>

            <div class="forecast-icon">

              <img
                src="https://openweathermap.org/img/wn/${icon}@2x.png"
              >

              <h2>${temp}°C</h2>

            </div>

          </div>

          <div class="forecast-stats">

            <div class="activity">
              🌡 Current:
              ${temp}°C
            </div>

            <div class="activity">
              🤔 Feels Like:
              ${Math.round(midday.main.feels_like)}°C
            </div>

            <div class="activity">
              📈 Max:
              ${max}°C
            </div>

            <div class="activity">
              📉 Min:
              ${min}°C
            </div>

            <div class="activity">
              💧 Humidity:
              ${midday.main.humidity}%
            </div>

            <div class="activity">
              🌬 Wind Speed:
              ${midday.wind.speed} m/s
            </div>

            <div class="activity">
              🧭 Wind Direction:
              ${getWindDirection(midday.wind.deg)}
            </div>

            <div class="activity">
              ☁️ Cloudiness:
              ${midday.clouds.all}%
            </div>

            <div class="activity">
              🔵 Pressure:
              ${midday.main.pressure} hPa
            </div>

            <div class="activity">
              👀 Visibility:
              ${(midday.visibility / 1000).toFixed(1)} km
            </div>

            <div class="activity">
              🌧 Rain Chance:
              ${Math.round((midday.pop || 0) * 100)}%
            </div>

            <div class="activity">
              ☀️ UV Advice:
              ${
                temp > 28
                  ? "High UV — sunscreen recommended"
                  : "Moderate conditions"
              }
            </div>

          </div>

          <button
            class="btn secondary-btn"
            onclick="toggleHourly('hourly-${index}')">

            ⏰ Hourly Breakdown

          </button>

          <div
            class="hourly-container hidden"
            id="hourly-${index}">

            ${entries.map(hour => `

              <div class="hour-card">

                <p class="hour-time">
                  ${hour.dt_txt
                    .split(" ")[1]
                    .slice(0,5)}
                </p>

                <img
                  src="https://openweathermap.org/img/wn/${hour.weather[0].icon}.png"
                >

                <p class="hour-temp">
                  ${Math.round(hour.main.temp)}°C
                </p>

                <small>
                  Feels:
                  ${Math.round(hour.main.feels_like)}°C
                </small>

                <small>
                  💧 ${hour.main.humidity}%
                </small>

                <small>
                  🌧 ${Math.round((hour.pop || 0) * 100)}%
                </small>

              </div>

            `).join("")}

          </div>

        </div>
      `;
    });

  } catch (err) {

    console.error(err);

    showToast(
      "Weather unavailable ❌",
      "error"
    );

    weatherBox.innerHTML = `
      <div class="activity">
        ❌ Forecast unavailable
      </div>
    `;
  }
}

function formatTime(unix) {
  const date = new Date(unix * 1000);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function getWindDirection(deg) {
  const directions = [
    "N", "NE", "E", "SE",
    "S", "SW", "W", "NW"
  ];

  return directions[Math.round(deg / 45) % 8];
}

function getSmartWeatherAdvice(data) {

  const temp = data.main.temp;
  const weather = data.weather[0].main.toLowerCase();

  if (weather.includes("rain")) {
    return "Rain expected ☔ → indoor attractions & museum visits recommended";
  }

  if (temp > 30) {
    return "Very hot 🔥 → stay hydrated, plan indoor midday breaks";
  }

  if (temp < 5) {
    return "Very cold ❄️ → warm clothing required, limit outdoor exposure";
  }

  if (weather.includes("cloud")) {
    return "Mild cloudy weather ☁️ → perfect for sightseeing walks";
  }

  if (weather.includes("clear")) {
    return "Clear skies ☀️ → best time for outdoor activities & photography";
  }

  return "Good travel conditions 👍 enjoy your day!";
}

/* =========================
   FAVORITE TRIPS SYSTEM
========================= */
function saveFavoriteTrip() {

  // =========================
  // VALIDATION: no trip
  // =========================
  if (!currentPlan || currentPlan.length === 0) {
    showToast("Generate a trip first ❌", "error");
    return;
  }

  const destination =
    document.getElementById("destination").value;

  const days =
    document.getElementById("days").value;

  const budget =
    document.getElementById("budget").value;

  const style =
    document.getElementById("style").value;

  // =========================
  // VALIDATION: incomplete form
  // =========================
  if (!destination || !days || !budget || !style) {
    showToast("Fill trip details before favouriting ⚠️", "error");
    return;
  }

  let favoriteTrips =
    JSON.parse(localStorage.getItem("favoriteTrips")) || [];

  // =========================
  // DUPLICATE CHECK
  // =========================
  const exists = favoriteTrips.some(trip =>
    trip.destination === destination &&
    trip.plan?.length === currentPlan.length
  );

  if (exists) {
    showToast("Already in favourites ❤️", "info");
    return;
  }

  // =========================
  // SAVE
  // =========================
  const favoriteTrip = {
    id: Date.now(),
    destination,
    days,
    budget,
    style,
    createdAt: new Date().toISOString(),
    plan: structuredClone(currentPlan)
  };

  favoriteTrips.push(favoriteTrip);

  localStorage.setItem(
    "favoriteTrips",
    JSON.stringify(favoriteTrips)
  );

  renderFavoriteTrips();

  showToast("Added to favourites ❤️", "success");
}

/* =========================
   RENDER FAVOURITES
========================= */

function renderFavoriteTrips(){

  const container =
    document.getElementById(
      "favoriteTripsList"
    );

  if(!container) return;

  let favoriteTrips =
    JSON.parse(
      localStorage.getItem("favoriteTrips")
    ) || [];

  if(!favoriteTrips.length){

    container.innerHTML = `

      <div class="activity">
        No favourite trips yet ❤️
      </div>

    `;

    return;
  }

  container.innerHTML = "";

  favoriteTrips.forEach(trip => {

    container.innerHTML += `

      <div class="favorite-trip-card">

        <div class="favorite-trip-title">
          ✈️ ${trip.destination}
        </div>

        <div class="favorite-trip-meta">
          ${trip.days} Days
        </div>

        <div class="favorite-trip-meta">
          ${trip.style}
        </div>

        <div class="favorite-trip-meta">
          ${trip.budget}
        </div>

        <div class="favorite-trip-meta">
          Saved: ${trip.createdAt}
        </div>

      <div class="favorite-trip-actions">

  <button
    class="btn primary-btn"
    onclick="loadFavoriteTrip(${trip.id})">
    📂 Load
  </button>

  <button
    class="btn secondary-btn"
    onclick="deleteFavoriteTrip(${trip.id})">
    🗑 Delete
  </button>

</div>

      </div>

    `;
  });
}

/* =========================
   DELETE FAVOURITE
========================= */

function deleteFavoriteTrip(id){

  let favoriteTrips =
    JSON.parse(
      localStorage.getItem("favoriteTrips")
    ) || [];

  favoriteTrips =
    favoriteTrips.filter(
      trip => trip.id !== id
    );

  localStorage.setItem(
    "favoriteTrips",
    JSON.stringify(favoriteTrips)
  );

  renderFavoriteTrips();

  showToast(
    "Favourite deleted 🗑"
  );
}

async function loadFavoriteTrip(id) {

  let favoriteTrips =
    JSON.parse(localStorage.getItem("favoriteTrips")) || [];

  const trip = favoriteTrips.find(t => t.id === id);

  if (!trip) {
    showToast("Favourite not found ❌", "error");
    return;
  }

  showToast("Loading favourite trip... ⏳", "info");

  // =========================
  // RESTORE FORM
  // =========================
  document.getElementById("destination").value = trip.destination || "";
  document.getElementById("days").value = trip.plan?.length || "";

  const destination = trip.destination;
  const days = trip.plan?.length;

  if (!destination || !days) {
    showToast("Invalid favourite trip ❌", "error");
    return;
  }

  // =========================
  // REFRESH AI VERSION (NOT OLD DATA)
  // =========================
  await new Promise(r => setTimeout(r, 400));

  await regenerateFavoriteTrip(destination, days);

  showToast("Favourite loaded & refreshed ✨");
}

async function regenerateFavoriteTrip(destination, days) {

  const budget =
    document.getElementById("budget").value;

  const style =
    document.getElementById("style").value;

  const travelers =
    document.getElementById("travelers").value;

  const startDate =
    document.getElementById("startDate").value;

  const pick = arr =>
    arr[Math.floor(Math.random() * arr.length)];

  let baseCost =
    budget === "Budget" ? 80 :
    budget === "Mid-Range" ? 180 : 400;

  let totalCost = baseCost * days;

  // =========================
  // SUMMARY
  // =========================
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
        <h3>${formatCurrency(totalCost)}</h3>
        <p>Total Cost</p>
      </div>

    </div>

    <div class="day-card">
      <h2>❤️ Favourite Reload: ${destination}</h2>
      <p>Fresh AI-generated version ✨</p>
    </div>
  `;

  const itinerary =
    document.getElementById("itinerary");

  itinerary.innerHTML = "";
  currentPlan = [];

  // =========================
  // BUILD DAYS
  // =========================
  for (let i = 1; i <= days; i++) {

    const baseDate =
      startDate ? new Date(startDate) : new Date();

    const date = new Date(baseDate);
    date.setDate(baseDate.getDate() + i - 1);

    const weather =
      weatherTypes[Math.floor(Math.random() * weatherTypes.length)];

    const tip =
      getWeatherTip(weather);

    const day = {
      day: i,
      date: date.toDateString(),
      weather,
      tip,
      cost: baseCost,
      packing: getPackingList(weather, style),
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
      <div class="day-card ${style === 'Theme Park' ? 'theme-park-card' : ''}">

        <div class="day-header"
          onclick="toggleDay('f${i}')">

          <div>
            <h3>Day ${i}</h3>
            <small>${day.date}</small>
          </div>

          <i class="fa-solid fa-chevron-down"></i>

        </div>

        <div class="day-content" id="f${i}">

          <div class="activity">🌤 Weather: ${weather}</div>

          <div class="activity">💡 Tip: ${tip}</div>

          <div class="activity">
            🤖 AI Suggestion:
            ${getAISuggestion(style, weather)}
          </div>

          <div class="activity">💰 Day Cost: £${baseCost}</div>

          <div class="activity">🏨 ${day.hotel}</div>

        </div>

      </div>
    `;
  }

  // =========================
  // UPDATE UI FEATURES
  // =========================
  loadMap(destination);
  renderBudgetChart(totalCost);
  startCountdown(startDate);
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
   HOURLY TOGGLE
========================= */

function toggleHourly(id) {

  const el =
    document.getElementById(id);

  if (!el) return;

  el.classList.toggle("hidden");
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

  if (!destination || !days) {
    showToast("Fill all fields", "error");
    return;
  }

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
        <h3>${formatCurrency(totalCost)}</h3>
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
    const weather = "Live Forecast";
    const tip = getWeatherTip(weather);

    const dayCost = baseCost; // 💰 DAILY PRICE

    const day = {
      day: i,
      date: date.toDateString(),
      weather: weather,
      tip: tip,
      cost: dayCost,
      packing: getPackingList(weather, style), 
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

      <div class="day-card ${style === 'Theme Park' ? 'theme-park-card' : ''}">

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

          <div class="activity">
           🤖 AI Suggestion:
           ${getAISuggestion(style, weather)}
        </div>

          <div class="activity">Day Cost: £${day.cost}</div>

           <div class="activity">
  ${style === "Theme Park" ? "🎢" : "🌅"}
  ${day.schedule.morning}
</div>

<div class="activity">
  🍽️ ${day.schedule.midday}
</div>

<div class="activity">
  ${style === "Theme Park" ? "🎠" : "☀️"}
  ${day.schedule.afternoon}
</div>

<div class="activity">
  ${style === "Theme Park" ? "🎆" : "🌙"}
  ${day.schedule.evening}
</div>

          <div class="activity">🏨 ${day.hotel}</div>
      </div>

    `;
  }

  loadMap(destination);

startCountdown(startDate);

renderBudgetChart(totalCost);

  showToast("Trip generated ✨");

  localStorage.setItem("hasGeneratedTrip", "true");
}

function saveTrip() {

  if (!currentPlan || currentPlan.length === 0) {
    showToast("Generate a trip first ❌", "error");
    return;
  }

  const destination = document.getElementById("destination").value;
  const days = document.getElementById("days").value;

  if (!destination || !days) {
    showToast("Trip details incomplete ❌", "error");
    return;
  }

  const tripData = {
    id: Date.now(),
    destination,
    createdAt: new Date().toISOString(),
    plan: JSON.parse(JSON.stringify(currentPlan))
  };

  let savedTrips =
    JSON.parse(localStorage.getItem("savedTrips")) || [];

  // prevent duplicates (simple check)
  const exists = savedTrips.some(t =>
    t.destination === destination &&
    t.plan?.length === currentPlan.length
  );

  if (exists) {
    showToast("Trip already saved ⚠️", "info");
    return;
  }

  savedTrips.push(tripData);

  localStorage.setItem("savedTrips", JSON.stringify(savedTrips));

  renderSavedTripsHistory();

  populateCompareDropdowns();

  showToast("Trip saved 💾");
}

function renderSavedTripsHistory() {

  const container =
    document.getElementById("savedTripsHistory");

  if (!container) return;

  let savedTrips =
    JSON.parse(localStorage.getItem("savedTrips")) || [];

  if (!savedTrips.length) {
    container.innerHTML = `
      <div class="activity">No saved trips yet 💾</div>
    `;
    return;
  }

  const lastFive = savedTrips.slice(-5).reverse();

  container.innerHTML = lastFive.map(trip => `
    <div class="favorite-trip-card">

      <div class="favorite-trip-title">
        ✈️ ${trip.destination || "Unknown"}
      </div>

      <div class="favorite-trip-meta">
        🗓 ${new Date(trip.createdAt).toLocaleString()}
      </div>

      <div class="favorite-trip-meta">
        📅 Days: ${trip.plan?.length || 0}
      </div>

      <div class="favorite-trip-actions">

        <button class="btn primary-btn"
          onclick="loadSavedTrip(${trip.id})">
          📂 Load
        </button>

        <button class="btn secondary-btn"
          onclick="deleteSavedTrip(${trip.id})">
          🗑 Delete
        </button>

      </div>

    </div>
  `).join("");
}

async function loadSavedTrip(id) {

  let savedTrips =
    JSON.parse(localStorage.getItem("savedTrips")) || [];

  const trip = savedTrips.find(t => t.id === id);

  if (!trip) {
    showToast("Trip not found ❌", "error");
    return;
  }

  showToast("Loading trip... ⏳", "info");

  // =========================
  // RESTORE FORM VALUES
  // =========================
  document.getElementById("destination").value = trip.destination || "";
  document.getElementById("days").value = trip.plan?.length || "";

  // optional fallback defaults if missing
  const destination = trip.destination;
  const days = trip.plan?.length;

  if (!destination || !days) {
    showToast("Invalid saved trip ❌", "error");
    return;
  }

  // =========================
  // REFRESH (NEW DATA)
  // =========================
  await new Promise(r => setTimeout(r, 400));

  await regenerateTripFromSaved(destination, days);

  showToast("Trip loaded & refreshed ✨");
}

async function regenerateTripFromSaved(destination, days) {

  const budget =
    document.getElementById("budget").value;

  const style =
    document.getElementById("style").value;

  const travelers =
    document.getElementById("travelers").value;

  const startDate =
    document.getElementById("startDate").value;

  const pick = arr =>
    arr[Math.floor(Math.random() * arr.length)];

  let baseCost =
    budget === "Budget" ? 80 :
    budget === "Mid-Range" ? 180 : 400;

  let totalCost = baseCost * days;

  // =========================
  // SUMMARY UI
  // =========================
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
        <h3>${formatCurrency(totalCost)}</h3>
        <p>Total Trip Cost</p>
      </div>

    </div>

    <div class="day-card">
      <h2>${destination}</h2>
      <p>AI refreshed travel plan ✨</p>
    </div>
  `;

  const itinerary =
    document.getElementById("itinerary");

  itinerary.innerHTML = "";
  currentPlan = [];

  // =========================
  // BUILD DAYS
  // =========================
  for (let i = 1; i <= days; i++) {

    const baseDate =
      startDate ? new Date(startDate) : new Date();

    const date = new Date(baseDate);
    date.setDate(baseDate.getDate() + i - 1);

    const weather =
      weatherTypes[Math.floor(Math.random() * weatherTypes.length)];

    const tip =
      getWeatherTip(weather);

    const day = {
      day: i,
      date: date.toDateString(),
      weather,
      tip,
      cost: baseCost,
      packing: getPackingList(weather, style),
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
          onclick="toggleDay('r${i}')">

          <div>
            <h3>Day ${i}</h3>
            <small>${day.date}</small>
          </div>

          <i class="fa-solid fa-chevron-down"></i>

        </div>

        <div class="day-content" id="r${i}">

          <div class="activity">🌤 Weather: ${weather}</div>

          <div class="activity">💡 Tip: ${tip}</div>

          <div class="activity">
            🤖 AI Suggestion:
            ${getAISuggestion(style, weather)}
          </div>

          <div class="activity">💰 Day Cost: £${baseCost}</div>

          <div class="activity">🏨 ${day.hotel}</div>

        </div>

      </div>
    `;
  }

  // =========================
  // MAP + CHART + EXTRAS
  // =========================
  loadMap(destination);
  renderBudgetChart(totalCost);
  startCountdown(startDate);
}

function deleteSavedTrip(id) {

  let savedTrips =
    JSON.parse(localStorage.getItem("savedTrips")) || [];

  savedTrips = savedTrips.filter(t => t.id !== id);

  localStorage.setItem("savedTrips", JSON.stringify(savedTrips));

  renderSavedTripsHistory();

  populateCompareDropdowns();

  showToast("Trip deleted 🗑");
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

// =========================
// CHAT ASSISTANT
// =========================

function toggleChat() {
  document.getElementById("chatBox").classList.toggle("hidden");
}

function sendChat() {

  const input = document.getElementById("chatInput");
  const msg = input.value.trim();

  if (!msg) return;

  addMessage(msg, "user");

  input.value = "";

  setTimeout(() => {
    addMessage(getBotReply(msg), "bot");
  }, 600);
}

function addMessage(text, type) {

  const box = document.getElementById("chatMessages");

  const div = document.createElement("div");

  div.classList.add("chat-msg");
  div.classList.add(type === "user" ? "user-msg" : "bot-msg");

  div.innerText = text;

  box.appendChild(div);

  box.scrollTop = box.scrollHeight;
}

// =========================
// SIMPLE AI LOGIC
// =========================

function getBotReply(msg) {

  const text = msg.toLowerCase();

  const destination =
    document.getElementById("destination")?.value;

  const style =
    document.getElementById("style")?.value;

  // -------------------------
  // TRIP CONTEXT AWARE RESPONSES
  // -------------------------

  if (text.includes("hotel")) {
    return `I suggest checking ${style || "your selected"} hotels for ${destination || "your destination"} 🏨`;
  }

  if (text.includes("weather")) {
    return "Your weather is shown in the forecast panel 🌤️";
  }

  if (text.includes("food")) {
    return "Try local food tours or night markets 🍜 — I can include them in your itinerary!";
  }

  if (text.includes("plan") || text.includes("itinerary")) {
    return "Your itinerary is already generated — you can refresh it or load a saved trip ✨";
  }

  if (text.includes("budget")) {
    return "Your budget breakdown is shown in the chart 📊";
  }

  if (text.includes("packing")) {
    return "Each day includes a packing list 🎒 based on weather conditions.";
  }

  if (destination) {
    return `For ${destination}, I recommend focusing on ${style || "your travel style"} experiences ✈️`;
  }

  return "Ask me about hotels, weather, food, packing, or your itinerary ✨";
}