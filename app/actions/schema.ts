import { z } from 'zod';

const schema = z.object({
  userId: z.string().nonempty('User ID is required.'),
  serviceName: z.string().nonempty('Provider is required.'),
  description: z.string().optional(),
  expirationDate: z.string().optional(),
  cost: z.string().optional(),
});

export default schema;
