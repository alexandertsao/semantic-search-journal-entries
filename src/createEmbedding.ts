import axios from 'axios'

export async function createEmbedding(input: string) {
  try {
    const apiKey = process.env.OPENAI_API_KEY
    const response = await axios.post(
      'https://api.openai.com/v1/embeddings',
      {
        input,
        model: "text-embedding-ada-002"
      },
      {
        headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        }
      }
    )
    const embedding = response.data

    return embedding

  } catch (e) {
    console.error(e)
    throw e
  }
}