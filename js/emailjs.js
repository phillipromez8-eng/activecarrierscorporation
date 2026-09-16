(function () {
  const config = window.EMAILJS_CONFIG || {
    serviceId: "service_135hhqn",
    registrationTemplateId: "template_ur29uhq",
    bookingTemplateId: "template_1jhv7yp",
    publicKey: "CMQGNtVjOi4q-BD89",
  };

  let initialized = false;

  function ensureSdk() {
    if (!window.emailjs || typeof window.emailjs.sendForm !== "function") {
      throw new Error("EmailJS SDK is not available.");
    }
  }

  function ensureConfigured(templateId, label) {
    if (!config.serviceId || !templateId || !config.publicKey) {
      throw new Error(
        `${label} is not configured yet. Please add the service ID, template ID, and public key in js/emailjs.js before testing this form.`
      );
    }
  }

  function getFriendlyEmailJSError(error) {
    return "We could not send your request right now. Please try again in a moment.";
  }

  function initEmailJS() {
    ensureSdk();
    if (!initialized) {
      window.emailjs.init(config.publicKey);
      initialized = true;
    }
  }

  async function sendForm(form, templateId, label) {
    ensureConfigured(templateId, label);
    initEmailJS();
    return window.emailjs.sendForm(config.serviceId, templateId, form);
  }

  window.EMAILJS_CONFIG = config;
  window.initEmailJS = initEmailJS;
  window.getFriendlyEmailJSError = getFriendlyEmailJSError;
  window.sendRegistrationEmail = function sendRegistrationEmail(form) {
    return sendForm(form, config.registrationTemplateId, "Carrier registration");
  };
  window.sendLaneBookingEmail = function sendLaneBookingEmail(form) {
    return sendForm(form, config.bookingTemplateId, "Lane booking");
  };
})();
