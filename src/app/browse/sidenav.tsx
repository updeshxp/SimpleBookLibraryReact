"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

// ...

export default function SideNav() {
  const pathname = usePathname();
  const links = [
    { icon: "asd", name: "Authors", href: "/browse/authors" },
    { icon: "asd", name: "Books", href: "/browse/books" },
  ];
  return (
    <>
      <ul className="nav nav-pills">
        <li className="nav-item">
          {links.map((link) => {
            const LinkIcon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={clsx("nav-link", {
                  "link-success": pathname === link.href,
                })}
              >
                {/* <Image className="w-6" /> */}
                <p>{link.name}</p>
              </Link>
            );
          })}
        </li>
      </ul>
    </>
  );
}
