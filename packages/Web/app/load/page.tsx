'use client'
import pd from '@classes/program-data'
import ErrorDTO from '@dto/error-dto'
import { useState } from 'react';

export default function LoadPageLayout() {
  const [file, setFile] = useState<File>();
  const [error, setError] = useState<string>();

  const sendFile = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    const responce: Response = await fetch(`${pd.apiUrl}/api/files/`, { method: 'POST', body: formData });
    if (responce.status === 400) {
      const err: ErrorDTO = await responce.json();
      setError(err.error);
    } else setError('Файл принят');
  }

  return (
    <div>
      <input type="file" onChange={e => setFile(e.target.files?.[0])} />
      <button type="button" onClick={sendFile}>Отправить</button>
      <p>{error ? error : ''}</p>
    </div>
  );
}