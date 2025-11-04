import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextsuth]/route";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
