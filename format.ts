export function formatMD(d: string | null): string | null {
  if (!d) return null;
  const [, m, day] = d.split("-");
  return `${Number(m)}/${Number(day)}`;
}

export function formatFull(d: string | null): string | null {
  if (!d) return null;
  const [y, m, day] = d.split("-");
  return `${y}年${Number(m)}月${Number(day)}日`;
}

export function formatYen(n: number | null): string | null {
  if (n === null || n === undefined) return null;
  return `¥${n.toLocaleString("ja-JP")}`;
}
