'use client';
import { useEffect, useState, } from 'react';
import { useSearchParams } from 'next/navigation';
import { FileCard } from '@components/file-card';
import FilesPageDTO from '@dto/files-page-dto';
import pd from '@classes/program-data';

export function MainPageLayout() {
  const searchParams = useSearchParams();
  const pageStr: string = searchParams.get('page') ?? '1';
  const page = Number(pageStr);

  const [filesPage, setFilesPage] = useState<FilesPageDTO>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    setLoading(true);

    try {
      const response: Response = await fetch(`${pd.apiUrl}/api/files/?page=${page}`);
      const data: FilesPageDTO = await response.json();
      setFilesPage(data);
    } catch (err: any) {
      setError(err);
    }

    setLoading(false);
  };

  const deleteFile = (id: string) => {
    setFilesPage(prev => {
      if (!prev) return prev;
      const newItems = prev.items.filter(item => item.id !== id);
      return {
        ...prev,
        items: newItems,
        total: newItems.length,
      };
    });
  };

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>Ошибка загрузки: {error.message}</p>;
  if (!filesPage || filesPage.items.length === 0) return <p>Нет файлов</p>;

  return (
    <div>
      <ul>
        {filesPage.items.map((file) => (
          <li key={file.id}>
            <FileCard metadata={file} onDelete={deleteFile} />
          </li>
        ))}
      </ul>
    </div>
  );
}