export type Vector2D = [x: number, y: number];

export const pause = (t: number): Promise<null> => {
  return new Promise((res) => {
    setTimeout(() => {
      res(null);
    }, t * 1000);
  });
};

export const loadImage = (imageUrl: string): Promise<HTMLImageElement> => {
  const img = document.createElement("img");
  img.crossOrigin = "Anonymous";
  img.src = imageUrl;

  return new Promise((resolve, reject) => {
    img.onload = () => resolve(img);
    img.onerror = (e: string | Event) => reject(e);
  });
};
