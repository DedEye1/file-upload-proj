'use client';
import pd from '../_classes/program-data';
import MetadataDTO from 'api/src/dto/metadata-dto';
import { FileImage } from './file-image';

export function FileCard({ metadata }: { metadata: MetadataDTO }) {
  return (
    <div>
      <h3>
        <a href="/file">{metadata.originalName}</a>
      </h3>
      <FileImage metadata={metadata} />
      <p>Тип: {metadata.mime}</p>
      <p>Размер: {metadata.size}</p>
      <p>Создан: {metadata.createdAt}</p>
    </div>
  );
}