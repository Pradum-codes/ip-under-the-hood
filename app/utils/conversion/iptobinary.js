function ConvertIPToBinary(ip) {
  if (!ip || !ip.includes(".")) return null;

  const parts = ip.split(".");
  if (parts.length !== 4) return null;

  return parts.map(part => {
    const num = Number(part);
    if (Number.isNaN(num) || num < 0 || num > 255) return "00000000";
    return num.toString(2).padStart(8, "0");
  });
}

export default ConvertIPToBinary;
