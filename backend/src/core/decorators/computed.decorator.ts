export const COMPUTED_FIELDS = 'COMPUTED_FIELDS';

type ValueGetter = (entity: any) => any;

export type ComputedFields = Record<string, ValueGetter>;

export const Computed =
  (valueGetter: ValueGetter) => (target: object, propertyKey: string) => {
    let computedFields: ComputedFields = Reflect.getMetadata(
      COMPUTED_FIELDS,
      target,
    );
    if (computedFields) {
      computedFields[propertyKey] = valueGetter;
    } else {
      computedFields = {
        [propertyKey]: valueGetter,
      };
      Reflect.defineMetadata(COMPUTED_FIELDS, computedFields, target);
    }
  };
