import React from "react";

const Footer = () => (
  <footer className="bg-white border-t mt-8">
    <div className="container mx-auto p-6 text-center small-muted">
      © {new Date().getFullYear()} Bloom-Well 
    </div>
  </footer>
);

export default Footer;
