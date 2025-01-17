// Replace this URL with your deployed Google Apps Script web app URL
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxJCEdvm7SeRfEHMB0DAfHJwTRftpNBy-0mjAy1zXqIpo4HTXVxkAhJ4cAf4_uXQoHc0Q/exec';

const cache = new Map<string, any>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function fetchSheetList(): Promise<SheetInfo[]> {
  const cacheKey = 'sheetList';
  const cachedData = cache.get(cacheKey);
  
  if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
    return cachedData.data;
  }

  try {
    const response = await fetch(`${APPS_SCRIPT_URL}?action=getSheets`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    if (!Array.isArray(data)) {
      throw new Error('Invalid data format received from Apps Script');
    }

    cache.set(cacheKey, { data, timestamp: Date.now() });
    
    return data;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    throw new Error(`Failed to fetch sheet list: ${message}`);
  }
}

export async function fetchSheetData(sheetName: string): Promise<any> {
  const cacheKey = `sheetData_${sheetName}`;
  const cachedData = cache.get(cacheKey);
  
  if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
    return cachedData.data;
  }

  if (!APPS_SCRIPT_URL) {
    throw new Error(
      'Apps Script URL not configured. Please deploy your Google Apps Script and set the URL.'
    );
  }

  try {
    const response = await fetch(`${APPS_SCRIPT_URL}?action=getData&sheet=${sheetName}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    if (!Array.isArray(data)) {
      throw new Error('Invalid data format received from Apps Script');
    }

    cache.set(cacheKey, { data, timestamp: Date.now() });
    
    return data;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    throw new Error(`Failed to fetch sheet data: ${message}`);
  }
}

export function parseSheetData(rawData: any[]): ActivationData[] {
  // Skip header rows
  const dataRows = rawData.slice(2);
  const validRows = dataRows.filter(row => row[1] && row[1].trim() !== '');
  
  if (!validRows || !Array.isArray(validRows)) {
    throw new Error('Invalid data format: Expected array of rows');
  }
  
  return validRows.map(row => ({
    empId: row[0],
    agentName: row[1],
    silver: parseInt(row[2]) || 0,
    gold: parseInt(row[3]) || 0,
    platinum: parseInt(row[4]) || 0,
    standard: parseInt(row[5]) || 0,
    total: parseInt(row[6]) || 0,
    target: parseInt(row[7]) || 0,
    achieved: parseInt(row[8]) || 0,
    remaining: parseInt(row[9]) || 0
  }));
}