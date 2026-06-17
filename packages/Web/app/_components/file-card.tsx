'use client';
import MetadataDTO from '@dto/metadata-dto';
import { FileImage } from '@components/file-image';
import pd from '@classes/program-data'
import type ErrorDTO from '@dto/error-dto';

export function FileCard({ metadata, onDelete }: { metadata: MetadataDTO, onDelete: (id: string) => void }) {
  const redirectPath = `/file/${metadata.id}`;
  const filePath = `${pd.apiUrl}/api/files/${metadata.id}`;

  const deleteFile = async () => {
    try {
      const response = (await fetch(filePath, { method: 'DELETE' }));
      const errDTO: ErrorDTO = await response.json().catch(() => ({ error: 'Неизвестная ошибка' }));
      if (response.status === 404) alert('Ошибка: Запись о файле отсутствует на сервере, его карточка будет удалена');
      else if (!response.ok) {
        alert(`Ошибка удаления: ${errDTO.error}`);
        return;
      }
      onDelete(metadata.id);
    } catch (err: any) {
      alert(`Ошибка удаления: ${err.message || 'Не удалось удалить файл'}`);
    }
  }

  return (
    <div>
      <h3>
        <a href={metadata.mime === 'application/pdf' ? filePath : redirectPath}>
          {metadata.originalName}
        </a>
      </h3>
      <FileImage metadata={metadata} />
      <p>Тип: {metadata.mime}</p>
      <p>Размер: {metadata.size}</p>
      <p>Создан: {metadata.createdAt}</p>
      <button type="button" onClick={deleteFile}>Удалить файл</button>
    </div>
  );
}