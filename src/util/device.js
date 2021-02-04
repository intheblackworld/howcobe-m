export const isMobile =
  window.navigator.userAgent.match(/iPhone/i) != null ||
  window.navigator.userAgent.match(/Android/i) != null

export const isTablet = window.navigator.userAgent.match(/iPad/i) != null

export const isPC = !isMobile

export const isBot = window.navigator.userAgent.match(/Googlebot/i) !== null ||
window.navigator.userAgent.match(/Bingbot/i) !== null ||
window.navigator.userAgent.match(/Slurp/i) !== null ||
window.navigator.userAgent.match(/DuckDuckBot/i) !== null ||
window.navigator.userAgent.match(/Baiduspider/i) !== null ||
window.navigator.userAgent.match(/YandexBot/i) !== null ||
window.navigator.userAgent.match(/facebot/i) !== null ||
window.navigator.userAgent.match(/facebookexternalhit/i) !== null
