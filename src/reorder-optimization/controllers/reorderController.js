const { PythonShell } = require("python-shell");
const path = require("path");

// Controller for Reorder Recommendation
exports.getReorderRecommendation = async (req, res) => {
  try {
    const { stockId, restaurantId } = req.params;

    // Use the system's default Python command (assumes Python is in PATH)
    const pythonPath = "python"; // Use "python3" if needed on the target machine
    // Resolve script path relative to the current file
    const scriptDir = path.join(__dirname, "..", "scripts"); // Navigate up one level to src/reorder-optimization, then into scripts

    let options = {
      mode: "text",
      pythonPath: pythonPath,
      pythonOptions: ["-u"],
      scriptPath: scriptDir,
      args: [stockId, restaurantId, "reorder"],
      timeout: 30000,
    };

    const pythonShell = new PythonShell("reorder.py", options);
    let messages = [];

    pythonShell.on("message", (message) => messages.push(message));
    pythonShell.on("stderr", (stderr) => console.error("Python stderr:", stderr));
    pythonShell.on("error", (error) => console.error("Python error:", error));
    pythonShell.on("close", (code, signal) => console.log("Python process closed with code:", code, "signal:", signal));

    pythonShell.end((err, code, signal) => {
      if (err) return res.status(500).json({ error: err.message || "Python script execution failed" });
      try {
        const jsonLine = messages.find((msg) => msg.startsWith("{"));
        if (!jsonLine) throw new Error("No JSON output found in Python script results");
        const result = JSON.parse(jsonLine);
        res.status(200).json(result);
      } catch (parseErr) {
        res.status(500).json({ error: "Failed to parse Python script output" });
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Controller for Consumption Data
exports.getConsumptionData = async (req, res) => {
  try {
    const { stockId, restaurantId } = req.params;
    const scriptDir = path.join(__dirname, "..", "scripts");

    let options = {
      mode: "text",
      pythonPath: "python",
      pythonOptions: ["-u"],
      scriptPath: scriptDir,
      args: [stockId, restaurantId, "consumption"],
      timeout: 30000,
    };

    const pythonShell = new PythonShell("reorder.py", options);
    let messages = [];

    pythonShell.on("message", (message) => messages.push(message));
    pythonShell.on("stderr", (stderr) => console.error("Python stderr:", stderr));

    pythonShell.end((err) => {
      if (err) return res.status(500).json({ error: err.message || "Python script execution failed" });
      try {
        const jsonLine = messages.find((msg) => msg.startsWith("["));
        if (!jsonLine) throw new Error("No JSON output found in Python script results");
        const result = JSON.parse(jsonLine);
        res.status(200).json({ data: result });
      } catch (parseErr) {
        res.status(500).json({ error: "Failed to parse Python script output" });
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Controller for Forecast Data
exports.getForecastData = async (req, res) => {
  try {
    const { stockId, restaurantId } = req.params;
    const scriptDir = path.join(__dirname, "..", "scripts");

    let options = {
      mode: "text",
      pythonPath: "python",
      pythonOptions: ["-u"],
      scriptPath: scriptDir,
      args: [stockId, restaurantId, "forecast"],
      timeout: 30000,
    };

    const pythonShell = new PythonShell("reorder.py", options);
    let messages = [];

    pythonShell.on("message", (message) => messages.push(message));
    pythonShell.on("stderr", (stderr) => console.error("Python stderr:", stderr));

    pythonShell.end((err) => {
      if (err) return res.status(500).json({ error: err.message || "Python script execution failed" });
      try {
        const jsonLine = messages.find((msg) => msg.startsWith("["));
        if (!jsonLine) throw new Error("No JSON output found in Python script results");
        const result = JSON.parse(jsonLine);
        res.status(200).json({ data: result });
      } catch (parseErr) {
        res.status(500).json({ error: "Failed to parse Python script output" });
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};