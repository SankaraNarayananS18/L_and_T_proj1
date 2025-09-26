const destinations = [
  {
    name: "Goa",
    type: "beach",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    activities: [{ name: "Surfing", cost: 100 }, { name: "Beach Party", cost: 50 }],
    stay: 120, flight: 200
  },
  {
    name: "Manali",
    type: "mountain",
    image: "https://encrypted-tbn2.gstatic.com/licensed-image?q=tbn:ANd9GcTmxS7PJ-xoB67Ad6Orf4Kvjc-6WYfpSec2ewxbqftJakcnrbRVpflJuRIVRLEHPMOfQxjy95MzzxaT-zGO0m0Ff5MuYqALSBeL-hKqnA",
    activities: [{ name: "Trekking", cost: 80 }, { name: "Skiing", cost: 150 }],
    stay: 90, flight: 180
  },
  {
    name: "Paris",
    type: "city",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
    activities: [{ name: "Eiffel Tower", cost: 70 }, { name: "Louvre", cost: 60 }],
    stay: 150, flight: 500
  },
  {
    name: "Kerala",
    type: "nature",
    image: "https://encrypted-tbn2.gstatic.com/licensed-image?q=tbn:ANd9GcTpUY4SkDmKW3lzimqsn71OcY9F77PGnxJZpsceQtW47o2ONG4fM19l5cBVFk428jOjqxVuwMUAsA4xKv7n6HH108_XQ6w1NrJQYw_H4w",
    activities: [{ name: "Houseboat Ride", cost: 120 }, { name: "Ayurvedic Spa", cost: 100 }],
    stay: 110, flight: 150
  },
  {
    name: "New York",
    type: "city",
    image: "https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcTwJemX1EQbEt8VjppHeW8r-5TSNqtkHsTBXC9A7aseAB7TsKeHxYS2IQFVYunSqm4CDNATtVuxK6rlvZpBfP3ZjxUQiZlsC9FvbI-lJg",
    activities: [{ name: "Statue of Liberty", cost: 90 }, { name: "Broadway Show", cost: 120 }],
    stay: 200, flight: 600
  },
  {
    name: "Maldives",
    type: "beach",
    image: "https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcQX35L6vE9YmNhiBdTuAHW1Njk7Eq4vLb33krni1mHneUfeG633EIYQFpfsOm-r_mSZOiZo_0OW84K_k4i6ANAcR0aJkAeOXhcZO_Pf_A",
    activities: [{ name: "Snorkeling", cost: 150 }, { name: "Island Hopping", cost: 200 }],
    stay: 300, flight: 800
  }
];

let itinerary = [];
let total = 0;

function renderDestinations(list = destinations) {
  $("#destinations").html(list.map(d => `
    <div class="col-md-6 col-lg-4">
      <div class="card p-3">
        <img src="${d.image}" alt="${d.name}" class="card-img-top" style="border-radius: 10px; height: 200px; object-fit: cover;">
        <div class="card-body">
          <h5>${d.name}</h5>
          <p class="text-muted">Type: ${d.type}</p>
          <div class="d-grid gap-2">
            <button class="btn btn-sm btn-outline-primary" onclick="addItem('Stay at ${d.name} Hotel',${d.stay})">Hotel $${d.stay}</button>
            <button class="btn btn-sm btn-outline-secondary" onclick="addItem('Flight to ${d.name}',${d.flight})">Flight $${d.flight}</button>
          </div>
          <div class="mt-2">
            ${d.activities.map(a => 
              `<button class="btn btn-sm btn-outline-success me-1 mb-1" onclick="addItem('${a.name} in ${d.name}',${a.cost})">${a.name} $${a.cost}</button>`
            ).join("")}
          </div>
        </div>
      </div>
    </div>
  `).join(""));

  // Animate destination cards on load
  $(".card").hide().fadeIn(500);
}

// Search/filter functions
function applyFilters() {
  const type = $("#typeFilter").val();
  const filtered = destinations.filter(d => !type || d.type === type);
  renderDestinations(filtered);
}

function filterByTab(tabName) {
  $(".tab").removeClass("active");
  $(`.tab:contains(${tabName})`).addClass("active");
  renderDestinations(destinations.filter(d => d.name === tabName));
}

// Scroll to destinations
function scrollToDestinations() {
  document.getElementById("destinations").scrollIntoView({ behavior: "smooth" });
}

// Add itinerary item with animation
function addItem(name, cost) {
  itinerary.push({ name, cost });
  total += cost;
  updateUI();

  const lastItem = $("#itinerary li").last();
  lastItem.hide().slideDown(300);
}

// Remove itinerary item with fade-out
function removeItem(index) {
  const item = $(`#itinerary li:eq(${index})`);
  item.slideUp(300, function () {
    total -= itinerary[index].cost;
    itinerary.splice(index, 1);
    updateUI();
  });
}

// Update UI
function updateUI() {
  $("#itinerary").html(itinerary.map((i, idx) => `
    <li class="list-group-item d-flex justify-content-between align-items-center">
      <span>${i.name} - $${i.cost}</span>
      <button class="btn btn-danger btn-sm" onclick="removeItem(${idx})">✖</button>
    </li>
  `).join(""));
  $("#budget").text(total);
  convertCurrency();
}

// Currency conversion
function convertCurrency() {
  const rate = parseFloat($("#currencySelector").val());
  if (!isNaN(rate) && rate > 0) {
    const converted = (total * rate).toFixed(2);
    $("#convertedTotal").text(converted);
  } else {
    $("#convertedTotal").text("0");
  }
}

// Export & Reset
function exportPlan() {
  const data = JSON.stringify({ itinerary, total }, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "plan.json";
  a.click();
  URL.revokeObjectURL(url);
}

function resetPlan() {
  itinerary = [];
  total = 0;
  updateUI();
}

// Init
$(document).ready(() => renderDestinations());
