export const checkKeys = <T>(
  obj: T,
  include: (keyof T)[],
  exclude: (keyof T)[],
) => {
  const resultedKeys = Object.keys(obj);
  expect(
    include.every(key => {
      const ris = resultedKeys.includes(key as string);
      if (!ris) console.log(key, ris);
      return ris;
    }),
  ).toBeTruthy();
  expect(
    exclude.some(key => {
      const ris = resultedKeys.includes(key as string);
      if (ris) console.log(key, ris);
      return ris;
    }),
  ).toBeFalsy();
};
