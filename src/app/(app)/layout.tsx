import "@/styles/globals.css";
import { Navbar } from "@/components/navbar";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-[100svh] w-full max-w-xl flex-col gap-5 p-5">
      <Navbar />
      {children}
    </div>
  );
}
