import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PUT") {
    res.setHeader("Allow", ["PUT"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    // TODO: Implement proper authentication
    const userId = req.body.userId || "demo-user";

    const { onboarded } = req.body;

    if (typeof onboarded !== "boolean") {
      return res.status(400).json({ error: "Invalid onboarded value" });
    }

    // TODO: Update user's onboarded status in your database
    // For now, we'll just return success
    // Example:
    // await updateUser(userId, { onboarded });

    console.log(`Marking user ${userId} as onboarded: ${onboarded}`);

    return res.json({
      success: true,
      message: "User onboarding status updated successfully",
    });
  } catch (error) {
    console.error("Error updating onboarding status:", error);
    return res
      .status(500)
      .json({ error: "Failed to update onboarding status" });
  }
}
