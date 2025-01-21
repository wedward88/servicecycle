import { z } from 'zod';

const schema = z.object({
  streamingProviderId: z.number(),
  id: z.number().optional(),
  description: z.string().optional(),
  cost: z.string().optional(),
});

export default schema;
