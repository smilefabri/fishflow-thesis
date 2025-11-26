import cv2
from matplotlib import pyplot as plt

from ultralytics import YOLO
import supervision as sv
import json
from collections import defaultdict
import os
import numpy as np
import tempfile
import boto3





# Punti del rettangolo nell'immagine originale (coincide con il tuo JSON)
src_pts = np.array([[18, 532], [297, 93], [657, 99], [924, 532]], dtype=np.float32)


# Punti di destinazione per la vista dall'alto (definisci un'area rettangolare)
#todo da automatizzare
dst_pts = np.array([[0, 500], [0, 0], [400, 0], [400, 500]], dtype=np.float32)

M = cv2.getPerspectiveTransform(src_pts, dst_pts)


def transform_point(x, y, M):
    src = np.array([[x, y]], dtype=np.float32)
    src = np.array([src])  # OpenCV richiede un array 3D
    dst = cv2.perspectiveTransform(src, M)
    return dst[0][0][0], dst[0][0][1]

def add_value_to_heatmap(heatmap, x, y, value, radius=10):
    for dx in range(-radius, radius + 1):
        for dy in range(-radius, radius + 1):
            nx, ny = x + dx, y + dy
            if 0 <= nx < heatmap.shape[1] and 0 <= ny < heatmap.shape[0]:
                heatmap[ny, nx] += value

def create_heatmap_from_json(json_path, background_frame_path, output_path="heatmap_overlay.jpg", alpha=0.3):
    # Carica i dati JSON
    with open(json_path, 'r') as f:
        data = json.load(f)

    # Carica il frame di sfondo
    background = cv2.imread(background_frame_path)
    height, width = background.shape[:2]

    # Crea una mappa vuota
    heatmap = np.zeros((height, width), dtype=np.float32)

    # Aggiungi valori alla mappa
    for point in data:
        x, y, value = point["x"], point["y"], point["value"]
        add_value_to_heatmap(heatmap, x, y, value, radius=20)

    # Sfoca la mappa per rendere più smooth
    heatmap = cv2.GaussianBlur(heatmap, (0, 0), sigmaX=10, sigmaY=10)

    # Normalizza e converte in uint8
    heatmap = cv2.normalize(heatmap, None, 0, 255, cv2.NORM_MINMAX)
    heatmap = np.uint8(heatmap)

    # Applica la color map
    heatmap_color = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)

    # Crea maschera dove la heatmap è significativa
    mask = heatmap > 0

    # Blending tra heatmap e background
    overlay = background.copy()
    overlay[mask] = cv2.addWeighted(heatmap_color[mask], alpha, background[mask], 1 - alpha, 0)

    # Salva il risultato
    cv2.imwrite(output_path, overlay)
    print(f"Heatmap con sfondo salvata in {output_path}")

    return output_path



def simplify_tracking_for_heatmap(tracker_position, output_json_file, bin_size=10):
    bins = defaultdict(int)

    for track in tracker_position.values():
        for _, x, y, _, _, _ in track:
            x = int(x // bin_size) * bin_size
            y = int(y // bin_size) * bin_size
            bins[(x, y)] += 1

    heatmap_data = [
        { "x": x, "y": y, "value": count }
        for (x, y), count in bins.items()
    ]

    
    with open(output_json_file, "w") as f:
        json.dump(heatmap_data, f)

    print(f"Heatmap semplificata salvata in {output_json_file}")

def generate_people_count_over_time(tracker_position, output_json_file, precision="1s"):
    import json
    from collections import defaultdict

    # Decidi il fattore di arrotondamento in base alla precisione
    if precision == "1s":
        round_fn = lambda t: int(t)
    elif precision == "0.1s":
        round_fn = lambda t: round(t, 1)
    else:
        raise ValueError("Precisione non supportata. Usa '1s' o '0.1s'")

    time_bins = defaultdict(set)

    for track_id, positions in tracker_position.items():
        for *_, time_sec in positions:
            t = round_fn(time_sec)
            time_bins[t].add(track_id)

    # Opzionale: aggiungi zeri per secondi mancanti (utile con '1s')
    all_times = range(int(min(time_bins)), int(max(time_bins)) + 1) if precision == "1s" else sorted(time_bins)
    count_data = [
        { "time": t, "count": len(time_bins.get(t, [])) }
        for t in all_times
    ]

    with open(output_json_file, "w") as f:
        json.dump(count_data, f)

    print(f"Salvato grafico ({precision}) in {output_json_file}")

def save_tracking_for_normal(tracking_data: dict, output_json: str):
    """Salva i dati di tracking in un file JSON."""
    os.makedirs(os.path.dirname(output_json), exist_ok=True)

    with open(output_json, "w") as file:
        json.dump(tracking_data, file,separators=(",", ":"))
    print(f"Tracking salvato in: {output_json}")
    
def track_people_in_video(
    input_path_video: str, output_path_video: str, output_json_file: str, save=False
):

    from ultralytics import YOLO
    video_info = sv.VideoInfo.from_video_path(video_path=input_path_video)
    frame_generator = sv.get_video_frames_generator(input_path_video)

    with sv.VideoSink(target_path=output_path_video, video_info=video_info) as sink:
        for index_frame, frame in enumerate(frame_generator):

            results = model(frame)[0]

            detections = sv.Detections.from_ultralytics(results)

            detections = detections[detections.class_id == 0]

            annotated_frame = box_annotator.annotate(scene=frame, detections=detections)
            detections = tracker.update_with_detections(detections=detections)

            labels = [
                f"#{track_id} {confidence:.2f}"
                for track_id, confidence in zip(
                    detections.tracker_id, detections.confidence
                )
            ]
            annotated_frame = label_annotator.annotate(
                scene=annotated_frame, detections=detections, labels=labels
            )

            for track_id, (x_min, y_min, x_max, y_max) in zip(
                detections.tracker_id, detections.xyxy
            ):
                center_x = (x_min + x_max) / 2
                center_y = (y_min + y_max) / 2

                bev_x, bev_y = transform_point(center_x, center_y, M)

                # cv2.circle(annotated_frame, (int(center_x), int(center_y)), radius=5, color=(0, 0, 255), thickness=-1)

                if str(track_id) not in tracker_position:
                    tracker_position[str(track_id)] = []
                tracker_position[str(track_id)].append(
                    [
                        {"coord": [index_frame, float(center_x), float(center_y)]},
                        {"bev_coord": [float(bev_x), float(bev_y)]},
                    ]
                )

            if save:
                sink.write_frame(annotated_frame)
            else:
                cv2.imshow("Video", annotated_frame)
                if cv2.waitKey(1) & 0xFF == ord("q"):
                    break

    cv2.destroyAllWindows()

    #save_tracking_to_json(tracker_position, output_json_file)

def upload_result_on_bucket_s3(local_path: str, bucket: str, path_json: str):
    # 1. Salva localmente il JSON
    # 2. Carica su S3
    s3 = boto3.client("s3")
    s3.upload_file(local_path, bucket, path_json)
    print(f"✅ JSON caricato su s3://{bucket}/{path_json}")

def track_people_in_video_s3(
    bucket_name: str,
    video_path: str,
    output_path_video: str,
    save=False,
):
    s3 = boto3.client("s3")
    model = YOLO("models/yolov8x.pt")
    box_annotator = sv.BoxAnnotator(thickness=2)
    label_annotator = sv.LabelAnnotator()
    tracker = sv.ByteTrack(
        lost_track_buffer=50,
        track_activation_threshold=0.3,
        minimum_matching_threshold=0.75,
    )

    tracker_position = {}

    print(f"Streaming video da S3: {bucket_name}/{video_path}")
    response = s3.get_object(Bucket=bucket_name, Key=video_path)

    with tempfile.NamedTemporaryFile(suffix=".mp4", delete=False) as tmp_video:
        tmp_video.write(response["Body"].read())
        tmp_video.flush()

        video_info = sv.VideoInfo.from_video_path(video_path=tmp_video.name)
        frame_generator = sv.get_video_frames_generator(tmp_video.name)
        fps = video_info.fps

        # Salva il primo frame
        first_frame = next(frame_generator)
        with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as tmp_img:
            first_frame_path = tmp_img.name
            cv2.imwrite(first_frame_path, first_frame)

        with sv.VideoSink(target_path=output_path_video, video_info=video_info) as sink:
            for index_frame, frame in enumerate([first_frame] + list(frame_generator)):
                results = model(frame)[0]
                detections = sv.Detections.from_ultralytics(results)
                detections = detections[detections.class_id == 0]

                annotated_frame = box_annotator.annotate(scene=frame, detections=detections)
                detections = tracker.update_with_detections(detections=detections)

                labels = [
                    f"#{track_id} {confidence:.2f}"
                    for track_id, confidence in zip(detections.tracker_id, detections.confidence)
                ]
                annotated_frame = label_annotator.annotate(
                    scene=annotated_frame, detections=detections, labels=labels
                )

                for track_id, (x_min, y_min, x_max, y_max) in zip(detections.tracker_id, detections.xyxy):
                    center_x = (x_min + x_max) / 2
                    center_y = (y_min + y_max) / 2
                    bev_x, bev_y = transform_point(center_x, center_y, M)

                    if str(track_id) not in tracker_position:
                        tracker_position[str(track_id)] = []

                    tracker_position[str(track_id)].append([
                        index_frame,
                        round(float(center_x), 1),
                        round(float(center_y), 1),
                        round(float(bev_x), 1),
                        round(float(bev_y), 1),
                        round(index_frame / fps, 2),
                    ])

                if save:
                    sink.write_frame(annotated_frame)

    return tracker_position, first_frame_path
