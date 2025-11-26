from decord import VideoReader, cpu
import cv2

def process_video_fps_resize(input_path_video: str, output_path_video: str, target_fps, resu:int = 960):
    # Carico il video in Ram con decord
    video_reader = VideoReader(str(input_path_video), ctx=cpu(0))
    fps = video_reader.get_avg_fps()
    max_width = resu
    frame_count = len(video_reader)

    # cambio la risoluzione del video
    orig_width, orig_height = video_reader[0].shape[1], video_reader[0].shape[0]
    scaling_factor = max_width / orig_width  
    new_width = int(orig_width * scaling_factor)
    new_height = int(orig_height * scaling_factor)

    fourcc = cv2.VideoWriter_fourcc(*"mp4v")
    output_video = cv2.VideoWriter(str(output_path_video), fourcc, target_fps, (new_width, new_height))

    frame_step = max(1, int(fps/ target_fps))
    
    
    for i in range(0,frame_count, frame_step):
        frame = video_reader[i].asnumpy()  
        frame = cv2.cvtColor(frame, cv2.COLOR_RGB2BGR) 
        frame = cv2.resize(frame, (new_width, new_height))  
        output_video.write(frame)  
    
    output_video.release()
    print(f"Video salvato in: {output_path_video}")


def save_single_frame(video_path, output_image_path, frame_number=0):
    cap = cv2.VideoCapture(video_path)
    
    cap.set(cv2.CAP_PROP_POS_FRAMES, frame_number)  # Vai al frame specifico
    ret, frame = cap.read()  # Leggi il frame
    
    if ret:
        cv2.imwrite(output_image_path, frame)  # Salva l'immagine
        print(f"Frame salvato in: {output_image_path}")
    else:
        print("Errore nel leggere il frame")
    
    cap.release()