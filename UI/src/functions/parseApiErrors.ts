export function parseApiErrors(data: any): string[] {
  try {
    if (!data) {
      return ["Всё сломалось."];
    }

    // Default  error
    if (data.error && typeof data.error === "string") {
      return [data.error];
    }

    // FluentValidation RFC 7807
    if (data.errors && typeof data.errors === "object") {
      return Object.values(data.errors).flat() as string[];
    }

    if (data.message) return [data.message];
    if (data.title) return [data.title];
    if (data.error) return [data.error];

    return ["Всё сломалось."];
  } catch {
    return ["Всё сломалось."];
  }
}
