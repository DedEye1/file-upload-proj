'use client';
import { useEffect, useState, type JSX, } from 'react';
import { useSearchParams } from 'next/navigation';
import { FileCard } from '@components/file-card';
import FilesPageDTO from '@dto/files-page-dto';
import pd from '@classes/program-data';

export default function MainPageLayout() {
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

  let content: JSX.Element;

  if (loading) content = <p>Загрузка...</p>;
  else if (error) content = <p>Ошибка загрузки: {error.message}</p>;
  else if (!filesPage || filesPage.items.length === 0) content = <p>Нет файлов</p>;
  else content =
    (<ul>
      {filesPage.items.map((file) => (
        <li key={file.id}>
          <FileCard metadata={file} onDelete={deleteFile} />
        </li>
      ))}
    </ul>);

  return (
    <div>
      <h1>Список файлов</h1>
      <a href="/load">Загрузка файла</a>
      {content}
    </div>
  );
}