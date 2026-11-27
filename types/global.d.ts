declare module '*.css'

interface DocumentPictureInPictureWindow extends Window {
  document: Document
  close: () => void
}

interface DocumentPictureInPictureOptions {
  width?: number
  height?: number
  disallowReturnToOpener?: boolean
  preferInitialWindowPlacement?: boolean
}

interface DocumentPictureInPicture {
  requestWindow: (options?: DocumentPictureInPictureOptions) => Promise<DocumentPictureInPictureWindow>
  readonly window: DocumentPictureInPictureWindow | null
}

interface Window {
  documentPictureInPicture?: DocumentPictureInPicture
}
