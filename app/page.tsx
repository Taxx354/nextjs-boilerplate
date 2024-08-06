'use client';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';

// Componente para mostrar la imagen
const ImageDisplay = ({ url }: { url: string }) => {
  const getFileIdFromUrl = (url: string) => {
    const regex = /id=([^&]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const cleanUrl = url.trim(); // Limpiar el enlace de caracteres innecesarios
  const fileId = getFileIdFromUrl(cleanUrl);

  return (
    <div>
      {fileId ? (
        <iframe
          src={`https://drive.google.com/file/d/${fileId}/preview`}
          width="100%"
          height="400px"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      ) : (
        <p>QR no disponible</p>
      )}
    </div>
  );
};

// Componente principal
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

          if (dni) {
            const filteredData = jsonData.filter(item => String(item['DNI del dueño de la mascota (sin puntos)']) === dni);
            if (Array.isArray(filteredData)) {
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
  }, []);

  const handlePrintQR = () => {
    if (!selectedQR) return;

    const cleanSelectedQR = selectedQR.trim(); // Limpiar el enlace de caracteres innecesarios

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Print QR</title>
            <style>
              body { display: flex; flex-wrap: wrap; justify-content: flex-end; align-items: flex-end; padding: 20px; }
              img { width: 1.5cm; height: 1.5cm; margin: 5px; border: 1px solid black; position: absolute; right: 10px; top: 10px; }
            </style>
          </head>
          <body>
            ${Array(numCopies).fill(`<img src="${cleanSelectedQR}" alt="QR Code" />`).join('')}
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
    <div>
      <header>
        <div className='div-head'>
          <Image src="/app/Logos.png" alt="Logos" width={75} height={75} />
          <h1><strong> IDENTIFICACIÓN MASCOTAS</strong></h1>
        </div>
        <br />
      </header>
      <br />
      <br />
      <div className='div-centrado'>
        <div className='contenedor'>
          <br/>
          <ul>
            {sheetData.map((item, index) => (
              <li key={index}>
                <div className='contenedor'>
                  <ImageDisplay url={item['Subir una Imagen de Frente de la Mascota']} />
                </div>
                <div className='contenedor'>
                  <ImageDisplay url={item['Subir una Imagen de Perfil de la mascota']} />
                </div>
                <br />
                <br />
                <strong>Nombre dueño</strong>: {item['Nombre del Dueño de la Mascota']} {item['Apellido del Dueño de la Mascota']}
                <br />
                <strong>Nombre mascota</strong>: {item['Nombre de la MASCOTA']}
                <br />
                <strong>Tipo de mascota</strong>: {item['Tipo de Mascota']}
                <br />
                <strong>Característica adicional</strong>: {item['Algún comentario particular de la mascota Ej: manchas o rasgos a tener en cuenta']}
                <br />
                <strong>Teléfono celular del dueño</strong>: {item['Teléfono del Dueño de la mascota']}
                <br />
                <strong>Correo electrónico</strong>: {item['Dirección de correo electrónico']}
                <br />
                <strong>Dirección</strong>: {item['Dirección (calle número)']}
                <br />
                <strong>Localidad</strong>: {item['Localidad']}
                <br />
                <button onClick={() => setSelectedQR(item["QRserv\r"].trim())}>Imprimir QR</button>
                <br />
                <a
                 href={`https://wa.me/${item['Teléfono del Dueño de la mascota']}?text=Hola, encontré a tu mascota "${item['Nombre de la MASCOTA']}"`}
                target="_blank"
                rel="noopener noreferrer"
                >
                <Image src="/app/whalogo.png" alt="Enviar mensaje por WhatsApp" width={32} height={32} />
                </a>

              </li>
            ))}
          </ul>
        </div>
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
            <button onClick={handlePrintQR}>Imprimir</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoogleSheetData;
