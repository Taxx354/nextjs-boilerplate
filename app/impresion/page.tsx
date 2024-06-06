'use client'
import Image from 'next/image'
import React, { useState, useEffect } from 'react';

const GoogleSheetData = () => {
  const [sheetData, setSheetData] = useState<{ [key: string]: string }[]>([]);
  const [selectedQR, setSelectedQR] = useState<string | null>(null);
  const [numCopies, setNumCopies] = useState(1);
  const url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR9s1KZEX30u4NRRrCakzW3EaqQObHh4jAB9HJ5GUybTdceeRagq76vE1T8CwN5FJ-gmsvdZcdsNT4M/pub?output=csv';

  useEffect(() => {
    const fetchSheetData = async () => {
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
          const objetoinverso = jsonData.reverse();
          let limitedData = objetoinverso.slice(0, 5);
          setSheetData(limitedData);
        }
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    fetchSheetData();
  }, []);

  const handlePrintQR = () => {
    if (!selectedQR) return;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Print QR</title>
            <style>
              body { display: flex; flex-wrap: wrap; justify-content: center; align-items: center; padding: 20px; }
              img { width: 1.5cm; height: 1.5cm; margin: 5px; border: 1px solid black; }
            </style>
          </head>
          <body>
            ${Array(numCopies).fill(`<img src="${selectedQR}" alt="QR Code" />`).join('')}
            <script>
              window.onload = function() {
                window.print();
                window.onafterprint = function() {
                  window.close();
                };
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <div className='fondo'>
      <h1>Ultimos agregados</h1>
      <ul>
        {sheetData.map((item, index) => (
          <li key={index}>
            <div className='contenedor'>
              <strong>DNI</strong>: {item['DNI del dueño de la mascota (sin puntos)']}
              <br />
              <strong>QR</strong>: <ImageDisplay link={item["QRserv\r"]} />
              <br />
              <button onClick={() => setSelectedQR(item["QRserv\r"])}>Seleccionar QR</button>
            </div>
          </li>
        ))}
      </ul>
      {selectedQR && (
        <div>
          <label>
            Cantidad de copias (1-5):
            <input
              type="number"
              min="1"
              max="5"
              value={numCopies}
              onChange={(e) => setNumCopies(Math.min(5, Math.max(1, parseInt(e.target.value))))}
            />
          </label>
          <button onClick={handlePrintQR}>Imprimir QR</button>
        </div>
      )}
    </div>
  );
};

const ImageDisplay = ({ link }: ImageDisplayProps) => {
  return (
    <div>
      <img src={link} alt="Imagen" style={{ width: '1.5cm', height: '1.5cm' }} />
    </div>
  );
};

interface ImageDisplayProps {
  link: string;
}

export default GoogleSheetData;
