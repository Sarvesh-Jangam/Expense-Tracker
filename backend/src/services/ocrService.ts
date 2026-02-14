import Tesseract from "tesseract.js";

export const extractTextFromImage = async (filePath:string) => {
  const { data: { text } } = await Tesseract.recognize(
    filePath,
    "eng"
  );

  return text;
};
