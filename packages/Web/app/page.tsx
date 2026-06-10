'use client';
import { MainPageLayout } from './page-layout'

export default function MainPage() {
  return (
    <html>
      <head>
        <title>Загрузчик файлов</title>
      </head>
      <body>
        <h1>Список загруженных файлов</h1>
        <MainPageLayout />
      </body>
    </html>
  );
}