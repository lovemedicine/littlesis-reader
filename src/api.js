import { awsCloudSearchApiKey, apiDomain, apiKey } from "./config.js";

export async function findLittlesisEntities(query) {
  const endpoint =
    "https://2c76ayi2ic.execute-api.us-east-1.amazonaws.com/search";
  const url = `${endpoint}?q=${encodeURIComponent(query)}&q.parser=structured`;
  const headers = { "X-Api-Key": awsCloudSearchApiKey };
  const response = await fetch(url, { headers });
  return await response.json();
}

export async function callBackendFunction(functionName, requestData) {
  const response = await fetch(`${apiDomain}/api/${functionName}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Api-Key": apiKey,
    },
    body: JSON.stringify(requestData),
  });
  const { data } = await response.json();
  return data;
}
