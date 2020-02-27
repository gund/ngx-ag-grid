/**
 * Represents a function that takes in value and returns transformed value
 *
 * Basically any unary function
 */
export type TransformerFn<T, D = T> = (arg: T) => D;
