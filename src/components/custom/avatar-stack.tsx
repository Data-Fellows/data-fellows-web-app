import Image from "next/image";

type Person = { name: string; image: string };

// Small overlapping circular headshots next to a trust-building statement --
// borrowed from Otherhalf's homepage, where the "Otherhalf builds
// exceptional storefronts..." line runs straight into a row of real team
// faces. Always the actual founding team's own photos, never a placeholder
// or stock crop.
export const AvatarStack = ({
  people,
  className = "",
}: {
  people: Person[];
  className?: string;
}) => (
  <div className={`inline-flex items-center -space-x-2 align-middle ${className}`}>
    {people.map((person) => (
      <span
        key={person.name}
        className="relative inline-block h-8 w-8 overflow-hidden rounded-full border-2 border-background"
      >
        <Image
          src={person.image}
          alt={person.name}
          fill
          sizes="32px"
          className="object-cover object-top grayscale"
        />
      </span>
    ))}
  </div>
);

export default AvatarStack;
