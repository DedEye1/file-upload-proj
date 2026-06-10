'use client';
import MetadataDTO from '@dto/metadata-dto';
import { FileImage } from '@components/file-image';

export function FileCard({ metadata }: { metadata: MetadataDTO }) {
  const redirectPath: string = `/file/${metadata.id}`;

  return (
    <div>
      <h3>
        <a href={redirectPath}>{metadata.originalName}</a>
      </h3>
      <FileImage metadata={metadata} />
      <p>Тип: {metadata.mime}</p>
      <p>Размер: {metadata.size}</p>
      <p>Создан: {metadata.createdAt}</p>
    </div>
  );
}