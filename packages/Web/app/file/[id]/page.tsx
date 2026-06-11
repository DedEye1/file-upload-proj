'use client'
import { useEffect, useState, } from 'react';
import pd from '@classes/program-data';
import { useParams } from 'next/navigation';

export default function FilePageLayout() {
  const id: string = useParams().id!.toString();

  const [imageURL, setImageURL] = useState<string>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    document.title = id;
    fetchFile();
  }, []);

  const fetchFile = async () => {
    setLoading(true);

    try {
      const url: string = `${pd.apiUrl}/api/files/${id}`
      const response: Response = await fetch(url);
      if (response.status === 404) throw new Error('Файл не найден');
      const image: Blob = await response.blob();
      const imageURL: string = URL.createObjectURL(image);
      setImageURL(imageURL);
    } catch (err: any) {
      setError(err);
    }

    setLoading(false);
  };

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>Ошибка загрузки: {error.message}</p>;

  return (
    <div>
      <img src={imageURL} alt={id} />
    </div>
  );
}