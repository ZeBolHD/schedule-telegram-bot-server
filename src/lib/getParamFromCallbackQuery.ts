export const getParamFromCallbackQuery = (data: string, param: string) => {
  const splittedData = data.split(".");
  return splittedData[splittedData.indexOf(param) + 1];
};
