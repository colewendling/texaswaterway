'use server';

import fs from 'fs/promises';
import path from 'path';
import Papa from 'papaparse';

export const fetchAndSaveLakeData = async (lakeId: string) => {
  const apiUrl = `https://waterdatafortexas.org/reservoirs/individual/${lakeId}.csv`;
  const response = await fetch(apiUrl);

  if (!response.ok) {
    throw new Error(`Failed to fetch data for lake: ${lakeId}`);
  }

  let csvData = await response.text();

  // Preprocess the CSV to remove comments and invalid rows
  csvData = csvData
    .split('\n')
    .filter((line) => !line.startsWith('#') && line.trim() !== '') // Remove comments and empty lines
    .join('\n');

  // Parse the cleaned CSV
  const parsedData = Papa.parse(csvData, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true, // Automatically convert numbers and booleans
  });

  // Clean the parsed data
  const cleanedData = parsedData.data
    .filter((row: any) => row.date) // Ensure rows have a valid date
    .map((row: any) => ({
      date: row.date || null,
      water_level: row.water_level || null,
      surface_area: row.surface_area || null,
      reservoir_storage: row.reservoir_storage || null,
      conservation_storage: row.conservation_storage || null,
      percent_full: row.percent_full || null,
      conservation_capacity: row.conservation_capacity || null,
      dead_pool_capacity: row.dead_pool_capacity || null,
    }));

  // Create the final object with metadata and data
  const lakeData = {
    id: lakeId,
    lastUpdated: new Date().toISOString().split('T')[0], // Format as YYYY-MM-DD
    data: cleanedData,
  };

  // Define the file path
  const filePath = path.join(process.cwd(), 'data/lakes', `${lakeId}.json`);

  // Save the final object to the file (replace if it exists)
  await fs.writeFile(filePath, JSON.stringify(lakeData, null, 2));

  return lakeData;
};

// Server Action to fetch Lake Data file by Lake Id
export async function fetchLakeData(lakeId: string) {
  try {
    const filePath = path.join(process.cwd(), 'data/lakes', `${lakeId}.json`);
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(fileContent);
    return data.data; // Return only the `data` array
  } catch (error) {
    console.error('Error fetching lake data:', error);
    throw new Error('Failed to fetch lake data.');
  }
}
