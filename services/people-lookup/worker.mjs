import { DurableObject } from 'cloudflare:workers';
import { handleLookup, consumeBudget, json } from './api.mjs';

export class PeopleBudget extends DurableObject {
  async fetch() {
    const allowed=await consumeBudget(this.ctx.storage,Date.now());
    return json({allowed},allowed?200:429);
  }
}
export default {fetch:handleLookup};
