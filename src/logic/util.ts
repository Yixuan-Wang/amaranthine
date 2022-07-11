export function download(content: any, fileName: string, contentType: string) {
  const a = document.createElement("a");
  const file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
}

export function uploadJSON<T>(file: File): Promise<T> {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onloadend = () => resolve(JSON.parse(fileReader.result as string) as T);
    fileReader.onabort = reject;
    fileReader.onerror = reject;

    fileReader.readAsText(file);
  });
}
