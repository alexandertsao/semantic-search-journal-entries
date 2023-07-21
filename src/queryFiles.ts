import {promises as fs} from 'fs'
import { PineconeClient } from '@pinecone-database/pinecone'
import { QueryResponse } from '@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch'
import {createEmbedding} from './createEmbedding'

const pinecone = new PineconeClient()

async function getQueryResponse(queryEmbedding: number[]) {
  const index = pinecone.Index("test-index")
  const queryResponse = await index.query({
    queryRequest: {
      vector: queryEmbedding,
      topK: 10,
      includeValues: true,
    },
  })
  return queryResponse
}

interface QueryResultEntry {
  score?: number
  text: string
}

async function returnQueryResponse(queryResponse?: QueryResponse) {
  const results: QueryResultEntry[] = []
  if (queryResponse?.matches) {
    for (const match of queryResponse.matches) {
      try {
        const data = await fs.readFile(match.id)
        const result = {
          score: match.score,
          text: data.toString()
        }
        results.push(result)
      } catch {
        console.error(`Id ${match.id} not Found`)
      }
    }
  }
  return results
}

export async function queryFiles (query: string) {
    await pinecone.init ({
        environment: process.env.PINECONE_ENV as string,
        apiKey: process.env.PINECONE_API_KEY as string
    })

    try {
        const queryEmbedding = await createEmbedding(query)
        const queryResponse = await getQueryResponse(queryEmbedding.data[0].embedding)
        return returnQueryResponse(queryResponse)
    } catch (e) {
        console.error(e)
        throw e
    }
}