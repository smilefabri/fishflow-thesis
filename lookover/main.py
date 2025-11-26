from src.track_model import (
    save_tracking_for_normal,
    simplify_tracking_for_heatmap,
    track_people_in_video_s3,
    upload_result_on_bucket_s3,
    create_heatmap_from_json,
    generate_people_count_over_time
)

from pathlib import Path
import boto3
import uuid
import logging
import argparse
import os
import sys

logging.basicConfig(level=logging.INFO)


"""
    arg:
    1: bucket
    2: nome del video da analizzare
    3: nome di dove salvare il file
    4: nome table dove salvare l'analisi
    5: tipo di elaborazione
    
"""


def change_status_analyzes_db(status: str, id_row: str, table_name: str):

    dynamodb = boto3.resource("dynamodb")

    table = dynamodb.Table(table_name)

    print(table.creation_date_time)

    response = table.update_item(
        Key={"id": id_row},
        UpdateExpression="SET #status = :valore",
        ExpressionAttributeNames={
            "#status": "status"  
        },
        ExpressionAttributeValues={":valore": status},
        ReturnValues="UPDATED_NEW",
    )

    print("Item aggiornato:", response["Attributes"])


def save_result_analyzes_db(result_json: str, id_row: str, table_name: str):
    dynamodb = boto3.resource("dynamodb")

    table = dynamodb.Table(table_name)

    print(table.creation_date_time)

    response = table.update_item(
        Key={"id": id_row},
        UpdateExpression="SET #result = :valore",
        ExpressionAttributeNames={"#result": "result"},  
        ExpressionAttributeValues={":valore": result_json},
        ReturnValues="UPDATED_NEW",
    )

    print("Item aggiornato:", response["Attributes"])

def parse_args():
    
    parser = argparse.ArgumentParser(description="Analizza un video su S3")
    parser.add_argument("--bucket-name", default=os.getenv("BUCKET_NAME"), required=True)
    parser.add_argument("--video-path", default=os.getenv("PATH_VIDEO_FILE"), required=True)
    parser.add_argument("--result-path", default=os.getenv("PATH_RESULT_FILE"), required=True)
    parser.add_argument("--row-id", default=os.getenv("ID_ROW_ANALYZE"), required=True)
    parser.add_argument("--table-name", default=os.getenv("NAME_TABLE_ANALISI"), required=True)
    return parser.parse_args()



def main():
    """
        if len(sys.argv) != 6:
            print(
                "Usage: script.py <bucket_name> <video_path> <result_json_path> <table_name> <id>"
            )
            sys.exit(1)
            
        bucket_name = sys.argv[1]
        path_video_file = sys.argv[2]
        path_result_folder = Path(sys.argv[3])
        name_table_analisi = sys.argv[4]
        id_row_analyze = sys.argv[5]
    
    """

        
    args = parse_args()

    bucket_name = args.bucket_name
    path_video_file = args.video_path
    path_result_folder = args.result_path
    id_row_analyze = args.row_id
    name_table_analisi = args.table_name


    logger = logging.getLogger(__name__)
    

    try:
        result_name = uuid.uuid4()

        result_path_normal = (
            Path(__file__).parent / "result" / "json" / f"{result_name}.json"
        )
        result_path_heatmap = (
            Path(__file__).parent / "result" / "json" / f"{result_name}_heatmap.json"
        )

        result_path_video = Path(__file__).parent / "result" / "video" / "result.mp4"
        result_path_image_heatmap = Path(__file__).parent / "result" / "heatmap.jpg"
        result_path_chart = Path(__file__).parent / "result" / "chart.jpg"

        # Utilizzare il Path per il risultato S3
        result_path_normal_s3 = Path(path_result_folder) / id_row_analyze / "result.json"
        result_path_heatmap_s3 = Path(path_result_folder) / id_row_analyze / "result_heatmap.json"
        result_path_image_heatmap_s3 = Path(path_result_folder) / id_row_analyze / "result_image_heatmap.jpg"
        result_path_chart_s3 = Path(path_result_folder) / id_row_analyze / "result_chart.json"

        # Converti i percorsi in stringhe quando necessario
        result_path_normal_s3 = str(result_path_normal_s3).replace("\\", "/")
        result_path_heatmap_s3 = str(result_path_heatmap_s3).replace("\\", "/")
        result_path_image_heatmap_s3 = str(result_path_image_heatmap_s3).replace("\\", "/")
        result_path_chart_s3 = str(result_path_chart_s3).replace("\\", "/")

        print("[DEBUG] Local result path (normal):", result_path_normal)
        print("[DEBUG] Local result path (heatmap):", result_path_heatmap)
        print("[DEBUG] Local video path:", result_path_video)
        print("[DEBUG] S3 result path (normal):", result_path_normal_s3)
        print("[DEBUG] S3 result path (heatmap):", result_path_heatmap_s3)

        """
            vecchio codice, ma in futuro potrebbe servire ancora
            owner_id = path_video_file.split("/")[3]
            print(owner_id)
            
        """

        change_status_analyzes_db("ONGOING", id_row_analyze, name_table_analisi)

        tracker_people, frame_path = track_people_in_video_s3(
            bucket_name=bucket_name,
            video_path=path_video_file,
            output_path_video=result_path_video,
            save=True,
        )
        #todo convertire in chiamate API, per occupare meno memoria su s3
        generate_people_count_over_time(tracker_position=tracker_people,output_json_file=result_path_chart)

        save_tracking_for_normal(tracker_people, result_path_normal)

        simplify_tracking_for_heatmap(tracker_people, result_path_heatmap, bin_size=30)

        create_heatmap_from_json(json_path=result_path_heatmap,background_frame_path=frame_path,output_path=result_path_image_heatmap,alpha=0.3)
        
        
        print("inizio salvataggio risultato ...")
        
        upload_result_on_bucket_s3(
            local_path=str(result_path_normal),
            bucket=bucket_name,
            path_json=str(result_path_normal_s3)
        )
        upload_result_on_bucket_s3(
            local_path=str(result_path_heatmap),
            bucket=bucket_name,
            path_json=str(result_path_heatmap_s3),
        )
        upload_result_on_bucket_s3(
            local_path=str(result_path_image_heatmap),
            bucket=bucket_name,
            path_json=str(result_path_image_heatmap_s3),
        )
        upload_result_on_bucket_s3(
            local_path=str(result_path_chart),
            bucket=bucket_name,
            path_json=str(result_path_chart_s3),
        )

        result_json = {
            "normal": str(result_path_normal_s3),
            "heatMap": str(result_path_heatmap_s3),
            "imageHeatMap":str(result_path_image_heatmap_s3),
            "chart": str(result_path_chart_s3)
        }

        save_result_analyzes_db(
            result_json=result_json,
            id_row=id_row_analyze,
            table_name=name_table_analisi,
        )

        change_status_analyzes_db("FINISHED", id_row_analyze, name_table_analisi)

    except Exception as e:
        print(f"Errore durante l'esecuzione: {e}")
        change_status_analyzes_db("FAILED", id_row_analyze, name_table_analisi)
        sys.exit(1)


if __name__ == "__main__":
    main()
