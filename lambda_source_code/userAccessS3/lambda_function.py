import boto3
import os
def set_aws_environment(access_key, secret_key, region):
    # visible in this process + all children
    os.environ['AWS_ACCESS_KEY_ID']=access_key
    os.environ['AWS_SECRET_ACCESS_KEY']=secret_key  
    os.environ["AWS_DEFAULT_REGION"] = region
    return
def put_file(access_key, secret_key, region,
             identity_id, bucket_name, upload_filename_path):
   filename = os.path.basename(upload_filename_path) 
   key_name = f"{self.identity_id}/{filename}"
   metadata = {}
   s3client = boto3.client('s3')
   s3transfer = boto3.s3.transfer.S3Transfer(s3client)    
   s3transfer.upload_file(upload_filename_path, bucket_name,
                  key_name, extra_args={'Metadata': metadata})
   return