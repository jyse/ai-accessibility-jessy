// src/popup/index.tsx - With inline styles as Tailwind backup
import React from "react";
import { createRoot } from "react-dom/client";
import "../styles/globals.css";

const styles = {
  container: {
    width: "384px",
    backgroundColor: "white",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    borderRadius: "8px",
    overflow: "hidden"
  },
  header: {
    background: "linear-gradient(to right, #7c3aed, #8b5cf6, #3b82f6)",
    padding: "24px"
  },
  headerCenter: {
    textAlign: "center" as const
  },
  iconContainer: {
    width: "48px",
    height: "48px",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 12px auto"
  },
  title: {
    fontSize: "20px",
    fontWeight: "600",
    color: "white",
    marginBottom: "4px"
  },
  subtitle: {
    color: "rgba(196, 181, 253, 1)",
    fontSize: "14px"
  },
  content: {
    padding: "24px"
  },
  welcomeSection: {
    textAlign: "center" as const,
    marginBottom: "24px"
  },
  welcomeTitle: {
    fontSize: "18px",
    fontWeight: "500",
    color: "#1f2937",
    marginBottom: "8px"
  },
  welcomeText: {
    color: "#6b7280",
    fontSize: "14px"
  },
  section: {
    marginBottom: "24px"
  },
  label: {
    display: "block",
    fontSize: "14px",
    fontWeight: "500",
    color: "#374151",
    marginBottom: "12px"
  },
  buttonGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "8px"
  },
  button: {
    padding: "12px",
    borderRadius: "8px",
    border: "2px solid #e5e7eb",
    backgroundColor: "white",
    color: "#6b7280",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s"
  },
  buttonActive: {
    border: "2px solid #8b5cf6",
    backgroundColor: "#f3f4f6",
    color: "#7c3aed"
  },
  toggleContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "16px"
  },
  toggleLabel: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#374151"
  },
  toggle: {
    position: "relative" as const,
    display: "inline-flex",
    height: "24px",
    width: "44px",
    alignItems: "center",
    borderRadius: "9999px",
    cursor: "pointer",
    transition: "background-color 0.2s"
  },
  toggleBall: {
    display: "inline-block",
    height: "16px",
    width: "16px",
    borderRadius: "50%",
    backgroundColor: "white",
    transition: "transform 0.2s"
  },
  mainButton: {
    width: "100%",
    background: "linear-gradient(to right, #7c3aed, #3b82f6)",
    color: "white",
    padding: "12px 16px",
    borderRadius: "8px",
    fontWeight: "500",
    border: "none",
    cursor: "pointer",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
  }
};

function App() {
  const [isSetupComplete, setIsSetupComplete] = React.useState(false);
  const [userProfile, setUserProfile] = React.useState(null);

  React.useEffect(() => {
    chrome.storage.local.get(["userProfile"], (result) => {
      if (result.userProfile) {
        setUserProfile(result.userProfile);
        setIsSetupComplete(true);
      }
    });
  }, []);

  if (!isSetupComplete) {
    return (
      <ProfileSetup
        onComplete={(profile) => {
          setUserProfile(profile);
          setIsSetupComplete(true);
        }}
      />
    );
  }

  return (
    <AccessibilityPanel
      userProfile={userProfile}
      onEditProfile={() => setIsSetupComplete(false)}
    />
  );
}

function ProfileSetup({ onComplete }: { onComplete: (profile: any) => void }) {
  const [profile, setProfile] = React.useState({
    fontSize: "normal",
    contrast: "normal",
    motionSensitive: false,
    screenReader: false
  });

  const handleSave = async () => {
    const userProfile = {
      id: crypto.randomUUID(),
      ...profile,
      createdAt: new Date().toISOString()
    };

    await chrome.storage.local.set({ userProfile });
    onComplete(userProfile);
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerCenter}>
          <div style={styles.iconContainer}>
            <span style={{ fontSize: "24px" }}>🤖</span>
          </div>
          <h1 style={styles.title}>AI Accessibility</h1>
          <p style={styles.subtitle}>Let's personalize your experience</p>
        </div>
      </div>

      {/* Content */}
      <div style={styles.content}>
        <div style={styles.welcomeSection}>
          <h2 style={styles.welcomeTitle}>Welcome!</h2>
          <p style={styles.welcomeText}>
            Tell us about your accessibility needs
          </p>
        </div>

        {/* Font Size */}
        <div style={styles.section}>
          <label style={styles.label}>Preferred text size</label>
          <div style={styles.buttonGrid}>
            {[
              { value: "normal", label: "Normal" },
              { value: "large", label: "Large" },
              { value: "xl", label: "Extra Large" }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() =>
                  setProfile((prev) => ({ ...prev, fontSize: option.value }))
                }
                style={{
                  ...styles.button,
                  ...(profile.fontSize === option.value
                    ? styles.buttonActive
                    : {})
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Contrast */}
        <div style={styles.section}>
          <label style={styles.label}>Color contrast preference</label>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "8px"
            }}
          >
            {[
              { value: "normal", label: "Normal" },
              { value: "high", label: "High Contrast" }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() =>
                  setProfile((prev) => ({ ...prev, contrast: option.value }))
                }
                style={{
                  ...styles.button,
                  ...(profile.contrast === option.value
                    ? styles.buttonActive
                    : {})
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Toggles */}
        <div style={styles.section}>
          <div style={styles.toggleContainer}>
            <span style={styles.toggleLabel}>I use a screen reader</span>
            <button
              onClick={() =>
                setProfile((prev) => ({
                  ...prev,
                  screenReader: !prev.screenReader
                }))
              }
              style={{
                ...styles.toggle,
                backgroundColor: profile.screenReader ? "#8b5cf6" : "#d1d5db"
              }}
            >
              <span
                style={{
                  ...styles.toggleBall,
                  transform: profile.screenReader
                    ? "translateX(20px)"
                    : "translateX(4px)"
                }}
              />
            </button>
          </div>

          <div style={styles.toggleContainer}>
            <span style={styles.toggleLabel}>Motion sensitive</span>
            <button
              onClick={() =>
                setProfile((prev) => ({
                  ...prev,
                  motionSensitive: !prev.motionSensitive
                }))
              }
              style={{
                ...styles.toggle,
                backgroundColor: profile.motionSensitive ? "#8b5cf6" : "#d1d5db"
              }}
            >
              <span
                style={{
                  ...styles.toggleBall,
                  transform: profile.motionSensitive
                    ? "translateX(20px)"
                    : "translateX(4px)"
                }}
              />
            </button>
          </div>
        </div>

        {/* Save Button */}
        <button onClick={handleSave} style={styles.mainButton}>
          Continue
        </button>
      </div>
    </div>
  );
}

function AccessibilityPanel({
  userProfile,
  onEditProfile
}: {
  userProfile: any;
  onEditProfile: () => void;
}) {
  const [feedback, setFeedback] = React.useState("");
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleQuickFix = async (type: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      console.log(`Applied ${type} fix`);
      setIsProcessing(false);
    }, 1500);
  };

  const handleCustomFeedback = async () => {
    if (!feedback.trim()) return;
    setIsProcessing(true);
    setTimeout(() => {
      console.log("Processed feedback:", feedback);
      setFeedback("");
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <span style={{ fontSize: "20px" }}>🤖</span>
            </div>
            <div>
              <h1
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "white",
                  margin: 0
                }}
              >
                AI Accessibility
              </h1>
              <p
                style={{
                  color: "rgba(196, 181, 253, 1)",
                  fontSize: "12px",
                  margin: 0
                }}
              >
                How can I help?
              </p>
            </div>
          </div>
          <button
            onClick={onEditProfile}
            style={{
              background: "none",
              border: "none",
              color: "rgba(255, 255, 255, 0.8)",
              cursor: "pointer",
              fontSize: "16px"
            }}
          >
            ⚙️
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={styles.content}>
        {/* Status */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px",
            backgroundColor: "#f0fdf4",
            borderRadius: "8px",
            border: "1px solid #bbf7d0",
            marginBottom: "16px"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                width: "8px",
                height: "8px",
                backgroundColor: "#22c55e",
                borderRadius: "50%"
              }}
            ></div>
            <span
              style={{ fontSize: "14px", fontWeight: "500", color: "#15803d" }}
            >
              Ready to help
            </span>
          </div>
          <span style={{ fontSize: "12px", color: "#16a34a" }}>
            {userProfile?.fontSize?.charAt(0).toUpperCase() +
              userProfile?.fontSize?.slice(1)}{" "}
            text
          </span>
        </div>

        {/* Quick Actions */}
        <div style={styles.section}>
          <h3
            style={{
              fontSize: "14px",
              fontWeight: "500",
              color: "#1f2937",
              marginBottom: "12px"
            }}
          >
            Quick fixes
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "8px"
            }}
          >
            {[
              { type: "font-size", emoji: "📝", label: "Bigger Text" },
              { type: "contrast", emoji: "🎨", label: "Better Contrast" },
              { type: "buttons", emoji: "🔘", label: "Bigger Buttons" },
              { type: "motion", emoji: "🔄", label: "Reduce Motion" }
            ].map((action) => (
              <button
                key={action.type}
                onClick={() => handleQuickFix(action.type)}
                disabled={isProcessing}
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                  backgroundColor: "white",
                  cursor: "pointer",
                  textAlign: "center" as const,
                  opacity: isProcessing ? 0.5 : 1
                }}
              >
                <div style={{ fontSize: "18px", marginBottom: "4px" }}>
                  {action.emoji}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: "500",
                    color: "#374151"
                  }}
                >
                  {action.label}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Input */}
        <div style={styles.section}>
          <h3
            style={{
              fontSize: "14px",
              fontWeight: "500",
              color: "#1f2937",
              marginBottom: "12px"
            }}
          >
            Describe the issue
          </h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Tell me what's difficult about this page..."
              style={{
                width: "100%",
                height: "80px",
                padding: "12px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                resize: "none" as const,
                fontSize: "14px",
                boxSizing: "border-box" as const
              }}
              disabled={isProcessing}
            />
            <button
              onClick={handleCustomFeedback}
              disabled={isProcessing || !feedback.trim()}
              style={{
                ...styles.mainButton,
                opacity: isProcessing || !feedback.trim() ? 0.5 : 1,
                fontSize: "14px"
              }}
            >
              {isProcessing ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px"
                  }}
                >
                  <div
                    style={{
                      width: "16px",
                      height: "16px",
                      border: "2px solid white",
                      borderTop: "2px solid transparent",
                      borderRadius: "50%",
                      animation: "spin 1s linear infinite"
                    }}
                  ></div>
                  <span>AI is thinking...</span>
                </div>
              ) : (
                "Generate Fix"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const container = document.getElementById("popup-root");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
