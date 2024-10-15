export const pickFields = <T>(object: T, field: (keyof T)[]) => {
    return field.reduce(
        (acc, key) => {
            acc[key] = object[key];
            return acc;
        },
        {} as Pick<T, keyof T>,
    );
};
