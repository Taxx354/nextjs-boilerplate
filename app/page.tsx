'use client'
import Image from 'next/image'
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
            const filteredData = jsonData.filter(item => String(item['DNI']) === dni);
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
                  <ImageDisplay link="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT69szUDIz8XcApPzK83e3Ke_8IHDcLJ7g3D-9atC1_vg&s" />
                </div>
                <br />
                <strong> DNI</strong>: {item['DNI']}
                <br />
                <strong>Nombre dueño</strong>: {item['Nombre dueño']}
                <br />
                <strong>Nombre mascota</strong>: {item['Nombre_mascota']}
                <br />
                <strong>Tipo de mascota</strong>: {item['Tipo de mascota']}
                <br />  
                <strong>Raza</strong>: {item['Raza']}
                <br />
                <strong>Caracteristica adicional</strong>: {item['Caracteristica mascota']}
                <br />
                <strong>Celular dueño</strong>: {item['Telefono celular']}
              </li>
                

            ))}
          </ul>
        </div>
      </div>
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

