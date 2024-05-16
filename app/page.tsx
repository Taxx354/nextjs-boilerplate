'use client'
import React, { useState, useEffect } from 'react';

const GoogleSheetData = () => {
  const [sheetData, setSheetData] = useState<{ [key: string]: string }[]>([]);
  const url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ6K-g3BOeuMtXmXQ-3hUxKPKd9DVN48vSLH2M8vPtcjByFcvwtY7mwL735kd46cu-W3rAglI-PBJUq/pub?output=csv';
  <head><link rel="icon" href="/favicon.ico" sizes="any" />  </head>
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

        const params = new URLSearchParams(window.location.search);
        const dni = params.get('dni');

        if (dni) {
          const filteredData = jsonData.filter(item => item.dni === dni);
          if (Array.isArray(filteredData)) {
            setSheetData(filteredData);
          }
        } else {
          console.log('No se proporcionó un DNI en los parámetros GET.');
        }
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }

    };

    fetchSheetData();
  }, []);

  return (
    <div>
      <header>
        <br />
        <h1> <strong>IDENTIFICACIÓN MASCOTAS</strong></h1>
        <br />
      </header>
      <div className='div-centrado'>
        <div className='contenedor'>
          <br/>
          <ul>
            {sheetData.map((item, index) => (
              <li key={index}>
                <div className='contenedor'><ImageDisplay link="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT69szUDIz8XcApPzK83e3Ke_8IHDcLJ7g3D-9atC1_vg&s" /></div>
                <br />
                <strong> DNI</strong>: {item.DNI} 
                <br />
                <strong>Nombre Dueño</strong>: {item.nombredueno}
                <br />
                <strong>Nombre Mascota</strong>: {item.nombremascota}
                <br />
                <strong>Tipo de mascota</strong>: {item.tipo}
                <br />
                <strong>Caracteristica adicional</strong>: {item.caracteristica}
                <br />
                <strong>Celular Dueño</strong>: {item.celular}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
  
};
function ImageDisplay({ link }: ImageDisplayProps) {
  return (
    <div>
      <img src={link} alt="Imagen" />
    </div>
  );
}
interface ImageDisplayProps {
  link: string; // Especificamos que el tipo de 'link' debe ser una cadena (URL de la imagen)
}
export default GoogleSheetData;
