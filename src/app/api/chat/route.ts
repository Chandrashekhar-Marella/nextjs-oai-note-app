
import { ChatCompletionMessage } from "openai/resources/index.mjs";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { auth } from "@clerk/nextjs";

import openai, { getEmbedding } from "@/lib/openai";
import { notesIndex } from "@/lib/db/pinecone";
import prisma from "@/lib/db/prisma";

export async function POST ( req: Request )
{
    try
    {
        const body = await req.json();
        const messages: ChatCompletionMessage[] = body.messages;

        const messagesTruncated = messages.slice( -6 );

        const embedding = await getEmbedding(
            messagesTruncated.map( ( message ) => message.content ).join( "\n" ),
        );

        const { userId } = auth();

        const vectorQueryResponse = await notesIndex.query( {
            vector: embedding,
            topK: 4,
            filter: { userId },
        } );

        const relevantNotes = await prisma.note.findMany( {
            where: {
                id: {
                    in: vectorQueryResponse.matches.map( ( match ) => match.id ),
                },
            },
        } );      

        const systemMessage: ChatCompletionMessage = {
            role: "assistant",
            content:
                "You are an intelligent note-taking app. You answer the user's question based on their existing notes from the data stored. Kindly politely reject anything else out of teh context is asked by the user. " +
                "The relevant notes for this query are:\n" +
                relevantNotes
                    .map( ( note ) => `Title: ${ note.title }\n\nContent:\n${ note.content }` )
                    .join( "\n\n" ),
        };

        const response = await openai.chat.completions.create( {
            model: "gpt-3.5-turbo",
            stream: true,
            messages: [ systemMessage, ...messagesTruncated ],
        } );

        const stream = OpenAIStream( response );
        return new StreamingTextResponse( stream );

    } catch ( error )
    {
        console.error( error );
        return Response.json( { error: "Internal server error" }, { status: 500 } );
    }
}
