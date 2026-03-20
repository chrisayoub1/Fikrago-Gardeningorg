import { db } from "../src/lib/db";
import { hash } from "bcryptjs";

async function main() {
  console.log("🌱 Seeding database...");

  // Create categories
  const categories = await Promise.all([
    db.category.upsert({
      where: { slug: "seeds" },
      update: {},
      create: {
        name: "Seeds",
        slug: "seeds",
        description: "Heirloom and organic seeds for your garden",
        icon: "seedling",
        sortOrder: 1,
      },
    }),
    db.category.upsert({
      where: { slug: "soil-amendments" },
      update: {},
      create: {
        name: "Soil Amendments",
        slug: "soil-amendments",
        description: "Compost, fertilizers, and soil boosters",
        icon: "leaf",
        sortOrder: 2,
      },
    }),
    db.category.upsert({
      where: { slug: "garden-kits" },
      update: {},
      create: {
        name: "Garden Kits",
        slug: "garden-kits",
        description: "Complete starter kits for beginners",
        icon: "package",
        sortOrder: 3,
      },
    }),
    db.category.upsert({
      where: { slug: "tools" },
      update: {},
      create: {
        name: "Tools & Equipment",
        slug: "tools",
        description: "Quality gardening tools and supplies",
        icon: "tool",
        sortOrder: 4,
      },
    }),
  ]);

  console.log(`✅ Created ${categories.length} categories`);

  // Create a sample vendor user
  const vendorPassword = await hash("vendor123", 10);
  const vendorUser = await db.user.upsert({
    where: { email: "vendor@fikrago.com" },
    update: {},
    create: {
      email: "vendor@fikrago.com",
      name: "Green Thumb Gardens",
      password: vendorPassword,
      role: "VENDOR",
      emailVerified: new Date(),
    },
  });

  // Create vendor profile
  const vendorProfile = await db.vendorProfile.upsert({
    where: { userId: vendorUser.id },
    update: {},
    create: {
      userId: vendorUser.id,
      businessName: "Green Thumb Gardens",
      businessEmail: "contact@greenthumbgardens.com",
      description: "Premium heirloom seeds and organic gardening supplies. We've been growing sustainably for over 15 years.",
      rating: 4.9,
      reviewCount: 127,
      totalSales: 892,
    },
  });

  console.log(`✅ Created vendor: ${vendorProfile.businessName}`);

  // Create sample products
  const products = [
    {
      name: "Heirloom Tomato Seed Collection",
      slug: "heirloom-tomato-seed-collection",
      description: "A curated collection of 10 varieties of heirloom tomato seeds. Includes Brandywine, Cherokee Purple, San Marzano, and more. Each variety comes with growing instructions and tips for optimal flavor.",
      shortDescription: "10 varieties of premium heirloom tomato seeds",
      price: 24.99,
      comparePrice: 34.99,
      sku: "HTS-001",
      stock: 150,
      categoryId: categories[0].id,
      vendorId: vendorUser.id,
      images: "[]",
      status: "ACTIVE",
      isFeatured: true,
      isBestseller: true,
      rating: 4.8,
      reviewCount: 45,
      totalSales: 234,
    },
    {
      name: "Organic Compost Tea Kit",
      slug: "organic-compost-tea-kit",
      description: "Everything you need to brew nutrient-rich compost tea for your garden. Includes 5-gallon brewer, compost tea bags, and microbial food mix. Makes up to 50 gallons of liquid fertilizer.",
      shortDescription: "Complete compost tea brewing system",
      price: 49.99,
      comparePrice: 69.99,
      sku: "OCT-001",
      stock: 75,
      categoryId: categories[1].id,
      vendorId: vendorUser.id,
      images: "[]",
      status: "ACTIVE",
      isFeatured: true,
      isBestseller: false,
      rating: 4.9,
      reviewCount: 32,
      totalSales: 156,
    },
    {
      name: "Beginner's Herb Garden Kit",
      slug: "beginners-herb-garden-kit",
      description: "Start your herb garden with this complete kit. Includes 6 varieties of culinary herbs (basil, cilantro, parsley, chives, dill, and oregano), biodegradable pots, organic soil mix, and growing guide.",
      shortDescription: "Complete starter kit for herb gardening",
      price: 34.99,
      comparePrice: null,
      sku: "BHG-001",
      stock: 200,
      categoryId: categories[2].id,
      vendorId: vendorUser.id,
      images: "[]",
      status: "ACTIVE",
      isFeatured: true,
      isBestseller: true,
      rating: 4.7,
      reviewCount: 89,
      totalSales: 412,
    },
    {
      name: "Premium Worm Castings - 25lb Bag",
      slug: "premium-worm-castings-25lb",
      description: "Pure, organic worm castings for optimal soil health. Rich in beneficial microorganisms and nutrients. Perfect for amending garden beds, potting mixes, and making compost tea.",
      shortDescription: "Organic worm castings for soil enrichment",
      price: 29.99,
      comparePrice: 39.99,
      sku: "PWC-001",
      stock: 100,
      categoryId: categories[1].id,
      vendorId: vendorUser.id,
      images: "[]",
      status: "ACTIVE",
      isFeatured: false,
      isBestseller: true,
      rating: 4.9,
      reviewCount: 67,
      totalSales: 289,
    },
    {
      name: "Heirloom Vegetable Seed Vault",
      slug: "heirloom-vegetable-seed-vault",
      description: "Over 50 varieties of heirloom vegetable seeds in a moisture-proof storage container. Includes tomatoes, peppers, squash, beans, carrots, lettuce, and more. Enough seeds to plant a full garden.",
      shortDescription: "50+ heirloom vegetable seed varieties",
      price: 79.99,
      comparePrice: 99.99,
      sku: "HVS-001",
      stock: 50,
      categoryId: categories[0].id,
      vendorId: vendorUser.id,
      images: "[]",
      status: "ACTIVE",
      isFeatured: true,
      isBestseller: false,
      rating: 4.8,
      reviewCount: 28,
      totalSales: 145,
    },
    {
      name: "Japanese Garden Tool Set",
      slug: "japanese-garden-tool-set",
      description: "Professional-grade Japanese steel garden tools. Includes trowel, cultivator, and pruning shears in a canvas tool roll. Ergonomic handles and razor-sharp edges for precision work.",
      shortDescription: "3-piece premium Japanese garden tool set",
      price: 59.99,
      comparePrice: 79.99,
      sku: "JGT-001",
      stock: 40,
      categoryId: categories[3].id,
      vendorId: vendorUser.id,
      images: "[]",
      status: "ACTIVE",
      isFeatured: false,
      isBestseller: false,
      rating: 4.9,
      reviewCount: 23,
      totalSales: 87,
    },
    {
      name: "Mycorrhizal Fungi Inoculant",
      slug: "mycorrhizal-fungi-inoculant",
      description: "Beneficial fungi that form symbiotic relationships with plant roots, improving nutrient uptake and drought resistance. One 4oz package treats up to 100 plants.",
      shortDescription: "Beneficial fungi for root health",
      price: 19.99,
      comparePrice: null,
      sku: "MFI-001",
      stock: 180,
      categoryId: categories[1].id,
      vendorId: vendorUser.id,
      images: "[]",
      status: "ACTIVE",
      isFeatured: false,
      isBestseller: true,
      rating: 4.7,
      reviewCount: 54,
      totalSales: 198,
    },
    {
      name: "Square Foot Garden Kit",
      slug: "square-foot-garden-kit",
      description: "Complete raised bed gardening system with 4x4 cedar frame, grid system, premium soil mix, and planting guide. Perfect for small spaces and intensive planting methods.",
      shortDescription: "Complete 4x4 raised bed garden system",
      price: 149.99,
      comparePrice: 199.99,
      sku: "SFG-001",
      stock: 25,
      categoryId: categories[2].id,
      vendorId: vendorUser.id,
      images: "[]",
      status: "ACTIVE",
      isFeatured: true,
      isBestseller: false,
      rating: 4.6,
      reviewCount: 19,
      totalSales: 67,
    },
  ];

  for (const product of products) {
    await db.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
  }

  console.log(`✅ Created ${products.length} products`);

  console.log("\n🎉 Seeding complete!");
  console.log("\nLogin credentials:");
  console.log("Admin: admin@fikrago.com / cnss2031");
  console.log("Vendor: vendor@fikrago.com / vendor123");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
