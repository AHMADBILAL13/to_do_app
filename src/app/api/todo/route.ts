import { NextRequest,NextResponse } from 'next/server'
import {todo,NewTodo,db,todoTable} from '@/lib/drizzle'
import { sql } from '@vercel/postgres'

export async function GET(request:NextRequest){

    try{
        await sql`CREATE TABLE IF NOT EXISTS TODOS(ID SERIAL, TASK VARCHAR(255));`
        const res = await db.select().from(todoTable);
        return NextResponse.json({data:res})
    }catch(err){
        console.log(err);
        return NextResponse.json({message:"Something went wrong"})
    }    
}

export async function POST(request:NextRequest){
    const req = await request.json();
    try{
        if(req.task){
           const res = db.insert(todoTable).values({task:req.task}).returning();
           return NextResponse.json({message:"Data Added Successfully"})
        }else{
            throw new Error("Task field is required")
        }
    }catch(error){
        return NextResponse.json({message: (error as{message:string}).message})
    }
}