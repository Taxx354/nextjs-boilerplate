// index.tsx
'use client'
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

// Componente para mostrar la imagen
const ImageDisplay = ({ url }: { url: string }) => {
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
const IndexPage = () => {
  const [sheetData, setSheetData] = useState<{ [key: string]: string }[]>([]);
  const [searchDni, setSearchDni] = useState('');
  const [filteredData, setFilteredData] = useState<{ [key: string]: string } | null>(null);
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
        setSheetData(jsonData);
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    fetchSheetData();
  }, []);

  const handleSearch = () => {
    const result = sheetData.find(item => item['DNI del dueño de la mascota (sin puntos)'] === searchDni);
    setFilteredData(result || null);
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
      <div className='div-centrado'>
        <input
          type="text"
          value={searchDni}
          onChange={(e) => setSearchDni(e.target.value)}
          placeholder="Buscar por DNI"
        />
        <button onClick={handleSearch}>Buscar</button>
      </div>
      <div className='div-centrado'>
        {filteredData ? (
          <div className='contenedor'>
            <ImageDisplay url={filteredData['Subir una Imagen de Perfil de la mascota']} />
            <br />
            <strong>DNI</strong>: {filteredData['DNI del dueño de la mascota (sin puntos)']}
            <br />
            <strong>Nombre dueño</strong>: {filteredData['Nombre del Dueño de la Mascota']} {filteredData['Apellido del Dueño de la Mascota']}
            <br />
            <strong>Nombre mascota</strong>: {filteredData['Nombre de la MASCOTA']}
            <br />
            <strong>Tipo de mascota</strong>: {filteredData['Tipo de mascota']}
            <br />
            <strong>Raza</strong>: {filteredData['Raza']}
            <br />
            <strong>Caracteristica adicional</strong>: {filteredData['Dirección de correo electrónico']}
            <br />
            <strong>Celular dueño</strong>: {filteredData['Telefono celular']}
            <br />
            <strong>QR</strong>: <ImageDisplay url={filteredData["QRserv\r"]} />
          </div>
        ) : (
          <p>No se encontraron resultados.</p>
        )}
      </div>
    </div>
  );
};

export default IndexPage;
