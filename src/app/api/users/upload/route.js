import { v2 as cloudinary } from "cloudinary";
import { NextRsponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

cloudinary.config({
  cloud_name,
});
