// pages/qr.tsx
'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const QRPage = () => {
  const router = useRouter();
  const [link, setLink] = useState<string | null>(null);

  useEffect(() => {
    if (router.isReady) {
      const { link } = router.query;
      if (typeof link === 'string') {
        setLink(link);
      }
    }
  }, [router.isReady, router.query]);

  if (!link) {
    return <p>No QR code provided</p>;
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#fff' }}>
      <img src={link} alt="QR Code" style={{ border: '5px solid black' }} />
    </div>
  );
};

export default QRPage;
