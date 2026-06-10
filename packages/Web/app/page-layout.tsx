'use client';
import pd from './_classes/program-data';
import { useEffect, useState, } from 'react';
import { FileCard } from './_components/file-card';
import FilesPageDTO from 'api/src/dto/files-page-dto';

export function MainPageLayout() {
  const [filesPage, setFilesPage] = useState<FilesPageDTO>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    setLoading(true);

    const response: Response = await fetch(`${pd.apiUrl}/api/files/`);
    const data: FilesPageDTO = await response.json();

    setFilesPage(data);
    setLoading(false);
  };

  if (loading) return <div>Загрузка...</div>;
  if (!filesPage || filesPage.items.length === 0) return <div>Нет файлов</div>;

  return (
    <div>
      <ul>
        {filesPage.items.map((file) => (
          <li key={file.id}>
            <FileCard metadata={file} />
          </li>
        ))}
      </ul>
    </div>
  );
}