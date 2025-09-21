'use client';

import React, { useRef, useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { handlePaste } from '../lib/imageUtils';
import type { Tool, ShapeType, Path, Shape, Img, TextElement, BrushStyle } from '@/types/whiteboard';

interface WhiteboardProps {
  room: string;
  tool: Tool;
  color: string;
  strokeWidth: number;
  clear: boolean;
  setClear: (clear: boolean) => void;
  zoom: number;
  setZoom: (zoom: number) => void;
  shape: ShapeType;
  brushStyle?: BrushStyle;
}

const HANDLE_SIZE = 8;

const Whiteboard: React.FC<WhiteboardProps> = ({ room, tool, color, strokeWidth, clear, setClear, zoom, setZoom, shape, brushStyle = 'brush' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  const [drawing, setDrawing] = useState(false);
  const [paths, setPaths] = useState<Path[]>([]);
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [images, setImages] = useState<Img[]>([]);
  const [textElements, setTextElements] = useState<TextElement[]>([]);
  const [multiSelection, setMultiSelection] = useState<(Shape | Img | TextElement)[]>([]);
  const [selectionBox, setSelectionBox] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [moving, setMoving] = useState(false);
  const [resizingHandle, setResizingHandle] = useState<string | null>(null);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [pan, setPan] = useState({ x: 0, y: 0 });

  const [loading, setLoading] = useState(false);
  const [editingTextElement, setEditingTextElement] = useState<TextElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      setContext(ctx);
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const handlePasteEvent = (e: ClipboardEvent) => {
        if (ctx) {
          handlePaste(e, ctx, pan, zoom, handleImagesChange, images, setLoading);
        }
      };

      window.addEventListener('paste', handlePasteEvent);

      return () => {
        window.removeEventListener('paste', handlePasteEvent);
      };
    }
  }, [context, pan, zoom, images]);

  useEffect(() => {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001';
    const newSocket = io(wsUrl);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      newSocket.emit('joinRoom', room);
    });

    newSocket.on('drawing', (data) => {
      if (data.newPath) {
        const np = data.newPath;
        setPaths(prevPaths => [...prevPaths, { id: np.id ?? Date.now(), brushStyle: np.brushStyle ?? 'brush', ...np }]);
      }
      if (data.newShape) {
        setShapes(prevShapes => [...prevShapes, data.newShape]);
      }
      if (data.newImage) {
        const img = new window.Image();
        img.src = data.newImage.src;
        setImages(prevImages => [...prevImages, { ...data.newImage, element: img }]);
      }
      if (data.newTextElement) {
        setTextElements(prevTextElements => [...prevTextElements, data.newTextElement]);
      }
      if (data.updatedSelection) {
        const updatedIds = data.updatedSelection.map((item: any) => item.id);
        const newShapes = shapes.map(shape => {
          const updatedShape = data.updatedSelection.find((item: any) => item.id === shape.id);
          return updatedShape || shape;
        });
        const newImages = images.map(image => {
          const updatedImage = data.updatedSelection.find((item: any) => item.id === image.id);
          return updatedImage || image;
        });
        const newTextElements = textElements.map(textElement => {
          const updatedTextElement = data.updatedSelection.find((item: any) => item.id === textElement.id);
          return updatedTextElement || textElement;
        });
        setShapes(newShapes);
        setImages(newImages);
        setTextElements(newTextElements);
      }
    });

    return () => {
      newSocket.disconnect();
    };
  }, [room]);

  const handlePathsChange = (newPaths: Path[]) => {
    setPaths(newPaths);
    socket?.emit('drawing', { room, newPath: newPaths[newPaths.length - 1] });
  };

  const handleShapesChange = (newShapes: Shape[]) => {
    setShapes(newShapes);
    socket?.emit('drawing', { room, newShape: newShapes[newShapes.length - 1] });
  };

  const handleImagesChange = (newImages: Img[]) => {
    setImages(newImages);
    const newImage = newImages[newImages.length - 1];
    if (newImage) {
      socket?.emit('drawing', { room, newImage: { ...newImage, src: newImage.element.src } });
    }
  };

  const handleTextElementsChange = (newTextElements: TextElement[]) => {
    setTextElements(newTextElements);
    const newTextElement = newTextElements[newTextElements.length - 1];
    if (newTextElement) {
      socket?.emit('drawing', { room, newTextElement });
    }
  };

  const handleMultiSelectionChange = (newSelection: (Shape | Img)[]) => {
    setMultiSelection(newSelection);
    const selectionData = newSelection.map(item => {
      if ('element' in item) {
        return { ...item, src: item.element.src };
      }
      return item;
    });
    socket?.emit('drawing', { room, updatedSelection: selectionData });
  };

  useEffect(() => {
    if (clear) {
      handlePathsChange([]);
      handleShapesChange([]);
      handleImagesChange([]);
      handleMultiSelectionChange([]);
      setPan({ x: 0, y: 0 });
      setZoom(1);
      setClear(false);
    }
  }, [clear]);

  const drawGrid = (ctx: CanvasRenderingContext2D) => {
    ctx.save();
    ctx.strokeStyle = '#f0f0f0';
    ctx.lineWidth = 1;
    const gridSize = 50 * zoom;

    for (let x = pan.x % gridSize; x < ctx.canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, ctx.canvas.height);
      ctx.stroke();
    }

    for (let y = pan.y % gridSize; y < ctx.canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(ctx.canvas.width, y);
      ctx.stroke();
    }
    ctx.restore();
  };

  const drawHandles = (ctx: CanvasRenderingContext2D, item: { x: number; y: number; width: number; height: number }) => {
    const { x, y, width, height } = item;
    const handles = {
      tl: { x: x, y: y },
      tr: { x: x + width, y: y },
      bl: { x: x, y: y + height },
      br: { x: x + width, y: y + height },
    };

    ctx.fillStyle = '#007bff';
    Object.values(handles).forEach(handle => {
      ctx.fillRect(handle.x - HANDLE_SIZE / 2, handle.y - HANDLE_SIZE / 2, HANDLE_SIZE, HANDLE_SIZE);
    });
  };

    const drawBasic = (ctx: CanvasRenderingContext2D, path: Path) => {
      ctx.save();
      ctx.strokeStyle = path.color;
      ctx.lineWidth = path.strokeWidth;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.beginPath();
      if (path.points.length > 0) {
        ctx.moveTo(path.points[0].x, path.points[0].y);
        path.points.forEach(p => ctx.lineTo(p.x, p.y));
        ctx.stroke();
      }
      ctx.restore();
    };

    const seeded = (seed: number) => {
      let t = seed + 0x6D2B79F5;
      return function() {
        t += 0x6D2B79F5;
        let x = Math.imul(t ^ (t >>> 15), 1 | t);
        x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
        return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
      };
    };

    const drawAirbrush = (ctx: CanvasRenderingContext2D, path: Path) => {
      ctx.save();
      const radius = Math.max(2, path.strokeWidth * 1.5);
      ctx.fillStyle = path.color;
      const rng = seeded(path.id);
      for (let i = 0; i < path.points.length; i += 2) {
        const p = path.points[i];
        for (let j = 0; j < 10; j++) {
          const r = radius * Math.sqrt(rng());
          const t = 2 * Math.PI * rng();
          const dx = r * Math.cos(t);
          const dy = r * Math.sin(t);
          ctx.globalAlpha = 0.25;
          ctx.beginPath();
          ctx.arc(p.x + dx, p.y + dy, 0.6 + rng() * 0.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
    };

    const drawMarker = (ctx: CanvasRenderingContext2D, path: Path) => {
      ctx.save();
      ctx.globalAlpha = 0.85;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = path.color;
      ctx.lineWidth = path.strokeWidth * 1.6;
      ctx.beginPath();
      if (path.points.length > 0) {
        ctx.moveTo(path.points[0].x, path.points[0].y);
        path.points.forEach(p => ctx.lineTo(p.x, p.y));
        ctx.stroke();
      }
      ctx.restore();
    };

    const drawCrayon = (ctx: CanvasRenderingContext2D, path: Path) => {
      ctx.save();
      ctx.strokeStyle = path.color;
      ctx.lineWidth = Math.max(1, path.strokeWidth * 0.9);
      ctx.setLineDash([1, 2]);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.globalAlpha = 0.9;
      ctx.beginPath();
      if (path.points.length > 0) {
        ctx.moveTo(path.points[0].x, path.points[0].y);
        path.points.forEach(p => ctx.lineTo(p.x, p.y));
        ctx.stroke();
      }
      ctx.setLineDash([]);
      ctx.globalAlpha = 0.15;
      ctx.lineWidth = path.strokeWidth * 1.2;
      ctx.beginPath();
      if (path.points.length > 0) {
        ctx.moveTo(path.points[0].x, path.points[0].y);
        path.points.forEach(p => ctx.lineTo(p.x + 0.5, p.y + 0.5));
        ctx.stroke();
      }
      ctx.restore();
    };

    const drawPencil = (ctx: CanvasRenderingContext2D, path: Path) => {
      ctx.save();
      ctx.globalAlpha = 0.6;
      ctx.strokeStyle = path.color;
      ctx.lineWidth = Math.max(0.5, path.strokeWidth * 0.6);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      if (path.points.length > 0) {
        ctx.moveTo(path.points[0].x, path.points[0].y);
        path.points.forEach((p, i) => {
          const jitter = (i % 2 === 0) ? 0.2 : -0.2;
          ctx.lineTo(p.x + jitter, p.y + jitter);
        });
        ctx.stroke();
      }
      ctx.restore();
    };

    const drawWatercolor = (ctx: CanvasRenderingContext2D, path: Path) => {
      ctx.save();
      ctx.globalAlpha = 0.35;
      // @ts-ignore
      ctx.filter = 'blur(1.2px)';
      ctx.strokeStyle = path.color;
      ctx.lineWidth = path.strokeWidth * 2.2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      if (path.points.length > 0) {
        ctx.moveTo(path.points[0].x, path.points[0].y);
        path.points.forEach(p => ctx.lineTo(p.x, p.y));
        ctx.stroke();
      }
      ctx.restore();
    };

    const drawOil = (ctx: CanvasRenderingContext2D, path: Path) => {
      ctx.save();
      ctx.strokeStyle = path.color;
      ctx.lineWidth = path.strokeWidth * 1.8;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.globalAlpha = 0.8;
      ctx.beginPath();
      if (path.points.length > 0) {
        ctx.moveTo(path.points[0].x, path.points[0].y);
        path.points.forEach(p => ctx.lineTo(p.x, p.y));
        ctx.stroke();
      }
      ctx.globalAlpha = 0.2;
      ctx.lineWidth = path.strokeWidth * 2.2;
      ctx.beginPath();
      if (path.points.length > 0) {
        ctx.moveTo(path.points[0].x + 0.5, path.points[0].y + 0.5);
        path.points.forEach(p => ctx.lineTo(p.x + 0.5, p.y + 0.5));
        ctx.stroke();
      }
      ctx.restore();
    };

    const drawCalligraphy = (ctx: CanvasRenderingContext2D, path: Path) => {
      ctx.save();
      ctx.strokeStyle = path.color;
      ctx.lineWidth = path.strokeWidth * 1.4;
      ctx.lineCap = 'butt';
      ctx.lineJoin = 'miter';
      ctx.beginPath();
      if (path.points.length > 0) {
        ctx.moveTo(path.points[0].x, path.points[0].y);
        path.points.forEach(p => ctx.lineTo(p.x, p.y));
        ctx.stroke();
      }
      ctx.restore();
    };

    const drawPathWithBrush = (ctx: CanvasRenderingContext2D, path: Path) => {
      const style = path.brushStyle || 'brush';
      switch (style) {
        case 'airbrush':
          drawAirbrush(ctx, path);
          break;
        case 'marker':
          drawMarker(ctx, path);
          break;
        case 'crayon':
          drawCrayon(ctx, path);
          break;
        case 'natural-pencil':
          drawPencil(ctx, path);
          break;
        case 'watercolor-brush':
          drawWatercolor(ctx, path);
          break;
        case 'oil-brush':
          drawOil(ctx, path);
          break;
        case 'calligraphy-brush':
        case 'calligraphy-pen':
          drawCalligraphy(ctx, path);
          break;
        case 'brush':
        default:
          drawBasic(ctx, path);
      }
    };

    useEffect(() => {
      if (context) {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        drawGrid(context);
        context.save();
        context.setTransform(zoom, 0, 0, zoom, pan.x, pan.y);
        paths.forEach(path => {
          drawPathWithBrush(context, path);
        });
      shapes.forEach(shape => {
        context.strokeStyle = shape.color;
        context.lineWidth = shape.strokeWidth;
        context.beginPath();
        if (shape.type === 'rectangle') {
          context.strokeRect(shape.x, shape.y, shape.width, shape.height);
        } else if (shape.type === 'circle') {
          context.ellipse(shape.x + shape.width / 2, shape.y + shape.height / 2, Math.abs(shape.width / 2), Math.abs(shape.height / 2), 0, 0, 2 * Math.PI);
        } else if (shape.type === 'triangle') {
          context.moveTo(shape.x + shape.width / 2, shape.y);
          context.lineTo(shape.x, shape.y + shape.height);
          context.lineTo(shape.x + shape.width, shape.y + shape.height);
          context.closePath();
        }
        context.stroke();
      });
      images.forEach(image => {
        context.drawImage(image.element, image.x, image.y, image.width, image.height);
      });
      textElements.forEach(textElement => {
        context.font = `${textElement.fontSize}px ${textElement.fontFamily}`;
        context.fillStyle = textElement.color;
        context.fillText(textElement.text, textElement.x, textElement.y + textElement.fontSize);
      });

      if (selectionBox) {
        context.strokeStyle = '#007bff';
        context.lineWidth = 1;
        context.setLineDash([5, 5]);
        context.strokeRect(selectionBox.x, selectionBox.y, selectionBox.width, selectionBox.height);
        context.setLineDash([]);
      }

      if (multiSelection.length > 0) {
        const bounds = getBoundingBox(multiSelection);
        context.strokeStyle = '#007bff';
        context.lineWidth = 2;
        context.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
        drawHandles(context, bounds);
      }

      context.restore();
    }
  }, [paths, shapes, images, multiSelection, selectionBox, pan, zoom, context]);

  const getBoundingBox = (items: (Shape | Img | TextElement)[]) => {
    if (items.length === 0) {
      return { x: 0, y: 0, width: 0, height: 0 };
    }
    const minX = Math.min(...items.map(item => item.x));
    const minY = Math.min(...items.map(item => item.y));
    const maxX = Math.max(...items.map(item => item.x + item.width));
    const maxY = Math.max(...items.map(item => item.y + item.height));
    return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
  };

  const getItemsInSelectionBox = (box: { x: number; y: number; width: number; height: number }) => {
    const selectedItems: (Shape | Img | TextElement)[] = [];
    const allItems = [...shapes, ...images, ...textElements];
    const sx = Math.min(box.x, box.x + box.width);
    const sy = Math.min(box.y, box.y + box.height);
    const sw = Math.abs(box.width);
    const sh = Math.abs(box.height);

    allItems.forEach(item => {
      if (
        item.x < sx + sw &&
        item.x + item.width > sx &&
        item.y < sy + sh &&
        item.y + item.height > sy
      ) {
        selectedItems.push(item);
      }
    });
    return selectedItems;
  };

  const getHandleAtPosition = (x: number, y: number, item: { x: number; y: number; width: number; height: number }) => {
    const { x: sx, y: sy, width, height } = item;
    const handles = {
      tl: { x: sx, y: sy },
      tr: { x: sx + width, y: sy },
      bl: { x: sx, y: sy + height },
      br: { x: sx + width, y: sy + height },
    };

    for (const [name, handle] of Object.entries(handles)) {
      if (
        x >= handle.x - HANDLE_SIZE / 2 &&
        x <= handle.x + HANDLE_SIZE / 2 &&
        y >= handle.y - HANDLE_SIZE / 2 &&
        y <= handle.y + HANDLE_SIZE / 2
      ) {
        return name;
      }
    }
    return null;
  };

  const startDrawing = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (event.button === 0 && context) {
      setDrawing(true);
      const { offsetX, offsetY } = event.nativeEvent;
      const x = (offsetX - pan.x) / zoom;
      const y = (offsetY - pan.y) / zoom;
      setStartPoint({ x, y });

      if (tool === 'pen' || tool === 'bruh' || tool === 'eraser') {
        const newPath: Path = { id: Date.now(), points: [{ x, y }], color, strokeWidth, brushStyle };
        handlePathsChange([...paths, newPath]);
      } else if (tool === 'shape') {
        const newShape: Shape = { id: Date.now(), x, y, width: 0, height: 0, color, strokeWidth, type: shape };
        handleShapesChange([...shapes, newShape]);
      } else if (tool === 'text') {
        const newTextElement: TextElement = { id: Date.now(), x, y, text: '', fontSize: 20, fontFamily: 'Arial', color, width: 0, height: 0 };
        handleTextElementsChange([...textElements, newTextElement]);
        setEditingTextElement(newTextElement);
      } else if (tool === 'select') {
        if (multiSelection.length > 0) {
          const bounds = getBoundingBox(multiSelection);
          const handle = getHandleAtPosition(x, y, bounds);
          if (handle) {
            setResizingHandle(handle);
            return;
          }
          if (x >= bounds.x && x <= bounds.x + bounds.width && y >= bounds.y && y <= bounds.y + bounds.height) {
            setMoving(true);
            return;
          }
        }
        setSelectionBox({ x, y, width: 0, height: 0 });
        handleMultiSelectionChange([]);
      }
    }
  };

  const draw = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (drawing && context) {
      const { offsetX, offsetY } = event.nativeEvent;
      const x = (offsetX - pan.x) / zoom;
      const y = (offsetY - pan.y) / zoom;

      if (tool === 'pen' || tool === 'bruh' || tool === 'eraser') {
        if (paths.length > 0) {
          const newPaths = [...paths];
          newPaths[newPaths.length - 1].points.push({ x, y });
          handlePathsChange(newPaths);
        }
      } else if (tool === 'shape') {
        if (shapes.length > 0) {
          const newShapes = [...shapes];
          const currentShape = newShapes[newShapes.length - 1];
          currentShape.width = x - startPoint.x;
          currentShape.height = y - startPoint.y;
          handleShapesChange(newShapes);
        }
      } else if (tool === 'select') {
        if (moving && multiSelection.length > 0) {
          const dx = x - startPoint.x;
          const dy = y - startPoint.y;

          const newShapes = shapes.map(shape => {
            if (multiSelection.find(item => item.id === shape.id)) {
              return { ...shape, x: shape.x + dx, y: shape.y + dy };
            }
            return shape;
          });
          handleShapesChange(newShapes);

          const newImages = images.map(image => {
            if (multiSelection.find(item => item.id === image.id)) {
              return { ...image, x: image.x + dx, y: image.y + dy };
            }
            return image;
          });
          handleImagesChange(newImages);

          const newTextElements = textElements.map(textElement => {
            if (multiSelection.find(item => item.id === textElement.id)) {
              return { ...textElement, x: textElement.x + dx, y: textElement.y + dy };
            }
            return textElement;
          });
          handleTextElementsChange(newTextElements);

          const newSelection = multiSelection.map(item => ({ ...item, x: item.x + dx, y: item.y + dy }));
          setMultiSelection(newSelection);

          setStartPoint({ x, y });
        } else if (resizingHandle && multiSelection.length > 0) {
          const bounds = getBoundingBox(multiSelection);
          const newSelection = multiSelection.map(item => {
            const newItem = { ...item };
            const relX = (item.x - bounds.x) / (bounds.width || 1);
            const relY = (item.y - bounds.y) / (bounds.height || 1);
            const relW = item.width / (bounds.width || 1);
            const relH = item.height / (bounds.height || 1);

            let newBounds = { ...bounds };

            switch (resizingHandle) {
              case 'tl':
                newBounds.width += newBounds.x - x;
                newBounds.height += newBounds.y - y;
                newBounds.x = x;
                newBounds.y = y;
                break;
              case 'tr':
                newBounds.width = x - newBounds.x;
                newBounds.height += newBounds.y - y;
                newBounds.y = y;
                break;
              case 'bl':
                newBounds.width += newBounds.x - x;
                newBounds.height = y - newBounds.y;
                newBounds.x = x;
                break;
              case 'br':
                newBounds.width = x - newBounds.x;
                newBounds.height = y - newBounds.y;
                break;
            }

            newItem.x = newBounds.x + relX * newBounds.width;
            newItem.y = newBounds.y + relY * newBounds.height;
            newItem.width = relW * newBounds.width;
            newItem.height = relH * newBounds.height;

            return newItem;
          });
          setMultiSelection(newSelection);

          const newShapes = shapes.map(shape => {
            const updatedShape = newSelection.find(item => item.id === shape.id);
            return updatedShape && 'width' in updatedShape ? updatedShape : shape;
          });
          handleShapesChange(newShapes as Shape[]);

          const newImages = images.map(image => {
            const updatedImage = newSelection.find(item => item.id === image.id);
            return updatedImage && 'element' in updatedImage ? updatedImage : image;
          });
          handleImagesChange(newImages as Img[]);

          const newTextElements = textElements.map(textElement => {
            const updatedTextElement = newSelection.find(item => item.id === textElement.id);
            return updatedTextElement && 'text' in updatedTextElement ? updatedTextElement : textElement;
          });
          handleTextElementsChange(newTextElements as TextElement[]);

        } else if (selectionBox) {
          setSelectionBox({
            ...selectionBox,
            width: x - startPoint.x,
            height: y - startPoint.y,
          });
        }
      }
    }
  };

  const stopDrawing = () => {
    if (tool === 'select' && selectionBox) {
      const items = getItemsInSelectionBox(selectionBox);
      handleMultiSelectionChange(items);
    }
    if (moving || resizingHandle) {
      socket?.emit('drawing', { room, updatedSelection: multiSelection, shapes, images, textElements });
    }
    setDrawing(false);
    setSelectionBox(null);
    setMoving(false);
    setResizingHandle(null);
  };

  const handlePan = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (event.buttons === 4) { // Middle mouse button
      setPan({
        x: pan.x + event.movementX,
        y: pan.y + event.movementY,
      });
    }
  };

  const handleZoom = (event: React.WheelEvent<HTMLCanvasElement>) => {
    const { deltaY, clientX, clientY } = event;
    const zoomFactor = 1.1;
    const newZoom = deltaY < 0 ? zoom * zoomFactor : zoom / zoomFactor;
    
    const mouseX = clientX - pan.x;
    const mouseY = clientY - pan.y;

    const newPanX = pan.x - (mouseX * (newZoom - zoom)) / zoom;
    const newPanY = pan.y - (mouseY * (newZoom - zoom)) / zoom;

    setZoom(newZoom);
    setPan({ x: newPanX, y: newPanY });
  };

  return (
    <>
      {loading && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      )}
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={(e) => {
          draw(e);
          handlePan(e);
        }}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onWheel={handleZoom}
        className={`whiteboard-canvas absolute top-0 left-0 w-full h-full ${tool === 'select' ? 'cursor-default' : 'cursor-crosshair'}`}
      />
      {editingTextElement && (
        <input
          type="text"
          value={editingTextElement.text}
          onChange={(e) => {
            const newTextElements = textElements.map(te =>
              te.id === editingTextElement.id ? { ...te, text: e.target.value } : te
            );
            setTextElements(newTextElements);
            setEditingTextElement(prev => prev ? { ...prev, text: e.target.value } : null);
          }}
          onBlur={() => setEditingTextElement(null)}
          style={{
            position: 'absolute',
            left: editingTextElement.x * zoom + pan.x,
            top: editingTextElement.y * zoom + pan.y,
            fontSize: editingTextElement.fontSize * zoom,
            fontFamily: editingTextElement.fontFamily,
            color: editingTextElement.color,
            border: '1px solid black',
            background: 'transparent',
            outline: 'none',
            transformOrigin: 'top left',
            transform: `scale(${zoom})`,
          }}
          autoFocus
        />
      )}
    </>
  );
};

export default Whiteboard;
