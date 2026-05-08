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

/* =========================
   LOADING
========================= */

function setLoading(state){

  document.getElementById("loader").style.display =
    state ? "block":"none";

  document.getElementById("generateBtn").disabled =
    state;
}

/* =========================
   RANDOM
========================= */

function randomItem(arr){

  return arr[
    Math.floor(Math.random()*arr.length)
  ];
}

/* =========================
   ACTIVITIES
========================= */

const activities = {

  relaxed: {
    morning: [
      "Enjoy breakfast at a cozy cafe",
      "Visit a botanical garden",
      "Walk through historic streets",
      "Explore local artisan markets",
      "Visit a quiet temple or church",
      "Take photos in scenic neighborhoods",
      "Coffee tasting experience",
      "Explore local bookstores",
      "Relax in a riverside park",
      "Visit flower gardens"
    ],
    afternoon: [
      "Relax in a scenic park",
      "Visit museums and galleries",
      "Try local cuisine at a famous restaurant",
      "Take a river cruise",
      "Attend a cooking workshop",
      "Spa and wellness session",
      "Explore old town districts",
      "Visit cultural exhibitions",
      "Enjoy afternoon tea",
      "Browse boutique shops"
    ],
    evening: [
      "Watch sunset viewpoints",
      "Enjoy live jazz or acoustic music",
      "Relax at a rooftop cafe",
      "Take a peaceful night walk",
      "Dinner cruise",
      "Night photography session",
      "Wine tasting",
      "Watch a cultural performance",
      "Visit illuminated landmarks",
      "Dessert hopping"
    ]
  },

  balanced: {
    morning: [
      "Explore famous landmarks",
      "Visit cultural attractions",
      "Join a walking tour",
      "Take city sightseeing photos",
      "Visit famous squares",
      "Hop-on hop-off bus tour",
      "Explore iconic neighborhoods",
      "Temple or cathedral visit",
      "City history tour",
      "Observation deck visit"
    ],
    afternoon: [
      "Try local street food",
      "Visit museums and shopping districts",
      "Explore hidden neighborhoods",
      "Experience local culture",
      "Food market exploration",
      "Shopping in local markets",
      "Art gallery hopping",
      "Try signature dishes",
      "Visit architectural sites",
      "Take public transport adventures"
    ],
    evening: [
      "Dinner at a popular restaurant",
      "Night market exploration",
      "Enjoy skyline views",
      "Experience nightlife spots",
      "Bar hopping",
      "Watch city lights",
      "Attend local events",
      "Try local desserts",
      "Visit rooftop bars",
      "Night photography walk"
    ]
  },

  adventurous: {
    morning: [
      "Go hiking or trekking",
      "Rent bikes and explore the city",
      "Take a mountain adventure tour",
      "Kayaking or outdoor activity",
      "Zipline experience",
      "Sunrise viewpoint hike",
      "Rock climbing",
      "Surfing lessons",
      "ATV trail ride",
      "Scuba diving session"
    ],
    afternoon: [
      "Adventure sports experience",
      "Explore hidden trails",
      "ATV or jeep safari",
      "Water activities and exploration",
      "Paragliding",
      "Snorkeling trip",
      "Cave exploration",
      "Camping setup",
      "Island hopping",
      "Jungle trekking"
    ],
    evening: [
      "Campfire experience",
      "Explore local nightlife",
      "Late-night street food tour",
      "Adventure photography session",
      "Beach bonfire",
      "Night hiking",
      "Live music bars",
      "Backpacker social events",
      "Moonlight kayaking",
      "Outdoor stargazing"
    ]
  }
};

/* =========================
   WEATHER
========================= */

async function getWeather(city){

  const API_KEY =
    "81c0d22b83ccbe180ccf4acf19f7d978";

  const res = await fetch(

    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`

  );

  return await res.json();
}

/* =========================
   WEATHER ADVICE
========================= */

function weatherAdvice(condition){

  condition=condition.toLowerCase();

  if(condition.includes("rain"))
    return "Carry an umbrella.";

  if(condition.includes("clear"))
    return "Perfect weather for outdoor plans.";

  if(condition.includes("snow"))
    return "Wear warm clothing.";

  return "Enjoy your journey.";
}

/* =========================
   MAP LINK
========================= */

function mapLink(place){

  return `https://www.google.com/maps/search/${encodeURIComponent(place)}`;
}

/* =========================
   BUDGET
========================= */

function calculateBudget(days,budget){

  return {

    daily:
      Math.round(budget/days),

    hotel:
      Math.round(budget*.45),

    food:
      Math.round(budget*.25),

    transport:
      Math.round(budget*.10),

    activities:
      Math.round(budget*.20)
  };
}

/* =========================
   COUNTDOWN
========================= */

function tripCountdown(date){

  const diff =
    new Date(date)-new Date();

  return Math.ceil(
    diff/(1000*60*60*24)
  );
}

/* =========================
   GENERATE PLAN
========================= */

async function generateItinerary(){

  const destination =
    document.getElementById("destination").value;

  const days =
    +document.getElementById("days").value;

  const style =
    document.getElementById("style").value;

  const budget =
    +document.getElementById("budget").value;

  const tripDate =
    document.getElementById("tripDate").value;

  if(!destination)
    return toast("Enter destination");

  setLoading(true);


  try{

    const selected =
      activities[style];

    const weather =
      await getWeather(destination);

    const plan = Array.from(

      {length:days},

      (_,i)=>{

        const forecast =
          weather?.list[i*8];

        return {

          day:i+1,

          weather:{

            condition:
              forecast?.weather[0]?.main || "Clear",

            description:
              forecast?.weather[0]?.description || "",

            temp:
              Math.round(forecast?.main?.temp || 25),

            icon:
              forecast?.weather[0]?.icon || "01d"
          },

          plan:[

            `08:00 - ${randomItem(selected.morning)}`,

            `01:00 - ${randomItem(selected.afternoon)}`,

            `06:00 - ${randomItem(selected.evening)}`
          ]
        };
      }
    );

    render(plan);

    /* BUDGET */

    const breakdown =
      calculateBudget(days,budget);

    document.getElementById("budgetBox").innerHTML = `

      <div class="budget-box">

        <h3>💰 Budget Breakdown</h3>

        <p>Daily: $${breakdown.daily}</p>

        <p>Hotel: $${breakdown.hotel}</p>

        <p>Food: $${breakdown.food}</p>

        <p>Transport: $${breakdown.transport}</p>

        <p>Activities: $${breakdown.activities}</p>

      </div>
    `;

    /* COUNTDOWN */

    if(tripDate){

      document.getElementById("countdown").innerHTML =

        `⏳ Trip starts in ${tripCountdown(tripDate)} days`;
    }

    toast("Itinerary generated");

  }catch(err){

    console.error(err);

    toast("Generation failed");
  }

  setLoading(false);
}

/* =========================
   RENDER
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

            <p>
              <strong>${d.weather.condition}</strong>
            </p>

            <p>${d.weather.description}</p>

            <p>🌡 ${d.weather.temp}°C</p>

          </div>

        </div>

        <div class="advice">
          💡 ${weatherAdvice(d.weather.condition)}
        </div>

        <ul class="sortable-list">

          ${d.plan.map(p=>`

            <li>

              ${p}

              <a
                href="${mapLink(p)}"
                target="_blank"
              >
                📍
              </a>

            </li>

          `).join("")}

        </ul>

        <button
          class="fav-btn"
          onclick="toggleFavorite(this)"
        >
          ❤️ Favorite
        </button>

        <textarea
          class="note"
          placeholder="Add personal notes..."
        ></textarea>

      </div>

    `).join("");

  /* DRAG DROP */

  document.querySelectorAll(".sortable-list")
    .forEach(el=>{

      new Sortable(el,{
        animation:150
      });

    });
}

/* =========================
   FAVORITE
========================= */

function toggleFavorite(btn){

  btn.classList.toggle("active");

  toast("Added to favorites");
}

/* =========================
   STORAGE
========================= */

function saveItinerary(){

  localStorage.setItem(

    "trip",

    document.getElementById("output").innerHTML
  );

  toast("Saved");
}

function loadItinerary(){

  document.getElementById("output").innerHTML =

    localStorage.getItem("trip") || "";

  toast("Loaded");
}

/* =========================
   EXPORT
========================= */

function exportJSON(){

  const data =
    localStorage.getItem("trip");

  const blob =
    new Blob([data],{
      type:"application/json"
    });

  const a=document.createElement("a");

  a.href=URL.createObjectURL(blob);

  a.download="trip.json";

  a.click();
}

function exportPDF(){

  html2pdf().from(
    document.getElementById("output")
  ).save("itinerary.pdf");
}

/* =========================
   COPY
========================= */

function copyItinerary(){

  navigator.clipboard.writeText(

    document.getElementById("output").innerText
  );

  toast("Copied");
}

/* =========================
   THEME
========================= */

function toggleTheme(){

  document.body.classList.toggle("dark");

  localStorage.setItem(

    "theme",

    document.body.classList.contains("dark")
  );
}

/* LOAD THEME */

window.onload=()=>{

  if(localStorage.getItem("theme")==="true"){

    document.body.classList.add("dark");
  }
};