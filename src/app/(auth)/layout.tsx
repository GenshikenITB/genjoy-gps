import "@/styles/globals.css";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-[100svh] w-full flex-col items-center justify-center gap-10 px-5">
      {children}
    </div>
  );
}
