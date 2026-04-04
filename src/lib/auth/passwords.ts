import bcrypt from 'bcryptjs';

export const hashValue = async (value: string) => bcrypt.hash(value, 12);

export const verifyValue = async (value: string, hash: string) => bcrypt.compare(value, hash);