'use client';
import { Suspense, useEffect, useState, type JSX, } from 'react';
import { useSearchParams } from 'next/navigation';
import { FileCard } from '@components/file-card';
import { Pagination } from '@components/pagination';
import FilesPageDTO from '@dto/files-page-dto';
import pd from '@classes/program-data';

export default function MainPageLayout() {
  const searchParams = useSearchParams();
  const pageParam: string = searchParams.get('page') ?? '1';
  const page = Number(pageParam);

  const [filesPage, setFilesPage] = useState<FilesPageDTO>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    fetchFiles();
  }, [pageParam]);

  const fetchFiles = async () => {
    setLoading(true);

    try {
      if (isNaN(page) || page <= 0) throw new Error('Страница отсутствует');
      const response: Response = await fetch(`${pd.apiUrl}/api/files/?page=${page}`);
      const filesPage: FilesPageDTO = await response.json();
      setFilesPage(filesPage);
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
        total: prev.total - 1,
      };
    });
  };

  let content: JSX.Element;
  const maxPage = filesPage ? Math.ceil(filesPage.total / filesPage.limit) : 1;

  if (loading) content = <p>Загрузка...</p>;
  else if (error) content = <p>Ошибка загрузки: {error.message}</p>;
  else if (!filesPage || filesPage.items.length === 0) content = <p>Нет файлов</p>;
  else content = (
    <div>
      <ul>
        {filesPage.items.map((file) => (
          <li key={file.id}>
            <FileCard metadata={file} onDelete={deleteFile} />
          </li>
        ))}
      </ul>
      <Suspense fallback={'Загрузка пагинации...'}>
        <Pagination maxPage={maxPage} />
      </Suspense>
    </div>
  );

  return (
    <div>
      <h1>Список файлов</h1>
      <a href="/load">{error ? '' : 'Загрузка файла'}</a>
      {content}
    </div>
  );
}