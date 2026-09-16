(function () {
  const lanes = (window.PAK_TRANSPORTATION && window.PAK_TRANSPORTATION.lanes) || [];

  const currency = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });

  const milesFormatter = new Intl.NumberFormat("en-US");

  function formatDate(value) {
    return new Date(`${value}T00:00:00`).toLocaleDateString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "2-digit",
    });
  }

  function setButtonState(button, isLoading) {
    if (!button) return;
    button.disabled = isLoading;
    button.dataset.originalLabel = button.dataset.originalLabel || button.textContent;
    button.textContent = isLoading ? "Submitting..." : button.dataset.originalLabel;
  }

  function showMessage(messageEl, text, type) {
    if (!messageEl) return;
    messageEl.textContent = text;
    messageEl.className = `form-message form-message--${type}`;
  }

  function populateLaneList() {
    const datalist = document.querySelector("[data-lane-datalist]");
    if (!datalist) return;
    datalist.innerHTML = lanes
      .map((lane) => `<option value="${lane.laneNumber}">${lane.originCity} to ${lane.destinationCity}</option>`)
      .join("");
  }

  // ── Info panel elements ──────────────────────────────────────────────
  function getPanelEls() {
    return {
      title:       document.querySelector("[data-selected-lane]"),
      route:       document.querySelector("[data-selected-route]"),
      detailBlock: document.querySelector("[data-lane-details]"),
      notFound:    document.querySelector("[data-lane-not-found]"),
      detailRate:     document.querySelector("[data-detail-rate]"),
      detailMiles:    document.querySelector("[data-detail-miles]"),
      detailPickup:   document.querySelector("[data-detail-pickup]"),
      detailDelivery: document.querySelector("[data-detail-delivery]"),
    };
  }

  // ── Update info panel based on a lane number string ──────────────────
  function updatePanel(laneNumber) {
    const el = getPanelEls();
    const trimmed = (laneNumber || "").trim().toUpperCase();
    const lane = lanes.find((l) => l.laneNumber.toUpperCase() === trimmed);

    if (!trimmed) {
      // Nothing typed — reset to default state
      if (el.title)       el.title.textContent = "Enter a lane number";
      if (el.route)       el.route.textContent = "Use the field below to manually enter or edit the lane number.";
      if (el.detailBlock) el.detailBlock.hidden = true;
      if (el.notFound)    el.notFound.hidden = true;
      return;
    }

    if (lane) {
      // Valid lane — show details, hide not-found
      if (el.title) el.title.textContent = lane.laneNumber;
      if (el.route) el.route.textContent =
        `${lane.originCity}, ${lane.originState} → ${lane.destinationCity}, ${lane.destinationState}`;

      if (el.detailRate)     el.detailRate.textContent     = currency.format(lane.rate);
      if (el.detailMiles)    el.detailMiles.textContent    = milesFormatter.format(lane.miles) + " mi";
      if (el.detailPickup)   el.detailPickup.textContent   = formatDate(lane.pickup);
      if (el.detailDelivery) el.detailDelivery.textContent = formatDate(lane.delivery);

      if (el.detailBlock) el.detailBlock.hidden = false;
      if (el.notFound)    el.notFound.hidden    = true;
    } else {
      // Typed something but no match — show not-found, hide details
      if (el.title)       el.title.textContent = trimmed;
      if (el.route)       el.route.textContent = "No matching lane found.";
      if (el.detailBlock) el.detailBlock.hidden = true;
      if (el.notFound)    el.notFound.hidden    = false;
    }
  }

  // ── On page load: read URL param / sessionStorage and populate field ─
  function initSelectedLane() {
    const input = document.querySelector("[data-lane-input]");
    const query = new URLSearchParams(window.location.search);
    const selectedLane = query.get("lane") || sessionStorage.getItem("selectedLaneNumber") || "";

    if (input && selectedLane) {
      input.value = selectedLane;
    }

    updatePanel(selectedLane);
  }

  // ── Form submit ──────────────────────────────────────────────────────
  document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("[data-booking-form]");
    if (!form) {
      populateLaneList();
      initSelectedLane();
      return;
    }

    const submitButton = form.querySelector('button[type="submit"]');
    const messageEl    = form.querySelector("[data-form-message]");
    const laneInput    = form.querySelector("[data-lane-input]");
    let isSubmitting   = false;

    populateLaneList();
    initSelectedLane();

    // Live update as the user types or picks from the datalist
    if (laneInput) {
      laneInput.addEventListener("input", () => updatePanel(laneInput.value));
      laneInput.addEventListener("change", () => updatePanel(laneInput.value));
    }

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (isSubmitting) return;

      if (!form.checkValidity()) {
        form.reportValidity();
        showMessage(messageEl, "Please complete the booking details before submitting.", "error");
        return;
      }

      // Block submit if lane number doesn't match a real lane
      const laneValue = (laneInput ? laneInput.value : "").trim().toUpperCase();
      const matchedLane = lanes.find((l) => l.laneNumber.toUpperCase() === laneValue);
      if (!matchedLane) {
        showMessage(messageEl, "Please enter a valid lane number before submitting.", "error");
        if (laneInput) laneInput.focus();
        return;
      }

      isSubmitting = true;
      setButtonState(submitButton, true);
      showMessage(messageEl, "Submitting your lane request...", "info");

      try {
        await window.sendLaneBookingEmail(form);
        sessionStorage.setItem("selectedLaneNumber", matchedLane.laneNumber);
        form.reset();
        // Keep lane number visible after reset
        if (laneInput) {
          laneInput.value = matchedLane.laneNumber;
          updatePanel(matchedLane.laneNumber);
        }
        showMessage(
          messageEl,
          "Your lane request has been received. Our team will contact you shortly to confirm availability and next steps.",
          "success"
        );
      } catch (error) {
        console.error("Lane booking failed:", error);
        showMessage(
          messageEl,
          window.getFriendlyEmailJSError
            ? window.getFriendlyEmailJSError(error)
            : "We could not submit the booking right now. Please try again in a moment.",
          "error"
        );
      } finally {
        isSubmitting = false;
        setButtonState(submitButton, false);
      }
    });
  });
})();
