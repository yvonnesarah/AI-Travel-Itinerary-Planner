/* =========================
   TOAST
========================= */

function toast(msg){
  const t=document.createElement("div");
  t.className="toast";
  t.innerText=msg;
  document.body.appendChild(t);
  setTimeout(()=>t.remove(),2000);
}

function setLoading(state){
  document.getElementById("loader").style.display =
    state ? "block":"none";

  document.getElementById("generateBtn").disabled = state;
}

/* =========================
   ACTIVITY DATABASE
========================= */

const activities = {

  relaxed: {
    morning: [
      "Enjoy breakfast at a cozy cafe",
      "Visit a botanical garden",
      "Walk through historic streets",
      "Explore local artisan markets"
    ],
    afternoon: [
      "Relax in a scenic park",
      "Visit museums and galleries",
      "Try local cuisine at a famous restaurant",
      "Take a river cruise"
    ],
    evening: [
      "Watch sunset viewpoints",
      "Enjoy live jazz or acoustic music",
      "Relax at a rooftop cafe",
      "Take a peaceful night walk"
    ]
  },

  balanced: {
    morning: [
      "Explore famous landmarks",
      "Visit cultural attractions",
      "Join a walking tour",
      "Take city sightseeing photos"
    ],
    afternoon: [
      "Try local street food",
      "Visit museums and shopping districts",
      "Explore hidden neighborhoods",
      "Experience local culture"
    ],
    evening: [
      "Dinner at a popular restaurant",
      "Night market exploration",
      "Enjoy skyline views",
      "Experience nightlife spots"
    ]
  },

  adventurous: {
    morning: [
      "Go hiking or trekking",
      "Rent bikes and explore the city",
      "Take a mountain adventure tour",
      "Kayaking or outdoor activity"
    ],
    afternoon: [
      "Adventure sports experience",
      "Explore hidden trails",
      "ATV or jeep safari",
      "Water activities and exploration"
    ],
    evening: [
      "Campfire experience",
      "Explore local nightlife",
      "Late-night street food tour",
      "Adventure photography session"
    ]
  }
};

/* =========================
   HELPER
========================= */

function randomItem(arr){
  return arr[Math.floor(Math.random()*arr.length)];
}

/* =========================
   AI ITINERARY ENGINE
========================= */

async function generateAIItinerary(destination, days, style){

  const selected = activities[style];

  return Array.from({length:days}, (_,i)=>({

    day:i+1,

    plan:[

      `08:00 AM - ${randomItem(selected.morning)} in ${destination}`,

      `10:30 AM - Visit popular attractions and capture photos`,

      `01:00 PM - ${randomItem(selected.afternoon)}`,

      `03:30 PM - Explore hidden gems and local experiences`,

      `06:30 PM - ${randomItem(selected.evening)}`,

      `09:00 PM - Enjoy local desserts and relax`
    ]
  }));
}

/* =========================
   WEATHER API
========================= */

async function getWeather(city){

  const API_KEY="81c0d22b83ccbe180ccf4acf19f7d978";

  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
  );

  return await res.json();
}

/* =========================
   WEATHER ATTACH
========================= */

function attachWeather(plan, weather){

  return plan.map((d,i)=>{

    const forecast = weather?.list[i*8];

    return {

      ...d,

      weather: {

        condition:
          forecast?.weather[0]?.main || "Clear",

        description:
          forecast?.weather[0]?.description || "pleasant weather",

        temp:
          Math.round(forecast?.main?.temp || 24),

        feels:
          Math.round(forecast?.main?.feels_like || 24),

        humidity:
          forecast?.main?.humidity || 60,

        wind:
          forecast?.wind?.speed || 3,

        icon:
          forecast?.weather[0]?.icon || "01d"
      }
    };
  });
}

/* =========================
   WEATHER BASED NOTES
========================= */

function weatherAdvice(condition){

  condition = condition.toLowerCase();

  if(condition.includes("rain"))
    return "Carry an umbrella and plan some indoor activities.";

  if(condition.includes("cloud"))
    return "Perfect weather for walking tours and sightseeing.";

  if(condition.includes("clear"))
    return "Great day for outdoor adventures and photography.";

  if(condition.includes("snow"))
    return "Wear warm clothes and enjoy winter attractions.";

  return "Enjoy your trip and stay hydrated.";
}

/* =========================
   GENERATE MAIN FLOW
========================= */

async function generateItinerary(){

  const destination =
    document.getElementById("destination").value;

  const days =
    +document.getElementById("days").value;

  const style =
    document.getElementById("style").value;

  if(!destination)
    return toast("Enter destination");

  setLoading(true);

  try{

    const aiPlan =
      await generateAIItinerary(destination, days, style);

    const weather =
      await getWeather(destination);

    const enriched =
      attachWeather(aiPlan, weather);

    render(enriched);

    toast("AI itinerary generated");

  }catch(e){

    console.error(e);

    toast("Error generating plan");
  }

  setLoading(false);
}

/* =========================
   RENDER UI
========================= */

function render(plan){

  document.getElementById("output").innerHTML =

    plan.map(d=>`

      <div class="day">

        <h3>Day ${d.day}</h3>

        <div class="weather-card">

          <img
            src="https://openweathermap.org/img/wn/${d.weather.icon}@2x.png"
          />

          <div>

            <p><strong>${d.weather.condition}</strong>
            (${d.weather.description})</p>

            <p>🌡 Temp: ${d.weather.temp}°C</p>

            <p>🤔 Feels like: ${d.weather.feels}°C</p>

            <p>💧 Humidity: ${d.weather.humidity}%</p>

            <p>🌬 Wind: ${d.weather.wind} m/s</p>

          </div>

        </div>

        <div class="advice">
          💡 ${weatherAdvice(d.weather.condition)}
        </div>

        <ul>
          ${d.plan.map(p=>`<li>${p}</li>`).join("")}
        </ul>

        <textarea
          class="note"
          placeholder="Add personal notes..."
        ></textarea>

      </div>

    `).join("");
}

/* =========================
   STORAGE
========================= */

function saveItinerary(){

  const data =
    document.getElementById("output").innerHTML;

  localStorage.setItem("trip", data);

  toast("Saved");
}

function loadItinerary(){

  document.getElementById("output").innerHTML =
    localStorage.getItem("trip") || "";
}

function exportJSON(){

  const data =
    localStorage.getItem("trip");

  const blob =
    new Blob([data],{type:"application/json"});

  const url =
    URL.createObjectURL(blob);

  const a=document.createElement("a");

  a.href=url;

  a.download="trip.json";

  a.click();
}

/* =========================
   UTILITIES
========================= */

function copyItinerary(){

  navigator.clipboard.writeText(
    document.getElementById("output").innerText
  );

  toast("Copied");
}

function toggleTheme(){
  document.body.classList.toggle("dark");
}