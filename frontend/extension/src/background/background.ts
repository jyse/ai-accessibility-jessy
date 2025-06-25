// Background service worker
console.log("AI Accessibility Extension background script loaded");

chrome.runtime.onInstalled.addListener(() => {
  console.log("AI Accessibility Extension installed");
});

export {};
