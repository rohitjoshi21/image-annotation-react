import React, {useRef, useState} from 'react'
import './App.css'
import {Image as KonvaImage, Layer, Rect, Stage, Circle} from "react-konva";
import Konva from "konva";

export default function App() {
    const [image] = useState(() => {
        const img = new window.Image();
        img.src = "https://fastly.picsum.photos/id/545/200/300.jpg?hmac=mKTuqg7uMMnQbx-G17z5e7tJrjfkYtqbsfRm_dCrCfQ"; // replace with your image
        return img;
    });

    const [rect, setRect] = useState<any>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const stageRef = useRef<any>();
    const [color, setColor] = React.useState<string>("green");


    const handleMouseDown = (e: any) => {
        const clickedOn = e.target;

        // If clicked on an existing rectangle → do nothing (so dragging works)
        if (clickedOn.getClassName() === "Rect") {
            return;
        }

        // Otherwise (stage or image) → start drawing
        const pos = e.target.getStage().getPointerPosition();
        setRect({
            x: pos.x,
            y: pos.y,
            width: 0,
            height: 0,
        });
        setIsDrawing(true);
    };

    const handleMouseMove = (e: any) => {
        if (!isDrawing || !rect) return;
        const stage = e.target.getStage();
        const pos = stage.getPointerPosition();

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
                            x={0}
                            y={0}
                            draggable
                            radius={50}
                            fill={color}
                            onDragEnd={() => {
                                setColor(Konva.Util.getRandomColor());
                            }}
                        />
                    {rect && (
                        <Rect
                            draggable
                            x={rect.x}
                            y={rect.y}
                            width={rect.width}
                            height={rect.height}
                            stroke="red"
                            // onDragEnd={(e) => {
                            //     setRect({
                            //         ...rect,
                            //         x: e.target.x(),
                            //         y: e.target.y(),
                            //     });
                            // }}
                            onDragMove={(e) => {
                                setRect({
                                    ...rect,
                                    x: e.target.x(),
                                    y: e.target.y(),
                                });
                            }}
                        />
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
