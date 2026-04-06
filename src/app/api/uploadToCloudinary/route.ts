import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

const validateCloudinaryConfig = () => {
  const requiredEnvVars = [
    "NEXT_CLOUD_NAME",
    "NEXT_CLOUDINARY_API_KEY",
    "NEXT_CLOUDINARY_SECRET",
  ];

  const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required Cloudinary environment variables: ${missingVars.join(", ")}`
    );
  }
};

try {
  validateCloudinaryConfig();
  cloudinary.config({
    cloud_name: process.env.NEXT_CLOUD_NAME,
    api_key: process.env.NEXT_CLOUDINARY_API_KEY,
    api_secret: process.env.NEXT_CLOUDINARY_SECRET,
  });
} catch (error) {
  console.error("Cloudinary configuration error:", error);
}

export async function POST(request: NextRequest) {
  try {
    validateCloudinaryConfig();

    const data = await request.json();
    const { mainImage, subImages } = data;

    if (!mainImage) {
      return NextResponse.json(
        { success: false, message: "No main image provided" },
        { status: 400 }
      );
    }

    const mainImageResult = await cloudinary.uploader.upload(mainImage, {
      folder: "longtai",
    });

    let subImageUrls: string[] = [];
    if (subImages && subImages.length > 0) {
      const subImagePromises = subImages.map((image: string) =>
        cloudinary.uploader.upload(image, {
          folder: "longtai",
        })
      );
      const subImageResults = await Promise.all(subImagePromises);
      subImageUrls = subImageResults.map((result) => result.secure_url);
    }

    return NextResponse.json({
      success: true,
      mainImageUrl: mainImageResult.secure_url,
      subImageUrls,
    });
  } catch (error: any) {
    console.error("Error uploading to Cloudinary:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to upload image(s)",
        details: error.stack,
      },
      { status: 500 }
    );
  }
}