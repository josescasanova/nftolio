/* This example requires Tailwind CSS v2.0+ */
const navigation = [{ name: "Address Book", href: "/address-book" }];

interface Props {
  isHome?: boolean;
}

export default function Header(props: Props) {
  return (
    <header className="bg-indigo-600">
      <nav
        className={`${props.isHome ? "max-w-7xl" : ""} mx-auto px-4 sm:px-6 ${
          props.isHome ? "lg:px-8" : "lg:px-20"
        }`}
        aria-label="Top"
      >
        <div className="w-full py-6 flex items-center justify-between border-b border-indigo-500 lg:border-none">
          <div className="flex items-center">
            <a href="/">
              <span className="text-base font-medium text-white hover:text-indigo-50">
                nftolio.xyz
              </span>
            </a>
            <div className="hidden ml-10 space-x-8 lg:block">
              {navigation.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-base  text-white hover:text-indigo-50"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
          <div className="ml-10 space-x-4"></div>
        </div>
        <div className="py-4 flex flex-wrap justify-center space-x-6 lg:hidden">
          {navigation.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-base  text-white hover:text-indigo-50"
            >
              {link.name}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}
