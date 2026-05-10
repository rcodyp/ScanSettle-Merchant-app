import logo from '@/public/logo.png';

export function Logo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <img
      src="/logo.png"
      alt="S"
      className={className}
    />
  );
}