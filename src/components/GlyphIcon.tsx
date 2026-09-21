function GlyphIcon({ src, color, size = 20 }: { src: string; color: string; size?: number }) {
  const mask = `url("${src}")`;

  return (
    <span
      className="glyph"
      aria-hidden="true"
      style={{ width: size, height: size, backgroundColor: color, maskImage: mask, WebkitMaskImage: mask }}
    />
  );
}

export default GlyphIcon;
