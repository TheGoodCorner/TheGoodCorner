import { Prisma } from '@prisma/client';
import { UserUpdate } from '../../interfaces/interfaces.js';

export const userUpdate = ({ body, file }: UserUpdate): Prisma.UserUpdateInput => {
	const data: Prisma.UserUpdateInput = {};

	if (body.email !== undefined)
		data.email = String(body.email);
	if (body.username !== undefined)
		data.username = String(body.username);
	if (body.password !== undefined)
		data.password = String(body.password);
	if (body.name !== undefined)
		data.name = String(body.name);
	if (body.bio !== undefined)
		data.bio = String(body.bio);
	if (body.locationId !== undefined) {
		const locId = typeof body.locationId === 'number' ? body.locationId : parseInt(body.locationId, 10);
		data.location = { connect: { id: locId } };
	}
	if (file)
		data.avatar = `/uploads/${file.filename}`;
	return data;
};