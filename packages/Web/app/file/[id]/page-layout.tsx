'use client'
import { useEffect, useState, } from 'react';
import pd from '@classes/program-data';

export function FilePageLayout({ id }: { id: string }) {

  const [imageURL, setImageURL] = useState<string>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    setLoading(true);

    try {
      const response: Response = await fetch(`${pd.apiUrl}/api/files/${id}`);
      if (response.status === 404) throw new Error('404');
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