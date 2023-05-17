export const pause = (t: number): Promise<null> => {
  return new Promise((res) => {
    setTimeout(() => {
      res(null);
    }, t * 1000);
  });
};
