import Image from "next/image";

export function Navbar() {
  return (
    <nav className="flex items-center justify-between px-4 py-3 sm:px-6">
      <Image
        src="/logo.png"
        alt="Logo"
        width={173}
        height={60}
        className="h-auto w-28 sm:w-36 md:w-40 lg:w-43.25"
        priority
      />
    </nav>
  );
}