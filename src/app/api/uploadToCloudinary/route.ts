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
    const { images, videos, video, mainImage, subImages } = data;
    const normalizedImages = Array.isArray(images)
      ? images.filter((image: unknown): image is string => typeof image === "string" && image.length > 0)
      : [mainImage, ...(Array.isArray(subImages) ? subImages : [])].filter(
          (image: unknown): image is string => typeof image === "string" && image.length > 0
        );
    const normalizedVideos = (
      Array.isArray(videos) ? videos : [video]
    ).filter((videoItem: unknown): videoItem is string => typeof videoItem === "string" && videoItem.length > 0);

    if (normalizedImages.length === 0 && normalizedVideos.length === 0) {
      return NextResponse.json(
        { success: false, message: "No media provided" },
        { status: 400 }
      );
    }

    const imageUploadResults = await Promise.all(
      normalizedImages.map((image) =>
        cloudinary.uploader.upload(image, {
          folder: "longtai",
        })
      )
    );
    const videoUploadResults = await Promise.all(
      normalizedVideos.map((video) =>
        cloudinary.uploader.upload(video, {
          folder: "longtai",
          resource_type: "video",
        })
      )
    );
    const imageUrls = imageUploadResults.map((result) => result.secure_url);
    const videoUrls = videoUploadResults.map((result) => result.secure_url);

    return NextResponse.json({
      success: true,
      mainImageUrl: imageUrls[0] ?? "",
      subImageUrls: imageUrls.slice(1),
      imageUrls,
      videoUrls,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to upload media";
    const details = error instanceof Error ? error.stack : undefined;

    console.error("Error uploading to Cloudinary:", error);
    return NextResponse.json(
      {
        success: false,
        message,
        details,
      },
      { status: 500 }
    );
  }
}
