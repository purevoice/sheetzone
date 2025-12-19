
import { useState, useCallback, useRef, useEffect } from 'react';
import type * as XLSX from 'xlsx';
import type { DataRow } from '../types';

declare global {
  interface Window {
    XLSX: typeof XLSX;
  }
}

const workerScript = `
  self.importScripts('https://cdn.sheetjs.com/xlsx-latest/package/dist/xlsx.full.min.js');

  self.onmessage = (e) => {
    const file = e.data;
    if (!file) {
      self.postMessage({ type: 'ERROR', payload: 'No file received by worker.' });
      return;
    }
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const binaryStr = event.target.result;
        if (!binaryStr) {
          throw new Error("Failed to read file. It might be empty or corrupted.");
        }
        const workbook = self.XLSX.read(binaryStr, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        if (!firstSheetName) {
          throw new Error("The Excel/CSV file does not contain any sheets.");
        }
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = self.XLSX.utils.sheet_to_json(worksheet);
        
        if (jsonData.length === 0) {
            throw new Error("The selected file is empty or could not be parsed into a usable format.");
        }
        self.postMessage({ type: 'SUCCESS', payload: jsonData });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred in the worker.';
        self.postMessage({ type: 'ERROR', payload: errorMessage });
      }
    };
    reader.onerror = () => {
        self.postMessage({ type: 'ERROR', payload: 'The file could not be read by the worker.' });
    };

    reader.readAsBinaryString(file);
  };
`;

export const useFileProcessor = () => {
  const [data, setData] = useState<DataRow[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const workerRef = useRef<Worker | null>(null);

  const cleanupWorker = () => {
    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
    }
  };

  useEffect(() => {
    return cleanupWorker;
  }, []);

  const processFile = useCallback((file: File) => {
    setIsLoading(true);
    setError(null);
    setData([]);

    cleanupWorker();

    try {
      const blob = new Blob([workerScript], { type: 'application/javascript' });
      const worker = new Worker(URL.createObjectURL(blob));
      workerRef.current = worker;
      
      worker.onmessage = (e) => {
          const { type, payload } = e.data;
          if (type === 'SUCCESS') {
              setData(payload);
          } else {
              setError(`Error processing file: ${payload}`);
          }
          setIsLoading(false);
          cleanupWorker();
      };

      worker.onerror = (e) => {
          console.error(e);
          setError(`A web worker error occurred: ${e.message}. This may be due to browser limitations.`);
          setIsLoading(false);
          cleanupWorker();
      };
      
      worker.postMessage(file);
    } catch (err) {
      console.error(err);
      setError("Failed to initialize the data processing worker. Your browser might not support it.");
      setIsLoading(false);
    }
  }, []);
  
  const reset = useCallback(() => {
    setData([]);
    setError(null);
    setIsLoading(false);
    cleanupWorker();
  }, []);

  return { data, isLoading, error, processFile, reset };
};
