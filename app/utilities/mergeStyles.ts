export default function mergeStyles(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
