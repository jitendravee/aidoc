import { useMutation } from "@tanstack/react-query";
import { uploadDocument, uploadImagesBatch } from "@/lib/api/documents";

const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png"];
const isImageFile = (file: File) =>
  IMAGE_EXTENSIONS.some((ext) => file.name.toLowerCase().endsWith(ext));

export function useUploadMultipleDocuments() {
  return useMutation({
    mutationFn: async (files: File[]) => {
      const images = files.filter(isImageFile);
      const nonImages = files.filter((f) => !isImageFile(f));

      const results: any[] = [];
      const passwordPrompts: any[] = [];

      if (images.length === 1) {
        nonImages.push(images[0]); // one image is just a normal single upload
      } else if (images.length > 1) {
        const batchResult = await uploadImagesBatch(images);
        if (batchResult.status === "success") results.push(batchResult);
      }

      for (const file of nonImages) {
        const result = await uploadDocument(file);
        if (result.status === "password_required") passwordPrompts.push(result);
        else if (result.status === "success") results.push(result);
      }

      return { results, passwordPrompts };
    },
  });
}