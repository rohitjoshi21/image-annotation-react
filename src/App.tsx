import { useRef, useState, useEffect } from "react";
import "./App.css";
import {
    Stage,
    Layer,
    Rect,
    Circle,
    Transformer,
    Image as KonvaImage,
} from "react-konva";
import Konva from "konva";

interface RectType {
    x: number;
    y: number;
    width: number;
    height: number;
}

export default function App() {
    const [image] = useState<HTMLImageElement>(() => {
        const img = new window.Image();
        img.src =
            "https://fastly.picsum.photos/id/545/200/300.jpg?hmac=mKTuqg7uMMnQbx-G17z5e7tJrjfkYtqbsfRm_dCrCfQ";
        return img;
    });

    const stageRef = useRef<Konva.Stage>(null);
    const rectRef = useRef<Konva.Rect>(null);
    const trRef = useRef<Konva.Transformer>(null);

    const [rect, setRect] = useState<RectType | null>(null);
    const [isDrawing, setIsDrawing] = useState<boolean>(false);
    const [selected, setSelected] = useState<boolean>(false);
    const [color, setColor] = useState<string>("green");

    // Attach transformer when rectangle is selected
    useEffect(() => {
        if (selected && trRef.current && rectRef.current) {
            trRef.current.nodes([rectRef.current]);
            trRef.current.getLayer()?.batchDraw();
        }
    }, [selected]);

    const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
        const clickedOn = e.target;

        // If clicked on existing rectangle → select it
        if (clickedOn.getClassName() === "Rect") {
            setSelected(true);
            return;
        }

        // Otherwise → start drawing
        const pos = stageRef.current?.getPointerPosition();
        if (!pos) return;

        setRect({
            x: pos.x,
            y: pos.y,
            width: 0,
            height: 0,
        });
        setIsDrawing(true);
        setSelected(true);
    };

    const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
        if (!isDrawing || !rect) return;
        console.log(e);
        const pos = stageRef.current?.getPointerPosition();
        if (!pos) return;

        setRect({
            ...rect,
            width: pos.x - rect.x,
            height: pos.y - rect.y,
        });
    };

    const handleMouseUp = () => {
        setIsDrawing(false);
    };

    return (
        <div className="flex">
            {/* Canvas */}
            <Stage
                className="stage-border"
                width={800}
                height={600}
                ref={stageRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
            >
                <Layer>
                    <KonvaImage image={image} />

                    <Circle
                        x={100}
                        y={100}
                        radius={50}
                        fill={color}
                        draggable
                        onDragEnd={() => setColor(Konva.Util.getRandomColor())}
                    />

                    {rect && (
                        <>
                            <Rect
                                ref={rectRef}
                                x={rect.x}
                                y={rect.y}
                                width={rect.width}
                                height={rect.height}
                                stroke="red"
                                draggable
                                onClick={() => setSelected(true)}
                                onDragMove={(e) =>
                                    setRect({
                                        ...rect,
                                        x: e.target.x(),
                                        y: e.target.y(),
                                    })
                                }
                                onTransformEnd={() => {
                                    const node = rectRef.current;
                                    if (!node) return;

                                    const scaleX = node.scaleX();
                                    const scaleY = node.scaleY();

                                    node.scaleX(1);
                                    node.scaleY(1);

                                    setRect({
                                        ...rect,
                                        x: node.x(),
                                        y: node.y(),
                                        width: Math.max(5, node.width() * scaleX),
                                        height: Math.max(5, node.height() * scaleY),
                                    });
                                }}
                            />
                            {selected && <Transformer ref={trRef} />}
                        </>
                    )}
                </Layer>
            </Stage>

            {/* Sidebar */}
            <div className="ml-4 p-2 border w-64">
                <h2 className="font-bold mb-2">Rectangle Info</h2>
                {rect ? (
                    <ul>
                        <li>X: {rect.x.toFixed(0)}</li>
                        <li>Y: {rect.y.toFixed(0)}</li>
                        <li>Width: {rect.width.toFixed(0)}</li>
                        <li>Height: {rect.height.toFixed(0)}</li>
                    </ul>
                ) : (
                    <p>No rectangle drawn</p>
                )}
            </div>
        </div>
    );
}
