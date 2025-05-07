const { PythonShell } = require("python-shell");
const path = require("path");

exports.getReorderRecommendation = async (req, res) => {
  try {
    console.log("Step 1: Entering getReorderRecommendation function");
    const { stockId, restaurantId } = req.params;
    console.log("Step 2: Extracted parameters - stockId:", stockId, "restaurantId:", restaurantId);

    const timeout = 30000;
    console.log("Step 3: Set timeout to", timeout, "milliseconds");

    if (!stockId.match(/^[0-9a-fA-F]{24}$/) || !restaurantId.match(/^[0-9a-fA-F]{24}$/)) {
      console.log("Step 4: Validation failed - Invalid ObjectId format");
      return res.status(400).json({ error: "Invalid stockId or restaurantId" });
    }
    console.log("Step 4: Validation passed for stockId and restaurantId");

    const scriptPath = "C:\\Users\\ASUS\\Documents\\GitHub\\The-menufy-microservices\\ThemenufyEspritPITwin2025-ERP-backend-app\\src\\reorder-optimization\\scripts";
    console.log("Step 5: Resolved scriptPath:", scriptPath);

    let options = {
      mode: "text",
      pythonPath: "C:\\Users\\ASUS\\AppData\\Local\\Programs\\Python\\Python313\\python.exe",
      pythonOptions: ["-u"],
      scriptPath: scriptPath,
      args: [stockId, restaurantId, "reorder"],
      timeout: timeout,
    };
    console.log("Step 6: Configured PythonShell options:", options);

    console.log("Step 7: Initiating PythonShell.run for reorder.py");
    const pythonShell = new PythonShell("reorder.py", options);

    let messages = [];
    pythonShell.on("message", (message) => {
      console.log("Step 7b: Received message from Python:", message);
      messages.push(message);
    });

    pythonShell.on("stderr", (stderr) => {
      console.error("Step 7c: Python stderr:", stderr);
    });

    pythonShell.on("error", (error) => {
      console.error("Step 7d: Python error:", error);
    });

    pythonShell.on("close", (code, signal) => {
      console.log("Step 7e: Python process closed with code:", code, "signal:", signal);
    });

    pythonShell.end((err, code, signal) => {
      console.log("Step 8: Inside PythonShell end callback - Checking for errors");
      if (err) {
        console.error("Step 8a: PythonShell End Error Details:", {
          message: err.message,
          code: code,
          signal: signal,
          stack: err.stack,
        });
        return res.status(500).json({ error: err.message || "Python script execution failed" });
      }
      console.log("Step 8b: No errors - Process ended, retrieving results");

      try {
        console.log("Step 9: All messages received:", messages);
        const jsonLine = messages.find((msg) => msg.startsWith("{"));
        if (!jsonLine) {
          throw new Error("No JSON output found in Python script results");
        }
        console.log("Step 9a: Found JSON line:", jsonLine);
        const result = JSON.parse(jsonLine);
        console.log("Step 9b: Successfully parsed result:", result);
        res.status(200).json(result);
      } catch (parseErr) {
        console.error("Step 9c: Parse Error Details:", parseErr);
        res.status(500).json({ error: "Failed to parse Python script output" });
      }
      console.log("Step 9d: Response sent to client");
    });
    console.log("Step 7a: PythonShell.run initiated - Awaiting callback");
  } catch (err) {
    console.error("Step 10: Caught unhandled error in try-catch:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getConsumptionData = async (req, res) => {
  try {
    const { stockId, restaurantId } = req.params;
    const scriptPath = "C:\\Users\\ASUS\\Documents\\GitHub\\The-menufy-microservices\\ThemenufyEspritPITwin2025-ERP-backend-app\\src\\reorder-optimization\\scripts";

    let options = {
      mode: "text",
      pythonPath: "C:\\Users\\ASUS\\AppData\\Local\\Programs\\Python\\Python313\\python.exe",
      pythonOptions: ["-u"],
      scriptPath: scriptPath,
      args: [stockId, restaurantId, "consumption"],
      timeout: 30000,
    };

    const pythonShell = new PythonShell("reorder.py", options);
    let messages = [];

    pythonShell.on("message", (message) => {
      messages.push(message);
    });

    pythonShell.on("stderr", (stderr) => {
      console.error("Python stderr:", stderr);
    });

    pythonShell.end((err) => {
      if (err) {
        return res.status(500).json({ error: err.message || "Python script execution failed" });
      }
      try {
        const jsonLine = messages.find((msg) => msg.startsWith("["));
        if (!jsonLine) {
          throw new Error("No JSON output found in Python script results");
        }
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

exports.getForecastData = async (req, res) => {
  try {
    const { stockId, restaurantId } = req.params;
    const scriptPath = "C:\\Users\\ASUS\\Documents\\GitHub\\The-menufy-microservices\\ThemenufyEspritPITwin2025-ERP-backend-app\\src\\reorder-optimization\\scripts";

    let options = {
      mode: "text",
      pythonPath: "C:\\Users\\ASUS\\AppData\\Local\\Programs\\Python\\Python313\\python.exe",
      pythonOptions: ["-u"],
      scriptPath: scriptPath,
      args: [stockId, restaurantId, "forecast"],
      timeout: 30000,
    };

    const pythonShell = new PythonShell("reorder.py", options);
    let messages = [];

    pythonShell.on("message", (message) => {
      messages.push(message);
    });

    pythonShell.on("stderr", (stderr) => {
      console.error("Python stderr:", stderr);
    });

    pythonShell.end((err) => {
      if (err) {
        return res.status(500).json({ error: err.message || "Python script execution failed" });
      }
      try {
        const jsonLine = messages.find((msg) => msg.startsWith("["));
        if (!jsonLine) {
          throw new Error("No JSON output found in Python script results");
        }
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