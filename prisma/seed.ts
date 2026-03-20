import { db } from "@/lib/db";

async function main() {
  console.log("🌱 Seeding database...");

  // Create Categories
  const categories = await Promise.all([
    db.category.upsert({
      where: { slug: "kits" },
      update: {},
      create: {
        name: "Gardening Kits",
        slug: "kits",
        description: "Complete starter kits for regenerative gardening",
        icon: "🌱",
        sortOrder: 1,
      },
    }),
    db.category.upsert({
      where: { slug: "seeds" },
      update: {},
      create: {
        name: "Seeds",
        slug: "seeds",
        description: "Heirloom and organic seeds",
        icon: "🌻",
        sortOrder: 2,
      },
    }),
    db.category.upsert({
      where: { slug: "soil" },
      update: {},
      create: {
        name: "Soil Amendments",
        slug: "soil",
        description: "Build healthy, living soil",
        icon: "🌍",
        sortOrder: 3,
      },
    }),
    db.category.upsert({
      where: { slug: "compost" },
      update: {},
      create: {
        name: "Compost & Tea",
        slug: "compost",
        description: "Composting supplies and compost tea kits",
        icon: "🍵",
        sortOrder: 4,
      },
    }),
    db.category.upsert({
      where: { slug: "tools" },
      update: {},
      create: {
        name: "Garden Tools",
        slug: "tools",
        description: "Quality tools for every task",
        icon: "🔧",
        sortOrder: 5,
      },
    }),
    db.category.upsert({
      where: { slug: "care" },
      update: {},
      create: {
        name: "Plant Care",
        slug: "care",
        description: "Fertilizers and plant food",
        icon: "💚",
        sortOrder: 6,
      },
    }),
  ]);

  console.log(`✅ Created ${categories.length} categories`);

  // Create Admin User
  const adminUser = await db.user.upsert({
    where: { email: "admin@fikrago.com" },
    update: {},
    create: {
      email: "admin@fikrago.com",
      name: "Admin User",
      role: "ADMIN",
      isAdmin: true,
    },
  });

  console.log(`✅ Created admin user: ${adminUser.email}`);

  // Create Sample Vendor
  const vendorUser = await db.user.upsert({
    where: { email: "vendor@example.com" },
    update: {},
    create: {
      email: "vendor@example.com",
      name: "Green Gardens Co.",
      role: "VENDOR",
      vendorStatus: "APPROVED",
      paypalEmail: "vendor@paypal.com",
    },
  });

  // Create Vendor Profile
  await db.vendorProfile.upsert({
    where: { userId: vendorUser.id },
    update: {},
    create: {
      userId: vendorUser.id,
      businessName: "Green Gardens Co.",
      businessEmail: "vendor@example.com",
      description: "Premium organic gardening supplies and soil amendments. We specialize in regenerative products that build healthy soil.",
      city: "Portland",
      state: "Oregon",
      country: "United States",
    },
  });

  console.log(`✅ Created sample vendor: ${vendorUser.email}`);

  // Create Sample Products
  const products = [
    {
      name: "Complete No-Till Garden Starter Kit",
      slug: "complete-no-till-garden-starter-kit",
      description: "Everything you need to start your no-till garden journey. Includes premium compost, worm castings, mycorrhizal fungi, and a detailed guide.",
      shortDescription: "Complete starter kit for no-till gardening",
      price: 89.99,
      comparePrice: 119.99,
      stock: 50,
      categoryId: categories[0].id,
      vendorId: vendorUser.id,
      status: "ACTIVE",
      isFeatured: true,
      isBestseller: true,
      images: JSON.stringify(["🌱"]),
    },
    {
      name: "Premium Heirloom Tomato Seed Collection",
      slug: "premium-heirloom-tomato-seed-collection",
      description: "A curated collection of 12 heirloom tomato varieties. Non-GMO, open-pollinated seeds passed down through generations.",
      shortDescription: "12 varieties of heirloom tomatoes",
      price: 24.99,
      stock: 200,
      categoryId: categories[1].id,
      vendorId: vendorUser.id,
      status: "ACTIVE",
      isFeatured: true,
      images: JSON.stringify(["🍅"]),
    },
    {
      name: "Living Soil Mix - Premium Grade",
      slug: "living-soil-mix-premium-grade",
      description: "A complete living soil mix with compost, worm castings, biochar, and beneficial microbes. Ready to plant.",
      shortDescription: "Pre-mixed living soil ready to use",
      price: 34.99,
      stock: 100,
      categoryId: categories[2].id,
      vendorId: vendorUser.id,
      status: "ACTIVE",
      isFeatured: true,
      images: JSON.stringify(["🌍"]),
    },
    {
      name: "Compost Tea Brewing Kit",
      slug: "compost-tea-brewing-kit",
      description: "Complete kit to brew your own compost tea. Includes 5-gallon brewer, air pump, compost tea bags, and instructions.",
      shortDescription: "Everything to brew compost tea",
      price: 54.99,
      comparePrice: 69.99,
      stock: 30,
      categoryId: categories[3].id,
      vendorId: vendorUser.id,
      status: "ACTIVE",
      images: JSON.stringify(["🍵"]),
    },
    {
      name: "Mycorrhizal Fungi Inoculant",
      slug: "mycorrhizal-fungi-inoculant",
      description: "Premium blend of endomycorrhizal and ectomycorrhizal fungi. Improves nutrient uptake and plant health.",
      shortDescription: "Beneficial fungi for root health",
      price: 29.99,
      stock: 150,
      categoryId: categories[2].id,
      vendorId: vendorUser.id,
      status: "ACTIVE",
      images: JSON.stringify(["🍄"]),
    },
    {
      name: "Worm Castings - Premium Grade",
      slug: "worm-castings-premium-grade",
      description: "Pure worm castings from red wiggler worms fed organic matter. Nature's perfect fertilizer.",
      shortDescription: "Pure organic worm castings",
      price: 19.99,
      stock: 300,
      categoryId: categories[2].id,
      vendorId: vendorUser.id,
      status: "ACTIVE",
      images: JSON.stringify(["🪱"]),
    },
    {
      name: "Japanese Garden Tool Set",
      slug: "japanese-garden-tool-set",
      description: "Hand-forged Japanese steel tools. Includes trowel, cultivator, and pruning shears in a canvas roll.",
      shortDescription: "Premium Japanese steel tools",
      price: 79.99,
      comparePrice: 99.99,
      stock: 25,
      categoryId: categories[4].id,
      vendorId: vendorUser.id,
      status: "ACTIVE",
      images: JSON.stringify(["🔧"]),
    },
    {
      name: "Organic Neem Oil Spray",
      slug: "organic-neem-oil-spray",
      description: "Cold-pressed organic neem oil for natural pest control. Safe for beneficial insects when used correctly.",
      shortDescription: "Natural organic pest control",
      price: 18.99,
      stock: 200,
      categoryId: categories[5].id,
      vendorId: vendorUser.id,
      status: "ACTIVE",
      images: JSON.stringify(["🌿"]),
    },
  ];

  for (const product of products) {
    await db.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    });
  }

  console.log(`✅ Created ${products.length} products`);

  // Create Platform Settings
  await db.platformSetting.upsert({
    where: { key: "PLATFORM_COMMISSION_RATE" },
    update: {},
    create: {
      key: "PLATFORM_COMMISSION_RATE",
      value: "0.15",
      description: "Platform commission rate (15%)",
    },
  });

  await db.platformSetting.upsert({
    where: { key: "PLATFORM_NAME" },
    update: {},
    create: {
      key: "PLATFORM_NAME",
      value: "Fikrago Gardening",
      description: "Platform name",
    },
  });

  console.log("✅ Created platform settings");

  console.log("\n🎉 Seeding completed!");
  console.log("\n📋 Summary:");
  console.log(`   - ${categories.length} categories`);
  console.log(`   - ${products.length} products`);
  console.log(`   - 1 admin user (admin@fikrago.com)`);
  console.log(`   - 1 vendor user (vendor@example.com)`);
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
