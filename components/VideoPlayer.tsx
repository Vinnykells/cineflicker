'use client'

import { forwardRef, useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

export type ServerKey = 'vidlink' | 'vidsrc' | 'multiembed'

const SERVER_OPTIONS: ReadonlyArray<[ServerKey, string]> = [
  ['vidlink', 'Server 1'],
  ['vidsrc', 'Server 2'],
  ['multiembed', 'Server 3'],
]

const IFRAME_EXTRA_PROPS: Record<string, string | boolean> = {
  'webkit-playsinline': 'true',
  playsInline: true,
  scrolling: 'no',
}

interface VideoPlayerProps {
  embedUrl: string
  iframeKey: string
  activeServer: ServerKey
  onSelectServer: (server: ServerKey) => void
  showPlayer: boolean
  onClose: () => void
  title: string
  episodeLabel?: string
  className?: string
}

const VideoPlayer = forwardRef<HTMLDivElement, VideoPlayerProps>(function VideoPlayer(
  {
    embedUrl,
    iframeKey,
    activeServer,
    onSelectServer,
    showPlayer,
    onClose,
    title,
    episodeLabel,
    className = '',
  },
  ref
) {
  const [pipSupported, setPipSupported] = useState(false)
  const [pipContainer, setPipContainer] = useState<HTMLDivElement | null>(null)
  const pipWindowRef = useRef<DocumentPictureInPictureWindow | null>(null)

  useEffect(() => {
    setPipSupported(typeof window !== 'undefined' && 'documentPictureInPicture' in window)
  }, [])

  const closePip = useCallback(() => {
    if (pipWindowRef.current) {
      pipWindowRef.current.close()
      pipWindowRef.current = null
    }
    setPipContainer(null)
  }, [])

  useEffect(() => {
    if (!showPlayer) {
      closePip()
    }
  }, [showPlayer, closePip])

  useEffect(() => {
    return () => {
      closePip()
    }
  }, [closePip])

  const openPip = async () => {
    if (!window.documentPictureInPicture) return

    if (pipWindowRef.current) {
      closePip()
      return
    }

    try {
      const pipWin = await window.documentPictureInPicture.requestWindow({
        width: 560,
        height: 360,
      })

      Array.from(document.styleSheets).forEach((styleSheet) => {
        try {
          if (styleSheet.href) {
            const link = pipWin.document.createElement('link')
            link.rel = 'stylesheet'
            link.href = styleSheet.href
            pipWin.document.head.appendChild(link)
          } else if (styleSheet.cssRules) {
            const style = pipWin.document.createElement('style')
            style.textContent = Array.from(styleSheet.cssRules)
              .map((rule) => rule.cssText)
              .join('\n')
            pipWin.document.head.appendChild(style)
          }
        } catch {
          // Ignore cross-origin stylesheet security errors
        }
      })

      const baseStyle = pipWin.document.createElement('style')
      baseStyle.textContent =
        'html, body { margin: 0; padding: 0; width: 100%; height: 100%; background: #0a0a0a; color: #f5f5f7; overflow: hidden; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }'
      pipWin.document.head.appendChild(baseStyle)
      pipWin.document.title = episodeLabel ? `${title} · ${episodeLabel}` : title

      const container = pipWin.document.createElement('div')
      container.style.width = '100%'
      container.style.height = '100%'
      pipWin.document.body.appendChild(container)

      pipWindowRef.current = pipWin
      setPipContainer(container)

      pipWin.addEventListener('pagehide', () => {
        pipWindowRef.current = null
        setPipContainer(null)
      })
    } catch {
      // User dismissed or browser blocked PiP request
    }
  }

  const handleClosePlayer = () => {
    closePip()
    onClose()
  }

  const renderIframe = (keySuffix: string) => (
    <iframe
      key={`${iframeKey}-${keySuffix}`}
      src={showPlayer ? embedUrl : undefined}
      className="w-full h-full border-0"
      allowFullScreen
      allow="autoplay; fullscreen *; encrypted-media; picture-in-picture"
      referrerPolicy="no-referrer"
      {...IFRAME_EXTRA_PROPS}
    />
  )

  return (
    <>
      <div
        ref={ref}
        className={`${className} rounded-2xl border border-flicker-border overflow-hidden transition-all duration-300 ${
          showPlayer ? 'opacity-100' : 'opacity-0 pointer-events-none h-0 overflow-hidden border-0'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 bg-flicker-card border-b border-flicker-border">
          <div className="flex flex-wrap items-center gap-3">
            {episodeLabel && <span className="text-white text-sm font-medium">{episodeLabel}</span>}
            <div className="flex items-center gap-2">
              <span className="text-flicker-gray text-xs">Server:</span>
              {SERVER_OPTIONS.map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => onSelectServer(key)}
                  className={`px-3 py-1 text-xs rounded-full font-medium transition ${
                    activeServer === key
                      ? 'bg-flicker-red text-white'
                      : 'bg-flicker-dark text-flicker-gray hover:text-white'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={openPip}
              disabled={!pipSupported}
              title={
                pipSupported
                  ? pipContainer
                    ? 'Return player to tab'
                    : 'Pop out floating Picture-in-Picture window'
                  : 'Document Picture-in-Picture requires desktop Chrome or Edge'
              }
              className={`px-3 py-1 text-xs rounded-full font-medium border transition ${
                !pipSupported
                  ? 'border-flicker-border text-flicker-gray/40 cursor-not-allowed'
                  : pipContainer
                    ? 'bg-flicker-red border-flicker-red text-white'
                    : 'bg-flicker-dark border-flicker-border text-white hover:border-white/40'
              }`}
            >
              {pipContainer ? (
                '↙ Return to tab'
              ) : (
                <span className="inline-flex items-center gap-1.5">
                  <span>⧉ PiP</span>
                  <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full bg-flicker-red text-white leading-none">
                    New
                  </span>
                </span>
              )}
            </button>
            <button
              onClick={handleClosePlayer}
              className="text-flicker-gray text-xs hover:text-white transition"
            >
              ✕ Close
            </button>
          </div>
        </div>

        <div className="aspect-video w-full bg-flicker-dark">
          {pipContainer ? (
            <div className="w-full h-full flex flex-col items-center justify-center gap-3 px-6 text-center">
              <span className="text-3xl">⧉</span>
              <p className="text-white text-sm font-medium">Playing in floating Picture-in-Picture window</p>
              <p className="text-flicker-gray text-xs max-w-sm">
                You can keep watching while working in other apps. Closing the floating window brings the player back here.
              </p>
              <button
                onClick={closePip}
                className="mt-1 px-5 py-2 rounded-full bg-white text-black text-xs font-semibold hover:bg-white/90 transition"
              >
                Return to tab
              </button>
            </div>
          ) : (
            renderIframe('inline')
          )}
        </div>
      </div>

      {pipContainer &&
        showPlayer &&
        createPortal(
          <div className="w-full h-full flex flex-col bg-flicker-black">
            <div className="flex items-center justify-between gap-2 px-3 py-1.5 bg-flicker-card border-b border-flicker-border flex-shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-white text-xs font-medium truncate">
                  {episodeLabel ? `${title} · ${episodeLabel}` : title}
                </span>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {SERVER_OPTIONS.map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => onSelectServer(key)}
                    className={`px-2 py-0.5 text-[11px] rounded-full font-medium transition ${
                      activeServer === key
                        ? 'bg-flicker-red text-white'
                        : 'bg-flicker-dark text-flicker-gray hover:text-white'
                    }`}
                  >
                    {label}
                  </button>
                ))}
                <button
                  onClick={closePip}
                  className="ml-1 px-2.5 py-0.5 text-[11px] rounded-full bg-white/10 text-white hover:bg-white/20 transition"
                >
                  ↙ Tab
                </button>
              </div>
            </div>
            <div className="flex-1 w-full min-h-0">{renderIframe('pip')}</div>
          </div>,
          pipContainer
        )}
    </>
  )
})

export default VideoPlayer
