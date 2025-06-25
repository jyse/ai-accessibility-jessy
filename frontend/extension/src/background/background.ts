// Background service worker
console.log('AI Accessibility Extension background script loaded');

// Extension installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('AI Accessibility Extension installed');
});
