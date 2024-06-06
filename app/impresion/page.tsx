'use client'
import Image from 'next/image'
import React, { useState, useEffect } from 'react';

const GoogleSheetData = () => {
  const [sheetData, setSheetData] = useState<{ [key: string]: string }[]>([]);
  const [selectedQRs, setSelectedQRs] = useState<string[]>([]);
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

  const handleToggleQR = (link: string) => {
    setSelectedQRs((prevSelectedQRs) =>
      prevSelectedQRs.includes(link)
        ? prevSelectedQRs.filter((qr) => qr !== link)
        : [...prevSelectedQRs, link]
    );
  };

  const handlePrintSelectedQRs = () => {
    if (selectedQRs.length === 0) return;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Print QR</title>
            <style>
              body { display: flex; flex-wrap: wrap; justify-content: center; align-items: center; padding: 20px; }
              img { margin: 10px; border: 5px solid black; }
            </style>
          </head>
          <body>
            ${selectedQRs.map((link) => `<img src="${link}" alt="QR Code" />`).join('')}
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
              <input
                type="checkbox"
                checked={selectedQRs.includes(item["QRserv\r"])}
                onChange={() => handleToggleQR(item["QRserv\r"])}
              /> Seleccionar para imprimir
            </div>
          </li>
        ))}
      </ul>
      <button onClick={handlePrintSelectedQRs}>Imprimir QR seleccionados</button>
    </div>
  );
};

const ImageDisplay = ({ link }: ImageDisplayProps) => {
  return (
    <div>
      <img src={link} alt="Imagen" />
    </div>
  );
};

interface ImageDisplayProps {
  link: string;
}

export default GoogleSheetData;
