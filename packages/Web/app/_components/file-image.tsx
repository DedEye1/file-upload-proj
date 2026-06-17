'use client';
import { useEffect, useState } from 'react';
import pd from '@classes/program-data';
import MetadataDTO from '@dto/metadata-dto';

export function FileImage({ metadata }: { metadata: MetadataDTO }) {
  const [imageURL, setImageURL] = useState<string>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let imageURL: string | undefined;

    const fetchImage = async () => {
      setLoading(true);

      const response: Response = await fetch(`${pd.apiUrl}/api/files/${metadata.id}`);
      const bin: Blob = await response.blob();
      imageURL = URL.createObjectURL(bin);

      setImageURL(imageURL);
      setLoading(false);
    }
    fetchImage();

    return () => {
      if (imageURL)
        URL.revokeObjectURL(imageURL);
    }
  }, []);


  if (loading) return <p>Загрузка...</p>;

  return (
    <div>
      {metadata.mime === 'application/pdf' ?
        '' :
        <img src={imageURL} alt={metadata.originalName} width="200" height="150" />}
    </div>
  );
}