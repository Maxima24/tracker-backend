import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateTransactionDto } from './Dto/create-transaction.dto';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
    constructor(
        private readonly transactionService:TransactionsService
    ) {}
    @Post('new-transaction')
    async createTransaction(@Body() transactionData:CreateTransactionDto ){
        return await this.transactionService.createTransaction(transactionData)
    }
    @Get('transaction/:id')
    async getTransactionById(@Param('id') id:string){
        return await this.transactionService.getTransactionById(id)
    }
    @Get('summary/:userId')
    async getTransactionSummary(@Param('userId') userId:string){
        return await this.transactionService.getTransactionSummary(userId)
    }
    @Get('delete/:id')
    async deleteTransaction(@Param('id') id:string){
        return await this.transactionService.deleteTransaction(id)
    }
    @Get('transactions/:userId')
    async getAllTransactions(@Param('userId') userId:string){
        return await this.transactionService.getAllTransactions(userId)
    }
}
