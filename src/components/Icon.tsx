function Icon({ src, alt }: { src: string; alt: string }) {
  return <img className="icon" src={src} alt={alt} aria-hidden={alt ? undefined : true} />;
}

export default Icon;
