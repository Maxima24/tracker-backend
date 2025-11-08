import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './Dto/create-transaction.dto';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';

@Injectable()
export class TransactionsService {
  constructor(private readonly db: PrismaService) {}
  async createTransaction(transactionData: CreateTransactionDto) {
    try {
      const transaction = await this.db.transactions.create({
        data: {
          ...transactionData,
          user: {
            connect: {
              id: transactionData.user_id,
            },
          },
        },
      });
      if (!transaction) {
        throw new HttpException(
          'Transaction could not be created',
          HttpStatus.NOT_FOUND,
        );
      }
      return transaction;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(
          'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
  async getTransactionById(id: string) {
    try {
      const transaction = await this.db.transactions.findUnique({
        where: { id },
      });
      if (!transaction) {
        throw new HttpException('Transaction not found', HttpStatus.NOT_FOUND);
      }
      return transaction;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(
          'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
  async deleteTransaction(id: string) {
    try {
      const transaction = await this.db.transactions.delete({
        where: { id },
      });
      if (!transaction) {
        throw new HttpException(
          'Transaction could not be deleted',
          HttpStatus.NOT_FOUND,
        );
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(
          'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
  async getTransactionSummary(userId: string) {
    try {
      const Expenses = await this.db.transactions.aggregate({
        where: {
          userId,
          type: 'expense',
        },
        _sum: {
          amount: true,
        },
      });
      if (!Expenses) {
        throw new HttpException(
          'No Expenses found for this user',
          HttpStatus.NOT_FOUND,
        );
      }
      const Income = await this.db.transactions.aggregate({
        where: { userId, type: 'income' },
        _sum: {
          amount: true,
        },
      });
      if (!Income) {
        throw new HttpException(
          'No Income found for this user',
          HttpStatus.NOT_FOUND,
        );
      }

      const balance = Income._sum.amount! - Expenses._sum.amount! || 0;
      return {
        Expenses: Expenses._sum.amount || 0,
        Income: Income._sum.amount || 0,
        balance,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(
          'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
  async getAllTransactions(userId: string) {
    try {
      const transactions = await this.db.user.findUnique({
        where: { id: userId },
        select:{
            transactions:true
        }
      })
      if (!transactions) {
        throw new HttpException(
          'No transactions found for this user',
          HttpStatus.NOT_FOUND,
        );
      }
    } catch (error) {
        if (error instanceof HttpException) {
          throw error;
        } else {    
            throw new HttpException(
            'Internal server error',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }

    }
  }
}
