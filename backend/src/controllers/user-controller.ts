import type { Context } from "hono";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { Role } from "../db/generated/enums";
import db from "../services/db";

const MAX_CHILDREN_PER_PARENT = 5;

export const getProfile = async (c: Context) => {
	const authUser = c.get("user");
	const user = await db.user.findUnique({
		where: { id: authUser.id },
		include: {
			portfolio: true,
			transactions: { take: 5, orderBy: { timestamp: "desc" } },
		},
	});
	return c.json(user);
};

export const getUserById = async (c: Context) => {
	const authUser = c.get("user");
	const userId = c.req.param("id");

	// Only allow users to get their own profile
	if (userId !== authUser.id) {
		return c.json({ error: "Unauthorized" }, 403);
	}

	const user = await db.user.findUnique({
		where: { id: userId },
		select: {
			id: true,
			email: true,
			name: true,
			role: true,
			balance: true,
			xp: true,
			parentId: true,
			children: {
				select: {
					id: true,
					name: true,
					email: true,
				},
			},
			createdAt: true,
			lastLogin: true,
		},
	});

	if (!user) {
		return c.json({ error: "User not found" }, 404);
	}

	return c.json(user);
};

export const getChildren = async (c: Context) => {
	const authUser = c.get("user");
	if (authUser.role !== Role.PARENT) {
		return c.json({ error: "Only parents can view children" }, 403);
	}

	const children = await db.user.findMany({
		where: { parentId: authUser.id },
		select: {
			id: true,
			email: true,
			name: true,
			role: true,
			balance: true,
			xp: true,
			portfolio: true,
			transactions: { take: 5, orderBy: { timestamp: "desc" } },
			createdAt: true,
			lastLogin: true,
		},
	});
	return c.json(children);
};

const createChildSchema = z.object({
	email: z.string().email("Invalid email format"),
	password: z.string().min(8, "Password must be at least 8 characters"),
	name: z.string().min(2, "Name must be at least 2 characters"),
});

export const createChild = async (c: Context) => {
	const authUser = c.get("user");
	if (authUser.role !== Role.PARENT) {
		return c.json({ error: "Only parents can create child accounts" }, 403);
	}

	try {
		const body = await c.req.json();
		const { email, password, name } = createChildSchema.parse(body);

		const childCount = await db.user.count({
			where: { parentId: authUser.id },
		});

		if (childCount >= MAX_CHILDREN_PER_PARENT) {
			return c.json(
				{ error: `Maximum of ${MAX_CHILDREN_PER_PARENT} children allowed per parent` },
				400,
			);
		}

		// Create user manually with role and parentId, then create account with password
		// Hash password using bcrypt (same as better-auth uses)
		const hashedPassword = await bcrypt.hash(password, 10);

		const child = await db.user.create({
			data: {
				email,
				name,
				role: Role.CHILD,
				parentId: authUser.id,
				emailVerified: false,
				accounts: {
					create: {
						accountId: email,
						providerId: "credential",
						password: hashedPassword,
					},
				},
			},
			select: {
				id: true,
				email: true,
				name: true,
				role: true,
				balance: true,
				xp: true,
				createdAt: true,
			},
		});

		return c.json({ success: true, child }, 201);
	} catch (e) {
		if (e instanceof z.ZodError) {
			return c.json({ error: "Validation error", details: e.errors }, 400);
		}

		if (e && typeof e === "object" && "code" in e && e.code === "P2002") {
			return c.json({ error: "Email already exists" }, 409);
		}

		console.error("Create child error:", e);
		return c.json({ error: "Failed to create child account" }, 500);
	}
};