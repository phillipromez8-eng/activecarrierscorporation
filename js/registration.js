(function () {
  function setButtonState(button, isLoading) {
    if (!button) {
      return;
    }

    button.disabled = isLoading;
    button.dataset.originalLabel = button.dataset.originalLabel || button.textContent;
    button.textContent = isLoading ? "Submitting..." : button.dataset.originalLabel;
  }

  function showMessage(messageEl, text, type) {
    if (!messageEl) {
      return;
    }
    messageEl.textContent = text;
    messageEl.className = `form-message form-message--${type}`;
  }

  document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("[data-registration-form]");
    if (!form) {
      return;
    }

    const submitButton = form.querySelector('button[type="submit"]');
    const messageEl = form.querySelector("[data-form-message]");
    let isSubmitting = false;

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (isSubmitting) {
        return;
      }

      if (!form.checkValidity()) {
        form.reportValidity();
        showMessage(messageEl, "Please complete the required carrier details.", "error");
        return;
      }

      isSubmitting = true;
      setButtonState(submitButton, true);
      showMessage(messageEl, "Submitting your registration...", "info");

      try {
        await window.sendRegistrationEmail(form);
        form.reset();
        showMessage(
          messageEl,
          "Thank you for registering with us. Our carrier team will review your information and contact you shortly.",
          "success"
        );
      } catch (error) {
        console.error("Carrier registration failed:", error);
        showMessage(
          messageEl,
          window.getFriendlyEmailJSError
            ? window.getFriendlyEmailJSError(error)
            : "We could not submit the registration right now. Please try again in a moment.",
          "error"
        );
      } finally {
        isSubmitting = false;
        setButtonState(submitButton, false);
      }
    });
  });
})();
