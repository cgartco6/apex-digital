import React, { useRef, useEffect, useState } from 'react';
import { loadFromLocal, saveToLocal } from '../utils/storage';

const DesignStudio = ({ role }) => {
    const canvasRef = useRef(null);
    const fabricCanvas = useRef(null);
    const [history, setHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [layers, setLayers] = useState([]);
    const [selectedId, setSelectedId] = useState(null);

    const saveState = () => {
        if (!fabricCanvas.current) return;
        const json = JSON.stringify(fabricCanvas.current.toJSON());
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(json);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
        updateLayersList();
    };

    const undo = () => {
        if (historyIndex > 0) {
            const prev = history[historyIndex - 1];
            fabricCanvas.current.loadFromJSON(JSON.parse(prev), () => {
                fabricCanvas.current.renderAll();
                setHistoryIndex(historyIndex - 1);
                updateLayersList();
            });
        }
    };
    const redo = () => {
        if (historyIndex < history.length - 1) {
            const next = history[historyIndex + 1];
            fabricCanvas.current.loadFromJSON(JSON.parse(next), () => {
                fabricCanvas.current.renderAll();
                setHistoryIndex(historyIndex + 1);
                updateLayersList();
            });
        }
    };

    const updateLayersList = () => {
        if (!fabricCanvas.current) return;
        const objects = fabricCanvas.current.getObjects();
        setLayers(objects.map((obj, idx) => ({ id: idx, type: obj.type, visible: obj.visible, text: obj.text || '' })));
    };

    useEffect(() => {
        if (!canvasRef.current) return;
        const canvas = new fabric.Canvas(canvasRef.current, {
            width: 580,
            height: 360,
            backgroundColor: '#1f2937',
            preserveObjectStacking: true,
        });
        fabricCanvas.current = canvas;
        const saved = loadFromLocal(role, 'design_state', null);
        if (saved) {
            canvas.loadFromJSON(saved, () => canvas.renderAll());
        } else {
            const defaultText = new fabric.IText('APEX\nDESIGN', { left: 100, top: 120, fontSize: 36, fill: '#f97316', fontFamily: 'Inter', fontWeight: 'bold' });
            canvas.add(defaultText);
            canvas.renderAll();
        }
        canvas.on('object:added', saveState);
        canvas.on('object:modified', saveState);
        canvas.on('object:removed', saveState);
        canvas.on('selection:created', () => updateLayersList());
        canvas.on('selection:cleared', () => setSelectedId(null));
        canvas.on('selection:updated', () => updateLayersList());
        saveState();
        updateLayersList();
        return () => canvas.dispose();
    }, [role]);

    const addText = () => {
        const text = new fabric.IText('Edit me', { left: 50, top: 50, fontSize: 24, fill: '#ffffff', fontFamily: 'Inter' });
        fabricCanvas.current.add(text);
        fabricCanvas.current.setActiveObject(text);
        fabricCanvas.current.renderAll();
    };
    const addRectangle = () => {
        const rect = new fabric.Rect({ width: 80, height: 80, fill: '#f97316', left: 200, top: 200, stroke: 'white', strokeWidth: 2 });
        fabricCanvas.current.add(rect);
        fabricCanvas.current.renderAll();
    };
    const uploadImage = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            fabric.Image.fromURL(event.target.result, (img) => {
                img.scaleToWidth(150);
                fabricCanvas.current.add(img);
                fabricCanvas.current.renderAll();
            });
        };
        reader.readAsDataURL(file);
    };
    const styleSelected = (prop, value) => {
        const active = fabricCanvas.current.getActiveObject();
        if (active) {
            active.set(prop, value);
            fabricCanvas.current.renderAll();
            saveState();
        }
    };
    const toggleLayerVisibility = (idx) => {
        const obj = fabricCanvas.current.getObjects()[idx];
        if (obj) {
            obj.visible = !obj.visible;
            fabricCanvas.current.renderAll();
            updateLayersList();
            saveState();
        }
    };
    const selectLayer = (idx) => {
        const obj = fabricCanvas.current.getObjects()[idx];
        if (obj) {
            fabricCanvas.current.setActiveObject(obj);
            fabricCanvas.current.renderAll();
            setSelectedId(idx);
        }
    };
    const exportPNG = () => {
        const dataURL = fabricCanvas.current.toDataURL({ format: 'png' });
        const link = document.createElement('a');
        link.download = 'apex-design.png';
        link.href = dataURL;
        link.click();
    };
    const exportSVG = () => {
        const svg = fabricCanvas.current.toSVG();
        const blob = new Blob([svg], { type: 'image/svg+xml' });
        saveAs(blob, 'apex-design.svg');
    };
    const saveDesignLocally = () => {
        const json = JSON.stringify(fabricCanvas.current.toJSON());
        saveToLocal(role, 'design_state', json);
        alert('Design saved to browser!');
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-2 items-center">
                <button onClick={addText} className="bg-indigo-600 px-3 py-1.5 rounded-lg text-sm"><i className="fas fa-font"></i> Text</button>
                <button onClick={addRectangle} className="bg-emerald-600 px-3 py-1.5 rounded-lg text-sm"><i className="fas fa-square"></i> Shape</button>
                <label className="bg-purple-600 px-3 py-1.5 rounded-lg text-sm cursor-pointer"><i className="fas fa-image"></i> Image<input type="file" accept="image/*" className="hidden" onChange={uploadImage} /></label>
                <div className="flex gap-1 border-l border-gray-600 pl-2">
                    <button onClick={undo} className="bg-gray-700 px-2 py-1 rounded"><i className="fas fa-undo"></i></button>
                    <button onClick={redo} className="bg-gray-700 px-2 py-1 rounded"><i className="fas fa-redo"></i></button>
                </div>
                <div className="flex gap-1">
                    <button onClick={() => styleSelected('fontWeight', 'bold')} className="bg-gray-700 px-2 py-1 rounded"><b>B</b></button>
                    <button onClick={() => styleSelected('fontStyle', 'italic')} className="bg-gray-700 px-2 py-1 rounded"><i>I</i></button>
                    <input type="color" onChange={(e) => styleSelected('fill', e.target.value)} className="w-8 h-8 rounded" />
                </div>
                <button onClick={exportPNG} className="bg-blue-600 px-3 py-1.5 rounded-lg text-sm"><i className="fas fa-download"></i> PNG</button>
                <button onClick={exportSVG} className="bg-blue-600 px-3 py-1.5 rounded-lg text-sm"><i className="fas fa-download"></i> SVG</button>
                <button onClick={saveDesignLocally} className="bg-green-700 px-3 py-1.5 rounded-lg text-sm"><i className="fas fa-save"></i> Save</button>
            </div>
            <div className="flex justify-center">
                <canvas ref={canvasRef} className="border-2 border-gray-600 rounded-xl shadow-2xl" style={{ maxWidth: '100%', height: 'auto' }}></canvas>
            </div>
            <div className="glass-card p-3 rounded-xl">
                <h4 className="text-sm font-bold">Layers</h4>
                <div className="max-h-32 overflow-y-auto mt-1">
                    {layers.map((layer, idx) => (
                        <div key={idx} className={`layer-item flex justify-between items-center p-1 text-xs cursor-pointer ${selectedId === idx ? 'bg-orange-800' : ''}`} onClick={() => selectLayer(idx)}>
                            <span><i className={`fas fa-${layer.type === 'text' ? 'font' : 'square'}`}></i> {layer.text || layer.type}</span>
                            <i className={`fas fa-eye${layer.visible ? '' : '-slash'} cursor-pointer`} onClick={(e) => { e.stopPropagation(); toggleLayerVisibility(idx); }}></i>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DesignStudio;
