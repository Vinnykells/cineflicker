'use client'

import Link from 'next/link'
import { useState } from 'react'

function CopyButton({ value, label }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={copy}
      className="flex items-center gap-2 bg-flicker-card border border-flicker-border hover:border-flicker-red/50 rounded-xl px-4 py-3 text-left transition-all duration-200 w-full group"
    >
      <div className="flex-1 min-w-0">
        <p className="text-flicker-gray text-xs mb-1">{label}</p>
        <p className="text-white text-xs font-mono truncate">{value}</p>
      </div>
      <span className={`text-xs flex-shrink-0 transition-colors duration-200 ${copied ? 'text-green-400' : 'text-flicker-gray group-hover:text-white'}`}>
        {copied ? '✓ Copied' : 'Copy'}
      </span>
    </button>
  )
}

export default function Footer() {
  return (
    <footer className="border-t border-flicker-border px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-1">
            <span className="text-flicker-red font-bold text-xl tracking-tight">Cine</span>
            <span className="text-white font-bold text-xl tracking-tight">flicker</span>
          </Link>

          <div className="flex items-center gap-6">
            {[
              { label: 'Movies', href: '/movies' },
              { label: 'TV Shows', href: '/shows' },
              { label: 'Top Rated', href: '/top-rated' },
              { label: 'Coming Soon', href: '/coming-soon' },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-flicker-gray hover:text-white transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <p className="text-flicker-gray text-sm">
            Powered by{' '}
            <a
              href="https://themoviedb.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-flicker-red hover:text-white transition-colors duration-200"
            >
              TMDB
            </a>
          </p>
        </div>

        {/* Tip section */}
        <div className="mt-10 pt-8 border-t border-flicker-border">
          <div className="max-w-md mx-auto text-center">
            <p className="text-white text-sm font-medium mb-1">☕ Enjoyed Cineflicker?</p>
            <p className="text-flicker-gray text-xs mb-4">Support the creator with a crypto tip</p>
            <div className="flex flex-col gap-2">
              <CopyButton label="BTC (Bitcoin)" value="bc1qyeckdfvsq6mzjq5kxhcl656hrwdu9jfsar796h" />
              <CopyButton label="USDT TRC20 / TRX" value="TP7bJKvtRSAi8eE2gq5z77Fkd2anV7MR17" />
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-flicker-border text-center">
          <p className="text-flicker-gray text-sm">
            © {new Date().getFullYear()} Cineflicker. Built with Next.js & Tailwind CSS.
          </p>
        </div>
      </div>
    </footer>
  )
}
