/*
  Lightweight client-side spam guard for public forms.
  - Time check: real users take a few seconds to fill a form; bots submit instantly.
  - Rate limit: cap submissions per browser within a rolling window.
  Note: this only stops browser-based bots. Bots posting straight to the API
  must also be blocked on the backend.
*/

const MIN_FILL_MS = 3000;
const MAX_SUBMISSIONS = 3;
const WINDOW_MS = 10 * 60 * 1000;

const storageKey = (formName) => `formSubmissions:${formName}`;

const getRecentSubmissions = (formName) => {
  try {
    const raw = localStorage.getItem(storageKey(formName));
    const list = raw ? JSON.parse(raw) : [];
    const cutoff = Date.now() - WINDOW_MS;
    return Array.isArray(list) ? list.filter((t) => t > cutoff) : [];
  } catch {
    return [];
  }
};

/*
  Returns { ok: true } or { ok: false, reason, message }.
  reason "too_fast" should be handled silently (pretend success) so bots
  don't learn they were blocked.
*/
export const checkSubmission = (formName, startedAt) => {
  if (Date.now() - startedAt < MIN_FILL_MS) {
    return { ok: false, reason: "too_fast" };
  }

  const recent = getRecentSubmissions(formName);
  if (recent.length >= MAX_SUBMISSIONS) {
    const waitMs = recent[0] + WINDOW_MS - Date.now();
    const minutes = Math.max(1, Math.ceil(waitMs / 60000));
    return {
      ok: false,
      reason: "rate_limited",
      message: `You've sent several messages already. Please try again in ${minutes} minute${minutes > 1 ? "s" : ""}.`,
    };
  }

  return { ok: true };
};

export const recordSubmission = (formName) => {
  try {
    const recent = getRecentSubmissions(formName);
    recent.push(Date.now());
    localStorage.setItem(storageKey(formName), JSON.stringify(recent));
  } catch {
    // storage unavailable (private mode etc.) – ignore
  }
};
