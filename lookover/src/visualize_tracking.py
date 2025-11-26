import matplotlib.pyplot as plt
import json
from pathlib import Path

# Carica i dati dal file JSON
path_json_file = Path(__file__).parent.parent / "result" / "json" / "tracking_video_output_2.json"
with open(path_json_file, "r") as file:
    tracker_data = json.load(file)

# Creazione della figura con più spazio laterale per la legenda
fig, ax = plt.subplots(figsize=(10, 6))  # Aumenta la larghezza

# Numero di tracciati e generazione dei colori distinti
num_tracks = len(tracker_data)
colors = [plt.cm.hsv(i / num_tracks) for i in range(num_tracks)]

# Per ogni persona tracciata
for i, (track_id, positions) in enumerate(tracker_data.items()):
    x_vals, y_vals = [], []
    
    for pos in positions:
        bev_coords = pos[1]["bev_coord"]  # Estrai coordinate BEV
        bev_x, bev_y = bev_coords
        x_vals.append(bev_x)
        y_vals.append(bev_y)
    
    # Disegna la traiettoria con un colore unico
    ax.plot(x_vals, y_vals, marker="o", linestyle="-", color=colors[i], label=f"ID {track_id}")
    
    # Indica il punto iniziale e finale
    ax.scatter(x_vals[0], y_vals[0], c="green", marker="s", label="Start" if i == 0 else "")
    ax.scatter(x_vals[-1], y_vals[-1], c="red", marker="x", label="End" if i == 0 else "")

# Configurazione del grafico
ax.invert_yaxis()  
ax.set_xlabel("X BEV")
ax.set_ylabel("Y BEV")
ax.set_title("Tracciamento delle persone in vista dall'alto")
ax.grid(True)

# Sposta la legenda fuori dal grafico e la ridimensiona per non farla tagliare
legend = ax.legend(loc='center left', bbox_to_anchor=(1, 0.5), ncol=3, fontsize=8)

# Adatta il layout per non tagliare la legenda
plt.subplots_adjust(right=0.7)  # Riduci la dimensione del grafico per far spazio alla legenda

# Mostra il grafico
plt.show()