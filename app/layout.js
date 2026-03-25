export const metadata = {
  title: "Free CV Checker — Score Your CV in 30 Seconds | Black & White Recruitment",
  description: "Get your CV scored against 8 sections by a UK recruiter with 14 years of experience. Free, instant, with rewrite examples. Fix your CV tonight.",
  openGraph: {
    title: "Free CV Checker — Is Your CV Getting Callbacks or Silence?",
    description: "Score your CV against UK 2026 best practice. 8-section breakdown, rewrite examples, and honest recruiter feedback. Free and instant.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}
