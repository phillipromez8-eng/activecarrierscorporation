(function () {
  const lanes = (window.PAK_TRANSPORTATION && window.PAK_TRANSPORTATION.lanes) || [];
  const data = {
    search: "",
    state: "all",
    pickupDate: "",
    sort: "featured",
    type: "all",
  };

  const currency = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });

  const miles = new Intl.NumberFormat("en-US");

  function formatDate(value) {
    return new Date(`${value}T00:00:00`).toLocaleDateString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "2-digit",
    });
  }

  function toIsoDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function laneMatches(lane) {
    const search = data.search.trim().toLowerCase();
    const laneText = [
      lane.laneNumber,
      lane.originCity,
      lane.originState,
      lane.destinationCity,
      lane.destinationState,
    ]
      .join(" ")
      .toLowerCase();

    const stateMatch =
      data.state === "all" ||
      lane.originState === data.state ||
      lane.destinationState === data.state;

    const dateMatch = !data.pickupDate || lane.pickup === data.pickupDate;
    const typeMatch  = data.type === "all" || lane.type === data.type;

    return (!search || laneText.includes(search)) && stateMatch && dateMatch && typeMatch;
  }

  function sortLanes(list) {
    const sorted = [...list];
    switch (data.sort) {
      case "rate-asc":
        sorted.sort((a, b) => a.rate - b.rate);
        break;
      case "rate-desc":
        sorted.sort((a, b) => b.rate - a.rate);
        break;
      case "miles-asc":
        sorted.sort((a, b) => a.miles - b.miles);
        break;
      case "miles-desc":
        sorted.sort((a, b) => b.miles - a.miles);
        break;
      default:
        sorted.sort((a, b) => a.laneNumber.localeCompare(b.laneNumber));
        break;
    }
    return sorted;
  }

  function renderLaneCard(lane) {
    const isRoundTrip = lane.type === "round-trip";
    const typeBadge = isRoundTrip
      ? `<span class="lane-card__type lane-card__type--round">Round Trip</span>`
      : `<span class="lane-card__type lane-card__type--one-way">One Way</span>`;

    // Extra meta chips: DH, weight, pallets, pickup window
    const extraMeta = [
      lane.dh      != null ? `<div><span>DH</span><strong>${miles.format(lane.dh)} mi</strong></div>`        : "",
      lane.weight           ? `<div><span>Weight</span><strong>${lane.weight.toLocaleString()} lbs</strong></div>` : "",
      lane.pallets          ? `<div><span>Pallets</span><strong>${lane.pallets}</strong></div>`                : "",
      lane.pickupWindow     ? `<div><span>PU Window</span><strong>${lane.pickupWindow}</strong></div>`        : "",
    ].filter(Boolean).join("");

    const originAddress = lane.originAddress
      ? `<p class="lane-card__address">${lane.originAddress}</p>` : "";
    const destAddress = lane.destinationAddress
      ? `<p class="lane-card__address">${lane.destinationAddress}</p>` : "";

    // Return-leg values — fall back to swapped origin/dest for dynamic lanes
    const retFromCity  = lane.returnOriginCity  || lane.destinationCity;
    const retFromState = lane.returnOriginState || lane.destinationState;
    const retToCity    = lane.returnDestCity    || lane.originCity;
    const retToState   = lane.returnDestState   || lane.originState;

    const retExtraMeta = isRoundTrip ? [
      lane.returnDH      != null ? `<div><span>DH</span><strong>${miles.format(lane.returnDH)} mi</strong></div>`         : "",
      lane.returnWeight           ? `<div><span>Weight</span><strong>${lane.returnWeight.toLocaleString()} lbs</strong></div>` : "",
      lane.returnPallets          ? `<div><span>Pallets</span><strong>${lane.returnPallets}</strong></div>`                : "",
      lane.returnPickupWindow     ? `<div><span>PU Window</span><strong>${lane.returnPickupWindow}</strong></div>`         : "",
    ].filter(Boolean).join("") : "";

    const retAddrOrigin = lane.returnOriginAddress
      ? `<p class="lane-card__address">${lane.returnOriginAddress}</p>` : "";
    const retAddrDest = lane.returnDestAddress
      ? `<p class="lane-card__address">${lane.returnDestAddress}</p>` : "";

    const retRateLabel = lane.returnRate
      ? `<strong class="lane-card__return-rate">${currency.format(lane.returnRate)}</strong>` : "";

    const totalRate = isRoundTrip && lane.returnRate
      ? `<span class="lane-card__total-rate">Total ${currency.format(lane.rate + lane.returnRate)}</span>` : "";

    const returnLeg = isRoundTrip ? `
      <div class="lane-card__return">
        <span class="lane-card__return-label">Return leg ${retRateLabel}</span>
        <div class="lane-card__return-route">
          ${retFromCity}, ${retFromState} <span>→</span> ${retToCity}, ${retToState}
        </div>
        ${retAddrOrigin}${retAddrDest}
        <div class="lane-card__meta lane-card__meta--return">
          <div><span>Miles</span><strong>${lane.returnMiles ? miles.format(lane.returnMiles) + " mi" : "—"}</strong></div>
          <div><span>Return Pickup</span><strong>${lane.returnPickup ? formatDate(lane.returnPickup) : "—"}</strong></div>
          <div><span>Return Delivery</span><strong>${lane.returnDelivery ? formatDate(lane.returnDelivery) : "—"}</strong></div>
          ${retExtraMeta}
        </div>
      </div>` : "";

    return `
      <article class="lane-card${isRoundTrip ? " lane-card--round-trip" : ""}" data-reveal>
        <div class="lane-card__top">
          <span class="lane-card__badge">${lane.laneNumber}</span>
          <div class="lane-card__top-right">
            ${typeBadge}
            <div class="lane-card__rates">
              <span class="lane-card__rate">${currency.format(lane.rate)}</span>
              ${totalRate}
            </div>
          </div>
        </div>
        <h3 class="lane-card__route">${lane.originCity}, ${lane.originState} <span>→</span> ${lane.destinationCity}, ${lane.destinationState}</h3>
        ${originAddress}${destAddress}
        <div class="lane-card__meta">
          <div><span>Trip Miles</span><strong>${miles.format(lane.miles)} mi</strong></div>
          <div><span>Pickup</span><strong>${formatDate(lane.pickup)}</strong></div>
          <div><span>Delivery</span><strong>${formatDate(lane.delivery)}</strong></div>
          ${extraMeta}
        </div>
        ${returnLeg}
        <button class="button button--accent lane-card__button" type="button" data-book-lane="${lane.laneNumber}">
          Book This Lane
        </button>
      </article>
    `;
  }

  function updateSummary(list) {
    const summary = document.querySelector("[data-lane-summary]");
    if (summary) {
      summary.textContent = `${list.length} lane${list.length === 1 ? "" : "s"} available`;
    }

    const sectionSummary = document.querySelector("[data-lane-section-summary]");
    if (sectionSummary) {
      sectionSummary.textContent = list.length
        ? `Showing ${list.length} lane${list.length === 1 ? "" : "s"} based on your current filters.`
        : "No lanes match your filters. Clear them to see all available freight.";
    }
  }

  function attachBookButtons() {
    document.querySelectorAll("[data-book-lane]").forEach((button) => {
      button.addEventListener("click", () => {
        const laneNumber = button.getAttribute("data-book-lane");
        if (!laneNumber) {
          return;
        }
        sessionStorage.setItem("selectedLaneNumber", laneNumber);
        window.location.href = `book-lane.html?lane=${encodeURIComponent(laneNumber)}#booking-form`;
      });
    });
  }

  function render() {
    const grid = document.querySelector("[data-lane-grid]");
    if (!grid) {
      return;
    }

    const list = sortLanes(lanes.filter(laneMatches));
    grid.innerHTML = list.length
      ? list.map(renderLaneCard).join("")
      : `
        <div class="lane-empty" data-reveal>
          <h3>No lanes found</h3>
          <p>Try clearing the search or filter controls to view the full lane board.</p>
          <button class="button button--secondary" type="button" data-reset-filters>Clear Filters</button>
        </div>
      `;

    grid.querySelectorAll("[data-reveal]").forEach((element) => {
      element.classList.add("is-visible");
    });

    updateSummary(list);
    attachBookButtons();
  }

  function populateStateFilter() {
    const select = document.querySelector("[data-state-filter]");
    if (!select) {
      return;
    }

    const states = Array.from(
      new Set(
        lanes.flatMap((lane) => [lane.originState, lane.destinationState])
      )
    ).sort();

    select.innerHTML = `
      <option value="all">All States</option>
      ${states.map((state) => `<option value="${state}">${state}</option>`).join("")}
    `;
  }

  function bindFilters() {
    const search     = document.querySelector("[data-search-filter]");
    const state      = document.querySelector("[data-state-filter]");
    const pickupDate = document.querySelector("[data-date-filter]");
    const sort       = document.querySelector("[data-sort-filter]");
    const type       = document.querySelector("[data-type-filter]");
    const sectionSummary = document.querySelector("[data-lane-section-summary]");
    const todayPlus2 = new Date();
    todayPlus2.setDate(todayPlus2.getDate() + 2);
    const defaultPickup = toIsoDate(todayPlus2);

    if (pickupDate && !pickupDate.value) {
      pickupDate.value = defaultPickup;
      data.pickupDate = defaultPickup;
    }

    search?.addEventListener("input", (event) => {
      data.search = event.target.value;
      render();
    });

    state?.addEventListener("change", (event) => {
      data.state = event.target.value;
      render();
    });

    pickupDate?.addEventListener("change", (event) => {
      data.pickupDate = event.target.value;
      render();
    });

    sort?.addEventListener("change", (event) => {
      data.sort = event.target.value;
      render();
    });

    type?.addEventListener("change", (event) => {
      data.type = event.target.value;
      render();
    });

    document.addEventListener("click", (event) => {
      const resetButton = event.target.closest("[data-reset-filters]");
      if (!resetButton) {
        return;
      }

      data.search = "";
      data.state  = "all";
      data.pickupDate = "";
      data.sort   = "featured";
      data.type   = "all";
      if (search)     search.value     = "";
      if (state)      state.value      = "all";
      if (pickupDate) pickupDate.value = "";
      if (sort)       sort.value       = "featured";
      if (type)       type.value       = "all";
      render();
    });

    if (sectionSummary) {
      sectionSummary.textContent = "Use the filters above to narrow the load board.";
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    const lanePage = document.querySelector("[data-lane-page]");
    if (!lanePage) {
      return;
    }

    populateStateFilter();
    bindFilters();
    render();
  });
})();
