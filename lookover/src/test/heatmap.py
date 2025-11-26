import cv2
import numpy as np
import json

def add_value_to_heatmap(heatmap, x, y, value, radius=10):
    for dx in range(-radius, radius + 1):
        for dy in range(-radius, radius + 1):
            nx, ny = x + dx, y + dy
            if 0 <= nx < heatmap.shape[1] and 0 <= ny < heatmap.shape[0]:
                heatmap[ny, nx] += value

def create_heatmap_from_json(json_path, background_frame_path, output_path="heatmap_overlay.jpg", width=640, height=480, alpha=0.3):
    # Carica i dati
    with open(json_path, 'r') as f:
        data = json.load(f)

    # Carica il frame di sfondo
    background = cv2.imread(background_frame_path)
    background = cv2.resize(background, (width, height))

    # Crea una mappa vuota
    heatmap = np.zeros((height, width), dtype=np.float32)

    for point in data:
        x, y, value = point["x"], point["y"], point["value"]
        add_value_to_heatmap(heatmap, x, y, value, radius=20)

    # Sfoca
    heatmap = cv2.GaussianBlur(heatmap, (0, 0), sigmaX=10, sigmaY=10)

    # Normalizza
    heatmap = cv2.normalize(heatmap, None, 0, 255, cv2.NORM_MINMAX)
    heatmap = np.uint8(heatmap)

    # Applica la mappa colori
    heatmap_color = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)

    # Crea maschera per il blending
    mask = heatmap > 0

    # Converte il background e heatmap in float per blending
    overlay = background.copy()
    overlay[mask] = cv2.addWeighted(heatmap_color[mask], alpha, background[mask], 1 - alpha, 0)

    # Salva il risultato
    cv2.imwrite(output_path, overlay)
    print(f"Heatmap con sfondo salvata in {output_path}")



create_heatmap_from_json("D:\\2025\\stage_bagubits\\lookover\\result\\json\\0e6ec272-19cd-4cc1-9c47-1235a6fca7ea_heatmap.json",background_frame_path="D:\\2025\\stage_bagubits\\lookover\\src\\videoframe_0.png", width=960, height=540)
