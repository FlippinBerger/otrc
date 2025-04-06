export const useUser = () => {
  return useState<string | null>("user", () => "");
};
