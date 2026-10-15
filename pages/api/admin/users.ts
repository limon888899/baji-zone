import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  if(req.method === 'GET'){
    const users = await prisma.user.findMany({select:{id:true,email:true,role:true,balance:true}})
    return res.status(200).json(users)
  }
  return res.status(405).end()
}
