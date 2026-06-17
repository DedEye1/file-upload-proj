export default function RootLayout({ children, }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <title>Загрузчик файлов</title>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}