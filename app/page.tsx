'use client'
import Image from 'next/image'
import React, { useState, useEffect } from 'react';

// Componente para mostrar la imagen
const ImageDisplay = ({ url }: { url: string }) => {
  console.log("url: " + url);

  function getFileIdFromUrl(url: string) {
    const regex = /id=([^&]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }

  const fileId = getFileIdFromUrl(url);

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
        <p>Imagen no disponible</p>
      )}
    </div>
  );
};

// Componente principal
const GoogleSheetData = () => {
  const [sheetData, setSheetData] = useState<{ [key: string]: string }[]>([]);
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
  }, []); // Ejecutar una sola vez al cargar el componente

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
                  <ImageDisplay url={item['Subir una Imagen de Perfil de la mascota']} />
                </div>
                <br />
                <strong>DNI</strong>: {item['DNI']}
                <br />
                <strong>Nombre dueño</strong>: {item['Nombre del Dueño de la Mascota']} {item['Apellido del Dueño de la Mascota']}
                <br />
                <strong>Nombre mascota</strong>: {item['Nombre de la MASCOTA']}
                <br />
                <strong>Tipo de mascota</strong>: {item['Tipo de mascota']}
                <br />
                <strong>Raza</strong>: {item['Raza']}
                <br />
                <strong>Caracteristica adicional</strong>: {item['Dirección de correo electrónico']}
                <br />
                <strong>Celular dueño</strong>: {item['Telefono celular']}
                <br />
                <strong>QR</strong>: <ImageDisplay url={item["QRserv\r"]}/>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GoogleSheetData;
