(function () {
  const signInForm = document.getElementById("signInForm");
  const signUpForm = document.getElementById("signUpForm");

  const showSignUpBtn = document.getElementById("showSignUpBtn");
  const showSignInBtn = document.getElementById("showSignInBtn");

  const formHeading = document.getElementById("formHeading");
  const formSubheading = document.getElementById("formSubheading");

  const formError = document.getElementById("formError");
  const yearEl = document.getElementById("year");

  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function isValidName(name) {
    const trimmed = (name || "").trim();
    if (trimmed.length < 2 || trimmed.length > 60) return false;

    try {
      return /^[\p{L}][\p{L}\p{M}\s.'-]{1,59}$/u.test(trimmed);
    } catch {
      return /^[A-Za-z][A-Za-z\s.'-]{1,59}$/.test(trimmed);
    }
  }

  function showError(message) {
    if (!formError) return;
    formError.textContent = message;
    formError.classList.add("show");
  }

  function clearError() {
    if (!formError) return;
    formError.textContent = "";
    formError.classList.remove("show");
  }

  function switchToSignUp() {
    clearError();
    signInForm.classList.add("hidden");
    signUpForm.classList.remove("hidden");
    formHeading.textContent = "Create your account";
    formSubheading.textContent = "Sign up to start using Taskify";
    document.getElementById("signupName")?.focus();
  }

  function switchToSignIn() {
    clearError();
    signUpForm.classList.add("hidden");
    signInForm.classList.remove("hidden");
    formHeading.textContent = "Let’s sign you in";
    formSubheading.textContent = "Sign in to your account";
    document.getElementById("signinEmail")?.focus();
  }

  showSignUpBtn?.addEventListener("click", switchToSignUp);
  showSignInBtn?.addEventListener("click", switchToSignIn);

  // Toggle password visibility
  document.querySelectorAll("[data-toggle-password]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const selector = btn.getAttribute("data-toggle-password");
      const input = selector ? document.querySelector(selector) : null;
      if (!input) return;

      const isPassword = input.getAttribute("type") === "password";
      input.setAttribute("type", isPassword ? "text" : "password");
      btn.setAttribute("aria-label", isPassword ? "Hide password" : "Show password");
    });
  });

  // SIGN IN submit – validate then allow POST
  signInForm?.addEventListener("submit", (e) => {
    clearError();
    let hasError = false;

    const email = document.getElementById("signinEmail")?.value.trim() || "";
    const password = document.getElementById("signinPassword")?.value || "";

    if (!email) {
      showError("Please enter your email.");
      hasError = true;
    } else if (!isValidEmail(email)) {
      showError("Please enter a valid email address.");
      hasError = true;
    } else if (!password || password.length < 6) {
      showError("Password must be at least 6 characters.");
      hasError = true;
    }

    if (hasError) e.preventDefault();
  });

  // SIGN UP submit – validate then allow POST
  signUpForm?.addEventListener("submit", (e) => {
    clearError();
    let hasError = false;

    const name = document.getElementById("signupName")?.value.trim() || "";
    const email = document.getElementById("signupEmail")?.value.trim() || "";
    const password = document.getElementById("signupPassword")?.value || "";
    const confirm = document.getElementById("signupConfirmPassword")?.value || "";

    if (!name) {
      showError("Please enter your name.");
      hasError = true;
    } else if (!isValidName(name)) {
      showError("Please enter a valid name (letters/spaces only, 2–60 chars).");
      hasError = true;
    } else if (!email) {
      showError("Please enter your email.");
      hasError = true;
    } else if (!isValidEmail(email)) {
      showError("Please enter a valid email address.");
      hasError = true;
    } else if (!password || password.length < 6) {
      showError("Password must be at least 6 characters.");
      hasError = true;
    } else if (password !== confirm) {
      showError("Passwords do not match.");
      hasError = true;
    }

    if (hasError) e.preventDefault();
  });

  document.getElementById("forgotPasswordLink")?.addEventListener("click", (e) => {
    e.preventDefault();
    alert("Forgot password functionality not implemented yet.");
  });
})();
