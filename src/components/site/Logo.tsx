import logo from '@/public/logo.png';

export function Logo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <img
      src={logo}
      alt="Site logo"
      className={className}
      onError={(e) => {
        (e.currentTarget as HTMLImageElement).src = '/logo.svg';
      }}
    />
  );
}