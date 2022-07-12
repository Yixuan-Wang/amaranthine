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

export function downloadImage(imageUrl: string) {
  return new Promise((resolve, reject) => {
    const downloadedImg = new Image();
    downloadedImg.crossOrigin = "Anonymous";
    downloadedImg.onload = () => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      canvas.width = downloadedImg.width;
      canvas.height = downloadedImg.height;

      context!.drawImage(downloadedImg, 0, 0);

      try {
        const result = canvas.toDataURL("image/png");
        resolve(result);
      }
      catch (err) {
        console.error(`Error: ${err}`);
        reject(err);
      }
    };
    downloadedImg.src = imageUrl;
  });
}
