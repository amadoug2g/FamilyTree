export function Avatar({
  name,
  photoUrl,
  size = 40,
}: {
  name: string;
  photoUrl: string | null | undefined;
  size?: number;
}) {
  return (
    <div
      className="flex flex-none items-center justify-center overflow-hidden rounded-full bg-surface font-medium text-muted"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {photoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={photoUrl} alt={name} className="h-full w-full object-cover" />
      ) : (
        name.charAt(0).toUpperCase()
      )}
    </div>
  );
}
