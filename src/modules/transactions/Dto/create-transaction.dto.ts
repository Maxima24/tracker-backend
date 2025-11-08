export class CreateTransactionDto{
    title:string
    amount:number
    type:"income" | "expense"
    description:string
    category:string
    user_id:string
}