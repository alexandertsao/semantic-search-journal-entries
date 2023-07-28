import {promises as fs} from 'fs'
import {join} from 'path'
import {PineconeClient} from '@pinecone-database/pinecone'
import {createEmbedding} from './createEmbedding'

const pinecone = new PineconeClient();

async function upsertEmbedding(embedding: number[], fileName: string) {
    const index = pinecone.Index("test-index")
    const upsertRequest = {
      vectors: [
        {
          id: fileName,
          values: embedding,
        },
      ],
    }
    const upsertResponse = await index.upsert({ upsertRequest })
    return embedding
}

async function readFileData(filePath: string) {
  try {
    const newFileData = await fs.readFile(filePath)
    const newFileText = newFileData.toString()
    return newFileText
  } catch {
    console.log('File reading error')
    return null
  }
}

export async function importFiles (path: string) {
    await pinecone.init({
        environment: process.env.PINECONE_ENV as string,
        apiKey: process.env.PINECONE_API_KEY as string
    })

    try {
        const fileNames = await fs.readdir(path)
        for (const file of fileNames) {
            const fileName = join(path, file)
            const newFileText = await readFileData(fileName)
            if (newFileText) {
              const embedding = await createEmbedding(newFileText)
              await upsertEmbedding(embedding.data[0].embedding, fileName)
            }
        }
    } catch {
        console.log('Directory reading error')
    }
}