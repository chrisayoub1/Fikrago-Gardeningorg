import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// GET /api/vendors - List all approved vendors
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const where: any = {
      role: "VENDOR",
    };

    if (status) {
      where.vendorStatus = status;
    } else {
      // By default, only show approved vendors for public listing
      where.vendorStatus = "APPROVED";
    }

    const vendors = await db.user.findMany({
      where,
      include: {
        vendorProfile: true,
        _count: {
          select: { products: { where: { status: "ACTIVE" } } },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(vendors);
  } catch (error) {
    console.error("Error fetching vendors:", error);
    return NextResponse.json(
      { error: "Failed to fetch vendors" },
      { status: 500 }
    );
  }
}

// POST /api/vendors/apply - Apply to become a vendor
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized - Please sign in first" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      businessName,
      businessEmail,
      businessPhone,
      description,
      address,
      city,
      state,
      zipCode,
      country,
      website,
      instagram,
      facebook,
      paypalEmail,
    } = body;

    // Check if user is already a vendor
    const existingUser = await db.user.findUnique({
      where: { id: session.user.id },
      select: { role: true, vendorStatus: true },
    });

    if (existingUser?.role === "VENDOR" && existingUser.vendorStatus === "APPROVED") {
      return NextResponse.json(
        { error: "You are already an approved vendor" },
        { status: 400 }
      );
    }

    // Update user to vendor role with pending status
    const user = await db.user.update({
      where: { id: session.user.id },
      data: {
        role: "VENDOR",
        vendorStatus: "PENDING",
        paypalEmail,
      },
    });

    // Create or update vendor profile
    const vendorProfile = await db.vendorProfile.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        businessName,
        businessEmail,
        businessPhone,
        description,
        address,
        city,
        state,
        zipCode,
        country,
        website,
        instagram,
        facebook,
      },
      update: {
        businessName,
        businessEmail,
        businessPhone,
        description,
        address,
        city,
        state,
        zipCode,
        country,
        website,
        instagram,
        facebook,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Vendor application submitted successfully. Please wait for admin approval.",
      vendorProfile,
    });
  } catch (error) {
    console.error("Error applying as vendor:", error);
    return NextResponse.json(
      { error: "Failed to submit vendor application" },
      { status: 500 }
    );
  }
}
