export function wrapText(text, { charMax, lineMax }) {
  const lineList = [];
  let line = "";
  for (const word of text.split(" ")) {
    if (line && `${line} ${word}`.length > charMax) {
      lineList.push(line);
      line = word;
    } else {
      line = line ? `${line} ${word}` : word;
    }
  }
  lineList.push(line);
  if (lineList.length > lineMax) {
    throw new Error(`Text does not fit in ${lineMax} lines: ${text}`);
  }
  return lineList;
}
