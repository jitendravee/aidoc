import Image from "next/image";

export function Navbar() {
  return (
    <nav className=" flex items-center justify-between px-6 py-3 ">
      <div className="relative w-43.25 h-15">
        <Image
          src="/logo.png"
          alt="Logo"
          fill
          className="object-contain"
          priority
        />
      </div>
    </nav>
  );
}
