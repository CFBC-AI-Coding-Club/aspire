import type { Context } from "hono";
import { z } from "zod";
import { Role } from "../db/generated/enums";
import db from "../services/db";

const updateUserSchema = z.object({
	name: z.string().min(2).optional(),
	email: z.string().email().optional(),
	balance: z.number().min(0).optional(),
	xp: z.number().int().min(0).optional(),
	isActive: z.boolean().optional(),
	role: z.nativeEnum(Role).optional(),
});

export const getAllUsers = async (c: Context) => {
	try {
		const page = parseInt(c.req.query("page") || "1");
		const limit = parseInt(c.req.query("limit") || "50");
		const skip = (page - 1) * limit;

		const [users, total] = await Promise.all([
			db.user.findMany({
				skip,
				take: limit,
				select: {
					id: true,
					email: true,
					name: true,
					role: true,
					balance: true,
					xp: true,
					isActive: true,
					parentId: true,
					createdAt: true,
					lastLogin: true,
					_count: {
						select: {
							children: true,
							transactions: true,
							portfolio: true,
						},
					},
				},
				orderBy: { createdAt: "desc" },
			}),
			db.user.count(),
		]);

		return c.json({
			users,
			pagination: {
				page,
				limit,
				total,
				totalPages: Math.ceil(total / limit),
			},
		});
	} catch (error) {
		console.error("Error fetching users:", error);
		return c.json({ error: "Failed to fetch users" }, 500);
	}
};

export const getUserById = async (c: Context) => {
	const userId = c.req.param("id");

	try {
		const user = await db.user.findUnique({
			where: { id: userId },
			include: {
				portfolio: true,
				transactions: { take: 10, orderBy: { timestamp: "desc" } },
				children: {
					select: {
						id: true,
						name: true,
						email: true,
						balance: true,
						xp: true,
						createdAt: true,
					},
				},
				parent: {
					select: {
						id: true,
						name: true,
						email: true,
					},
				},
			},
		});

		if (!user) {
			return c.json({ error: "User not found" }, 404);
		}

		return c.json(user);
	} catch (error) {
		console.error("Error fetching user:", error);
		return c.json({ error: "Failed to fetch user" }, 500);
	}
};

export const updateUser = async (c: Context) => {
	const userId = c.req.param("id");

	try {
		const body = await c.req.json();
		const updateData = updateUserSchema.parse(body);

		// Prevent role changes that would break relationships
		if (updateData.role) {
			const existingUser = await db.user.findUnique({
				where: { id: userId },
				select: { role: true, parentId: true, children: { select: { id: true } } },
			});

			if (!existingUser) {
				return c.json({ error: "User not found" }, 404);
			}

			// If changing to CHILD, must have parentId
			if (updateData.role === Role.CHILD && !existingUser.parentId) {
				return c.json({ error: "Cannot change to CHILD role without parentId" }, 400);
			}

			// If changing from PARENT, must not have children
			if (existingUser.role === Role.PARENT && updateData.role !== Role.PARENT) {
				const childCount = await db.user.count({ where: { parentId: userId } });
				if (childCount > 0) {
					return c.json(
						{ error: "Cannot change role: user has children accounts" },
						400,
					);
				}
			}
		}

		const updatedUser = await db.user.update({
			where: { id: userId },
			data: updateData,
			select: {
				id: true,
				email: true,
				name: true,
				role: true,
				balance: true,
				xp: true,
				isActive: true,
				createdAt: true,
				lastLogin: true,
			},
		});

		return c.json(updatedUser);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return c.json({ error: "Validation error", details: error.errors }, 400);
		}

		if (error && typeof error === "object" && "code" in error && error.code === "P2025") {
			return c.json({ error: "User not found" }, 404);
		}

		console.error("Error updating user:", error);
		return c.json({ error: "Failed to update user" }, 500);
	}
};

export const deleteUser = async (c: Context) => {
	const userId = c.req.param("id");

	try {
		const user = await db.user.findUnique({
			where: { id: userId },
			select: { role: true, children: { select: { id: true } } },
		});

		if (!user) {
			return c.json({ error: "User not found" }, 404);
		}

		// Check if user has children
		if (user.role === Role.PARENT) {
			const childCount = await db.user.count({ where: { parentId: userId } });
			if (childCount > 0) {
				return c.json(
					{ error: "Cannot delete parent account with active children" },
					400,
				);
			}
		}

		// Soft delete by deactivating
		await db.user.update({
			where: { id: userId },
			data: { isActive: false },
		});

		return c.json({ message: "User deactivated successfully" });
	} catch (error) {
		console.error("Error deleting user:", error);
		return c.json({ error: "Failed to delete user" }, 500);
	}
};

export const getSystemStats = async (c: Context) => {
	try {
		const [
			totalUsers,
			totalParents,
			totalChildren,
			totalStocks,
			totalTransactions,
			totalVolume,
		] = await Promise.all([
			db.user.count({ where: { isActive: true } }),
			db.user.count({ where: { role: Role.PARENT, isActive: true } }),
			db.user.count({ where: { role: Role.CHILD, isActive: true } }),
			db.stock.count({ where: { isActive: true } }),
			db.transaction.count(),
			db.transaction.aggregate({
				_sum: { quantity: true },
			}),
		]);

		return c.json({
			users: {
				total: totalUsers,
				parents: totalParents,
				children: totalChildren,
			},
			stocks: {
				total: totalStocks,
			},
			trading: {
				totalTransactions,
				totalVolume: totalVolume._sum.quantity || 0,
			},
		});
	} catch (error) {
		console.error("Error fetching system stats:", error);
		return c.json({ error: "Failed to fetch system stats" }, 500);
	}
};

