import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🧹 Starting database cleanup...");

  try {
    // Correct order to avoid foreign key constraint violations
    
    console.log("- Deleting OrderItems...");
    await prisma.orderItem.deleteMany({});

    console.log("- Deleting Orders...");
    await prisma.order.deleteMany({});

    console.log("- Deleting Reviews...");
    await prisma.review.deleteMany({});

    console.log("- Deleting CartItems and WishlistItems...");
    await prisma.cartItem.deleteMany({});
    await prisma.wishlistItem.deleteMany({});

    console.log("- Deleting Products...");
    await prisma.product.deleteMany({});

    console.log("- Deleting VendorProfiles...");
    await prisma.vendorProfile.deleteMany({});

    console.log("- Deleting Addresses and Notifications...");
    await prisma.address.deleteMany({});
    await prisma.notification.deleteMany({});

    console.log("- Deleting Subscriptions and Payouts...");
    await prisma.subscriptionPayment.deleteMany({});
    await prisma.subscription.deleteMany({});
    await prisma.payout.deleteMany({});

    console.log("- Deleting Accounts and Sessions...");
    await prisma.account.deleteMany({});
    await prisma.session.deleteMany({});

    console.log("- Deleting non-Admin Users...");
    const deleteResult = await prisma.user.deleteMany({
      where: {
        role: {
          not: "ADMIN"
        }
      }
    });
    console.log(`✅ Deleted ${deleteResult.count} non-admin users.`);

    console.log("\n✨ Database is now CLEAN (except for Categories and Admins).");
    console.log("🚀 You can now start adding real vendors and products!");

  } catch (error) {
    console.error("❌ Cleanup failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
