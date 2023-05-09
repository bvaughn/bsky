export function assert(
  expectedCondition: boolean,
  message = "Assertion failed!"
): asserts expectedCondition {
  if (!expectedCondition) {
    console.error(message);

    throw Error(message);
  }
}
