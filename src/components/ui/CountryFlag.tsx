import type { Country } from '@/lib/types';

// Real flag image, not an emoji. Windows browsers do not render country
// flag emoji as coloured flags - they show only the two-letter code
// (PK, US, GB) or nothing - which is why emoji flags looked "not coming"
// on a Windows PC. A flag image works on every device.
export default function CountryFlag({
  country,
  className = 'h-4 w-6',
}: {
  country?: Pick<Country, 'code' | 'name' | 'flag_emoji'> | null;
  className?: string;
}) {
  if (!country?.code) {
    return <span aria-hidden="true">🌐</span>;
  }
  return (
    <img
      src={`https://flagcdn.com/w80/${country.code.toLowerCase()}.png`}
      alt={`${country.name} flag`}
      width={24}
      height={18}
      loading="lazy"
      className={`inline-block shrink-0 rounded-[2px] object-cover ${className}`}
    />
  );
}
