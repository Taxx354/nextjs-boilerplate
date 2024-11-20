'use client';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import Head from 'next/head';

// Componente para mostrar la imagen
const ImageDisplay = ({ url }: { url: string }) => {
  const getFileIdFromUrl = (url: string) => {
    const regex = /id=([^&]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const cleanUrl = url.trim();
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
  const url =
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vRxK9uTzFJO6PdDE3AbOs93KMmlnDWXseOtWN9jk7Y0m2lkB-lmfmGqrxjrde6k6-kRdjQd9LU5pImz/pub?output=tsv';

  useEffect(() => {
    const fetchSheetData = async () => {
      try {
        const response = await fetch(url);
        const data = await response.text();
        const lines = data.split('\n');
        const headers = lines[0].split('\t'); // Change to tab separator
        const jsonData: { [key: string]: string }[] = [];

        for (let i = 1; i < lines.length; i++) {
          const currentLine = lines[i].split('\t'); // Change to tab separator
          const obj: { [key: string]: string } = {};

          for (let j = 0; j < headers.length; j++) {
            obj[headers[j].trim()] = currentLine[j]?.trim() || '';
          }

          jsonData.push(obj);
        }

        if (typeof window !== 'undefined') {
          const params = new URLSearchParams(window.location.search);
          const dni = params.get('dni');

          if (dni) {
            const filteredData = jsonData.filter(
              (item) =>
                String(item['DNI del dueño de la mascota (sin puntos)']) === dni
            );
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

  const handlePrintQR = (qrData: string, buttonRef: React.RefObject<HTMLButtonElement>) => {
    console.log('Intentando imprimir QR:', qrData);
    if (!qrData) {
      alert('No se ha seleccionado un QR válido.');
      return;
    }

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Identificación Mascotas</title>
            <style>
              body { display: flex; flex-wrap: wrap; justify-content: flex-end; align-items: flex-end; padding: 20px; }
              img { width: 1.5cm; height: 1.5cm; margin: 5px; border: 1px solid black; }
            </style>
          </head>
          <body>
            ${Array(numCopies).fill(`<img src="${qrData}" alt="QR Code" />`).join('')}
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

    if (buttonRef.current) {
      buttonRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div>
      <Head>
        <title>Identificación Mascotas</title>
      </Head>
      <header>
        <div className="div-head">
          <Image src="/logoMascotas.png" alt="Logo Mascotas" width={75} height={75} />
          <h1>
            <strong>UN QR PARA TUS MASCOTAS</strong>
          </h1>
        </div>
        <br />
      </header>
      <br />
      <br />
      <div className="div-centrado">
        <div className="contenedor">
          <br />
          <ul>
            {sheetData.map((item, index) => {
              const phoneNumber = item['Teléfono del Dueño de la mascota (Colocar código de país y área Ej: 54 9 para Argentina y Bs.As. Luego el número de celular sin 0 (cero) delante. No utilizar ningún signo para separar los números)'].replace(/\s+/g, '');
              const buttonRef = React.createRef<HTMLButtonElement>();
              return (
                <li key={index}>
                  <div className="contenedor">
                    <ImageDisplay url={item['Subir una Imagen de Frente de la Mascota']} />
                  </div>
                  <div className="contenedor">
                    <ImageDisplay url={item['Subir una Imagen de Perfil de la mascota']} />
                  </div>
                  <br />
                  <br />
                  <strong>Nombre dueño</strong>: {item['Nombre del Dueño de la Mascota']}{' '}
                  {item['Apellido del Dueño de la Mascota']}
                  <br />
                  <strong>Nombre mascota</strong>: {item['Nombre de la MASCOTA']}
                  <br />
                  <strong>Tipo de mascota</strong>: {item['Tipo de Mascota']}
                  <br />
                  <strong>Característica adicional</strong>:{' '}
                  {item[
                    'Algún comentario particular de la mascota Ej: manchas o rasgos a tener en cuenta'
                  ]}
                  <br />
                  <strong>Teléfono celular del dueño</strong>: {phoneNumber}
                  <br />
                  <strong>Localidad</strong>: {item['Localidad']}
                  <br />
                  <a
                    href={`https://wa.me/${phoneNumber}?text=Hola, encontré a tu mascota "${item['Nombre de la MASCOTA']}".`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="whatsapp-link"
                  >
                    <br />
                    <Image src="/app/whalogo.png" alt="Enviar mensaje por WhatsApp" width={32} height={32} />
                    Enviar mensaje
                  </a>
                  <button
                    className="print-btn"
                    ref={buttonRef}
                    onClick={() => {
                      const qrData = item['QRserv']?.trim();
                      console.log('QR Data:', qrData);
                      setSelectedQR(qrData || '');
                      handlePrintQR(qrData || '', buttonRef);
                    }}
                  >
                    Imprimir QR
                  </button>
                  <br />
                </li>
              );
            })}
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
                onChange={(e) =>
                  setNumCopies(Math.min(5, Math.max(1, parseInt(e.target.value))) || 1)
                }
              />
            </label>
            <button onClick={() => {
              const buttonRef = React.createRef<HTMLButtonElement>();
              handlePrintQR(selectedQR, buttonRef);
            }}>Imprimir</button>
          </div>
        )}
      </div>
      <style jsx>{`
        .whatsapp-link {
          display: flex;
          align-items: center;
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 10px;
        }

        .whatsapp-link img {
          margin-right: 5px;
        }

        .print-btn {
          font-size: 14px;
          padding: 5px 10px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default GoogleSheetData;
