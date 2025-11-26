from video_processing import process_video_fps_resize, save_single_frame
import cv2
from pathlib import Path

def process_video_fps_resize_test():
    pass

def save_single_frame_test(video_path,output_path_frame ):
    save_single_frame(video_path=video_path,output_image_path=output_path_frame,frame_number= 4)
    
    




if __name__ =="__main__": 
    video_path = Path(__file__).parent.parent / "data"/ "processed" /  "6387-191695740_small.mp4"
    output_path_frame = Path(__file__).parent.parent / "data" / "frame" / "frame_3.jpg"   
    save_single_frame_test(video_path=video_path,output_path_frame=output_path_frame)