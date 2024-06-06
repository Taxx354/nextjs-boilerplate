// pages/qr.tsx
'use client'
import React from 'react';
import { useRouter } from 'next/router';

const QRPage = () => {
  const router = useRouter();
  const { link } = router.query;

  if (!link) {
    return <p>No QR code provided</p>;
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#fff' }}>
      <img src={link as string} alt="QR Code" style={{ border: '5px solid black' }} />
    </div>
  );
};

export default QRPage;
