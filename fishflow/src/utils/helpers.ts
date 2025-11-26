export function convertiInGMA(dataISO: string) {
  const data = new Date(dataISO);

  const giorno = String(data.getUTCDate()).padStart(2, "0");
  const mese = String(data.getUTCMonth() + 1).padStart(2, "0");
  const anno = data.getUTCFullYear();

  return `${giorno}-${mese}-${anno}`;
}
