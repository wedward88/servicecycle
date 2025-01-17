import { z } from 'zod';

const schema = z.object({
  serviceName: z.string().nonempty('Service Name is required.'),
  description: z.string().optional(),
  expirationDate: z.string().optional(),
  cost: z.string().optional(),
});

export default schema;
