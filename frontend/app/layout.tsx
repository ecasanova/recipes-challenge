export default function Layout({ children }: React.PropsWithChildren<{}>) {
  return (
    <html lang="en">
      <head>
        <title>Next.js</title>
      </head>
      <body>
        <div>Header</div>
        {children}
      </body>
    </html>
  );
}
