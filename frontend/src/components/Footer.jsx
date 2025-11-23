export default function Footer() {
  return (
    <footer className="bg-tertiary text-gray-800 bottom-0 left-0 w-full py-3">
      <div className="px-4">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-2">Bloom-well</h3>
          <p className="text-gray-700 text-sm">
            © {new Date().getFullYear()} Bloom-well. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
