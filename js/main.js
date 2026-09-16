(function () {
  const company = (window.PAK_TRANSPORTATION && window.PAK_TRANSPORTATION.company) || {
    name:        "Active Carriers Corporation",
    shortName:   "Active Carriers",
    usdot:       "3735366",
    usdotStatus: "ACTIVE",
    mc:          "MC-1434047",
    phone:       "(415) 300-0938",
    email:       "team@activecarrierscorporation.com",
    address:     "10825 1st Street",
    city:        "Gilroy",
    state:       "CA",
    zip:         "95020",
    location:    "Gilroy, CA 95020",
    hours:       "Mon - Fri, 7:00 AM - 7:00 PM",
  };

  const navItems = [
    { label: "Home", href: "index.html", page: "home" },
    { label: "Carrier", href: "carrier.html", page: "carrier" },
    { label: "Lanes", href: "lanes.html", page: "lanes" },
    { label: "Get a Quote", href: "book-lane.html", page: "booking" },
    { label: "About", href: "about.html", page: "about" },
    { label: "Contact Us", href: "contact.html", page: "contact" },
  ];

  function renderHeader(activePage) {
    const links = navItems
      .map(
        (item) => `
          <li class="nav__item">
            <a class="nav__link ${activePage === item.page ? "is-active" : ""}" href="${item.href}">${item.label}</a>
          </li>`
      )
      .join("");

    return `
      <header class="site-header">
        <div class="container header__inner">
          <a class="brand" href="index.html" aria-label="${company.name} home">
            <img class="brand__mark" src="assets/logo/logo.svg" alt="" width="44" height="44">
            <span class="brand__text">
              <span class="brand__name">${company.name}</span>
              <span class="brand__tag">Freight Brokerage & Transportation</span>
            </span>
          </a>

          <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="primary-nav">
            <span class="nav-toggle__bar"></span>
            <span class="nav-toggle__bar"></span>
            <span class="nav-toggle__bar"></span>
            <span class="sr-only">Toggle navigation</span>
          </button>

          <nav class="nav" id="primary-nav" aria-label="Primary navigation">
            <ul class="nav__list">
              ${links}
              <li class="nav__item nav__cta-wrap">
                <a class="button button--accent nav__cta" href="book-lane.html">Get a Quote</a>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    `;
  }

  function renderFooter() {
    return `
      <footer class="site-footer">
        <div class="container footer__grid">
          <div class="footer__brand">
            <a class="brand brand--footer" href="index.html">
              <img class="brand__mark" src="assets/logo/logo.svg" alt="" width="44" height="44">
              <span class="brand__text">
                <span class="brand__name">${company.name}</span>
                <span class="brand__tag">Trusted freight, every mile.</span>
              </span>
            </a>
            <p class="footer__copy">
              A modern North American freight brokerage built for dependable communication, reliable carriers, and freight that needs to keep moving.
            </p>
          </div>

          <div>
            <h2 class="footer__heading">Services</h2>
            <ul class="footer__links">
              <li><a href="about.html#services">Truckload (TL)</a></li>
              <li><a href="about.html#services">Regional Deliveries</a></li>
              <li><a href="about.html#services">LTL Freight</a></li>
              <li><a href="about.html#services">Cross-Border Shipping</a></li>
              <li><a href="about.html#services">Warehousing</a></li>
              <li><a href="about.html#services">Expedited Freight</a></li>
            </ul>
          </div>

          <div>
            <h2 class="footer__heading">Quick Links</h2>
            <ul class="footer__links">
              <li><a href="index.html">Home</a></li>
              <li><a href="carrier.html">Carrier</a></li>
              <li><a href="lanes.html">Lanes</a></li>
              <li><a href="book-lane.html">Get a Quote</a></li>
              <li><a href="about.html">About</a></li>
              <li><a href="contact.html">Contact</a></li>
            </ul>
          </div>

          <div>
            <h2 class="footer__heading">Contact</h2>
            <ul class="footer__contact">
              <li><span>Phone:</span> <a href="tel:${company.phone.replace(/[^+\d]/g, "")}">${company.phone}</a></li>
              <li><span>Email:</span> <a href="mailto:${company.email}">${company.email}</a></li>
              <li><span>Address:</span> ${company.address}, ${company.city}, ${company.state} ${company.zip}</li>
              <li><span>USDOT:</span> ${company.usdot}</li>
              <li><span>MC:</span> ${company.mc}</li>
            </ul>
          </div>
        </div>

        <div class="container footer__bottom">
          <p>© <span data-current-year></span> ${company.name}. All rights reserved.</p>
          <div class="footer__legal">
            <a href="https://activecarrierscorporation.com/privacy.html">Privacy Policy</a>
            <a href="https://activecarrierscorporation.com/terms.html">Terms of Service</a>
          </div>
        </div>
      </footer>
    `;
  }

  function setupNav() {
    const toggle = document.querySelector(".nav-toggle");
    const nav = document.querySelector(".nav");
    if (!toggle || !nav) {
      return;
    }

    const closeMenu = () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("nav-open");
    };

    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
      document.body.classList.toggle("nav-open", isOpen);
    });

    nav.addEventListener("click", (event) => {
      if (event.target instanceof HTMLAnchorElement && window.innerWidth <= 900) {
        closeMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) {
        closeMenu();
      }
    });
  }

  function setupRevealAnimations() {
    const elements = document.querySelectorAll("[data-reveal]");
    if (!elements.length) {
      return;
    }

    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    elements.forEach((element) => observer.observe(element));
  }

  function handleContactForm() {
    const form = document.querySelector("[data-contact-form]");
    if (!form) {
      return;
    }

    const message = form.querySelector("[data-form-message]");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const formData = new FormData(form);
      const subject = `${formData.get("company") || "Freight quote request"} - ${company.name}`;
      const body = [
        `Name: ${formData.get("first_name") || ""} ${formData.get("last_name") || ""}`.trim(),
        `Email: ${formData.get("email") || ""}`,
        `Phone: ${formData.get("phone") || ""}`,
        `Company: ${formData.get("company") || ""}`,
        "",
        `${formData.get("message") || ""}`,
      ].join("\n");

      if (message) {
        message.textContent = "Opening your email app with a prefilled quote request.";
        message.className = "form-message form-message--success";
      }

      window.location.href = `mailto:${company.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      form.reset();
    });
  }

  function initFooterYear() {
    document.querySelectorAll("[data-current-year]").forEach((element) => {
      element.textContent = String(new Date().getFullYear());
    });
  }

  function mountLayout() {
    const activePage = document.body.dataset.page || "home";
    document.querySelectorAll("[data-site-header]").forEach((slot) => {
      slot.innerHTML = renderHeader(activePage);
    });
    document.querySelectorAll("[data-site-footer]").forEach((slot) => {
      slot.innerHTML = renderFooter();
    });
    setupNav();
    setupRevealAnimations();
    handleContactForm();
    initFooterYear();
  }

  document.addEventListener("DOMContentLoaded", mountLayout);
})();
