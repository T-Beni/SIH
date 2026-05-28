import vision from "@google-cloud/vision";

const client = new vision.ImageAnnotatorClient();

export async function extractTextFromImage(buffer) {
  const [result] = await client.documentTextDetection({
    image: {
      content: buffer.toString("base64"),
    },
  });

  return result.fullTextAnnotation?.text || "";
}