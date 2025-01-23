import { z } from 'zod';

const schema = z.object({
  streamingProviderId: z.number(),
  id: z.number().optional(),
  cost: z.string().optional(),
});

export default schema;
