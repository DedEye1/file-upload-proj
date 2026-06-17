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
      const response: Response = await fetch(`${pd.apiUrl}/api/files/`, { method: 'POST', body: formData });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          error: `Ошибка ${response.status}: ${response.statusText}`
        }));
        setMessage(errorData.error || 'Ошибка загрузки');
        return;
      }

      setMessage('Файл принят');
    } catch (err: any) {
      setMessage(`Ошибка: ${err.message || 'Не удалось отправить файл'}`);
    }
  }

  return (
    <div>
      <input type="file" onChange={e => {
        const selectedFile = e.target.files?.[0];
        setFile(selectedFile);
        setHasContent(!!selectedFile);
        setMessage('');
      }} />
      <button type="button" onClick={sendFile} disabled={!hasContent}>Отправить</button>
      <p>{message ? message : ''}</p>
    </div>
  );
}