// Content script for CSS injection and page analysis
console.log(
  "🚀 AI Accessibility Extension content script loaded on:",
  window.location.href
);

// Types for accessibility issues
interface AccessibilityIssue {
  type: "font-size" | "contrast" | "click-target" | "aria-label";
  element: string; // CSS selector
  description: string;
  severity: "low" | "medium" | "high";
  currentValue?: string;
  suggestedValue?: string;
}

class AccessibilityScanner {
  /**
   * Main function to scan the entire page for accessibility issues
   */
  scanPage(): AccessibilityIssue[] {
    console.log("🔍 Starting accessibility scan...");

    const issues: AccessibilityIssue[] = [
      ...this.checkFontSizes(),
      ...this.checkContrast(),
      ...this.checkClickTargets(),
      ...this.checkAriaLabels()
    ];

    console.log(`📊 Found ${issues.length} accessibility issues`);
    return issues;
  }

  /**
   * Check for text that's too small to read easily
   */
  checkFontSizes(): AccessibilityIssue[] {
    const issues: AccessibilityIssue[] = [];
    const textElements = document.querySelectorAll(
      "p, span, div, a, button, h1, h2, h3, h4, h5, h6"
    );

    textElements.forEach((element, index) => {
      const computedStyle = window.getComputedStyle(element);
      const fontSize = parseFloat(computedStyle.fontSize);

      // Text smaller than 14px is generally hard to read
      if (fontSize < 14 && element.textContent?.trim()) {
        issues.push({
          type: "font-size",
          element: this.getElementSelector(element, index),
          description: `Text is too small (${fontSize}px). Recommended minimum: 14px`,
          severity: fontSize < 12 ? "high" : "medium",
          currentValue: `${fontSize}px`,
          suggestedValue: "16px"
        });
      }
    });

    return issues;
  }

  /**
   * Check for poor color contrast
   */
  checkContrast(): AccessibilityIssue[] {
    const issues: AccessibilityIssue[] = [];
    const textElements = document.querySelectorAll(
      "p, span, div, a, button, h1, h2, h3, h4, h5, h6"
    );

    textElements.forEach((element, index) => {
      const computedStyle = window.getComputedStyle(element);
      const color = computedStyle.color;
      const backgroundColor = computedStyle.backgroundColor;

      // Simple heuristic for very light gray text (common accessibility issue)
      if (color.includes("rgb(") && element.textContent?.trim()) {
        const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (rgbMatch) {
          const [, r, g, b] = rgbMatch.map(Number);
          const brightness = (r + g + b) / 3;

          // Very light gray text (brightness > 160 on likely white background)
          if (brightness > 160) {
            issues.push({
              type: "contrast",
              element: this.getElementSelector(element, index),
              description: `Low contrast text detected. Current color: ${color}`,
              severity: "medium",
              currentValue: color,
              suggestedValue: "rgb(51, 51, 51)" // Dark gray
            });
          }
        }
      }
    });

    return issues;
  }

  /**
   * Check for click targets that are too small
   */
  checkClickTargets(): AccessibilityIssue[] {
    const issues: AccessibilityIssue[] = [];
    const clickableElements = document.querySelectorAll(
      'button, a, input[type="button"], input[type="submit"], [onclick]'
    );

    clickableElements.forEach((element, index) => {
      const rect = element.getBoundingClientRect();
      const minSize = 44; // WCAG recommendation for touch targets

      if (
        (rect.width < minSize || rect.height < minSize) &&
        rect.width > 0 &&
        rect.height > 0
      ) {
        issues.push({
          type: "click-target",
          element: this.getElementSelector(element, index),
          description: `Click target too small (${Math.round(
            rect.width
          )}x${Math.round(
            rect.height
          )}px). Recommended: ${minSize}x${minSize}px`,
          severity: "high",
          currentValue: `${Math.round(rect.width)}x${Math.round(
            rect.height
          )}px`,
          suggestedValue: `${minSize}x${minSize}px`
        });
      }
    });

    return issues;
  }

  /**
   * Check for missing ARIA labels on interactive elements
   */
  checkAriaLabels(): AccessibilityIssue[] {
    const issues: AccessibilityIssue[] = [];
    const interactiveElements = document.querySelectorAll(
      'button, input, select, textarea, [role="button"]'
    );

    interactiveElements.forEach((element, index) => {
      const hasLabel =
        element.getAttribute("aria-label") ||
        element.getAttribute("aria-labelledby") ||
        element.textContent?.trim() ||
        (element as HTMLInputElement).placeholder;

      if (!hasLabel) {
        issues.push({
          type: "aria-label",
          element: this.getElementSelector(element, index),
          description: "Interactive element missing accessible label",
          severity: "medium",
          currentValue: "No label",
          suggestedValue: "Add aria-label or text content"
        });
      }
    });

    return issues;
  }

  /**
   * Generate a unique CSS selector for an element
   */
  private getElementSelector(element: Element, fallbackIndex: number): string {
    // Try to get a unique selector
    if (element.id) {
      return `#${element.id}`;
    }

    if (element.className && typeof element.className === "string") {
      const classes = element.className.split(" ").filter((c) => c.length > 0);
      if (classes.length > 0) {
        return `${element.tagName.toLowerCase()}.${classes[0]}`;
      }
    }

    // Fallback to element type with index
    return `${element.tagName.toLowerCase()}:nth-of-type(${fallbackIndex + 1})`;
  }

  /**
   * Inject CSS fixes into the page
   */
  injectCSS(cssRules: string): void {
    console.log("💉 Injecting CSS fixes:", cssRules);

    // Remove existing accessibility fixes
    const existingStyle = document.getElementById("ai-accessibility-fixes");
    if (existingStyle) {
      existingStyle.remove();
    }

    // Create new style element
    const styleElement = document.createElement("style");
    styleElement.id = "ai-accessibility-fixes";
    styleElement.textContent = cssRules;

    // Add to document head
    document.head.appendChild(styleElement);

    console.log("✅ CSS fixes applied successfully");
  }
}

// Create scanner instance
const scanner = new AccessibilityScanner();

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("📨 Content script received message:", message);

  switch (message.action) {
    case "scanPage":
      try {
        const issues = scanner.scanPage();
        sendResponse({ success: true, issues });
      } catch (error) {
        console.error("❌ Error scanning page:", error);
        sendResponse({ success: false, error: error.message });
      }
      break;

    case "applyFixes":
      try {
        scanner.injectCSS(message.css);
        sendResponse({ success: true });
      } catch (error) {
        console.error("❌ Error applying fixes:", error);
        sendResponse({ success: false, error: error.message });
      }
      break;

    case "ping":
      sendResponse({ success: true, message: "Content script is active" });
      break;

    default:
      console.warn("⚠️ Unknown message action:", message.action);
      sendResponse({ success: false, error: "Unknown action" });
  }

  // Return true to indicate we'll send a response asynchronously
  return true;
});

// Signal that content script is ready
console.log(
  "✅ AI Accessibility content script ready and listening for messages"
);

export {};
