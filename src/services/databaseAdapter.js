export async function readTable(client, candidates, options = {}) {
  const tables = Array.isArray(candidates) ? candidates : [candidates];
  const errors = [];

  for (const table of tables) {
    try {
      let query = client.from(table).select('*');

      if (options.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;

      if (!error && Array.isArray(data)) {
        return { data, table, error: null };
      }

      errors.push({ table, error });
    } catch (error) {
      errors.push({ table, error });
    }
  }

  return {
    data: [],
    table: null,
    error: errors[0]?.error || new Error('Tidak ada tabel yang cocok ditemukan')
  };
}

export function getValue(row, keys, fallback = '') {
  if (!row || typeof row !== 'object') return fallback;

  for (const key of keys) {
    const value = row[key];
    if (value !== undefined && value !== null && value !== '') {
      return value;
    }
  }

  return fallback;
}

export function toNumber(value, fallback = 0) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

export function toDateValue(value) {
  if (!value) return null;

  const dateValue = new Date(value);
  return Number.isNaN(dateValue.getTime()) ? null : dateValue;
}

export function containsText(value, candidates = []) {
  const text = String(value || '').toLowerCase();
  return candidates.some(item => text.includes(String(item).toLowerCase()));
}
