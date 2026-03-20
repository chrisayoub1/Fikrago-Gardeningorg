import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// GET /api/orders - List orders (Admin: all, Vendor: their orders, User: their purchases)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "20");
    const page = parseInt(searchParams.get("page") || "1");

    const where: any = {};

    // Filter by role
    if (session.user.role === "ADMIN") {
      // Admin sees all orders
      if (status) where.status = status;
    } else if (session.user.role === "VENDOR") {
      // Vendor sees orders for their products
      where.vendorId = session.user.id;
      if (status) where.status = status;
    } else {
      // Buyer sees their own orders
      where.buyerId = session.user.id;
      if (status) where.status = status;
    }

    const [orders, total] = await Promise.all([
      db.order.findMany({
        where,
        include: {
          items: {
            include: {
              product: {
                select: { name: true, images: true },
              },
            },
          },
          buyer: {
            select: { name: true, email: true },
          },
          vendor: {
            select: { name: true, vendorProfile: { select: { businessName: true } } },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.order.count({ where }),
    ]);

    return NextResponse.json({
      orders,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

// POST /api/orders - Create a new order
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      items,
      shippingAddress,
      paypalOrderId,
      hasOrderBump,
    } = body;

    // Calculate totals
    const COMMISSION_RATE = 0.15;
    let subtotal = 0;
    let platformFee = 0;
    let vendorEarnings = 0;

    // Get product details
    const productIds = items.map((item: any) => item.productId);
    const products = await db.product.findMany({
      where: { id: { in: productIds } },
      include: { vendor: true },
    });

    const orderItems = items.map((item: any) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) throw new Error(`Product ${item.productId} not found`);
      
      const itemTotal = product.price * item.quantity;
      const itemPlatformFee = itemTotal * COMMISSION_RATE;
      const itemVendorEarnings = itemTotal - itemPlatformFee;
      
      subtotal += itemTotal;
      platformFee += itemPlatformFee;
      vendorEarnings += itemVendorEarnings;

      return {
        productId: product.id,
        productName: product.name,
        productImage: JSON.parse(product.images)[0] || "",
        price: product.price,
        quantity: item.quantity,
        vendorEarnings: itemVendorEarnings,
        platformFee: itemPlatformFee,
      };
    });

    // Add order bump if selected
    if (hasOrderBump) {
      subtotal += 19;
      platformFee += 19 * COMMISSION_RATE;
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}`;

    // Get the first vendor (for simplicity, orders are per-vendor)
    const vendorId = products[0]?.vendorId || "";

    // Create order
    const order = await db.order.create({
      data: {
        orderNumber,
        buyerId: session.user.id,
        vendorId,
        shippingFirstName: shippingAddress.firstName,
        shippingLastName: shippingAddress.lastName,
        shippingAddress1: shippingAddress.addressLine1,
        shippingAddress2: shippingAddress.addressLine2,
        shippingCity: shippingAddress.city,
        shippingState: shippingAddress.state,
        shippingZip: shippingAddress.zipCode,
        shippingCountry: shippingAddress.country,
        shippingPhone: shippingAddress.phone,
        subtotal,
        platformFee,
        vendorEarnings,
        total: subtotal, // Add shipping/tax if needed
        hasOrderBump: hasOrderBump || false,
        orderBumpPrice: hasOrderBump ? 19 : 0,
        paypalOrderId,
        status: "PENDING",
        paymentStatus: "PAID",
        items: {
          create: orderItems,
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
