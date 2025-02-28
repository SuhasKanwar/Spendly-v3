import { Schema, Document } from "mongoose";
import TransactionSchema from "./Transactions";

export interface Bank extends Document {
    accountHolderName: string;
    accountNumber: string;
    accountType: string;
    bankName: string;
    transactionsCount: number;
    transactions: [typeof TransactionSchema];
}

const BankSchema: Schema<Bank> = new Schema({
    accountHolderName: {
        type: String,
        default: '',
        required: [true, "Account holder name is required"],
        trim: true
    },
    accountNumber: {
        type: String,
        // default: '',
        // required: [true, "Account number is required"],
        // unique: true
    },
    accountType: {
        type: String,
        default: '',
        required: [true, "Account type is required"]
    },
    bankName: {
        type: String,
        default: '',
        required: [true, "Bank name is required"]
    },
    transactionsCount: {
        type: Number,
        default: 0
    },
    transactions: {
        type: [TransactionSchema],
        default: []
    }
});

export default BankSchema;