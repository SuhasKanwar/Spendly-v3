import { Schema, Document } from 'mongoose';

export interface Transaction extends Document {
    date: String;
    amount: number;
    description: string;
    transactionType: string;
    balance: number;
}

const TransactionSchema: Schema<Transaction> = new Schema({
    date: {
        type: String,
        required: [true, "Date is required"]
    },
    amount: {
        type: Number,
        required: [true, "Amount is required"]
    },
    description: {
        type: String,
        required: [true, "Description is required"]
    },
    transactionType: {
        type: String,
        required: [true, "Transaction type is required"],
        enum: ['credit', 'debit']
    },
    balance: {
        type: Number,
        required: [true, "Balance is required"]
    }
});

export default TransactionSchema;