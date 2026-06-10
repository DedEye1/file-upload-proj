'use client'
import { FilePageLayout } from './page-layout';
import type { Params } from "next/dist/server/request/params";
import { useParams } from "next/navigation";

export default function FilePage() {
  const params: Params = useParams();
  const id: string = params.id?.toString()!;

  return (
    <html>
      <head>
        <title>{id}</title>
      </head>
      <body>
        <FilePageLayout id={id} />
      </body>
    </html>
  );
}