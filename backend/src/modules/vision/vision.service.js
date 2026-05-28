import vision from "@google-cloud/vision";

function getVisionClient() {
  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);

    credentials.private_key = credentials.private_key.replace(/\\n/g, "\n");

    return new vision.ImageAnnotatorClient({
      credentials: {
        client_email: credentials.client_email,
        private_key: credentials.private_key,
      },
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