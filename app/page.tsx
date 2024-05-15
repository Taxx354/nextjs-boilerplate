'use client'
import React, { useState, useEffect } from 'react';

const GoogleSheetData = () => {
  const [sheetData, setSheetData] = useState<{ [key: string]: string }[]>([]);
  const url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ6K-g3BOeuMtXmXQ-3hUxKPKd9DVN48vSLH2M8vPtcjByFcvwtY7mwL735kd46cu-W3rAglI-PBJUq/pub?output=csv';

  useEffect(() => {
    const fetchSheetData = async () => {
      //console.log(dni);
      try {
        const response = await fetch(url);
        const data = await response.text();

        const lines = data.split('\n');
        const headers = lines[0].split(',');
        const jsonData = [];

        for (let i = 1; i < lines.length; i++) {
          const currentLine = lines[i].split(',');
          const obj: { [key: string]: string } = {};

          for (let j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentLine[j];
          }

          jsonData.push(obj);
        }

        if (typeof window !== 'undefined') {
          const params = new URLSearchParams(window.location.search);
          const dni = params.get('dni');
  
          if (dni) {
            const filteredData = jsonData.filter(item => item.dni === dni);
            if (Array.isArray(filteredData)) {
              // Actualiza el estado sheetData con los datos obtenidos
              setSheetData(filteredData);
            }
            console.log(filteredData);
          } else {
            console.log('No se proporcionó un DNI en los parámetros GET.');
          }
        }
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }

    };

    fetchSheetData();
  }, []); // Ejecutar una sola vez al cargar el componente

  return (
    <div>
      <h1>Datos de Google Sheets</h1>
      <ul>
       {sheetData.map((item, index) => (
          <li key={index}>
            <strong>{item.Raza}</strong> - {item.dni}
          </li>
        ))}
      </ul>
    </div>
  );
  
};

export default GoogleSheetData;