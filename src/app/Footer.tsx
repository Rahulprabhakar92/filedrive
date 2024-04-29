import Link from "next/link";

export function Footer() {
  return (
    <footer className="fixed bottom-0 w-full bg-gray-100 h-20 flex items-center justify-between ">
      <div className="container mx-auto text-base ">FileDrive</div>
      <div className="flex mr-10">
        <Link href="/privacy" className="text-blue-900 hover:text-blue-500">
          Privacy Policy
        </Link>
        <Link href="/terms-of-service" className="text-blue-900 hover:text-blue-500">
          Terms of Service
        </Link>
        <Link href="/about" className="text-blue-900 hover:text-blue-500">
          About
        </Link>
      </div>
    </footer>
  );
}