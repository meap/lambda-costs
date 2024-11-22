import { CloudWatchClient, GetMetricStatisticsCommand } from "@aws-sdk/client-cloudwatch";
import { LambdaClient, ListFunctionsCommand, GetFunctionConfigurationCommand } from "@aws-sdk/client-lambda";
import fs from "fs/promises";
import path from "path";

// AWS Clients
const cloudWatchClient = new CloudWatchClient({});
const lambdaClient = new LambdaClient({});

// Function to list all Lambda functions
async function listLambdaFunctions() {
  let functions = [];
  let nextMarker = null;

  do {
    const params = { Marker: nextMarker };
    const command = new ListFunctionsCommand(params);
    const response = await lambdaClient.send(command);
    functions = functions.concat(response.Functions || []);
    nextMarker = response.NextMarker;
  } while (nextMarker);

  return functions;
}

// Function to fetch metrics
async function getMetric(functionName, metricName, statistic, startTime, endTime) {
  const params = {
    Namespace: "AWS/Lambda",
    MetricName: metricName,
    Dimensions: [{ Name: "FunctionName", Value: functionName }],
    StartTime: startTime,
    EndTime: endTime,
    Period: 2592000,
    Statistics: [statistic],
  };

  const command = new GetMetricStatisticsCommand(params);
  const response = await cloudWatchClient.send(command);

  return response.Datapoints?.[0]?.[statistic] || 0;
}

// Function to fetch Lambda configuration
async function getLambdaConfig(functionName) {
  const command = new GetFunctionConfigurationCommand({ FunctionName: functionName });
  const response = await lambdaClient.send(command);
  return {
    memorySizeMB: response.MemorySize,
    ephemeralStorageMB: response.EphemeralStorage?.Size || 512,
  };
}

// Function to create CSV row
function createCsvRow(data) {
  return [
    data.LambdaFunction,
    data.MemoryAllocatedMB,
    data.EphemeralStorageMB,
    data.Invocations,
    data.DurationMilliseconds,
    data.InvocationCostUSD,
    data.DurationCostUSD,
    data.StorageCostUSD,
    data.TotalCostUSD,
  ].join(",");
}

// Main function
async function processMonth(monthYear) {
  try {
    const [month, year] = monthYear.split('.').map(Number);
    const startTime = new Date(year, month - 1, 1);
    const endTime = new Date(year, month, 0, 23, 59, 59);

    const outputDir = "costs";
    const outputFile = path.join(outputDir, `lambda_costs_${monthYear}.csv`);

    // Create output directory
    await fs.mkdir(outputDir, { recursive: true });

    // Fetch Lambda functions
    const functions = await listLambdaFunctions();
    console.log(`Found ${functions.length} Lambda functions for ${monthYear}.`);

    let results = [];

    for (const func of functions) {
      const functionName = func.FunctionName;
      console.log(`Processing function: ${functionName} for ${monthYear}`);

      try {
        const { memorySizeMB, ephemeralStorageMB } = await getLambdaConfig(functionName);
        const memorySizeGB = memorySizeMB / 1024;

        const invocations = await getMetric(functionName, "Invocations", "Sum", startTime, endTime);
        const durationMs = await getMetric(functionName, "Duration", "Sum", startTime, endTime);
        const durationSeconds = durationMs / 1000;

        const gbSeconds = durationSeconds * memorySizeGB;
        const durationCost = gbSeconds * 0.0000166667;
        const invocationCost = (invocations / 1_000_000) * 0.20;

        let storageCost = 0;
        if (ephemeralStorageMB > 512) {
          const extraStorageGB = (ephemeralStorageMB / 1024) - 0.5;
          const storageGBSeconds = extraStorageGB * durationSeconds;
          storageCost = storageGBSeconds * 0.000009;
        }

        const totalCost = durationCost + invocationCost + storageCost;

        results.push({
          LambdaFunction: functionName,
          MemoryAllocatedMB: memorySizeMB,
          EphemeralStorageMB: ephemeralStorageMB,
          Invocations: invocations,
          DurationMilliseconds: durationMs,
          InvocationCostUSD: invocationCost.toFixed(6),
          DurationCostUSD: durationCost.toFixed(6),
          StorageCostUSD: storageCost.toFixed(6),
          TotalCostUSD: totalCost.toFixed(6),
        });
      } catch (error) {
        console.error(`Error processing function ${functionName} for ${monthYear}:`, error);
      }
    }

    results.sort((a, b) => parseFloat(b.TotalCostUSD) - parseFloat(a.TotalCostUSD));

    const headers = [
      "FunctionName",
      "MemoryAllocatedMB",
      "EphemeralStorageMB",
      "Invocations",
      "DurationMilliseconds",
      "InvocationCostUSD",
      "DurationCostUSD",
      "StorageCostUSD",
      "TotalCostUSD",
    ].join(",") + "\n";

    const csvContent = headers + results.map(createCsvRow).join("\n");

    await fs.writeFile(outputFile, csvContent);
    console.log(`Metrics and costs saved to ${outputFile}`);
  } catch (error) {
    console.error(`Error processing ${monthYear}:`, error);
  }
}

async function main(months) {
  for (const monthYear of months) {
    await processMonth(monthYear);
  }
}

// Example usage
main(["11.2024", "10.2024", "9.2024", "8.2024"]);
