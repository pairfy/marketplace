function sleep(timeInMs: any) {
  timeInMs =
    typeof timeInMs === "string" ? (timeInMs = parseInt(timeInMs)) : timeInMs;

  return new Promise((resolve) => setTimeout(() => resolve(false), timeInMs));
}

export { sleep };
