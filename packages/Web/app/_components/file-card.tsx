'use client';
import MetadataDTO from '@dto/metadata-dto';
import { FileImage } from '@components/file-image';
import pd from '@classes/program-data'

export function FileCard({ metadata, onDelete }: { metadata: MetadataDTO, onDelete: (id: string) => void }) {
  const redirectPath: string = `/file/${metadata.id}`;

  const deleteFile = async () => {
    await fetch(`${pd.apiUrl}/api/files/${metadata.id}`, { method: 'DELETE' })
    onDelete(metadata.id);
  }

  return (
    <div>
      <h3>
        <a href={redirectPath}>{metadata.originalName}</a>
      </h3>
      <FileImage metadata={metadata} />
      <p>Тип: {metadata.mime}</p>
      <p>Размер: {metadata.size}</p>
      <p>Создан: {metadata.createdAt}</p>
      <button type="button" onClick={deleteFile}>Удалить файл</button>
    </div>
  );
}