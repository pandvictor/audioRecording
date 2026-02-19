type LogPayload = Record<string, unknown>;

export const logEvent = (name: string, payload: LogPayload = {}) => {
  const timestamp = new Date().toISOString();
  console.log(`[RUM] ${timestamp} ${name}`, payload);
};
