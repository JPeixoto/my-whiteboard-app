import type { Img } from "@/types/whiteboard";

export const handlePaste = (
  e: ClipboardEvent,
  context: CanvasRenderingContext2D,
  pan: { x: number; y: number },
  zoom: number,
  handleImagesChange: (newImages: Img[]) => void,
  images: Img[],
  setLoading: (loading: boolean) => void
) => {
  const items = e.clipboardData?.items;
  if (!items) return;

  for (let i = 0; i < items.length; i++) {
    if (items[i].type.indexOf("image") !== -1) {
      const blob = items[i].getAsFile();
      if (!blob) continue;

      const reader = new FileReader();
      setLoading(true);

      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const x = (e.clientX - pan.x) / zoom;
          const y = (e.clientY - pan.y) / zoom;
          const newImage: Img = {
            id: Date.now(),
            x,
            y,
            width: img.width,
            height: img.height,
            element: img,
            src: img.src,
          };
          handleImagesChange([...images, newImage]);
          setLoading(false);
        };
        img.onerror = () => {
          setLoading(false);
          console.error("Error loading image");
        };
        img.src = event.target?.result as string;
      };
      reader.onerror = () => {
        setLoading(false);
        console.error("Error reading file");
      };
      reader.readAsDataURL(blob);
    }
  }
};
