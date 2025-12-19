
import React, { useEffect, useRef } from 'react';
import type { DataRow } from '../types';

declare global {
  interface Window {
    luckysheet: any;
  }
}

interface SheetViewProps {
  data: DataRow[];
}

// Helper function to transform JSON array of objects to Luckysheet's required celldata format
const transformDataForLuckysheet = (data: DataRow[]) => {
    if (!data || data.length === 0) {
        return [];
    }
    
    const headers = Object.keys(data[0]);
    const celldata: { r: number; c: number; v: any }[] = [];

    // Create header row
    headers.forEach((header, index) => {
        celldata.push({
            r: 0,
            c: index,
            v: { v: header, m: String(header), bl: 1 } // v: value, m: display value, bl: bold
        });
    });

    // Create data rows
    data.forEach((row, rowIndex) => {
        headers.forEach((header, colIndex) => {
            const value = row[header];
            celldata.push({
                r: rowIndex + 1,
                c: colIndex,
                v: value
            });
        });
    });
    
    return celldata;
};


export const SheetView: React.FC<SheetViewProps> = ({ data }) => {
  const isInitialized = useRef(false);
  
  useEffect(() => {
    if (data.length > 0 && !isInitialized.current) {
      try {
        const celldata = transformDataForLuckysheet(data);
        const options = {
          container: 'luckysheet', // the id of the container
          lang: 'en',
          data: [
            {
              name: 'Sheet1',
              celldata: celldata,
              order: 0,
              index: 0,
              status: 1,
            }
          ],
          // Dark Theme Configuration
          theme: 'dark',
          // More advanced features can be configured here
          showinfobar: false,
          showtoolbar: true,
          showsheetbar: true,
          showstatisticbar: true,
        };
        
        window.luckysheet.create(options);
        isInitialized.current = true;

      } catch (error) {
        console.error("Failed to initialize Luckysheet:", error);
      }
    }
    
    return () => {
        // Cleanup when component unmounts or data is reset
        if (window.luckysheet) {
            window.luckysheet.destroy();
            isInitialized.current = false;
        }
    };
  }, [data]);

  // The container div for Luckysheet must be in the DOM when the component mounts.
  return <div id="luckysheet" className="absolute top-0 left-0 w-full h-full"></div>;
};
