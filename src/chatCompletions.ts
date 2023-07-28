import {queryFiles} from "./queryFiles"
import { Configuration, OpenAIApi, ChatCompletionRequestMessage } from 'openai'

export async function chatCompletions (input: string) {

    const results = await queryFiles(input)

    const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    // Details the intended functions of the AI
    let role: string = "You are an assistant for a mobile application that tracks patterns in your health through journal entries. The information stored in each journal entry can include: time/date of entry, activities, food eaten, emotional state, etc. You will answer questions and queries about journal entries. \n\n"

    // Command for AI and the query
    let message: string = "Based on the journal entries below, answer the following query and display the relevant journal entry(s): \n" + input + "\n\n"

    // Rules for AI when writing response
    message = message + "Your response should adhere to the following rules: \n"
    message = message + "1. First, answer the question as a friend who is helping you jog your memory about something you said or did in the past. However, don't explicitly say this. The response should feel natural and have a conversational tone. Slang can be used in the repsonse.\n"
    message = message + "2. After answering the question, display the journal entries that pertain to the query. More relevant entries should be listed first. \n"
    message = message + "3. If there are no relevant journal entries, tell user that none could be found. If this is the case, ask a follow-up question that can guide the user to asking a query that is similar, but that there is information stored for it. \n"
    message = message + "4. After listing relevant jounral entries, write a brief summary/explanation of how the journal entries answer the user's question in a single paragraph. \n"
    message = message + "5. Although the journal entries displayed should adhere closely to the user's query, in the paragraph at the end, feel free to make logical assumptions that can better help the user analyze their past entries. \n\n"

    // journal entries
    message = message + "Journal Entries: \n" + results + "\n"

    // console.log(message) // print message

    const completion = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [{"role": "system", "content": role}, {role: "user", content: message}],
        temperature: 0.4,
    });

    const responseMessage = completion.data.choices[0].message;
    if (responseMessage) {
        console.log(responseMessage.content);
    }
}
