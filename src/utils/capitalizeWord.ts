export const capitalizeWord = (word: string): string => {
  // biome-ignore lint/style/noNonNullAssertion: trust me
  return word ? word[0]!.toUpperCase() + word.slice(1).toLowerCase() : word;
};
