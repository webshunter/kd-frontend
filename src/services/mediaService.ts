import { api, ApiError } from './api';

interface MediaUploadResponse {
  imageUrl: string;
}

/**
 * Layanan media untuk menangani upload manual maupun generasi gambar produk.
 */
class MediaService {
  /**
   * Unggah file gambar produk ke backend dan dapatkan URL publiknya.
   */
  async uploadProductImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.upload<MediaUploadResponse>('/media/product-image/upload', formData);
    if (!response.success || !response.data) {
      throw new ApiError(response.message || 'Gagal mengunggah gambar produk.', 500, response);
    }

    return response.data.imageUrl;
  }

  /**
   * Minta backend membuat gambar dengan Gemini berdasarkan prompt produk.
   */
  async generateProductImage(prompt: string, aspectRatio: string): Promise<string> {
    const response = await api.post<MediaUploadResponse>('/media/product-image/generate', {
      prompt,
      aspectRatio,
    });

    if (!response.success || !response.data) {
      throw new ApiError(response.message || 'Gagal membuat gambar melalui Gemini.', 500, response);
    }

    return response.data.imageUrl;
  }
}

export const mediaService = new MediaService();
export type { MediaUploadResponse };
