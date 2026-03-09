export interface ShareButtonProps {
  card: {
    id: string
    title: string
    teaser: string
  }
}

export interface ShareMenuProps {
  title: string
  url: string
  open: boolean
  onClose: () => void
}
