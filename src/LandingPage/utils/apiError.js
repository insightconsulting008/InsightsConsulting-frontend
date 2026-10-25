/*
  Pulls a human-readable message out of an axios error.
  Prefers whatever the backend sent, and only falls back to a generic
  line when the response carries nothing usable.
*/

const firstString = (...values) =>
  values.find((v) => typeof v === "string" && v.trim()) || "";

/* Validation errors usually arrive as an array of objects or strings. */
const fromErrorList = (list) => {
  if (!Array.isArray(list) || list.length === 0) return "";
  const messages = list
    .map((item) =>
      typeof item === "string"
        ? item
        : firstString(item?.message, item?.msg, item?.error),
    )
    .filter(Boolean);
  return messages.join(" ");
};

export const getApiErrorMessage = (error, fallback = "Something went wrong. Please try again.") => {
  const data = error?.response?.data;

  /* Backend replied with a plain-text body (express-rate-limit does this). */
  if (typeof data === "string" && data.trim()) return data.trim();

  const direct = firstString(
    data?.message,
    data?.error?.message,
    typeof data?.error === "string" ? data.error : "",
    data?.msg,
    data?.detail,
  );
  if (direct) return direct;

  const listed = fromErrorList(data?.errors || data?.details);
  if (listed) return listed;

  /* Nothing in the body - explain the status instead. */
  const status = error?.response?.status;
  if (status === 429) {
    return "Too many requests right now. Please wait a few minutes and try again.";
  }
  if (status === 413) {
    return "Your message is too long. Please shorten it and try again.";
  }
  if (status >= 500) {
    return "Our server is not responding at the moment. Please try again shortly.";
  }

  /* Request never reached the server. */
  if (!error?.response) {
    if (error?.code === "ECONNABORTED") {
      return "The request timed out. Please check your connection and try again.";
    }
    return "Could not reach our server. Please check your internet connection and try again.";
  }

  return fallback;
};

/*
  Some endpoints answer 200 with { success: false, message }.
  Returns the message when the payload says the submission failed.
*/
export const getApiFailureMessage = (data) => {
  if (data && typeof data === "object" && data.success === false) {
    return firstString(data.message, data.error, data.msg) ||
      "We could not save your message. Please try again.";
  }
  return "";
};
