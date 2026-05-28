import vision from "@google-cloud/vision";

function getVisionClient() {
  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);

    return new vision.ImageAnnotatorClient({
      credentials,
      projectId: credentials.project_id,
    });
  }

  return new vision.ImageAnnotatorClient();
}

const client = getVisionClient();

export async function extractTextFromImage(buffer) {
  const [result] = await client.documentTextDetection({
    image: {
      content: buffer.toString("base64"),
    },
  });

  return result.fullTextAnnotation?.text || "";
}