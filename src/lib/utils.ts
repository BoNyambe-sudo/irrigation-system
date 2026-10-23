export function cn(...inputs: any[]) {
  const classes = inputs.filter(Boolean).join(" ");
  return classes;
}
