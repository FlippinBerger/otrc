export const useToken = () => {
  return useState<string | null>("token", () => "");
};
