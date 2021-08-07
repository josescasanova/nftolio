import Link from "next/Link";
export default function Footer(props: {}) {
  return (
    <footer className="text-indigo-600 hover:text-indigo-900">
      <Link href="/">Home</Link>
      <br />
      <Link href="/list">List</Link>
      <br />
      <Link href="https://github.com/0x-icy/nftolio">Github</Link>
    </footer>
  );
}
