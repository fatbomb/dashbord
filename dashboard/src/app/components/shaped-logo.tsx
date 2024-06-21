import Image from "next/image"

interface ShapedLogoProps extends React.HTMLAttributes<HTMLImageElement> {}

export default function ShapedLogo({ className }: ShapedLogoProps) {
  return (
    <Image
      src="/shaped-cube.png"
      alt="Logo"
      className="mx-auto h-12 w-12"
      width="48"
      height="48"
    />
  )
}