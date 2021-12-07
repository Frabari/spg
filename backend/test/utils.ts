export const checkKeys = <T>(
  obj: T,
  include: (keyof T)[],
  exclude: (keyof T)[],
) => {
  const resultedKeys = Object.keys(obj);
  expect(
    include.every(key => resultedKeys.includes(key as string)),
  ).toBeTruthy();
  expect(exclude.some(key => resultedKeys.includes(key as string))).toBeFalsy();
};
