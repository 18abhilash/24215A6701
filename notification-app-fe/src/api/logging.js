export const requestLog = [];
export const responseLog = [];

const LOG_API_URL = "http://4.224.186.213/evaluation-service/logs";
const ACCESS_TOKEN85 = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiIyNDIxNWE2NzAxQGJ2cml0LmFjLmluIiwiZXhwIjoxNzgyMzg0MjczLCJpYXQiOjE3ODIzODMzNzMsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiI4NTI2YjRiMi1lMjlkLTQ2OGEtOTZhYi1kZTM0YThiZDI5ZmMiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJrYXl5YSBhYmhpbGFzaCIsInN1YiI6IjIwYjI1NDY0LTllZDctNDZkNy1iODk0LTQyZTU5ZjI5MzQwZSJ9LCJlbWFpbCI6IjI0MjE1YTY3MDFAYnZyaXQuYWMuaW4iLCJuYW1lIjoia2F5eWEgYWJoaWxhc2giLCJyb2xsTm8iOiIyNDIxNWE2NzAxIiwiYWNjZXNzQ29kZSI6ImFoWGp2cCIsImNsaWVudElEIjoiMjBiMjU0NjQtOWVkNy00NmQ3LWI4OTQtNDJlNTlmMjkzNDBlIiwiY2xpZW50U2VjcmV0IjoiQmhjZllSWUpCY0RXbmR1SCJ9.PeBUT-16tgYLMxkpOcfs-oFr4IOZw95E2mxytkpkKqw"


function captureResponse(url, status, data) {
  responseLog.push({ url, status, timestamp: new Date().toISOString(), data });
}

async function sendLog(stack, level, packageName, message) {
  try {
    await fetch(LOG_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        stack,
        level,
        package: packageName,
        message,
      }),
    });
  } catch (err) {
    console.error("Failed to send log:", err);
  }
}

export async function fetchWithLogging(url, options = {}) {
  captureRequest(url, options);

  try {
    const response = await fetch(url, options);
    const clone = response.clone();

    let responseData;
    try {
      responseData = await clone.json();
    } catch (error) {
      responseData = { message: "Non-JSON response" };
    }

    captureResponse(url, response.status, responseData);

    if (!response.ok) {
      const errMsg = responseData?.message || `Request failed with status ${response.status}`;
      sendLog("frontend", "error", "api", `API call failed: ${errMsg}`);
      throw new Error(errMsg);
    }

    sendLog("frontend", "info", "api", `API call succeeded: ${url}`);
    return response;
  } catch (err) {
    sendLog("frontend", "error", "api", `API error: ${err?.message || "Unknown error"}`);
    throw err;
  }
}
