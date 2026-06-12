'use client'
import pd from '@classes/program-data'
import ErrorDTO from '@dto/error-dto'
import { useState } from 'react';

export default function LoadPageLayout() {
  const [file, setFile] = useState<File>();
  const [message, setMessage] = useState<string>();
  const [hasContent, setHasContent] = useState<boolean>();

  const sendFile = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const responce: Response = await fetch(`${pd.apiUrl}/api/files/`, { method: 'POST', body: formData });
      if (responce.status === 400) {
        const err: ErrorDTO = await responce.json();
        setMessage(err.error);
      } else setMessage('Файл принят');
    } catch (err: any) {
      setMessage(err.message);
    }
  }

  return (
    <div>
      <input type="file" onChange={e => { setFile(e.target.files?.[0]); setHasContent(true); }} />
      <button type="button" onClick={sendFile} disabled={!hasContent}>Отправить</button>
      <p>{message ? message : ''}</p>
    </div>
  );
}