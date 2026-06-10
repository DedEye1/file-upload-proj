'use client';
import { useEffect, useState } from 'react';
import pd from '../_classes/program-data';
import MetadataDTO from '@dto/metadata-dto';

export function FileImage({ metadata }: { metadata: MetadataDTO }) {
  const [imageURL, setImageURL] = useState<string>();
  const [loading, setLoading] = useState<boolean>();

  useEffect(() => {
    fetchImage();
  }, []);

  const fetchImage = async () => {
    setLoading(true);

    const response: Response = await fetch(`${pd.apiUrl}/api/files/${metadata.id}`);
    const bin: Blob = await response.blob();
    const imageURL: string = URL.createObjectURL(bin);

    setImageURL(imageURL);
    setLoading(false);
  }

  if (loading) return <p>Загрузка...</p>;

  return (
    <div>
      <img src={imageURL} alt={metadata.originalName} width="200" height="150" />
    </div>
  );
}