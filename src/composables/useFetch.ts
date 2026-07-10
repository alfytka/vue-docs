interface FetchState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

export async function useFetch<T>(
  url: string,
  options?: RequestInit,
  signal?: AbortSignal
): Promise<FetchState<T>> {
  try {
    const response = await fetch(url, { ...options, signal });

    if (!response.ok) {
      throw new Error(`Request gagal: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as T;
    return { data, isLoading: false, error: null };
  } catch (error) {
    // AbortError terjadi kalau request di-cancel manual (misal user pindah halaman)
    // Ini BUKAN error sungguhan, jadi jangan ditampilkan sebagai error ke user
    if (error instanceof Error && error.name === 'AbortError') {
      return { data: null, isLoading: false, error: null };
    }

    const message = error instanceof Error ? error.message : 'Terjadi kesalahan tidak diketahui';
    return { data: null, isLoading: false, error: message };
  }
}