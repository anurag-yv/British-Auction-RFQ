function shouldExtend(currentTime, closeTime, triggerWindow) {
  return currentTime >= (closeTime - triggerWindow * 60000);
}

module.exports = { shouldExtend };