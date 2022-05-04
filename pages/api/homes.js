import { getSession } from "next-auth/react";

import { prisma } from '@/lib/prisma';

export default async function handler(req, res) {
  // Check if user is authenticated
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: "Unauthorized." });
  }

  // Create new home
  if (req.method === "POST") {
    try {
      const { image, title, description, price, guests, beds, baths } = req.body;

      // Retrieve the current authenticated user
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
      });
      console.log("user", user);

      const home = await prisma.home.create({
        data: { image, title, description, price, guests, beds, baths, ownerId: user.id },
      });
      res.status(200).json(home);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ message: `HTTP method ${req.method} is not supported.` });
  }
}
