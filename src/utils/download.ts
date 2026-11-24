/** 2차원 배열을 UTF-8(BOM) CSV 파일로 내려받습니다. 엑셀에서 한글이 깨지지 않도록 BOM을 붙입니다. */
export function downloadCsv(filename: string, rows: (string | number)[][]) {
  const escape = (cell: string | number) => {
    const text = String(cell);
    return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  };
  const csv = "﻿" + rows.map((row) => row.map(escape).join(",")).join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
