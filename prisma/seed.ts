import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || "file:./dev.db",
});

const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.supportRequest.deleteMany();

  await prisma.supportRequest.createMany({
    data: [
      {
        id: "REQ-1001",
        requesterName: "Aina Rahman",
        email: "aina@example.com",
        category: "Login",
        priority: "High",
        status: "Open",
        assignedTo: "Support",
        message: "Unable to log in after resetting password.",
      },
      {
        id: "REQ-1002",
        requesterName: "Daniel Tan",
        email: "daniel@example.com",
        category: "Billing",
        priority: "Medium",
        status: "In Progress",
        assignedTo: "Operations",
        message: "Invoice amount does not match the subscription plan.",
      },
      {
        id: "REQ-1003",
        requesterName: "Priya Nair",
        email: "priya@example.com",
        category: "App Issue",
        priority: "High",
        status: "Open",
        assignedTo: "Engineering",
        message: "Mobile app crashes when opening reports.",
      },
      {
        id: "REQ-1004",
        requesterName: "Jason Lee",
        email: "jason@example.com",
        category: "Report",
        priority: "Low",
        status: "Resolved",
        assignedTo: "Support",
        message: "Requested help exporting monthly report.",
      },
      {
        id: "REQ-1005",
        requesterName: "Nur Iman",
        email: "iman@example.com",
        category: "Other",
        priority: "Medium",
        status: "Closed",
        assignedTo: "Unassigned",
        message: "General question about account settings.",
      },
      {
        id: "REQ-1006",
        requesterName: "Marcus Wong",
        email: "marcus@example.com",
        category: "Login",
        priority: "Low",
        status: "Resolved",
        assignedTo: "Support",
        message: "Two-factor authentication code was delayed.",
      },
      {
        id: "REQ-1007",
        requesterName: "Farah Aziz",
        email: "farah@example.com",
        category: "Billing",
        priority: "High",
        status: "In Progress",
        assignedTo: "Operations",
        message: "Payment was charged twice for the same month.",
      },
      {
        id: "REQ-1008",
        requesterName: "Kevin Lim",
        email: "kevin@example.com",
        category: "App Issue",
        priority: "Medium",
        status: "Open",
        assignedTo: "Engineering",
        message: "Notifications are not appearing on the dashboard.",
      },
    ],
  });
}

main()
  .then(async () => {
    console.log("Seed data created successfully.");
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });