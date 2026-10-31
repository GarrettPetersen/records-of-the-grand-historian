import { createHash } from 'node:crypto';
export const identityArtifactHash = bytes => createHash('sha256').update(bytes).digest('hex');
