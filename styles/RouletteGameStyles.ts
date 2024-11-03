// RouletteGameStyles.ts

export const styles: { [key: string]: React.CSSProperties } = {
  container: {
    position: "relative", // To enable absolute positioning of child elements
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    minHeight: "100vh",
    backgroundImage: `url('../../casino.jpg')`, // Optional: Add a background image
    backgroundSize: "cover",
    backgroundPosition: "center",
    color: "#ffffff",
    fontFamily: "Comic Sans MS, cursive, sans-serif", // Changed font for a more "cartoonish" look
    overflow: "auto",
  },

  faucet: {
    display: "flex",
    border: "2px solid #ffffff",
  },

  connectKitContainer: {
    position: "absolute",
    top: "20px",
    left: "20px",
    zIndex: 1000, // Ensures the button stays on top
  },
  title: {
    fontSize: "48px",
    fontWeight: "bold",
    marginBottom: "20px",
    textAlign: "center",
    textShadow: "2px 2px 4px #000000",
  },
  inputsContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: "20px",
    marginBottom: "20px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  label: {
    fontSize: "18px",
    marginBottom: "5px",
    textShadow: "1px 1px 2px #000000",
  },
  input: {
    width: "150px",
    padding: "8px",
    fontSize: "16px",
    borderRadius: "10px",
    border: "2px solid #ffffff",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    color: "#ffffff",
    textAlign: "center",
    boxShadow: "inset 0 0 5px #000000",
  },

  sliderContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "20px",
  },
  slider: {
    width: "80%",
    maxWidth: "600px",
    cursor: "pointer",
    WebkitAppearance: "none",
    appearance: "none",
    height: "15px",
    background: "#ddd",
    outline: "none",
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: "inset 0 0 5px #000000",
  },
  probabilityDisplay: {
    marginTop: "10px",
    fontSize: "24px",
    fontWeight: "bold",
    textShadow: "1px 1px 2px #000000",
  },
  pointer: {
    position: "absolute",
    top: "0px",
    left: "50%",
    marginLeft: "-10px",
    width: "0",
    height: "0",
    borderLeft: "10px solid transparent",
    borderRight: "10px solid transparent",
    borderBottom: "20px solid white", // Changed color to gold
    zIndex: 1,
  },

  result: {
    marginTop: "20px",
    textAlign: "center",
    fontSize: "24px",
    fontWeight: "bold",
    textShadow: "1px 1px 2px #000000",
  },
  backButton: {
    marginTop: "30px",
    padding: "12px 24px",
    fontSize: "18px",
    cursor: "pointer",
    border: "none",
    borderRadius: "15px",
    backgroundColor: "#1E90FF",
    color: "#fff",
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.3)",
    transition: "background-color 0.3s, opacity 0.3s",
  },
};
