"use client";
import { Info } from "lucide-react";

interface FooterProps {
  text: string;
}

export default function Footer({ text }: FooterProps) {
  return (
    <footer className="footer" role="contentinfo">
      <Info aria-hidden="true" />
      <span>{text}</span>
    </footer>
  );
}
